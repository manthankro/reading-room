/**
 * Vite plugin that injects Grok PWA head tags, the extensions script, and
 * serves the ?install=1 tutorial page during dev. Production uses the Nitro
 * middleware in server/middleware/grok-pwa.ts for the same behaviour.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  injectGrokPwaHead,
  renderInstallPageHtml,
  renderWebManifest,
} from "./grok-pwa-shared.mjs";

export function grokPwaPlugin() {
  return {
    name: "app-builder:grok-pwa",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? "";
        if (url.startsWith("/manifest.webmanifest")) {
          const body = renderWebManifest(req.headers.host);
          res.statusCode = 200;
          res.setHeader("content-type", "application/manifest+json");
          res.end(body);
          return;
        }
        if (url.includes("install=1") || url.startsWith("/?install=1")) {
          try {
            const template = readFileSync(
              join(server.config.root, "scripts/install-page.html"),
              "utf8",
            );
            const html = renderInstallPageHtml(template, {
              host: req.headers.host,
              url,
            });
            res.statusCode = 200;
            res.setHeader("content-type", "text/html; charset=utf-8");
            res.end(html);
            return;
          } catch (err) {
            console.error("[grok-pwa] install page failed", err);
          }
        }
        next();
      });
    },
    transformIndexHtml(html) {
      return injectGrokPwaHead(html);
    },
  };
}
