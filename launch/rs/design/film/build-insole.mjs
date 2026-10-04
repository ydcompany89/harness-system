// RS 런칭필름 — 쿼드그립 아치가득 인솔 (1080x1920, 약 16초)
// node build-insole.mjs → insole-film.html, insole-film.webm, stills/insole-*.png
// 구성: 로고 → 제품명 → 기능 3 (아치 라인 · 뒤꿈치 컵 · 우드칩 소재) → 엔딩카드
// 제품은 실물 사진(insole-photo.png, 09/30 시사출)만 사용. 문구는 구조·소재 사실만 (교정·통증·질병명 금지)
import fs from 'fs';
import { createRequire } from 'module';
import { badgeSVG } from '../brand/icons/icons.mjs';
const here = new URL('.', import.meta.url).pathname;
const F = '../hangtag/fonts';
const L = '#C6F432';
let n = 0;
const logo = (w) => { const id = 'lg' + n++; return `<svg class="logo" style="width:${w}px" viewBox="66 39 478 402"><defs><clipPath id="c${id}"><rect x="66" y="39" width="478" height="402"/></clipPath><filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0.776  0 0 0 0 0.957  0 0 0 0 0.196  -0.667 -0.667 -0.667 0 1.6"/></filter></defs><g clip-path="url(#c${id})"><image href="../brand/rs-logo-source.png" width="587" height="481" filter="url(#${id})"/></g></svg>`; };
// 사진 위쪽 인솔만 잘라 세로로 세움(뒤꿈치 아래·앞꿈치 위). 사진 좌표 기준 크롭 1080x600
const insole = (extra = '') => `<div class="crop"><img src="insole-photo.png">${extra}</div>`;
const ring = `<svg class="ring" viewBox="0 0 1080 600"><ellipse cx="244" cy="317" rx="150" ry="140" fill="none" stroke="${L}" stroke-width="10"/><ellipse cx="244" cy="317" rx="150" ry="140" fill="none" stroke="${L}" stroke-width="4" class="pulse"/></svg>`;
const T = { s1: [0, 2.6], s2: [2.6, 5.0], s3: [5.0, 8.0], s4: [8.0, 11.0], s5: [11.0, 14.0], s6: [14.0, 16.5] };
const sc = (k, end = false) => `animation:${end ? 'sceneIn' : 'scene'} ${T[k][1] - T[k][0]}s linear ${T[k][0]}s both`;
const at = (s) => `animation-delay:${s}s`;
const chips = [[-300, -200, 25], [320, -120, -40], [-260, 260, 60], [280, 300, -15], [0, -360, 80]].map(([x, y, r], i) =>
  `<svg class="chip" style="--x:${x}px;--y:${y}px;--r:${r}deg;${at(11.3 + i * .12)}" viewBox="0 0 48 48"><path d="M6 30L14 18L26 21L22 34Z" fill="#b8874b" stroke="${L}" stroke-width="1.5"/><path d="M12 25L21 27" stroke="#7a5428" stroke-width="1.5"/></svg>`).join('');
