#!/usr/bin/env node
/**
 * Compares the live dev server's VITE_AUTH_ENABLED (via /__app-env) against
 * the value the next build will resolve from .grok/app-env.json + process.env.
 * A mismatch is a common source of "works in preview, blank on deploy".
 */
import { loadAppEnv } from "./with-app-env.mjs";

export function authEnabledFromEnvValue(value) {
  if (value === undefined || value === null || value === "") return true;
  return String(value).toLowerCase() !== "false";
}

export function buildAuthEnabled(cwd = process.cwd()) {
  const fileEnv = loadAppEnv(cwd);
  const fromFile = fileEnv.VITE_AUTH_ENABLED;
  const fromProcess = process.env.VITE_AUTH_ENABLED;
  return authEnabledFromEnvValue(fromProcess ?? fromFile);
}

export async function probeDevAuthEnabled(baseUrl, fetchImpl = fetch) {
  const res = await fetchImpl(`${baseUrl.replace(/\/$/, "")}/__app-env`);
  if (!res.ok) return null;
  const text = await res.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  return authEnabledFromEnvValue(parsed?.VITE_AUTH_ENABLED);
}

export function compareAuthInvariant({ dev, build }) {
  if (dev === null) {
    return { ok: true, warnings: ["could not probe live /__app-env"] };
  }
  if (dev === build) return { ok: true, warnings: [] };
  return {
    ok: false,
    warnings: [
      `VITE_AUTH_ENABLED mismatch: live dev=${dev} vs next build=${build}. ` +
        `Start Vite through npm run dev (scripts/with-app-env.mjs) so both agree.`,
    ],
  };
}

export function authInvariantWarnings(result) {
  return result.warnings ?? [];
}

async function main() {
  const base = process.env.APP_URL ?? "http://127.0.0.1:8080";
  const dev = await probeDevAuthEnabled(base).catch(() => null);
  const build = buildAuthEnabled();
  const result = compareAuthInvariant({ dev, build });
  for (const w of result.warnings) console.error(w);
  process.exit(result.ok ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
