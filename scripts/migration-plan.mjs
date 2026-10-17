/** Shared helpers for migration file discovery used by migrate.mjs and db.ts. */
export function isMigrationFile(name) {
  return /^\d{4}_.+\.sql$/.test(name);
}

export function sortMigrationFiles(names) {
  return names.filter(isMigrationFile).sort();
}
