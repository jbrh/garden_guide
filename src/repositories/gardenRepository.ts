import type { SQLiteDatabase } from "expo-sqlite";

import type {
  CreateGardenInput,
  Garden,
  UpdateGardenInput,
} from "@/types/domain";
import { mapGardenRow } from "@/types/domain";
import type { GardenRow } from "@/types/database";
import { getNowIsoString } from "@/utils/dates";
import { createId } from "@/utils/ids";
import { trimOptional, trimRequired } from "@/utils/validation";

export async function getAllGardens(db: SQLiteDatabase): Promise<Garden[]> {
  const rows = await db.getAllAsync<GardenRow>(
    `SELECT * FROM gardens
     ORDER BY is_active DESC, name COLLATE NOCASE ASC;`,
  );

  return rows.map(mapGardenRow);
}

export async function getGardenById(
  db: SQLiteDatabase,
  gardenId: string,
): Promise<Garden | null> {
  const row = await db.getFirstAsync<GardenRow>(
    "SELECT * FROM gardens WHERE id = ? LIMIT 1;",
    gardenId,
  );

  return row ? mapGardenRow(row) : null;
}

export async function getActiveGarden(
  db: SQLiteDatabase,
): Promise<Garden | null> {
  const row = await db.getFirstAsync<GardenRow>(
    `SELECT * FROM gardens
     WHERE is_active = 1
     ORDER BY updated_at DESC
     LIMIT 1;`,
  );

  if (row) {
    return mapGardenRow(row);
  }

  const fallback = await db.getFirstAsync<GardenRow>(
    `SELECT * FROM gardens
     ORDER BY created_at ASC
     LIMIT 1;`,
  );

  return fallback ? mapGardenRow(fallback) : null;
}

export async function createGarden(
  db: SQLiteDatabase,
  input: CreateGardenInput,
): Promise<Garden> {
  const now = getNowIsoString();
  const id = createId("garden");
  const name = trimRequired(input.name, "Garden name");
  const description = trimOptional(input.description);
  const isActive = input.isActive ?? false;

  if (isActive) {
    await db.runAsync(
      "UPDATE gardens SET is_active = 0, updated_at = ? WHERE is_active = 1;",
      now,
    );
  }

  await db.runAsync(
    `INSERT INTO gardens (id, name, description, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
    id,
    name,
    description,
    isActive ? 1 : 0,
    now,
    now,
  );

  const garden = await getGardenById(db, id);

  if (!garden) {
    throw new Error("Garden could not be created.");
  }

  return garden;
}

export async function updateGarden(
  db: SQLiteDatabase,
  gardenId: string,
  input: UpdateGardenInput,
): Promise<Garden> {
  const existing = await getGardenById(db, gardenId);

  if (!existing) {
    throw new Error("Garden not found.");
  }

  const now = getNowIsoString();
  const name =
    input.name === undefined
      ? existing.name
      : trimRequired(input.name, "Garden name");
  const description =
    input.description === undefined
      ? existing.description
      : trimOptional(input.description);
  const isActive = input.isActive ?? existing.isActive;

  if (isActive) {
    await db.runAsync(
      "UPDATE gardens SET is_active = 0, updated_at = ? WHERE id <> ?;",
      now,
      gardenId,
    );
  }

  await db.runAsync(
    `UPDATE gardens
     SET name = ?, description = ?, is_active = ?, updated_at = ?
     WHERE id = ?;`,
    name,
    description,
    isActive ? 1 : 0,
    now,
    gardenId,
  );

  const garden = await getGardenById(db, gardenId);

  if (!garden) {
    throw new Error("Garden could not be updated.");
  }

  return garden;
}

export async function setActiveGarden(
  db: SQLiteDatabase,
  gardenId: string,
): Promise<void> {
  const now = getNowIsoString();

  await db.runAsync("UPDATE gardens SET is_active = 0, updated_at = ?;", now);
  await db.runAsync(
    "UPDATE gardens SET is_active = 1, updated_at = ? WHERE id = ?;",
    now,
    gardenId,
  );
}

export async function deleteGarden(
  db: SQLiteDatabase,
  gardenId: string,
): Promise<void> {
  await db.runAsync("DELETE FROM gardens WHERE id = ?;", gardenId);
}
