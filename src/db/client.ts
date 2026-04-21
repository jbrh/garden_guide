import * as SQLite from "expo-sqlite";

export const DATABASE_NAME = "garden-companion.db";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDatabaseAsync(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  return databasePromise;
}
