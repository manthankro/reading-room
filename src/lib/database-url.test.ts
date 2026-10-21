import assert from "node:assert/strict";
import { test } from "node:test";
import { getDatabaseUrl } from "./database-url.ts";

test("prefers DATABASE_URL when both database variables are configured", () => {
  assert.equal(
    getDatabaseUrl({ DATABASE_URL: " postgres://manual ", POSTGRES_URL: "postgres://neon" }),
    "postgres://manual",
  );
});

test("uses the pooled Neon POSTGRES_URL when DATABASE_URL is missing", () => {
  assert.equal(getDatabaseUrl({ POSTGRES_URL: " postgres://neon-pooler " }), "postgres://neon-pooler");
});

test("treats empty values as unconfigured", () => {
  assert.equal(getDatabaseUrl({ DATABASE_URL: " ", POSTGRES_URL: "" }), undefined);
});
