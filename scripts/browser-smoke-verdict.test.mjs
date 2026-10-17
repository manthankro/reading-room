import assert from "node:assert/strict";
import { test } from "node:test";
import { emptyVerdict, finalizeVerdict } from "./browser-smoke-verdict.mjs";

test("emptyVerdict starts not ok", () => {
  const v = emptyVerdict();
  assert.equal(v.desktop.ok, false);
  assert.equal(v.mobile.ok, false);
});

test("finalizeVerdict requires both viewports clean", () => {
  const v = emptyVerdict();
  v.desktop = { ok: true, blank: false, errors: [], screenshot: "d.png" };
  v.mobile = { ok: true, blank: false, errors: [], screenshot: "m.png" };
  v.brand = { ok: true, warnings: [] };
  const final = finalizeVerdict(v);
  assert.equal(final.ok, true);
  assert.equal(final.desktopOk, true);
  assert.equal(final.mobileOk, true);
});

test("finalizeVerdict fails on blank", () => {
  const v = emptyVerdict();
  v.desktop = { ok: true, blank: true, errors: [], screenshot: null };
  v.mobile = { ok: true, blank: false, errors: [], screenshot: "m.png" };
  v.brand = { ok: true, warnings: [] };
  const final = finalizeVerdict(v);
  assert.equal(final.ok, false);
});

console.log("browser-smoke-verdict.test.mjs: ok");
