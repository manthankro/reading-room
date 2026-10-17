/** Shared PWA / OG helpers used by the Vite plugin and Nitro middleware. */

import { readFileSync } from "node:fs";
import { join } from "node:path";

export const GROK_EXTENSIONS_SCRIPT_SRC =
  "https://grok.com/grok-app-builder/extensions.js";

export function readGrokProjectId() {
  return process.env.GROK_PROJECT_ID ?? "";
}

export function readGrokExtensionsEnabled() {
  return process.env.GROK_EXTENSIONS_ENABLED !== "false";
}

export function readXCreator() {
  return process.env.X_CREATOR ?? "";
}

export function readXCreatorId() {
  return process.env.X_CREATOR_ID ?? "";
}

export function readOgSite(cwd = process.cwd()) {
  try {
    return JSON.parse(readFileSync(join(cwd, "src/lib/og/site.json"), "utf8"));
  } catch {
    return {};
  }
}

export function renderWebManifest(_hostHeader) {
  const name = "Reading Room";
  return JSON.stringify({
    name,
    short_name: name,
    start_url: "/",
    display: "standalone",
    background_color: "#121110",
    theme_color: "#8c3d32",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  });
}

export function renderInstallPageHtml(template, context = {}) {
  return template
    .replace(/\{\{host\}\}/g, context.host ?? "")
    .replace(/\{\{url\}\}/g, context.url ?? "");
}

export function injectGrokPwaHead(html, _ctx = {}) {
  const tags = [
    `<link rel="manifest" href="/manifest.webmanifest" />`,
    `<script src="${GROK_EXTENSIONS_SCRIPT_SRC}" defer></script>`,
  ];
  if (html.includes("</head>")) {
    return html.replace("</head>", `${tags.join("\n")}\n</head>`);
  }
  return html + tags.join("\n");
}

export function grokPwaHeadTags() {
  return [
    ["link", 'rel="manifest" href="/manifest.webmanifest"'],
    ["script", `src="${GROK_EXTENSIONS_SCRIPT_SRC}" defer`],
  ];
}
