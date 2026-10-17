/**
 * Single source of truth for platform head chrome (PWA, extensions.js, OG),
 * shared by the Vite plugin and Nitro middleware. Plain ESM so `node --test`
 * and the Nitro bundler can both consume it.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const DEFAULT_APP_NAME = "Grok App";
export const OG_SERVICE_URL_DEFAULT = "https://og.grok.me";
export const OG_SITE_REL_PATH = "src/lib/og/site.json";

const SHARE_META_KEYS = new Set([
  "og:title",
  "og:description",
  "og:image",
  "og:image:width",
  "og:image:height",
  "og:type",
  "og:url",
  "og:site_name",
  "twitter:card",
  "twitter:title",
  "twitter:image",
  "twitter:description",
  "x:game:image",
  "x:game:image:width",
  "x:game:image:height",
]);

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Inverse of escapeHtml. Decode &amp; last so a single pass undoes one encode. */
function unescapeHtml(value) {
  return String(value)
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");
}

/** 6-digit hex for the og.grok.me placeholder, or "" if site.color is missing/invalid. */
function placeholderCardColor(site = {}) {
  const raw = String(site.color ?? "").trim();
  const hex = raw.startsWith("#") ? raw.slice(1) : raw;
  return /^[0-9a-fA-F]{6}$/.test(hex) ? hex : "";
}

/**
 * "wild-race.grok.me" → "Wild Race". Only published app hosts encode the
 * display name in the first label. Preview / guest hosts are image origins
 * only — slugifying them produced internal names like "Hds Abc 3000 Xy".
 */
export function appNameFromHost(hostHeader) {
  const host = String(hostHeader ?? "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  if (!host.endsWith(".grok.me")) {
    return DEFAULT_APP_NAME;
  }
  const slug = host.split(".")[0] ?? "";
  if (!slug || slug === "www" || !/^[a-z0-9-]{1,63}$/.test(slug)) {
    return DEFAULT_APP_NAME;
  }
  return (
    slug
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || DEFAULT_APP_NAME
  );
}

/** True for Vercel system domains. Envoy rewrites origin Host to these; they SSO-protect `/og.jpg`. */
function isVercelSystemHost(host) {
  return (
    host === "vercel.app" ||
    host.endsWith(".vercel.app") ||
    host === "vercel.com" ||
    host.endsWith(".vercel.com")
  );
}

