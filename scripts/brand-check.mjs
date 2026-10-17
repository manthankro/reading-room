#!/usr/bin/env node
/**
 * Brand-asset gate shared by browser-smoke.mjs.
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

  let cardRel = DEFAULT_CARD;
  if (typeof site.image === "string" && site.image.length > 0) {
    cardRel = site.image.replace(/^\//, "");
    if (!cardRel.startsWith("public/")) {
      cardRel = join("public", cardRel);
    }
  }
  const cardPath = join(cwd, cardRel);
  if (!existsSync(cardPath)) {
    warnings.push(`share card missing: ${cardPath}`);
  } else {
    const st = statSync(cardPath);
    if (st.size < 500) {
      warnings.push(`share card looks empty/placeholder (${st.size} bytes): ${cardPath}`);
    }
  }

  if (site.card !== undefined && site.card !== "custom") {
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
