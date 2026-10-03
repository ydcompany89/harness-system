// RS SNS 1일차 — 유입용 "깔창 사기 전에, 신던 신발부터 꺼내보세요"
// node build-day1.mjs → carousel/01~08.png, carousel-sheet.png, reel/day1-reel.mp4, reel/stills/*.png, reel-sheet.png
// 톤: 런칭필름(launch/rs/design/film/build-insole.mjs) — #0e0e0e + 라임 #C6F432, 헤링본, 라임 도트 4개, Noto Sans KR 900
// 규칙: 정보 장(체크 4가지)은 일반 착용 정보만. 제품 장은 구조·소재 사실만(교정·통증·질병명·충격흡수·피로감소 금지).
//       제품 이미지는 실물 사진(design/film/insole-photo.png)만. 가격·링크 없음.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { createRequire } from 'module';
import { badgeSVG } from '../../design/brand/icons/icons.mjs';

const here = new URL('.', import.meta.url).pathname;
const FFMPEG = process.env.FFMPEG || '/tmp/claude-0/-home-user-harness-system/5da7427a-16df-5cf7-a374-3aaffc0f541d/scratchpad/node_modules/ffmpeg-static/ffmpeg';
const F = '../../design/hangtag/fonts';
const PHOTO = '../../design/film/insole-photo.png';
const L = '#C6F432';
let n = 0;

// ---------- 공용 그래픽 ----------
const logo = (w) => { const id = 'lg' + n++; return `<svg class="logo" style="width:${w}px" viewBox="66 39 478 402"><defs><clipPath id="c${id}"><rect x="66" y="39" width="478" height="402"/></clipPath><filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0.776  0 0 0 0 0.957  0 0 0 0 0.196  -0.667 -0.667 -0.667 0 1.6"/></filter></defs><g clip-path="url(#c${id})"><image href="../../design/brand/rs-logo-source.png" width="587" height="481" filter="url(#${id})"/></g></svg>`; };
const heelGlyph = '<g transform="scale(2)" stroke-width="1.3"><path d="M5 4 V13 A7 7 0 0 0 19 13 V4"/><path d="M8.5 4 V12.5 A3.5 3.5 0 0 0 15.5 12.5 V4" /></g>';
const badge = (k, size) => { const id = 'b' + n++; return `<div class="bd" style="width:${size}px;height:${size}px">${badgeSVG(k, { id, glow: true, custom: k === 'heel' ? heelGlyph : null })}</div>`; };
// 실물 사진 크롭 (사진 위쪽 인솔, 1080x600 기준) + 뒤꿈치 홀을 두르는 링(크롭좌표 268,312 — 실측 맞춤)
const ringSVG = (cls = '') => `<svg class="ring ${cls}" viewBox="0 0 1080 600"><ellipse cx="268" cy="312" rx="182" ry="128" fill="none" stroke="${L}" stroke-width="10"/></svg>`;
const crop = (extra = '') => `<div class="crop"><img src="${PHOTO}">${extra}</div>`;

// 체크 그래픽 (일반 정보용 도해 — 제품 아님)
const shoe = {
  sneaker: `<path d="M8 62H112V54C112 46 104 44 94 42L66 34L56 18H30L24 40C14 42 8 48 8 54Z"/><path d="M8 54H112"/><path d="M40 26L48 24M42 32L52 30"/>`,
  dress: `<path d="M8 58H24V66H32V58H114C114 50 106 46 94 44L64 38L54 28H24C20 38 12 44 8 50Z"/><path d="M32 58H114"/>`,
  boot: `<path d="M10 64H112V56C112 48 104 46 94 44L70 38L66 8H28L26 44C16 46 10 50 10 56Z"/><path d="M10 56H112"/><path d="M34 18H60M34 28H62"/>`,
};
const g1 = `<div class="g1">${[['sneaker', '운동화'], ['dress', '구두'], ['boot', '안전화']].map(([k, t]) =>
  `<div class="sh"><svg viewBox="0 0 120 80" fill="none" stroke="${L}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">${shoe[k]}</svg><b>${t}</b></div>`).join('')}</div>`;
