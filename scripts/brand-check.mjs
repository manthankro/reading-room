#!/usr/bin/env node
/**
 * Brand-asset gate shared by browser-smoke.mjs (and unit-testable without a
 * browser): a canvas app is almost always a game, and a game without a share
 * card is incomplete. The smoke runner calls this after the visual audit so a
 * missing card fails the same way a blank page does.
 *
 * Rules (from the og skill):
 * - custom-card apps (games, whimsical/creative) need public/og.jpg (or the
 *   path in src/lib/og/site.json) and site.json with card: "custom".
 * - A BRAND WARNING is treated as a soft fail by the smoke runner unless
 *   --strict-brand is passed.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DEFAULT_CARD = "public/og.jpg";
const SITE_JSON = "src/lib/og/site.json";

export function checkBrand(cwd = process.cwd()) {
  const warnings = [];
  const sitePath = join(cwd, SITE_JSON);
  let site = {};
  if (existsSync(sitePath)) {
    try {
      site = JSON.parse(readFileSync(sitePath, "utf8"));
    } catch {
      warnings.push(`${SITE_JSON} is not valid JSON`);
    }
  } else {
    warnings.push(`${SITE_JSON} is missing`);
  }

  const cardPath = site.image
    ? join(cwd, site.image.replace(/^\//, ""))
    : join(cwd, DEFAULT_CARD);
  if (!existsSync(cardPath)) {
    warnings.push(`share card missing: ${cardPath}`);
  } else {
    const st = statSync(cardPath);
    if (st.size < 500) {
      warnings.push(`share card looks empty/placeholder (${st.size} bytes): ${cardPath}`);
    }
  }

  if (site.card !== "custom" && site.card !== undefined) {
    warnings.push(`site.json card should be "custom" for custom-card apps (got ${JSON.stringify(site.card)})`);
  }

  return {
    ok: warnings.length === 0,
    warnings,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = checkBrand();
  if (!result.ok) {
    for (const w of result.warnings) console.error(`BRAND WARNING: ${w}`);
    process.exit(1);
  }
  console.log("brand-check: ok");
}
