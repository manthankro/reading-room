#!/usr/bin/env node
/**
 * Capture a single thumbnail of the running app for the preview chrome.
 * Writes to the path given on argv (default /tmp/preview-thumb.png).
 */
import { chromium } from "playwright";
import { checkedUrl, checkedOutputPath } from "./browser-guard.mjs";

const url = checkedUrl(process.argv[2] ?? "http://127.0.0.1:8080/");
const out = checkedOutputPath(process.argv[3] ?? "/tmp/preview-thumb.png");

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
await page.screenshot({ path: out, fullPage: false });
await browser.close();
console.log(out);
