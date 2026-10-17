import assert from "node:assert/strict";
import { test } from "node:test";

// Lightweight smoke for the preview helper surface.
// Full process tests live in the browser-smoke path.

test("preview helper module loads", async () => {
  const mod = await import("./preview.mjs");
  assert.ok(mod);
});

console.log("preview.test.mjs: ok");