// 단면: 신발 바닥(U) 안에 층
const g2 = `<svg class="g2" viewBox="0 0 860 380" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <g><path d="M40 120V300Q40 330 70 330H350Q380 330 380 300V120" stroke="#777" stroke-width="8"/>
    <rect x="70" y="70" width="280" height="26" rx="13" stroke="#bbb" stroke-width="5" stroke-dasharray="14 12"/>
    <path d="M210 150V112M194 128L210 112L226 128" stroke="#bbb" stroke-width="6"/>
    <rect x="62" y="280" width="296" height="30" rx="15" fill="${L}"/>
    <text x="210" y="372" text-anchor="middle" class="lb">빼고 넣기</text></g>
  <g transform="translate(440 0)"><path d="M40 120V300Q40 330 70 330H350Q380 330 380 300V120" stroke="#777" stroke-width="8"/>
    <rect x="62" y="282" width="296" height="28" rx="14" fill="#666"/>
    <rect x="62" y="244" width="296" height="30" rx="15" fill="${L}"/>
    <text x="210" y="372" text-anchor="middle" class="lb">위에 겹치기</text></g>
</svg>`;
const sole = 'M150 20C232 20 272 92 270 200C268 300 238 360 240 452C242 566 220 680 150 680C80 680 58 566 60 452C62 372 30 300 30 200C28 92 68 20 150 20Z';
const g3 = `<svg class="g3" viewBox="-80 0 600 760" fill="none" stroke-linecap="round">
  <path d="${sole}" transform="translate(70 40)" stroke="#bbb" stroke-width="6" stroke-dasharray="16 12"/>
  <path d="${sole}" transform="translate(84 6) scale(.95 1.05)" stroke="${L}" stroke-width="8"/>
  <path d="M40 30V740M28 30H52M28 740H52" stroke="#888" stroke-width="4"/>
  <text x="0" y="400" class="lb">길이</text>
  <path d="M110 520H420M110 508V532M420 508V532" stroke="#888" stroke-width="4"/>
  <text x="265" y="505" class="lb" text-anchor="middle">폭</text>
</svg>`;
const g4 = `<div class="g4">
  <div class="row"><span>처음</span><i style="width:22%"></i></div>
  <div class="row"><span>조금씩</span><i style="width:52%"></i></div>
  <div class="row"><span>익숙해지면</span><i style="width:86%"></i></div>
  <div class="warn">불편하면 참지 말고 빼기</div>
</div>`;

const checks = [
  { t: '어디에 넣을지<br>먼저 정하기', s: '운동화·구두·안전화는 신발 안 공간이 달라요. 넣을 신발부터 정하고 고르세요.', g: g1, src: 'TOP15 #7' },
  { t: '원래 안창이<br>빠지는지 보기', s: '빼고 넣는 깔창인지, 위에 겹쳐 까는 깔창인지 먼저 확인하세요.', g: g2, src: 'TOP15 #7' },
  { t: '원래 안창 위에<br>겹쳐 대보기', s: '길이와 폭을 맞대어 보세요. 자를 수 있는 제품인지도 함께요.', g: g3, src: 'TOP15 #7·#9' },
  { t: '처음엔<br>짧게 신어보기', s: '새 깔창은 발이 낯설 수 있어요. 불편하면 참지 말고 빼세요.', g: g4, src: 'TOP15 #12' },
];
const quotes = [
  ['안정화 러닝화에 아치깔창<br>넣어도 되나요?', '#7'],
  ['깔창 추가로 깔면 너무 푹신해서<br>역효과?', '#4'],
  ['슬리퍼에도 되나요?', '#7'],
  ['운동용으로 쓸 수 있나요?', '#7'],
];

