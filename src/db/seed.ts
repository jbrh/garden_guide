import type { SQLiteDatabase } from "expo-sqlite";

import {
  bundledGardenData,
  type BundledGardenData,
  type BundledPlantDefinition,
} from "@/data/bundledGarden";
import { getNowIsoString } from "@/utils/dates";
import { trimOptional, trimRequired } from "@/utils/validation";

function validateBundledGardenData(data: BundledGardenData): void {
  trimRequired(data.garden.id, "Bundled garden id");
  trimRequired(data.garden.name, "Bundled garden name");

  const plantIds = new Set<string>();
  const qrCodeValues = new Set<string>();

  for (const plant of data.plants) {
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
  validateBundledGardenData(bundledGardenData);

  const now = getNowIsoString();
  const gardenId = trimRequired(bundledGardenData.garden.id, "Bundled garden id");
  const isActive = bundledGardenData.garden.isActive ?? true;

  if (isActive) {
    await db.runAsync(
      "UPDATE gardens SET is_active = 0, updated_at = ? WHERE id <> ?;",
      now,
      gardenId,
    );
  }

  await db.runAsync(
    `INSERT INTO gardens (id, name, description, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       description = excluded.description,
       is_active = excluded.is_active,
       updated_at = excluded.updated_at;`,
    gardenId,
    trimRequired(bundledGardenData.garden.name, "Bundled garden name"),
    trimOptional(bundledGardenData.garden.description),
    isActive ? 1 : 0,
    now,
    now,
  );

  for (const plant of bundledGardenData.plants) {
    await syncBundledPlant(db, gardenId, plant, now);
  }
}
