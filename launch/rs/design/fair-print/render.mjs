// node render.mjs  : *_art.html / *_dieline.html → out/*.pdf (1:1 mm) + out/*_preview-N.png (긴 변 1800px)
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
import fs from 'fs';
const here = new URL('.', import.meta.url).pathname;
fs.mkdirSync(here + 'out', { recursive: true });
const man = JSON.parse(fs.readFileSync(here + 'manifest.json', 'utf8'));
const only = process.argv[2];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
for (const m of man) {
  if (only && !m.name.startsWith(only)) continue;
  for (const v of ['art', 'dieline']) {
    const pxW = m.w * 96 / 25.4, pxH = m.h * 96 / 25.4;
    const dsf = Math.min(3, 1800 / Math.max(pxW, pxH));
    const ctx = await browser.newContext({ deviceScaleFactor: dsf, viewport: { width: Math.ceil(pxW) + 40, height: 900 } });
    const pg = await ctx.newPage();
    await pg.goto(`file://${here}${m.name}_${v}.html`);
    await pg.evaluate(() => document.fonts.ready);
    await pg.waitForTimeout(400);
    await pg.pdf({ path: `${here}out/${m.name}_${v}.pdf`, width: `${m.w}mm`, height: `${m.h}mm`, printBackground: true, preferCSSPageSize: true });
    if (v === 'dieline') {
      const pages = await pg.$$('.page');
      for (const [i, p] of pages.entries()) await p.screenshot({ path: `${here}out/${m.name}_preview-${i + 1}.png` });
    }
    await ctx.close();
  }
  console.log('done', m.name);
}
await browser.close();