const css = `
@font-face{font-family:K;font-weight:400;src:url(${F}/NotoSansKR-400.ttf)}
@font-face{font-family:K;font-weight:700;src:url(${F}/NotoSansKR-700.ttf)}
@font-face{font-family:K;font-weight:900;src:url(${F}/NotoSansKR-900.ttf)}
*{box-sizing:border-box}
html,body{margin:0;background:#0e0e0e;font-family:K,sans-serif;color:#fff;word-break:keep-all}
.bg{position:absolute;inset:0;background:repeating-linear-gradient(135deg,transparent 0 38px,#161616 38px 40px),repeating-linear-gradient(45deg,transparent 0 38px,#161616 38px 40px)}
.L{color:${L}}
.logo{display:block}
.bd svg{width:100%;height:100%;display:block}
.crop{position:relative;width:1080px;height:600px;overflow:hidden;border-radius:60px}
.crop img{position:absolute;left:-95px;top:-60px;width:1181px}
.ring{position:absolute;inset:0;width:1080px;height:600px}
.dots{display:flex;gap:22px}.dots i{width:30px;height:30px;border-radius:50%;background:${L};display:block}
.lb{fill:#bbb;font-family:K;font-weight:700;font-size:34px}
.g1{display:flex;gap:30px;justify-content:center}
.g1 .sh{width:270px;height:300px;border:4px solid #333;border-radius:36px;background:#141414;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px}
.g1 svg{width:200px}.g1 b{font-size:44px;font-weight:900}
.g2{width:860px;display:block;margin:0 auto}
.g3{height:560px;display:block;margin:0 auto}
.g4{width:860px;margin:0 auto}
.g4 .row{display:flex;align-items:center;gap:26px;margin-bottom:34px}
.g4 .row span{width:260px;white-space:nowrap;font-size:40px;font-weight:700;color:#bbb;text-align:right}
.g4 .row i{display:block;height:54px;border-radius:27px;background:${L}}
.g4 .warn{margin:40px 0 0 286px;display:inline-block;border:4px solid ${L};border-radius:999px;padding:14px 40px;font-size:40px;font-weight:900;color:${L}}
`;