const html = `<!doctype html><html><head><meta charset="utf-8"><title>RS insole launch film</title><style>
@font-face{font-family:K;font-weight:400;src:url(${F}/NotoSansKR-400.ttf)}
@font-face{font-family:K;font-weight:700;src:url(${F}/NotoSansKR-700.ttf)}
@font-face{font-family:K;font-weight:900;src:url(${F}/NotoSansKR-900.ttf)}
*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;background:#0e0e0e;overflow:hidden;font-family:K,sans-serif;color:#fff}
body:not(.go) *{animation-play-state:paused!important}
.s{position:absolute;inset:0;opacity:0}
@keyframes scene{0%{opacity:0}8%{opacity:1}92%{opacity:1}100%{opacity:0}}
@keyframes sceneIn{0%{opacity:0}12%{opacity:1}100%{opacity:1}}
@keyframes up{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:none}}
@keyframes pop{from{transform:scale(0)}to{transform:scale(1)}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes draw{to{stroke-dashoffset:0}}
.a{opacity:0;animation:up .5s cubic-bezier(.2,.8,.2,1) both}
.bg{position:absolute;inset:0;background:repeating-linear-gradient(135deg,transparent 0 38px,#161616 38px 40px),repeating-linear-gradient(45deg,transparent 0 38px,#161616 38px 40px)}
.logo{display:block}
/* S1 */
.dots{position:absolute;top:640px;left:0;right:0;display:flex;justify-content:center;gap:48px}
.dots i{width:70px;height:70px;border-radius:50%;background:${L};transform:scale(0);animation:pop .22s ease-out both}
.s1 .logo{position:absolute;top:800px;left:50%;margin-left:-230px;opacity:0;animation:up .5s ease-out 1.0s both}
.s1 .nm{position:absolute;top:1230px;left:0;right:0;text-align:center}
.nm b{display:block;font-size:72px;font-weight:900;letter-spacing:2px}.nm span{font-size:44px;color:${L};font-weight:700}
/* 제품 */
.crop{position:relative;width:1080px;height:600px;overflow:hidden;border-radius:60px}
.crop img{position:absolute;left:-95px;top:-60px;width:1181px}
.prod{position:absolute;left:50%;top:50%;width:1080px;height:600px;margin:-300px 0 0 -540px}
.ring{position:absolute;inset:0;width:1080px;height:600px}
.ring ellipse{stroke-dasharray:920;stroke-dashoffset:920;animation:draw .7s ease-out ${8.5}s forwards}
.ring .pulse{animation:draw .7s ease-out 8.5s forwards, pl 1s ease-out 9.2s 2}
@keyframes pl{from{transform:scale(1);opacity:1}to{transform:scale(1.25);opacity:0}}
.ring .pulse{transform-origin:244px 317px}
.cap{position:absolute;left:90px;right:90px}
.no{font-size:40px;font-weight:900;color:${L};letter-spacing:4px}
.cap h2{margin:10px 0 18px;font-size:92px;line-height:1.12;font-weight:900;word-break:keep-all}
.cap p{margin:0;font-size:44px;line-height:1.5;color:#d8d8d8;word-break:keep-all}
.cap .en{font-size:30px;color:#8a8a8a;letter-spacing:3px;margin-top:22px}
.badge{position:absolute;width:190px;height:190px}
/* S2 */
.s2 .p2{position:absolute;left:50%;top:1080px;transform:translateX(-50%) rotate(-90deg) scale(.95);animation:p2 2.4s ease-out 2.6s both}
@keyframes p2{from{opacity:0;transform:translateX(-50%) translateY(200px) rotate(-90deg) scale(.85)}25%{opacity:1}to{opacity:1;transform:translateX(-50%) rotate(-90deg) scale(.95)}}
.s2 .p2 .crop{box-shadow:0 30px 80px #000}
/* S3 아치 도해 */
.arch{position:absolute;left:90px;top:900px;width:900px;height:520px}
.arch path{fill:none;stroke-linecap:round;stroke-linejoin:round}
.arch .base{stroke:#555;stroke-width:8}
.arch .foot{stroke:#bbb;stroke-width:6;stroke-dasharray:1600;stroke-dashoffset:1600;animation:draw 1s ease-out 5.4s forwards}
.arch .sole{stroke:${L};stroke-width:16;stroke-dasharray:1400;stroke-dashoffset:1400;animation:draw 1.1s ease-out 6.0s forwards}
.arch .fill{fill:${L};opacity:0;animation:fade .6s ease-out 6.8s forwards}
.arch text{fill:#8a8a8a;font-size:30px;font-family:K}
/* S4 뒤꿈치 줌 */
.s4 .p4{position:absolute;left:50%;top:1260px;width:1080px;height:600px;margin-left:-540px;transform:rotate(-90deg) scale(1.15);transform-origin:50% 50%;animation:zoom 3s ease-in-out 8s both}
@keyframes zoom{from{transform:rotate(-90deg) scale(1.0)}to{transform:rotate(-90deg) scale(1.35) translateX(170px)}}
.shade{position:absolute;left:0;right:0;top:0;height:980px;background:linear-gradient(#0e0e0e 0,#0e0e0e 68%,rgba(14,14,14,0))}
.s4 .cap,.s4 .badge{z-index:2}
/* S5 */
.s5 .p5{position:absolute;left:50%;top:1080px;width:1080px;height:600px;margin-left:-540px;transform:rotate(-90deg) scale(.9);filter:brightness(.55)}
.chip{position:absolute;left:50%;top:1380px;width:150px;height:150px;margin:-75px;opacity:0;animation:fly .8s cubic-bezier(.2,.8,.2,1) both}
@keyframes fly{from{opacity:0;transform:translate(0,0) rotate(0) scale(.3)}to{opacity:1;transform:translate(var(--x),var(--y)) rotate(var(--r)) scale(1)}}
/* S6 */
.s6 .logo{position:absolute;top:560px;left:50%;margin-left:-200px;animation:up .5s ease-out 14.2s both}
.s6 .t{position:absolute;top:1000px;left:0;right:0;text-align:center}
.s6 .t span{display:block;font-size:44px;color:#ccc;font-weight:700}
.s6 .t b{display:block;font-size:96px;font-weight:900;color:${L};margin-top:6px}
.s6 .open{position:absolute;top:1330px;left:0;right:0;text-align:center}
.s6 .open span{display:inline-block;border:5px solid ${L};border-radius:999px;padding:22px 70px;font-size:56px;font-weight:900;letter-spacing:4px;white-space:nowrap}
.s6 .sig{position:absolute;bottom:150px;left:0;right:0;text-align:center;font-size:34px;color:#888;letter-spacing:3px}
</style></head><body>
<div class="bg"></div>

<section class="s s1" style="${sc('s1')}">
  <div class="dots">${[0, 1, 2, 3].map(i => `<i style="${at(.15 + i * .16)}"></i>`).join('')}</div>
  ${logo(460)}
  <div class="nm a" style="${at(1.3)}"><b>RhaRa Shoe</b><span>라라슈</span></div>
</section>

<section class="s s2" style="${sc('s2')}">
  <div class="cap" style="top:230px"><div class="a" style="${at(2.8)}"><div class="no">NEW · RS</div><h2>라라슈 쿼드그립<br><span style="color:${L}">아치가득 인솔</span></h2></div></div>
  <div class="p2">${insole()}</div>
</section>

<section class="s s3" style="${sc('s3')}">
  <div class="badge a" style="right:90px;top:220px;${at(5.2)}">${badgeSVG('arch', { id: 'f1', glow: true })}</div>
  <div class="cap" style="top:220px"><div class="a" style="${at(5.2)}"><div class="no">01</div><h2>아치 라인을<br>따라 가득</h2><p>발 아치 곡선을 따라<br>빈틈을 채우는 형태</p><div class="en">ARCH CONTOUR</div></div></div>
  <svg class="arch" viewBox="0 0 900 520">
    <path class="base" d="M20 470H880"/>
    <path class="foot" d="M60 440C60 400 90 380 150 380C230 380 270 250 380 220C480 195 560 170 650 120C720 80 800 90 830 160C850 210 850 300 840 360C835 420 820 440 800 440"/>
    <path class="fill" d="M60 470C140 470 170 466 210 440C270 400 300 330 400 320C500 312 560 400 620 440C680 470 760 470 840 470Z"/>
    <path class="sole" d="M60 470C140 470 170 466 210 440C270 400 300 330 400 320C500 312 560 400 620 440C680 470 760 470 840 470"/>
    <text x="40" y="515">HEEL</text><text x="770" y="515">TOE</text>
  </svg>
</section>

<section class="s s4" style="${sc('s4')}">
  <div class="p4">${insole(ring)}</div>
  <div class="shade"></div>
  <div class="badge a" style="right:90px;top:220px;${at(8.2)}">${badgeSVG('heel', { id: 'f2', glow: true, custom: '<g transform="scale(2)" stroke-width="1.3"><path d="M5 4 V13 A7 7 0 0 0 19 13 V4"/><path d="M8.5 4 V12.5 A3.5 3.5 0 0 0 15.5 12.5 V4" /></g>' })}</div>
  <div class="cap" style="top:220px"><div class="a" style="${at(8.2)}"><div class="no">02</div><h2>뒤꿈치를<br>감싸는 컵</h2><p>가운데를 비운 링 구조로<br>뒤꿈치를 감싸 안습니다</p><div class="en">HEEL CUP · RING</div></div></div>
</section>

<section class="s s5" style="${sc('s5')}">
  <div class="p5">${insole()}</div>
  ${chips}
  <div class="badge a" style="right:90px;top:220px;${at(11.2)}">${badgeSVG('woodchip', { id: 'f3', glow: true })}</div>
  <div class="cap" style="top:220px"><div class="a" style="${at(11.2)}"><div class="no">03</div><h2>우드칩<br>배합 소재</h2><p>목공소 자투리 우드칩을<br>새활용해 배합했습니다</p><div class="en">UPCYCLED WOOD-CHIP BLEND</div></div></div>
</section>

<section class="s s6" style="${sc('s6', true)}">
  ${logo(400)}
  <div class="t a" style="${at(14.4)}"><span>라라슈 쿼드그립</span><b>아치가득 인솔</b></div>
  <div class="open a" style="${at(14.7)}"><span>2026. 11. 11 OPEN</span></div>
  <div class="sig a" style="${at(14.9)}">RhaRa Shoe · Made for Standing.</div>
</section>
<script>document.fonts.ready.then(()=>requestAnimationFrame(()=>document.body.classList.add('go')))</script>
</body></html>`;
fs.writeFileSync(here + 'insole-film.html', html);

