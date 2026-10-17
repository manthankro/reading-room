#!/usr/bin/env node
/**
 * Run a command with `.grok/app-env.json` merged into its environment.
 *
 * `dev`, `build` and `preview` all route through this wrapper, so the dev
 * server, the built bundle and the preview server can never disagree about
 * `VITE_AUTH_ENABLED` — a divergence that only shows up as a built-output
 * mismatch long after the fact. Anything that starts Vite directly bypasses it.
 *
 * Only `VITE_`-prefixed keys are honored: the file is a build flag carrier, not
 * a secret store, and only `VITE_` vars reach the browser anyway. A real
 * `process.env` entry always wins, so an explicit override still works.
 */
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const APP_ENV_REL_PATH = ".grok/app-env.json";
const VITE_PREFIX = "VITE_";

export function parseAppEnv(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return {};
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return {};
  const env = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (!key.startsWith(VITE_PREFIX) || typeof value !== "string") continue;
    env[key] = value;
  }
  return env;
}

export function loadAppEnv(cwd = process.cwd()) {
  try {
    const text = readFileSync(join(cwd, APP_ENV_REL_PATH), "utf8");
    return parseAppEnv(text);
  } catch {
    return {};
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("usage: with-app-env.mjs <command> [args...]");
    process.exit(1);
  }
  const fileEnv = loadAppEnv();
  const env = { ...process.env };
  for (const [k, v] of Object.entries(fileEnv)) {
    if (env[k] === undefined) env[k] = v;
  }
  const child = spawn(args[0], args.slice(1), {
    env,
    stdio: "inherit",
    shell: false,
  });
  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
