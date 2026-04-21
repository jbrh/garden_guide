import type { SQLiteDatabase } from "expo-sqlite";

import { seedDatabase } from "@/db/seed";

const SCHEMA_VERSION = 1;

const SCHEMA_SQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS gardens (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS plants (
  id TEXT PRIMARY KEY NOT NULL,
  garden_id TEXT NOT NULL,
  common_name TEXT NOT NULL,
  botanical_name TEXT,
  cultivar TEXT,
  location_name TEXT,
  date_planted TEXT,
  short_description TEXT,
  recognition_notes TEXT,
  care_basics TEXT,
  habitat_value TEXT,
  personal_notes TEXT,
  qr_code_value TEXT,
  primary_photo_uri TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (garden_id) REFERENCES gardens(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_plants_qr_code_value
  ON plants(qr_code_value)
  WHERE qr_code_value IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_plants_garden_id
  ON plants(garden_id);

CREATE INDEX IF NOT EXISTS idx_plants_common_name
  ON plants(common_name);

CREATE INDEX IF NOT EXISTS idx_plants_location_name
  ON plants(location_name);
`;

export async function initializeDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync("PRAGMA foreign_keys = ON;");

  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version;",
  );
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion < SCHEMA_VERSION) {
    await db.execAsync(SCHEMA_SQL);
    await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION};`);
  }

  await seedDatabase(db);
}
