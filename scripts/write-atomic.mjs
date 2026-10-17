import { writeFileSync, renameSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { randomBytes } from "node:crypto";

/**
 * Write `data` to `path` atomically (temp file + rename).
 * Avoids partial reads if a reader opens the file mid-write.
 */
export function writeAtomic(path, data, encoding = "utf8") {
  const dir = dirname(path);
  const tmp = join(dir, `.${randomBytes(8).toString("hex")}.tmp`);
  try {
    writeFileSync(tmp, data, encoding);
    renameSync(tmp, path);
  } catch (err) {
    try {
      unlinkSync(tmp);
    } catch {
      /* ignore */
    }
    throw err;
  }
}
