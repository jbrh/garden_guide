import type { SQLiteDatabase } from "expo-sqlite";

import type {
  CreatePlantInput,
  Plant,
  UpdatePlantInput,
} from "@/types/domain";
import { mapPlantRow } from "@/types/domain";
import type { PlantRow } from "@/types/database";
import { getNowIsoString } from "@/utils/dates";
import { createId } from "@/utils/ids";
import { trimOptional, trimRequired } from "@/utils/validation";

async function getPlantRowById(
  db: SQLiteDatabase,
  plantId: string,
): Promise<PlantRow | null> {
  const row = await db.getFirstAsync<PlantRow>(
    "SELECT * FROM plants WHERE id = ? LIMIT 1;",
    plantId,
  );

  return row ?? null;
}

async function ensureQrCodeAvailable(
  db: SQLiteDatabase,
  qrCodeValue: string | null | undefined,
  excludePlantId?: string,
): Promise<string | null> {
  const normalized = trimOptional(qrCodeValue);

  if (!normalized) {
    return null;
  }

  const existing = excludePlantId
    ? await db.getFirstAsync<{ id: string }>(
        "SELECT id FROM plants WHERE qr_code_value = ? AND id <> ? LIMIT 1;",
        normalized,
        excludePlantId,
      )
    : await db.getFirstAsync<{ id: string }>(
        "SELECT id FROM plants WHERE qr_code_value = ? LIMIT 1;",
        normalized,
      );

  if (existing) {
    throw new Error("This QR code is already assigned to another plant.");
  }

  return normalized;
}

export async function getPlantsByGardenId(
  db: SQLiteDatabase,
  gardenId: string,
): Promise<Plant[]> {
  const rows = await db.getAllAsync<PlantRow>(
    `SELECT * FROM plants
     WHERE garden_id = ?
     ORDER BY common_name COLLATE NOCASE ASC;`,
    gardenId,
  );

  return rows.map(mapPlantRow);
}

export async function getPlantById(
  db: SQLiteDatabase,
  plantId: string,
): Promise<Plant | null> {
  const row = await getPlantRowById(db, plantId);
  return row ? mapPlantRow(row) : null;
}

export async function getPlantByQrCodeValue(
  db: SQLiteDatabase,
  qrCodeValue: string,
): Promise<Plant | null> {
  const normalized = trimOptional(qrCodeValue);

  if (!normalized) {
    return null;
  }

  const row = await db.getFirstAsync<PlantRow>(
    "SELECT * FROM plants WHERE qr_code_value = ? LIMIT 1;",
    normalized,
  );

  return row ? mapPlantRow(row) : null;
}

export async function searchPlants(
  db: SQLiteDatabase,
  gardenId: string,
  query: string,
): Promise<Plant[]> {
  const trimmed = query.trim();

  if (!trimmed) {
    return getPlantsByGardenId(db, gardenId);
  }

  const searchTerm = `%${trimmed}%`;
  const rows = await db.getAllAsync<PlantRow>(
    `SELECT * FROM plants
     WHERE garden_id = ?
       AND (
         common_name LIKE ?
         OR IFNULL(botanical_name, '') LIKE ?
         OR IFNULL(cultivar, '') LIKE ?
       )
     ORDER BY common_name COLLATE NOCASE ASC;`,
    gardenId,
    searchTerm,
    searchTerm,
    searchTerm,
  );

  return rows.map(mapPlantRow);
}

export async function createPlant(
  db: SQLiteDatabase,
  input: CreatePlantInput,
): Promise<Plant> {
  const now = getNowIsoString();
  const id = createId("plant");
  const qrCodeValue = await ensureQrCodeAvailable(db, input.qrCodeValue);

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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    id,
    trimRequired(input.gardenId, "Garden"),
    trimRequired(input.commonName, "Common name"),
    trimOptional(input.botanicalName),
    trimOptional(input.cultivar),
    trimOptional(input.shortDescription),
    trimOptional(input.careBasics),
    trimOptional(input.habitatValue),
    trimOptional(input.personalNotes),
    qrCodeValue,
    trimOptional(input.primaryPhotoUri),
    now,
    now,
  );

  const plant = await getPlantById(db, id);

  if (!plant) {
    throw new Error("Plant could not be created.");
  }

  return plant;
}

export async function updatePlant(
  db: SQLiteDatabase,
  plantId: string,
  input: UpdatePlantInput,
): Promise<Plant> {
  const existingRow = await getPlantRowById(db, plantId);

  if (!existingRow) {
    throw new Error("Plant not found.");
  }

  const existing = mapPlantRow(existingRow);
  const qrCodeValue =
    input.qrCodeValue === undefined
      ? existing.qrCodeValue
      : await ensureQrCodeAvailable(db, input.qrCodeValue, plantId);
  const now = getNowIsoString();

  await db.runAsync(
    `UPDATE plants
     SET common_name = ?,
         botanical_name = ?,
         cultivar = ?,
         short_description = ?,
         care_basics = ?,
         habitat_value = ?,
         personal_notes = ?,
         qr_code_value = ?,
         primary_photo_uri = ?,
         updated_at = ?
     WHERE id = ?;`,
    input.commonName === undefined
      ? existing.commonName
      : trimRequired(input.commonName, "Common name"),
    input.botanicalName === undefined
      ? existing.botanicalName
      : trimOptional(input.botanicalName),
    input.cultivar === undefined
      ? existing.cultivar
      : trimOptional(input.cultivar),
    input.shortDescription === undefined
      ? existing.shortDescription
      : trimOptional(input.shortDescription),
    input.careBasics === undefined
      ? existing.careBasics
      : trimOptional(input.careBasics),
    input.habitatValue === undefined
      ? existing.habitatValue
      : trimOptional(input.habitatValue),
    input.personalNotes === undefined
      ? existing.personalNotes
      : trimOptional(input.personalNotes),
    qrCodeValue,
    input.primaryPhotoUri === undefined
      ? existing.primaryPhotoUri
      : trimOptional(input.primaryPhotoUri),
    now,
    plantId,
  );

  const plant = await getPlantById(db, plantId);

  if (!plant) {
    throw new Error("Plant could not be updated.");
  }

  return plant;
}

export async function deletePlant(
  db: SQLiteDatabase,
  plantId: string,
): Promise<void> {
  await db.runAsync("DELETE FROM plants WHERE id = ?;", plantId);
}

export async function assignQrCodeToPlant(
  db: SQLiteDatabase,
  plantId: string,
  qrCodeValue: string,
): Promise<Plant> {
  return updatePlant(db, plantId, {
    qrCodeValue,
  });
}

export async function clearQrCodeFromPlant(
  db: SQLiteDatabase,
  plantId: string,
): Promise<Plant> {
  return updatePlant(db, plantId, {
    qrCodeValue: null,
  });
}
