import assert from "node:assert/strict";
import { test } from "node:test";
import { parseAppEnv, loadAppEnv } from "./with-app-env.mjs";

test("parseAppEnv keeps only VITE_ string keys", () => {
  const env = parseAppEnv(JSON.stringify({
    VITE_AUTH_ENABLED: "false",
    SECRET: "no",
    VITE_FOO: 1,
  }));
  assert.deepEqual(env, { VITE_AUTH_ENABLED: "false" });
});

test("parseAppEnv tolerates bad JSON", () => {
  assert.deepEqual(parseAppEnv("not json"), {});
});

test("loadAppEnv returns object", () => {
  const env = loadAppEnv();
  assert.equal(typeof env, "object");
});

console.log("with-app-env.test.mjs: ok");
