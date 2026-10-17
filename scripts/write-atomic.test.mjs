import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeAtomic } from "./write-atomic.mjs";

const dir = mkdtempSync(join(tmpdir(), "write-atomic-"));
const path = join(dir, "out.txt");
try {
  writeAtomic(path, "hello atomic");
  assert.equal(readFileSync(path, "utf8"), "hello atomic");
  writeAtomic(path, "updated");
  assert.equal(readFileSync(path, "utf8"), "updated");
  console.log("write-atomic.test.mjs: ok");
} finally {
  rmSync(dir, { recursive: true, force: true });
}
