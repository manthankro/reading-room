import assert from "node:assert/strict";
import { test } from "node:test";
import { injectGrokPwaHead, renderWebManifest } from "./grok-pwa-shared.mjs";

test("injectGrokPwaHead inserts before </head>", () => {
  const html = "<html><head><title>t</title></head><body></body></html>";
  const out = injectGrokPwaHead(html);
  assert.ok(out.includes("manifest.webmanifest"));
  assert.ok(out.includes("extensions.js"));
  assert.ok(out.indexOf("manifest") < out.indexOf("</head>"));
});

test("renderWebManifest returns JSON", () => {
  const body = renderWebManifest("localhost:8080");
  const parsed = JSON.parse(body);
  assert.equal(parsed.display, "standalone");
  assert.ok(parsed.icons?.length > 0);
});

console.log("grok-pwa-plugin.test.mjs: ok");
