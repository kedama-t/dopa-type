// OGP 画像と Favicon の PNG を書き出す: node tools/make-assets.mjs（要 Playwright + Chromium）
import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const browser = await chromium.launch();
const page = await browser.newPage();

await page.setViewportSize({ width: 1200, height: 630 });
await page.goto('file://' + join(root, 'tools/og.html'));
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: join(root, 'og.png') });

const svg = readFileSync(join(root, 'favicon.svg'), 'utf8');
for (const [size, file] of [[32, 'favicon-32.png'], [180, 'apple-touch-icon.png']]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:#0a0628">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: join(root, file) });
}
await browser.close();
console.log('og.png / favicon-32.png / apple-touch-icon.png を書き出しました');
