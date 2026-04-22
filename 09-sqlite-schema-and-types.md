# SQLite Schema and TypeScript Starter Types

This document proposes a simple local-first schema for the Expo app. It is designed for `expo-sqlite` now and can later map cleanly to Supabase/Postgres.

## Design goals

- Support more than one garden on a single phone
- Keep plant records flexible and easy to edit
- Support QR assignment per plant
- Keep image handling simple for v1
- Support a Mac-authored bundled garden data file that can be shipped in app builds
- Leave room for future sync and sharing

## V1 tables

For v1, use just two main tables:

- `gardens`
- `plants`

You can add `plant_photos`, `users`, and sync metadata later.

## Current bundled-content workflow

The current app keeps a canonical garden-tour content file in `src/data/bundledGarden.ts`.

On app launch:
- the app initializes SQLite locally on the device
- `src/db/seed.ts` validates the bundled garden data
- the bundled garden and plants are upserted into SQLite by stable IDs
- bundled records refresh on newer builds without requiring a hosted database

This fits the current model where the Mac is the source of truth and phones are primarily for taking the tour.

## SQLite schema (starter)

```sql
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
```

## Why these choices

### `id TEXT`
Use string IDs rather than auto-increment integers. This makes it easier later to sync with Supabase and avoid ID collisions.

### `garden_id`
Every plant belongs to one garden. This is important for future multi-garden support.

### `qr_code_value`
This is optional until you assign a label. It is unique when present, so one QR code cannot accidentally point to two plants.

### `primary_photo_uri`
For v1, store one main photo URI directly on the plant record. Later, you can move to a separate `plant_photos` table if you want galleries.

### timestamps
Use ISO strings for `created_at` and `updated_at`.

## Suggested TypeScript domain types

```ts
export interface Garden {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Plant {
  id: string;
  gardenId: string;
  commonName: string;
  botanicalName: string | null;
  cultivar: string | null;
  shortDescription: string | null;
  careBasics: string | null;
  habitatValue: string | null;
  personalNotes: string | null;
  qrCodeValue: string | null;
  primaryPhotoUri: string | null;
  createdAt: string;
  updatedAt: string;
}
```

## Suggested insert/update input types

Keep create/update payloads distinct from row types.

```ts
export interface CreateGardenInput {
  name: string;
  description?: string | null;
  isActive?: boolean;
}

export interface UpdateGardenInput {
  name?: string;
  description?: string | null;
  isActive?: boolean;
}

export interface CreatePlantInput {
  gardenId: string;
  commonName: string;
  botanicalName?: string | null;
  cultivar?: string | null;
  shortDescription?: string | null;
  careBasics?: string | null;
  habitatValue?: string | null;
  personalNotes?: string | null;
  qrCodeValue?: string | null;
  primaryPhotoUri?: string | null;
}

export interface UpdatePlantInput {
  commonName?: string;
  botanicalName?: string | null;
  cultivar?: string | null;
  shortDescription?: string | null;
  careBasics?: string | null;
  habitatValue?: string | null;
  personalNotes?: string | null;
  qrCodeValue?: string | null;
  primaryPhotoUri?: string | null;
}
```

## Suggested SQLite row types

If you want explicit row typing for DB mapping:

```ts
export interface GardenRow {
  id: string;
  name: string;
  description: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface PlantRow {
  id: string;
  garden_id: string;
  common_name: string;
  botanical_name: string | null;
  cultivar: string | null;
  short_description: string | null;
  care_basics: string | null;
  habitat_value: string | null;
  personal_notes: string | null;
  qr_code_value: string | null;
  primary_photo_uri: string | null;
  created_at: string;
  updated_at: string;
}
```

## Mapper helpers

Map DB rows to app-friendly objects near the repository layer.

```ts
export function mapGardenRow(row: GardenRow): Garden {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapPlantRow(row: PlantRow): Plant {
  return {
    id: row.id,
    gardenId: row.garden_id,
    commonName: row.common_name,
    botanicalName: row.botanical_name,
    cultivar: row.cultivar,
    shortDescription: row.short_description,
    careBasics: row.care_basics,
    habitatValue: row.habitat_value,
    personalNotes: row.personal_notes,
    qrCodeValue: row.qr_code_value,
    primaryPhotoUri: row.primary_photo_uri,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
```

## Recommended initial repository functions

### Garden repository

- `createGarden(input)`
- `getAllGardens()`
- `getGardenById(gardenId)`
- `updateGarden(gardenId, input)`
- `setActiveGarden(gardenId)` (optional)
- `deleteGarden(gardenId)`

### Plant repository

- `createPlant(input)`
- `getPlantsByGardenId(gardenId)`
- `getPlantById(plantId)`
- `updatePlant(plantId, input)`
- `deletePlant(plantId)`
- `getPlantByQrCodeValue(qrCodeValue)`
- `assignQrCodeToPlant(plantId, qrCodeValue)`
- `clearQrCodeFromPlant(plantId)`
- `searchPlants(gardenId, query)`

## Suggested validation rules for v1

### Garden
- `name` is required

### Plant
- `gardenId` is required
- `commonName` is required
- `qrCodeValue`, if present, must be unique

## Suggested future tables (not needed yet)

Later, consider adding:

### `plant_photos`
For multiple photos per plant.

```sql
CREATE TABLE plant_photos (
  id TEXT PRIMARY KEY NOT NULL,
  plant_id TEXT NOT NULL,
  photo_uri TEXT NOT NULL,
  caption TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);
```

### `observations`
For seasonal notes over time.

### `tasks`
For care reminders.

### `sync_queue`
For local-first sync with Supabase later.

## How this maps to Supabase later

This schema will translate cleanly to Postgres with minor changes:

- `INTEGER` booleans can become `boolean`
- timestamps can become `timestamptz`
- same table/column concepts can remain intact
- `qr_code_value` can stay uniquely indexed

That is why this is a good local-first starting schema.

## Recommended v1 constraint mindset

Keep the schema small.

The most common mistake at this stage is creating too many tables too early. For your first working app, two tables are enough:

- `gardens`
- `plants`

That is sufficient to support:
- your garden
- your daughter's garden
- switching between gardens on one device later
- future cloud sync planning