// ---------- 캐러셀 1080x1350 ----------
const head = (i, label) => `<div class="hd"><span class="lbl">${label}</span><span class="pg">${String(i).padStart(2, '0')} / 08</span></div>`;
const foot = `<div class="ft"><div class="dots sm"><i></i><i></i><i></i><i></i></div><span>RhaRa Shoe · 라라슈</span></div>`;
const slides = [
  // 1 훅
  `<div class="sl s-hook">${head(1, '저장해두고 살 때 보기')}
    <p class="who">오래 서서 일하다<br>퇴근길에 <b class="L">‘깔창 추천’</b> 검색해 본 분들</p>
    <h1>깔창 사기 전에<br>신던 신발부터<br><span class="L">꺼내보세요</span></h1>
    <div class="next"><div class="dots"><i></i><i></i><i></i><i></i></div><span>확인할 4가지 →</span></div>
    ${foot}</div>`,
  // 2 실제 질문
  `<div class="sl s-q">${head(2, '먼저, 실제로 많이 묻는 질문')}
    <h2>영상 댓글<br>약 <span class="L">210개</span>를 읽었습니다</h2>
    <div class="qs">${quotes.map(([q]) => `<div class="q"><i>“</i><p>${q}</p></div>`).join('')}</div>
    <p class="src">출처: 유튜브 ‘서서 일하는 신발·깔창’ 영상 공개 댓글 (2026.10, 라라슈 직접 열람·익명)</p>
    ${foot}</div>`,
  // 3~6 체크
  ...checks.map((c, k) => `<div class="sl s-ck">${head(k + 3, '깔창 사기 전 체크')}
    <div class="num">${k + 1}</div>
    <h2>${c.t}</h2><p class="sub">${c.s}</p>
    <div class="gr">${c.g}</div>
    ${foot}</div>`),
  // 7 제품 (실물 사진)
  `<div class="sl s-pd">${head(7, '그리고, 저희 이야기')}
    <p class="who">라라슈가 지금 만들고 있는 인솔</p>
    <h2>쿼드그립<br><span class="L">아치가득 인솔</span></h2>
    <div class="ph"><div class="phin">${crop(ringSVG())}</div></div>
    <div class="facts">
      <div class="f">${badge('arch', 96)}<p>아치 라인을 따라<br>가득 채운 형태</p></div>
      <div class="f">${badge('heel', 96)}<p>뒤꿈치 가운데를 비운 링<br>+ 감싸는 컵</p></div>
      <div class="f">${badge('woodchip', 96)}<p>E-실리폴리렌에 목공소<br>자투리 우드칩 배합</p></div>
    </div>
    <p class="src">운동화·구두·안전화 같은 일반 신발에 넣는 인솔<br>사진: 09/30 시사출 샘플 — 양산품과 색·표면이 다를 수 있습니다</p>
    </div>`,
  // 8 브랜드·팔로우
  `<div class="sl s-end">
    <div class="dots big"><i></i><i></i><i></i><i></i></div>
    ${logo(330)}
    <div class="nm"><b>RhaRa Shoe</b><span>라라슈</span></div>
    <p class="tag">서서 걷고 일하는 하루를 위한<br>신발과 인솔을 만듭니다</p>
    <div class="open"><span>2026. 11. 11 OPEN</span></div>
    <div class="cta"><b>저장</b> 해두고 · <b>팔로우</b> 하고 · 오픈 <b>알림</b>은 프로필 링크</div>
  </div>`,
];
const carouselHTML = `<!doctype html><html><head><meta charset="utf-8"><title>RS day1 carousel</title><style>${css}
body{width:1080px}
.sl{position:relative;width:1080px;height:1350px;overflow:hidden}
.sl>*{position:relative}
.sl:before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(135deg,transparent 0 38px,#161616 38px 40px),repeating-linear-gradient(45deg,transparent 0 38px,#161616 38px 40px)}
.hd{position:absolute;top:70px;left:90px;right:90px;display:flex;justify-content:space-between;font-size:30px;font-weight:700;letter-spacing:1px}
.hd .lbl{color:${L}}.hd .pg{color:#777}
.ft{position:absolute;left:90px;right:90px;bottom:60px;display:flex;justify-content:space-between;align-items:center;font-size:28px;color:#777;letter-spacing:2px}
.dots.sm{gap:12px}.dots.sm i{width:16px;height:16px}
h1{position:absolute;left:90px;right:60px;top:430px;margin:0;font-size:132px;line-height:1.14;font-weight:900;letter-spacing:-3px}
.who{position:absolute;left:90px;right:90px;top:200px;margin:0;font-size:46px;line-height:1.45;font-weight:700;color:#e0e0e0}
.next{position:absolute;left:90px;top:1010px;display:flex;align-items:center;gap:30px;font-size:44px;font-weight:900}
.s-q h2,.s-ck h2,.s-pd h2{position:absolute;left:90px;right:90px;margin:0;font-weight:900;letter-spacing:-2px}
.s-q h2{top:160px;font-size:84px;line-height:1.18}
.qs{position:absolute;left:90px;right:90px;top:410px;display:flex;flex-direction:column;gap:26px}
.q{display:flex;gap:22px;background:#161616;border:3px solid #2b2b2b;border-radius:30px;padding:26px 34px}
.q i{font-style:normal;font-size:90px;line-height:.9;font-weight:900;color:${L}}
.q p{margin:0;font-size:42px;line-height:1.38;font-weight:700}
.src{position:absolute;left:90px;right:90px;margin:0;font-size:24px;line-height:1.5;color:#777}
.s-q .src{top:1190px}
.num{position:absolute;left:90px;top:170px;width:120px;height:120px;border-radius:50%;background:${L};color:#0e0e0e;font-size:80px;font-weight:900;display:flex;align-items:center;justify-content:center;line-height:1}
.s-ck h2{top:320px;font-size:96px;line-height:1.14}
.s-ck .sub{position:absolute;left:90px;right:90px;top:560px;margin:0;font-size:42px;line-height:1.5;color:#d0d0d0}
.s-ck .gr{position:absolute;left:0;right:0;top:730px;height:520px;display:flex;align-items:center;justify-content:center}
.s-ck .g3{height:500px}
.s-pd .who{top:150px;font-size:40px;color:${L}}
.s-pd h2{top:205px;font-size:84px;line-height:1.14}
.ph{position:absolute;left:90px;top:420px;width:900px;height:480px;border-radius:50px;overflow:hidden;box-shadow:0 30px 80px #000}
.phin{transform:scale(.8333);transform-origin:0 0}
.facts{position:absolute;left:90px;right:60px;top:925px;display:flex;flex-direction:column;gap:8px}
.f{display:flex;align-items:center;gap:26px}
.f p{margin:0;font-size:34px;line-height:1.3;font-weight:700}
.s-pd .src{top:1250px;font-size:24px}
.s-end{text-align:center}
.dots.big{position:absolute;top:220px;left:0;right:0;justify-content:center;gap:40px}.dots.big i{width:56px;height:56px}
.s-end .logo{position:absolute;top:340px;left:375px}
.nm{position:absolute;top:660px;left:0;right:0}
.nm b{display:block;font-size:64px;font-weight:900;letter-spacing:2px}.nm span{font-size:40px;color:${L};font-weight:700}
.tag{position:absolute;top:830px;left:0;right:0;margin:0;font-size:44px;line-height:1.45;font-weight:700;color:#ddd}
.open{position:absolute;top:1010px;left:0;right:0}
.open span{display:inline-block;border:5px solid ${L};border-radius:999px;padding:18px 60px;font-size:50px;font-weight:900;letter-spacing:4px}
.cta{position:absolute;top:1170px;left:0;right:0;font-size:34px;color:#aaa}.cta b{color:${L}}
</style></head><body>${slides.join('\n')}</body></html>`;

