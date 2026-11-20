// 로고 가이드 이미지: brand/*.svg → img/*.png(투명) + 금지 사례 타일 6개
import { createRequire } from 'module'; const require = createRequire('/opt/node22/lib/node_modules/'); const { chromium } = require('playwright');
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)); const B = path.join(dir, '../brand');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
const ctx = await b.newContext({ viewport: { width: 1600, height: 1600 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const TMP = path.join(dir, '_tmp.html');
const show = async (html) => { fs.writeFileSync(TMP, html); await p.goto('file://' + TMP); await p.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {})))); };
for (const f of fs.readdirSync(B).filter(f => /^rs-(symbol|logo-rharashoe-caps|logo-horizontal)-.*\.svg$/.test(f))) {
  await show(`<html><body style="margin:0;background:transparent"><img id="i" src="file://${B}/${f}" style="width:1600px;display:block"></body></html>`);
  await p.waitForTimeout(150); const el = await p.$('#i');
  await el.screenshot({ path: path.join(dir, 'img', f.replace('.svg', '.png')), omitBackground: true });
}
const logo = (c) => `file://${B}/rs-logo-rharashoe-caps-${c}.svg`;
const tiles = {
  stretch: `<img src="${logo("ink")}" style="width:170px;transform:scaleX(1.7)">`,
  rotate: `<img src="${logo('ink')}" style="width:200px;transform:rotate(-18deg)">`,
  color: `<img src="${logo('ink')}" style="width:200px;filter:invert(23%) sepia(90%) saturate(6000%) hue-rotate(350deg)">`,
  effect: `<img src="${logo('lime')}" style="width:200px;filter:drop-shadow(8px 8px 4px #0008) drop-shadow(0 0 10px #f0f)">`,
  busy: `<div style="width:100%;height:100%;display:grid;place-items:center;background:url(file://${dir}/../fair-print/assets/walking-hero.jpg) center/cover"><img src="${logo('lime')}" style="width:200px"></div>`,
  retype: `<div style="text-align:center;font:700 64px 'DejaVu Serif',serif;color:#0D0D0D">RS<div style="font:italic 28px serif">Rhara shoe</div></div>`,
};
for (const [k, html] of Object.entries(tiles)) {
  await p.setViewportSize({ width: 480, height: 320 });
  await show(`<html><body style="margin:0;width:480px;height:320px;background:#F2F2EF;display:grid;place-items:center;overflow:hidden">${html}</body></html>`);
  await p.waitForTimeout(250); await p.screenshot({ path: path.join(dir, 'img', `bad-${k}.png`) });
}
fs.unlinkSync(TMP); await b.close();
