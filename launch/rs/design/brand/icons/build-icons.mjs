// node build-icons.mjs -> svg/*.svg (인쇄용 벡터) + icon-sheet.html/png (전체 시트)
import fs from 'fs';
import { createRequire } from 'module';
import { badges, badgeSVG } from './icons.mjs';
const here = new URL('.', import.meta.url).pathname;
for (const [k,,, st] of badges) {
  fs.writeFileSync(`${here}svg/rs-badge-${k}.svg`, badgeSVG(k, { lock: st === 'lock' }));
}
const font = '../../hangtag/fonts';
const cell = ([k, kr, en, st, note]) => `<div class="c ${st}">${badgeSVG(k, { lock: st === 'lock', glow: true })}<b>${kr}</b><i>${en}</i><small>${note}</small></div>`;
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:N;src:url(${font}/NotoSansKR-900.ttf);font-weight:900}
@font-face{font-family:N;src:url(${font}/NotoSansKR-700.ttf);font-weight:700}
@font-face{font-family:N;src:url(${font}/NotoSansKR-400.ttf);font-weight:400}
body{margin:0;background:#111;color:#eee;font-family:N,sans-serif}
.w{width:1600px;padding:56px 64px;box-sizing:border-box;background:linear-gradient(#1a1a1a,#0e0e0e);border:1px solid #2a2a2a}
h1{font-weight:900;font-size:34px;margin:0;color:#C6F432;letter-spacing:.04em}h1 span{color:#eee;font-size:20px;margin-left:14px;font-weight:700}
h2{font-size:18px;margin:44px 0 18px;color:#bbb;font-weight:700;border-bottom:1px solid #333;padding-bottom:10px}
.g{display:grid;grid-template-columns:repeat(5,1fr);gap:28px 22px}
.c{text-align:center}.c svg{width:150px;height:150px;display:block;margin:0 auto 10px}
.c b{display:block;font-size:19px;font-weight:900}.c i{display:block;font-style:normal;font-size:13px;color:#C6F432;font-weight:700;letter-spacing:.06em;margin:4px 0 8px}
.lock i{color:#8a8a8a}.lock b{color:#aaa}.c small{display:block;font-size:12px;color:#888;line-height:1.45;padding:0 8px}
</style><div class="w"><h1>RS TECH BADGES <span>RhaRa Shoe · 라라슈 기술 배지 세트</span></h1>
<h2>✅ 지금 사용 가능 — 구조·소재 사실 표기</h2><div class="g">${badges.filter(b=>b[3]==='ok').map(cell).join('')}</div>
<h2>🔒 번호·성적서 확보 후 활성화 — 그 전엔 인쇄·게시 금지</h2><div class="g">${badges.filter(b=>b[3]==='lock').map(cell).join('')}</div></div>`;
fs.writeFileSync(`${here}icon-sheet.html`, html);
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch(); const p = await b.newPage({ deviceScaleFactor: 1.5 });
await p.goto(`file://${here}icon-sheet.html`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
await (await p.$('.w')).screenshot({ path: `${here}icon-sheet.png` }); await b.close();
console.log('ok', badges.length);
