// node render.mjs : HTML -> PDF(칼선 포함/제외) + PNG(바깥/안쪽 × 포함/제외, 300dpi 근사)
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
import fs from 'fs';
const here = new URL('.', import.meta.url).pathname;
const browser = await chromium.launch();
for (const k of ['walking','insole']) {
  for (const lines of [1,0]) {
    const tag = lines ? 'dieline' : 'nodieline';
    const ctx = await browser.newContext({ deviceScaleFactor: 300/96 });
    const pg = await ctx.newPage();
    await pg.goto(`file://${here}hangtag-${k}.html?lines=${lines}`);
    await pg.evaluate(() => document.fonts.ready);
    await pg.waitForTimeout(500);
    const pages = await pg.$$('.page');
    for (const [i, side] of ['outside','inside'].entries()) {
      await pages[i].screenshot({ path: `${here}hangtag-${k}-${side}-${tag}.png` });
    }
    await pg.pdf({ path: `${here}hangtag-${k}-${tag}.pdf`, width: '240mm', height: '180mm', printBackground: true, preferCSSPageSize: true });
    await ctx.close();
  }
}
await browser.close();