const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
// 1) 장면별 스틸 (애니메이션 정지·시점 이동)
fs.mkdirSync(here + 'stills', { recursive: true });
{
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto(`file://${here}insole-film.html`); await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => document.body.classList.add('go'));
  for (const [name, t] of [['1-logo', 2.0], ['2-title', 4.6], ['3-arch', 7.6], ['4-heel', 10.4], ['5-wood', 13.4], ['6-end', 16.3]]) {
    await p.evaluate((ms) => document.getAnimations().forEach(a => { a.pause(); a.currentTime = ms; }), t * 1000);
    await p.screenshot({ path: `${here}stills/insole-${name}.png` });
  }
  await p.close();
}
// 2) 영상 (실시간 녹화)
{
  const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 }, recordVideo: { dir: here + 'tmpvid', size: { width: 1080, height: 1920 } } });
  const p = await ctx.newPage(); await p.goto(`file://${here}insole-film.html`); await p.waitForTimeout(17300);
  const v = p.video(); await ctx.close(); fs.renameSync(await v.path(), here + 'insole-film.webm') /* mp4 변환: ffmpeg -ss 0.4 -c:v libx264 -pix_fmt yuv420p -r 30 */; fs.rmSync(here + 'tmpvid', { recursive: true, force: true });
}
await b.close();
console.log('done');
