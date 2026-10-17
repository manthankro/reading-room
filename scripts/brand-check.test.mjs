import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { checkBrand } from "./brand-check.mjs";

test("missing site.json and card produces warnings", () => {
  const dir = mkdtempSync(join(tmpdir(), "brand-"));
  try {
    const result = checkBrand(dir);
    assert.equal(result.ok, false);
    assert.ok(result.warnings.some((w) => w.includes("site.json")));
    assert.ok(result.warnings.some((w) => w.includes("share card")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("valid custom card is ok", () => {
  const dir = mkdtempSync(join(tmpdir(), "brand-"));
  try {
    mkdirSync(join(dir, "src/lib/og"), { recursive: true });
    mkdirSync(join(dir, "public"), { recursive: true });
    writeFileSync(
      join(dir, "src/lib/og/site.json"),
      JSON.stringify({ title: "Test", card: "custom", image: "/og.jpg" }),
    );
    writeFileSync(join(dir, "public/og.jpg"), Buffer.alloc(600));
    const result = checkBrand(dir);
    assert.equal(result.ok, true);
    assert.deepEqual(result.warnings, []);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

console.log("brand-check.test.mjs: ok");
