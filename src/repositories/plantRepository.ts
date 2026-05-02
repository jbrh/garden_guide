import type { SQLiteDatabase } from "expo-sqlite";

import type { Plant } from "@/types/domain";
import { mapPlantRow } from "@/types/domain";
import type { PlantRow } from "@/types/database";
import { trimOptional } from "@/utils/validation";

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
