import assert from "node:assert/strict";
import { test } from "node:test";
import {
  authEnabledFromEnvValue,
  compareAuthInvariant,
} from "./check-auth-invariant.mjs";

test("the flag predicate matches src/lib/auth", () => {
  assert.equal(authEnabledFromEnvValue("false"), false);
  assert.equal(authEnabledFromEnvValue("true"), true);
  assert.equal(authEnabledFromEnvValue(undefined), true);
});

test("compareAuthInvariant reports mismatch", () => {
  const result = compareAuthInvariant({ dev: false, build: true });
  assert.equal(result.ok, false);
  assert.ok(result.warnings.length > 0);
});

test("compareAuthInvariant ok when matching", () => {
  const result = compareAuthInvariant({ dev: true, build: true });
  assert.equal(result.ok, true);
});

console.log("check-auth-invariant.test.mjs: ok");
