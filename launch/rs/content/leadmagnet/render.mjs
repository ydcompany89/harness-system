// node render.mjs → checklist.pdf (A4) + checklist-mobile.png (1080px 폭, 문자·카톡 첨부용)
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const here = new URL('.', import.meta.url).pathname;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
const ctx = await browser.newContext({ deviceScaleFactor: 1080 / (210 * 96 / 25.4), viewport: { width: 800, height: 1200 } });
const pg = await ctx.newPage();
await pg.goto(`file://${here}checklist.html`);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(400);
await pg.pdf({ path: `${here}checklist.pdf`, width: '210mm', height: '297mm', printBackground: true, preferCSSPageSize: true });
await (await pg.$('.page')).screenshot({ path: `${here}checklist-mobile.png` });
await browser.close();
console.log('ok');
