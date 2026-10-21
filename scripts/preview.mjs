#!/usr/bin/env node
/**
 * Owns :8081, the built-output QA preview.
 *
 * `vite preview` is strictPort, so a preview left over from an earlier turn
 * both fails the next start and keeps serving the previous build's output.
 * Every restart therefore kills the current port owner first.
 *
 *   node scripts/preview.mjs restart
 *   node scripts/preview.mjs stop
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const PREVIEW_PORT = 8081;
const PREVIEW_HOST = "127.0.0.1";

function parseArgs(argv) {
  const action = argv[2] ?? "restart";
  if (action !== "restart" && action !== "stop") {
    return { error: `unknown action ${action}; use restart|stop` };
  }
  return { action };
}

function pidsOnPort(port) {
  if (!existsSync("/proc")) return [];
  const pids = [];
  for (const entry of readdirSync("/proc")) {
    if (!/^\d+$/.test(entry)) continue;
    try {
      const cmdline = readFileSync(join("/proc", entry, "cmdline"), "utf8");
      if (cmdline.includes(`port ${port}`) || cmdline.includes(`:${port}`)) {
        pids.push(Number(entry));
      }
    } catch {
      /* ignore */
    }
  }
  return pids;
}

async function stop() {
  const pids = pidsOnPort(PREVIEW_PORT);
  for (const pid of pids) {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      /* ignore */
    }
  }
  return pids.length > 0;
}

async function restart() {
  await stop();
  await new Promise((r) => setTimeout(r, 400));
  const child = spawn(
    "node",
    ["scripts/with-app-env.mjs", "vite", "preview", "--host", PREVIEW_HOST, "--port", String(PREVIEW_PORT)],
    { stdio: "ignore", detached: true, cwd: process.cwd() },
  );
  child.unref();
  return 0;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.error) {
    console.error(`[preview] ${args.error}`);
    process.exit(1);
  }
  if (!existsSync("/proc/self")) {
    console.error("[preview] no /proc — this script only runs inside the sandbox");
    process.exit(1);
  }
  process.exitCode = args.action === "stop" ? ((await stop()) ? 0 : 1) : await restart();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