// ---------- 릴스 1080x1920, 100 BPM (1박 0.6s), 2박마다 컷 ----------
const cuts = [ // [key, start, end]
  ['c1', 0, 1.2], ['c2', 1.2, 2.4], ['c3', 2.4, 3.6], ['c4', 3.6, 4.8], ['c5', 4.8, 6.0], ['c6', 6.0, 7.2],
  ['c7', 7.2, 8.4], ['c8', 8.4, 9.6], ['c9', 9.6, 10.8], ['c10', 10.8, 12.6], ['c11', 12.6, 13.8], ['c12', 13.8, 16.2],
];
const T = Object.fromEntries(cuts.map(([k, a, b]) => [k, [a, b]]));
const DUR = 16.2;
const sc = (k, last = false) => `animation:${last ? 'cutIn' : 'cut'} ${T[k][1] - T[k][0]}s linear ${T[k][0]}s both`;
const at = (s) => `animation-delay:${s}s`;
const pop = (k, d = 0) => `class="pp" style="${at(T[k][0] + d)}"`;
const reelCheck = (k, i) => `<section class="c ck" style="${sc(k)}">
  <div class="top"><span class="lbl">깔창 사기 전 체크</span></div>
  <div ${pop(k)}><div class="num">${i + 1}</div></div>
  <h2 ${pop(k, .08)}>${checks[i].t}</h2>
  <div class="gr"><div ${pop(k, .2)}>${checks[i].g}</div></div>
</section>`;
const reelHTML = `<!doctype html><html><head><meta charset="utf-8"><title>RS day1 reel</title><style>${css}
html,body{width:1080px;height:1920px;overflow:hidden}
body:not(.go) *{animation-play-state:paused!important}
.c{position:absolute;inset:0;opacity:0;text-align:center}
@keyframes cut{0%{opacity:0}2%{opacity:1}98%{opacity:1}100%{opacity:0}}
@keyframes cutIn{0%{opacity:0}4%{opacity:1}100%{opacity:1}}
@keyframes pp{from{opacity:0;transform:scale(1.18)}to{opacity:1;transform:scale(1)}}
@keyframes up{from{opacity:0;transform:translateY(80px)}to{opacity:1;transform:none}}
@keyframes dot{from{transform:scale(0)}to{transform:scale(1)}}
@keyframes zoom{from{transform:none}to{transform:translateY(-200px) scale(1.4)}}
@keyframes draw{to{stroke-dashoffset:0}}
.pp{opacity:0;animation:pp .28s cubic-bezier(.2,.8,.2,1) both}
.upa{opacity:0;animation:up .5s cubic-bezier(.2,.8,.2,1) both}
.top{position:absolute;top:250px;left:0;right:0;font-size:38px;font-weight:700;letter-spacing:2px}.lbl{color:${L}}
h1,h2{margin:0;font-weight:900;letter-spacing:-3px}
.c1 .who{position:absolute;top:390px;left:60px;right:60px;margin:0;font-size:58px;line-height:1.4;font-weight:700;color:#ddd}
.c1 h1{position:absolute;top:640px;left:40px;right:40px;font-size:150px;line-height:1.14}
.qq{position:absolute;top:300px;left:0;right:0;font-size:44px;font-weight:700;color:#bbb}
.qq b{color:${L}}
.qc{position:absolute;top:600px;left:80px;right:80px}
.qc i{display:block;font-style:normal;font-size:220px;line-height:.8;font-weight:900;color:${L}}
.qc p{margin:20px 0 0;font-size:88px;line-height:1.25;font-weight:900;letter-spacing:-2px}
.c4{background:${L};color:#0e0e0e}
.c4 .dots{position:absolute;top:520px;left:0;right:0;justify-content:center;gap:60px}
.c4 .dots i{width:110px;height:110px;background:#0e0e0e;transform:scale(0);animation:dot .2s ease-out both}
.c4 h2{position:absolute;top:760px;left:40px;right:40px;font-size:140px;line-height:1.14}
.c4 p{position:absolute;top:1120px;left:0;right:0;margin:0;font-size:52px;font-weight:900}
.ck .num{margin:0 auto;width:170px;height:170px;border-radius:50%;background:${L};color:#0e0e0e;font-size:120px;font-weight:900;display:flex;align-items:center;justify-content:center;line-height:1}
.ck>div:nth-child(2){position:absolute;top:360px;left:0;right:0}
.ck h2{position:absolute;top:580px;left:40px;right:40px;font-size:124px;line-height:1.14}
.ck .gr{position:absolute;top:930px;left:0;right:0;height:560px;display:flex;align-items:center;justify-content:center}
.ck .gr>div{width:100%}
.ck .g3{height:540px}
.c9 svg{position:absolute;top:420px;left:440px;width:200px}
.c9 h2{position:absolute;top:720px;left:40px;right:40px;font-size:136px;line-height:1.16}
.c10 .who,.c11 .who{position:absolute;top:250px;left:0;right:0;margin:0;font-size:48px;font-weight:700;color:${L}}
.c10 h2{position:absolute;top:330px;left:40px;right:40px;font-size:112px;line-height:1.14}
.pv{position:absolute;left:0;right:0;top:640px;height:1080px}
.pv .rot{position:absolute;left:240px;top:0;width:600px;height:1080px}
.pv .rot .crop{position:absolute;left:-240px;top:240px;transform:rotate(-90deg);box-shadow:0 30px 80px #000}
.c10 .pv{animation:up .6s cubic-bezier(.2,.8,.2,1) ${T.c10[0]}s both}
.c11 h2{position:absolute;top:330px;left:40px;right:40px;font-size:112px;line-height:1.14;z-index:2}
.c11 .zm{position:absolute;inset:0;transform-origin:557px 1476px;animation:zoom 1.2s ease-out ${T.c11[0]}s both}
.c11 .ring ellipse{stroke-dasharray:1000;stroke-dashoffset:1000;animation:draw .5s ease-out ${T.c11[0] + .15}s forwards}
.c11 .shade{position:absolute;left:0;right:0;top:0;height:720px;background:linear-gradient(#0e0e0e 0,#0e0e0e 75%,rgba(14,14,14,0));z-index:1}
.c12 .dots{position:absolute;top:470px;left:0;right:0;justify-content:center;gap:44px}
.c12 .dots i{width:70px;height:70px;transform:scale(0);animation:dot .2s ease-out both}
.c12 .lw{position:absolute;top:610px;left:0;right:0;display:flex;justify-content:center}
.c12 .nm{position:absolute;top:1010px;left:0;right:0}
.c12 .nm b{display:block;font-size:72px;font-weight:900;letter-spacing:2px}.c12 .nm span{font-size:44px;color:${L};font-weight:700}
.c12 .open{position:absolute;top:1220px;left:0;right:0}
.c12 .open span{display:inline-block;border:5px solid ${L};border-radius:999px;padding:22px 70px;font-size:60px;font-weight:900;letter-spacing:4px;white-space:nowrap}
.c12 .fl{position:absolute;top:1420px;left:0;right:0;font-size:44px;font-weight:700;color:#ccc}
</style></head><body>
<div class="bg"></div>

<section class="c c1" style="${sc('c1')}">
  <p class="who">오래 서서 일하다<br>‘깔창 추천’ 검색해 본 분들</p>
  <h1 ${pop('c1', .05)}>깔창 사기 전에<br><span class="L">신던 신발부터<br>꺼내보세요</span></h1>
</section>

<section class="c c2" style="${sc('c2')}">
  <div class="qq">영상 댓글 <b>약 210개</b>를 읽었더니</div>
  <div class="qc" ${pop('c2')}><i>“</i><p>러닝화에 아치깔창<br>넣어도 되나요?</p></div>
</section>

<section class="c c3" style="${sc('c3')}">
  <div class="qq">이런 질문이 <b>반복</b>됐어요</div>
  <div class="qc" ${pop('c3')}><i>“</i><p>깔창 추가하면<br>너무 푹신해서<br>역효과?</p></div>
</section>

<section class="c c4" style="${sc('c4')}">
  <div class="dots">${[0, 1, 2, 3].map(i => `<i style="${at(T.c4[0] + .05 + i * .1)}"></i>`).join('')}</div>
  <h2 ${pop('c4', .3)}>깔창 사기 전<br>확인할 4가지</h2>
  <p ${pop('c4', .45)}>저장해두세요</p>
</section>

${checks.map((_, i) => reelCheck('c' + (5 + i), i)).join('\n')}

<section class="c c9" style="${sc('c9')}">
  <svg ${pop('c9')} viewBox="0 0 24 24" fill="none" stroke="${L}" stroke-width="2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg>
  <h2 ${pop('c9', .08)}>저장해두고<br><span class="L">살 때</span><br>꺼내보세요</h2>
</section>

<section class="c c10" style="${sc('c10')}">
  <p class="who upa" style="${at(T.c10[0])}">라라슈가 만들고 있는 인솔</p>
  <h2 class="upa" style="${at(T.c10[0] + .1)}">쿼드그립<br><span class="L">아치가득 인솔</span></h2>
  <div class="pv"><div class="rot">${crop()}</div></div>
</section>

<section class="c c11" style="${sc('c11')}">
  <div class="shade"></div>
  <p class="who" style="z-index:2">실물 시사출 샘플</p>
  <h2 ${pop('c11')}>뒤꿈치 가운데를<br><span class="L">비운 링 구조</span></h2>
  <div class="zm"><div class="pv"><div class="rot">${crop(ringSVG())}</div></div></div>
</section>

<section class="c c12" style="${sc('c12', true)}">
  <div class="dots">${[0, 1, 2, 3].map(i => `<i style="${at(T.c12[0] + .05 + i * .15)}"></i>`).join('')}</div>
  <div class="lw upa" style="${at(T.c12[0] + .65)}">${logo(380)}</div>
  <div class="nm upa" style="${at(T.c12[0] + .8)}"><b>RhaRa Shoe</b><span>라라슈</span></div>
  <div class="open upa" style="${at(T.c12[0] + 1.0)}"><span>2026. 11. 11 OPEN</span></div>
  <div class="fl upa" style="${at(T.c12[0] + 1.2)}">팔로우하고 오픈 소식 먼저 받기</div>
</section>
<script>document.fonts.ready.then(()=>requestAnimationFrame(()=>document.body.classList.add('go')))</script>
</body></html>`;

