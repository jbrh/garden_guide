import type { SQLiteDatabase } from "expo-sqlite";

import {
  bundledGardensData,
  type BundledGardenData,
  type BundledPlantDefinition,
} from "@/data/bundledGarden";
import { getNowIsoString } from "@/utils/dates";
import { trimOptional, trimRequired } from "@/utils/validation";

function validateBundledGardenData(data: BundledGardenData[]): string {
  if (data.length === 0) {
    throw new Error("At least one bundled garden is required.");
  }

  const gardenIds = new Set<string>();
  const plantIds = new Set<string>();
  const qrCodeValues = new Set<string>();
  const activeGardenIds: string[] = [];

  for (const bundledGarden of data) {
    const gardenId = trimRequired(bundledGarden.garden.id, "Bundled garden id");
    trimRequired(bundledGarden.garden.name, "Bundled garden name");

    if (gardenIds.has(gardenId)) {
      throw new Error(`Duplicate bundled garden id: ${gardenId}`);
    }

    gardenIds.add(gardenId);

    if (bundledGarden.garden.isActive) {
      activeGardenIds.push(gardenId);
    }

    for (const plant of bundledGarden.plants) {
      const plantId = trimRequired(plant.id, "Bundled plant id");

      if (plantIds.has(plantId)) {
        throw new Error(`Duplicate bundled plant id: ${plantId}`);
      }

      plantIds.add(plantId);
      trimRequired(plant.commonName, `Common name for ${plantId}`);

      const qrCodeValue = trimOptional(plant.qrCodeValue);

      if (qrCodeValue && qrCodeValues.has(qrCodeValue)) {
        throw new Error(`Duplicate bundled QR code value: ${qrCodeValue}`);
      }

      if (qrCodeValue) {
        qrCodeValues.add(qrCodeValue);
      }
    }
  }

  if (activeGardenIds.length > 1) {
    throw new Error("Only one bundled garden can be marked active.");
  }

  return activeGardenIds[0] ?? trimRequired(data[0]?.garden.id, "Bundled garden id");
}

async function getPreservedActiveGardenId(
  db: SQLiteDatabase,
  bundledGardenIds: string[],
): Promise<string | null> {
  const currentActive = await db.getFirstAsync<{ id: string }>(
    `SELECT id FROM gardens
     WHERE is_active = 1
     ORDER BY updated_at DESC
     LIMIT 1;`,
  );

  if (currentActive && bundledGardenIds.includes(currentActive.id)) {
    return currentActive.id;
  }

  return null;
}

async function syncBundledPlant(
  db: SQLiteDatabase,
  gardenId: string,
  plant: BundledPlantDefinition,
  now: string,
): Promise<void> {
  const plantId = trimRequired(plant.id, "Bundled plant id");
  const qrCodeValue = trimOptional(plant.qrCodeValue);

  if (qrCodeValue) {
    await db.runAsync(
      `UPDATE plants
       SET qr_code_value = NULL,
           updated_at = ?
       WHERE qr_code_value = ?
         AND id <> ?;`,
      now,
      qrCodeValue,
      plantId,
    );
  }

  await db.runAsync(
    `INSERT INTO plants (
      id,
      garden_id,
      common_name,
      botanical_name,
      cultivar,
      short_description,
      care_basics,
      habitat_value,
      personal_notes,
      qr_code_value,
      primary_photo_uri,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      garden_id = excluded.garden_id,
      common_name = excluded.common_name,
      botanical_name = excluded.botanical_name,
      cultivar = excluded.cultivar,
      short_description = excluded.short_description,
      care_basics = excluded.care_basics,
      habitat_value = excluded.habitat_value,
      personal_notes = excluded.personal_notes,
      qr_code_value = excluded.qr_code_value,
      primary_photo_uri = excluded.primary_photo_uri,
      updated_at = excluded.updated_at;`,
    plantId,
    gardenId,
    trimRequired(plant.commonName, "Common name"),
    trimOptional(plant.botanicalName),
    trimOptional(plant.cultivar),
    trimOptional(plant.shortDescription),
    trimOptional(plant.careBasics),
    trimOptional(plant.habitatValue),
    trimOptional(plant.personalNotes),
    qrCodeValue,
    trimOptional(plant.primaryPhotoUri),
    now,
    now,
  );
}

export async function syncBundledGardenData(
  db: SQLiteDatabase,
): Promise<void> {
  const defaultActiveGardenId = validateBundledGardenData(bundledGardensData);

  const now = getNowIsoString();
  const bundledGardenIds = bundledGardensData.map((bundledGarden) =>
    trimRequired(bundledGarden.garden.id, "Bundled garden id"),
  );
  const preservedActiveGardenId = await getPreservedActiveGardenId(
    db,
    bundledGardenIds,
  );
  const activeGardenId = preservedActiveGardenId ?? defaultActiveGardenId;

  await db.runAsync("UPDATE gardens SET is_active = 0, updated_at = ?;", now);

  for (const bundledGarden of bundledGardensData) {
    const gardenId = trimRequired(bundledGarden.garden.id, "Bundled garden id");
    const bundledPlantIds = bundledGarden.plants.map((plant) =>
      trimRequired(plant.id, "Bundled plant id"),
    );

    await db.runAsync(
      `INSERT INTO gardens (id, name, description, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         description = excluded.description,
         is_active = excluded.is_active,
         updated_at = excluded.updated_at;`,
      gardenId,
      trimRequired(bundledGarden.garden.name, "Bundled garden name"),
      trimOptional(bundledGarden.garden.description),
      gardenId === activeGardenId ? 1 : 0,
      now,
      now,
    );

    for (const plant of bundledGarden.plants) {
      await syncBundledPlant(db, gardenId, plant, now);
    }

    if (bundledPlantIds.length === 0) {
      await db.runAsync("DELETE FROM plants WHERE garden_id = ?;", gardenId);
      continue;
    }

    const placeholders = bundledPlantIds.map(() => "?").join(", ");

    await db.runAsync(
      `DELETE FROM plants
       WHERE garden_id = ?
         AND id NOT IN (${placeholders});`,
      gardenId,
      ...bundledPlantIds,
    );
  }

  const gardenPlaceholders = bundledGardenIds.map(() => "?").join(", ");

  await db.runAsync(
    `DELETE FROM gardens
     WHERE id NOT IN (${gardenPlaceholders});`,
    ...bundledGardenIds,
  );
}
