import assert from "node:assert/strict";
import { isMigrationFile, sortMigrationFiles } from "./migration-plan.mjs";

assert.equal(isMigrationFile("0001_auth.sql"), true);
assert.equal(isMigrationFile("0002_reading_sync.sql"), true);
assert.equal(isMigrationFile("readme.md"), false);
assert.equal(isMigrationFile("0001_auth.sql.bak"), false);

const sorted = sortMigrationFiles([
  "0002_b.sql",
  "readme.md",
  "0001_a.sql",
  "0003_c.sql",
]);
assert.deepEqual(sorted, ["0001_a.sql", "0002_b.sql", "0003_c.sql"]);

console.log("migration-plan.test.mjs: ok");
