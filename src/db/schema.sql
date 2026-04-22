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
  short_description TEXT,
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