// ---------- 렌더 ----------
fs.mkdirSync(here + 'carousel', { recursive: true });
fs.mkdirSync(here + 'reel/stills', { recursive: true });
fs.writeFileSync(here + 'carousel.html', carouselHTML);
fs.writeFileSync(here + 'reel.html', reelHTML);

const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
const sheet = async (files, w, h, cols, out, labels) => {
  const p = await b.newPage({ viewport: { width: 100, height: 100 } });
  const cell = files.map((f, i) => `<figure><img src="${f}" style="width:${w}px;height:${h}px"><figcaption>${labels[i]}</figcaption></figure>`).join('');
  fs.writeFileSync(here + '_sheet.html', `<!doctype html><meta charset="utf-8"><style>@font-face{font-family:K;src:url(${F}/NotoSansKR-700.ttf)}body{margin:0;padding:24px;background:#2a2a2a;display:grid;grid-template-columns:repeat(${cols},${w}px);gap:20px;width:max-content;font-family:K}figure{margin:0}figcaption{color:#ccc;font-size:20px;margin-top:8px}</style>${cell}`);
  await p.goto(`file://${here}_sheet.html`); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: here + out, fullPage: true }); await p.close(); fs.rmSync(here + '_sheet.html');
};
// 1) 캐러셀
{
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto(`file://${here}carousel.html`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  const els = await p.$$('.sl');
  for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: `${here}carousel/${String(i + 1).padStart(2, '0')}.png` });
  await p.close();
  const fl = slides.map((_, i) => `carousel/${String(i + 1).padStart(2, '0')}.png`);
  await sheet(fl, 360, 450, 4, 'carousel-sheet.png', ['1 훅', '2 실제 질문', '3 체크①', '4 체크②', '5 체크③', '6 체크④', '7 제품(실물)', '8 브랜드·팔로우']);
}
// 2) 릴스 스틸 (컷별 끝무렵 시점)
const stillAt = [['c01-hook', 1.0], ['c02-q1', 2.2], ['c03-q2', 3.4], ['c04-four', 4.6], ['c05-ck1', 5.8], ['c06-ck2', 7.0], ['c07-ck3', 8.2], ['c08-ck4', 9.4], ['c09-save', 10.6], ['c10-product', 12.4], ['c11-heel', 13.6], ['c12-outro', 16.1]];
{
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto(`file://${here}reel.html`); await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => document.body.classList.add('go'));
  for (const [name, t] of stillAt) {
    await p.evaluate((ms) => document.getAnimations().forEach(a => { a.pause(); a.currentTime = ms; }), t * 1000);
    await p.screenshot({ path: `${here}reel/stills/${name}.png` });
  }
  await p.close();
  const pick = ['c01-hook', 'c03-q2', 'c04-four', 'c06-ck2', 'c11-heel', 'c12-outro'];
  await sheet(pick.map(k => `reel/stills/${k}.png`), 300, 533, 6, 'reel-sheet.png', ['0.0 훅', '2.4 질문', '3.6 확인 4가지', '6.0 체크②', '12.6 뒤꿈치 링', '13.8 아웃트로']);
}
// 3) 릴스 영상 (실시간 녹화 → mp4)
if (!process.argv.includes('--no-video')) {
  const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 }, recordVideo: { dir: here + 'reel/tmpvid', size: { width: 1080, height: 1920 } } });
  const p = await ctx.newPage(); await p.goto(`file://${here}reel.html`); await p.waitForTimeout((DUR + 1.0) * 1000);
  const v = p.video(); await ctx.close();
  const webm = here + 'reel/day1-reel.webm';
  fs.renameSync(await v.path(), webm); fs.rmSync(here + 'reel/tmpvid', { recursive: true, force: true });
  execFileSync(FFMPEG, ['-y', '-ss', '0.4', '-i', webm, '-t', String(DUR), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30', '-crf', '20', '-movflags', '+faststart', here + 'reel/day1-reel.mp4'], { stdio: 'ignore' });
  fs.rmSync(webm);
}
await b.close();
console.log('done');
