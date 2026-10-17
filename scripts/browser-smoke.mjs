#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { chromium } from "playwright";
import { checkedOutputPath, checkedUrl } from "./browser-guard.mjs";
import { checkBrand } from "./brand-check.mjs";
import { emptyVerdict, finalizeVerdict } from "./browser-smoke-verdict.mjs";

const url = checkedUrl(process.argv[2] ?? "http://127.0.0.1:8080/");
const outDir = process.argv[3] ?? "/workspace/screenshots";
mkdirSync(outDir, { recursive: true });

const verdict = emptyVerdict();

async function capture(label, viewport) {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
    await page.waitForTimeout(500);
    const bodyText = await page.evaluate(() => document.body?.innerText?.trim() ?? "");
    const blank = bodyText.length < 20;
    const shot = `${outDir}/${label}.png`;
    await page.screenshot({ path: shot, fullPage: false });
    return { ok: !blank && errors.length === 0, blank, errors, screenshot: shot };
  } finally {
    await browser.close();
  }
}

verdict.desktop = await capture("desktop", { width: 1280, height: 800 });
verdict.mobile = await capture("mobile", { width: 390, height: 844 });

const brand = checkBrand();
verdict.brand = { ok: brand.ok, warnings: brand.warnings };

const final = finalizeVerdict(verdict);
console.log(JSON.stringify(final, null, 2));
if (!final.ok) process.exit(1);