/** Hostname suitable for absolute og:image URLs. Preview guests (X-Forwarded-Host) are allowed. */
export function publicAppHost(hostHeader) {
  const host = String(hostHeader ?? "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  if (!host || isVercelSystemHost(host)) return "";
  return host;
}

/** Prefer X-Forwarded-Host when present (preview guests); else Host. */
export function resolvePublicHost(hostHeader) {
  return publicAppHost(hostHeader);
}

export function isInstallQuery(url) {
  try {
    const u = typeof url === "string" ? new URL(url, "http://x") : url;
    return u.searchParams.has("install") || u.searchParams.get("utm_source") === "pwa";
  } catch {
    return false;
  }
}

export function isDocumentPath(pathname) {
  if (!pathname || pathname === "/") return true;
  const p = pathname.split("?")[0].split("#")[0];
  if (p.endsWith(".html") || p.endsWith("/")) return true;
  // SPA routes: no file extension
  const last = p.split("/").pop() ?? "";
  return !last.includes(".");
}

export function acceptsHtml(accept) {
  if (!accept) return true;
  const a = String(accept).toLowerCase();
  return a.includes("text/html") || a.includes("*/*") || a.includes("application/xhtml");
}

export function stripInstallParams(url) {
  try {
    const u = typeof url === "string" ? new URL(url, "http://x") : new URL(url.href);
    u.searchParams.delete("install");
    if (u.searchParams.get("utm_source") === "pwa") u.searchParams.delete("utm_source");
    return u.pathname + (u.search ? u.search : "") + (u.hash || "");
  } catch {
    return typeof url === "string" ? url : "/";
  }
}

export function renderInstallPageHtml(template, { host, url } = {}) {
  return String(template ?? "")
    .replace(/\{\{host\}\}/g, host ?? "")
    .replace(/\{\{url\}\}/g, url ?? "");
}

export function renderWebManifest(hostHeader) {
  const name = appNameFromHost(hostHeader) || DEFAULT_APP_NAME;
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

export function grokPwaHeadTags(appName = DEFAULT_APP_NAME) {
  return [
    `<link rel="manifest" href="/manifest.webmanifest" />`,
    `<meta name="application-name" content="${escapeHtml(appName)}" />`,
    `<meta name="apple-mobile-web-app-title" content="${escapeHtml(appName)}" />`,
  ];
}

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

export function grokXCreatorHeadTags(creator = readXCreator(), creatorId = readXCreatorId()) {
  const tags = [];
  if (creator) {
    tags.push(`<meta property="x:creator" content="${escapeHtml(creator)}">`);
  }
  if (creatorId) {
    tags.push(`<meta property="x:creator:id" content="${escapeHtml(creatorId)}">`);
  }
  return tags;
}

export function grokExtensionsHeadTags(projectId = readGrokProjectId()) {
  const tags = [];
  if (projectId) {
    tags.push(`<meta name="grok-project-id" content="${escapeHtml(projectId)}">`);
    tags.push(`<meta property="grok:app_id" content="${escapeHtml(projectId)}">`);
  }
  tags.push(`<script src="${GROK_EXTENSIONS_SCRIPT_SRC}" defer></script>`);
  return tags;
}

export function readOgSite(cwd = process.cwd()) {
  try {
    return JSON.parse(readFileSync(join(cwd, OG_SITE_REL_PATH), "utf8"));
  } catch {
    return {};
  }
}

export function ogCardPublicPath(cwd = process.cwd()) {
  const site = readOgSite(cwd);
  if (site.card && typeof site.card === "string") return site.card;
  return "/og.jpg";
}

export function snapshotOgIdentity(cwd = process.cwd()) {
  const site = readOgSite(cwd);
  return {
    title: site.title ?? site.name ?? "",
    description: site.description ?? "",
    color: placeholderCardColor(site),
  };
}

export function customOgAssetPath(cwd = process.cwd()) {
  const rel = ogCardPublicPath(cwd);
  if (rel.startsWith("http")) return null;
  const local = join(cwd, "public", rel.replace(/^\//, ""));
  return existsSync(local) ? local : null;
}

export function ogServiceUrl() {
  return process.env.OG_SERVICE_URL ?? OG_SERVICE_URL_DEFAULT;
}

export function titleFromDocument(html) {
  const m = String(html).match(/<title[^>]*>([^<]*)<\/title>/i);
  return m ? unescapeHtml(m[1].trim()) : "";
}

export function resolveOgTitle(html, site = {}, appName = DEFAULT_APP_NAME) {
  return (
    site.title ||
    site.name ||
    titleFromDocument(html) ||
    appName ||
    DEFAULT_APP_NAME
  );
}

export function siteHasCustomCard(site = {}) {
  return Boolean(site.card && String(site.card).trim());
}

export function resolveOgCardAsset(site = {}, cwd = process.cwd()) {
  if (siteHasCustomCard(site)) {
    const card = String(site.card).trim();
    if (card.startsWith("http")) return card;
    return card.startsWith("/") ? card : `/${card}`;
  }
  const local = customOgAssetPath(cwd);
  if (local) return ogCardPublicPath(cwd);
  return null;
}

export function grokOgHeadTags({
  title,
  description,
  image,
  host,
  site = {},
  width = 1200,
  height = 630,
} = {}) {
  const tags = [];
  const t = title || site.title || site.name || DEFAULT_APP_NAME;
  const d = description || site.description || "";
  const absImage =
    image && image.startsWith("http")
      ? image
      : image && host
        ? `https://${host}${image.startsWith("/") ? image : `/${image}`}`
        : image || "";

  tags.push(`<meta property="og:title" content="${escapeHtml(t)}">`);
  if (d) tags.push(`<meta property="og:description" content="${escapeHtml(d)}">`);
  if (absImage) {
    tags.push(`<meta property="og:image" content="${escapeHtml(absImage)}">`);
    tags.push(`<meta property="og:image:width" content="${width}">`);
    tags.push(`<meta property="og:image:height" content="${height}">`);
  }
  tags.push(`<meta property="og:type" content="website">`);
  if (host) tags.push(`<meta property="og:url" content="https://${escapeHtml(host)}/">`);
  tags.push(`<meta property="og:site_name" content="${escapeHtml(t)}">`);
  tags.push(`<meta name="twitter:card" content="summary_large_image">`);
  tags.push(`<meta name="twitter:title" content="${escapeHtml(t)}">`);
  if (d) tags.push(`<meta name="twitter:description" content="${escapeHtml(d)}">`);
  if (absImage) tags.push(`<meta name="twitter:image" content="${escapeHtml(absImage)}">`);
  if (absImage) {
    tags.push(`<meta property="x:game:image" content="${escapeHtml(absImage)}">`);
    tags.push(`<meta property="x:game:image:width" content="${width}">`);
    tags.push(`<meta property="x:game:image:height" content="${height}">`);
  }
  return tags;
}

export function stripShareMetaTags(html) {
  let next = String(html);
  for (const key of SHARE_META_KEYS) {
    const re = new RegExp(
      `<meta\\s+[^>]*(?:property|name)=["']${key.replace(/:/g, "\\:")}["'][^>]*>`,
      "gi",
    );
    next = next.replace(re, "");
  }
  return next;
}

export function normalizeHeadContext(ctx = {}) {
  const host = resolvePublicHost(ctx.host ?? ctx.hostHeader ?? "");
  const site = ctx.site ?? readOgSite(ctx.cwd ?? process.cwd());
  const appName =
    ctx.appName ||
    site.title ||
    site.name ||
    appNameFromHost(host) ||
    DEFAULT_APP_NAME;
  return {
    appName,
    projectId: ctx.projectId ?? readGrokProjectId(),
    creator: ctx.creator ?? readXCreator(),
    creatorId: ctx.creatorId ?? readXCreatorId(),
    host,
    cwd: ctx.cwd ?? process.cwd(),
    site,
  };
}

function insertBeforeHeadClose(html, snippet) {
  if (html.includes("</head>")) {
    return html.replace("</head>", `${snippet}\n</head>`);
  }
  return html + snippet;
}

export function injectGrokPwaHead(html, ctx = {}) {
  const normalized = normalizeHeadContext(ctx);
  const { appName, projectId, creator, creatorId, host, cwd, site } = normalized;
  let next = stripShareMetaTags(html);

  const missing = [];
  missing.push(...grokPwaHeadTags(appName));

  const card = resolveOgCardAsset(site, cwd);
  const ogImage =
    card ||
    (host
      ? `${ogServiceUrl()}/?title=${encodeURIComponent(appName)}&color=${placeholderCardColor(site)}`
      : "");
  missing.push(
    ...grokOgHeadTags({
      title: resolveOgTitle(next, site, appName),
      description: site.description,
      image: ogImage,
      host,
      site,
    }),
  );

  if (readGrokExtensionsEnabled() && !next.includes("/grok-app-builder/extensions.js")) {
    missing.push(...grokExtensionsHeadTags(projectId));
  } else if (projectId && !next.includes('name="grok-project-id"')) {
    missing.push(`<meta name="grok-project-id" content="${escapeHtml(projectId)}">`);
  }
  if (
    projectId &&
    !next.includes('property="grok:app_id"') &&
    !next.includes("property='grok:app_id'")
  ) {
    missing.push(`<meta property="grok:app_id" content="${escapeHtml(projectId)}">`);
  }
  const creatorTags = grokXCreatorHeadTags(creator, creatorId);
  if (creatorTags.length > 0) {
    const hasCreator =
      next.includes('property="x:creator" content=') ||
      next.includes("property='x:creator' content=");
    if (!hasCreator) missing.push(creatorTags[0]);
    if (!next.includes('property="x:creator:id"')) missing.push(creatorTags[1]);
  }

  if (missing.length === 0) return next;
  return insertBeforeHeadClose(next, missing.join(""));
}

function findHeadClose(buf) {
  const at = buf.toString("latin1").search(/<\/head>/i);
  return at;
}

/**
 * Streaming head injector: buffers only until `</head>` (ASCII marker; never
 * appears inside a UTF-8 continuation byte), overwrites share-card metas,
 * then passes later chunks through so streaming SSR keeps streaming.
 */
export function createHeadInjector(ctx = {}) {
  const normalized = normalizeHeadContext(ctx);

  /** @type {Buffer[]} */
  let pending = [];
  let done = false;

  const apply = (html) =>
    injectGrokPwaHead(html, {
      appName: normalized.appName,
      projectId: normalized.projectId,
      creator: normalized.creator,
      creatorId: normalized.creatorId,
      host: normalized.host,
      cwd: normalized.cwd,
      site: normalized.site,
    });

  return {
    /** @param {Uint8Array | string} chunk @returns {Buffer[]} chunks ready to emit */
    push(chunk) {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      if (done) return [buf];
      pending.push(buf);
      const joined = Buffer.concat(pending);
      const at = findHeadClose(joined);
      if (at === -1) return [];
      done = true;
      pending = [];
      const closeLen = joined.toString("latin1", at).match(/^<\/head>/i)[0].length;
      const head = apply(joined.subarray(0, at + closeLen).toString("utf8"));
      return [Buffer.concat([Buffer.from(head, "utf8"), joined.subarray(at + closeLen)])];
    },
    /** @returns {Buffer[]} whatever is still buffered (no `</head>` seen) */
    flush() {
      if (done || pending.length === 0) return [];
      const rest = Buffer.concat(pending);
      pending = [];
      done = true;
      return [Buffer.from(apply(rest.toString("utf8")), "utf8")];
    },
  };
}
