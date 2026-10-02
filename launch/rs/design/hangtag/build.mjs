// 행택 HTML 생성기: node build.mjs  -> hangtag-walking.html / hangtag-insole.html
// 수정은 이 파일(데이터/레이아웃)에서 하고 다시 실행한다. 렌더: node render.mjs
import fs from 'fs';
const here = new URL('.', import.meta.url).pathname;

const NEED = '<span class="red">[확인필요]</span>';

// ---------- 아이콘 (24x24, 단순 라인) ----------
const ic = {
  grip4: `<rect x="3.5" y="1.5" width="17" height="21" rx="8" /><circle cx="9" cy="8" r="2"/><circle cx="15" cy="8" r="2"/><circle cx="9" cy="16" r="2"/><circle cx="15" cy="16" r="2"/>`,
  herring: `<polyline points="3,8 12,3.5 21,8"/><polyline points="3,14 12,9.5 21,14"/><polyline points="3,20 12,15.5 21,20"/>`,
  slipon: `<path d="M2.5 18.5 H21.5 V15.5 Q21.5 13.5 18.5 13 L14.5 11.5 L11.5 7 H7.5 L6 12.5 Q2.5 13.5 2.5 16 Z"/><path d="M2.5 21 H21.5"/>`,
  tire: `<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="4"/><path d="M12 2.5 V6 M12 18 V21.5 M2.5 12 H6 M18 12 H21.5"/>`,
  arch: `<path d="M2 19 H22"/><path d="M3.5 19 C7 19 8 10.5 12.5 10.5 C17 10.5 17.5 17 21 19"/><path d="M3 15.5 H5"/>`,
  heel: `<path d="M5 4 V13 A7 7 0 0 0 19 13 V4"/><path d="M8.5 4 V12.5 A3.5 3.5 0 0 0 15.5 12.5 V4" />`,
  vent: [6,12,18].flatMap(x=>[6,12,18].map(y=>`<circle cx="${x}" cy="${y}" r="1.6"/>`)).join(''),
};
const icon = (k) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="#C6F432" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ic[k]}</svg>`;

// ---------- RS 로고 (2026-10-02 대표 확정 원본 PNG를 라임 #C6F432로 재색) ----------
// 인쇄 최종본은 원본 벡터(AI/SVG) 수령 후 교체 — 현재 원본: ../brand/rs-logo-source.png (587px)
let _lg = 0;
const logo = (cls='') => { const id = `lgf${_lg++}`; return `<svg class="logo ${cls}" viewBox="66 39 478 402" style="overflow:hidden"><defs><clipPath id="c${id}"><rect x="66" y="39" width="478" height="402"/></clipPath><filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0.776  0 0 0 0 0.957  0 0 0 0 0.196  -0.667 -0.667 -0.667 0 1.6"/></filter></defs><g clip-path="url(#c${id})"><image href="../brand/rs-logo-source.png" width="587" height="481" filter="url(#${id})"/></g></svg>`; };

// ---------- 헤링본 배경 ----------
const herring = (id, color='#262626') => `<svg class="bgsvg" viewBox="0 0 55 110" preserveAspectRatio="none"><defs><pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 3.5 L3.5 0 L7 3.5 M0 7 L3.5 3.5 L7 7" fill="none" stroke="${color}" stroke-width="0.7"/></pattern></defs><rect width="55" height="110" fill="url(#${id})"/></svg>`;
const dots = (n, y) => [0,1,2,3].map(i=>`<circle cx="${12+i*10.3}" cy="${y}" r="3" ${i<n?'fill="#C6F432"':'fill="none" stroke="#C6F432" stroke-width="0.6"'}/>`).join('');
const zig = (y) => `<polyline points="${Array.from({length:8},(_,i)=>`${i*7.857},${y+(i%2?0:3.5)}`).join(' ')}" fill="none" stroke="#C6F432" stroke-width="0.9"/>`;

// ---------- 제품 데이터 ----------
const products = {
  walking: {
    file: 'hangtag-walking.html',
    kr1: '라라슈', kr2: '쿼드그립', kr3: '종일편한 워킹화',
    en1: 'QUAD GRIP', en2: 'WORKING SHOE',
    nameKR: '라라슈 쿼드그립 종일편한 워킹화', nameEN: 'RhaRa Shoe Quad Grip Working Shoe', nameJA: 'クアッドグリップ ワーキングシューズ',
    itemKR: '신발 (워킹화·슬립온)', itemEN: 'Footwear (working shoe, slip-on)', itemJA: '靴（ワーキングシューズ）',
    material: [['갑피·밑창','Upper·Outsole','アッパー・ソール','합성수지(EVA·실리콘 복합 E-실리폴리렌)'],['안창','Insole','中敷',null],['그립패드','Grip pad','グリップパッド','재생고무(폐타이어)·재생 PVC(실크벽지)']],
    feats: [
      ['grip4','쿼드그립 4점 패드','Quad Grip 4-point pads','밑창에 원형 그립 패드 4개를 배치했습니다.','Four round grip pads are placed on the outsole.'],
      ['herring','헤링본 트레드','Herringbone tread','V자가 이어지는 헤링본 패턴의 밑창 무늬입니다.','A tread pattern of continuous V-shaped herringbone lines.'],
      ['slipon','뒤꿈치 감싸는 슬립온','Closed-heel slip-on','신고 벗기 쉬운 슬립온, 뒤꿈치까지 감싸는 구조입니다.','An easy slip-on that closes around the heel.'],
      ['tire','폐타이어·폐벽지 새활용 패드','Upcycled grip pads','그립 패드에 폐타이어 고무와 실크벽지 재생 PVC를 배합했습니다.','Grip pads blend waste-tire rubber with PVC recovered from silk wallpaper.'],
    ],
    coverIcons: [['grip4','쿼드그립','4점 패드'],['herring','헤링본','트레드'],['slipon','뒤꿈치 감싸는','슬립온'],['tire','폐타이어·폐벽지','새활용 패드']],
    quotes: [
      ['오늘도, 내 속도로.','Today, at my own pace.'],
      ['하루 종일 서 있는 당신에게.','For you, on your feet all day.'],
      ['버려진 타이어가, 다시 걷는 길이 되었습니다.','Discarded tires, now a path to walk again.'],
    ],
    introKR: '뒤꿈치를 감싸는 슬립온 구조에 쿼드그립 4점 패드와 헤링본 트레드를 더한 워킹화입니다. 서서 일하고 걷는 하루를 생각하며 설계했습니다.',
    introEN: 'A closed-heel slip-on with Quad Grip 4-point pads and a herringbone tread, designed with long days of standing and walking in mind.',
    who: ['조리·서비스·매장 등 서서 일하는 분','하루 종일 걷는 분'],
    whoEN: ['People who work on their feet','People who walk all day'],
    caution: [
      ['고온·직사광선을 피해 보관하세요.','Store away from high heat and direct sunlight.','高温・直射日光を避けて保管してください。'],
      ['젖은 바닥·기름진 바닥에서는 주의해서 보행하세요.','Walk with care on wet or oily floors.','濡れた床・油のついた床では注意して歩行してください。'],
      ['용도 외 사용을 금지합니다.','Do not use for other purposes.','用途以外には使用しないでください。'],
    ],
    paper: 'walking',
  },
  insole: {
    file: 'hangtag-insole.html',
    kr1: '라라슈', kr2: '쿼드그립', kr3: '아치가득 인솔',
    en1: 'QUAD GRIP', en2: 'ARCH INSOLE',
    nameKR: '라라슈 쿼드그립 아치가득 인솔', nameEN: 'RhaRa Shoe Quad Grip Arch Insole', nameJA: 'クアッドグリップ アーチインソール',
    itemKR: '신발 깔창 (인솔)', itemEN: 'Shoe insole', itemJA: 'インソール（中敷）',
    material: [['본체','Body','本体','합성수지(E-실리폴리렌)·목분(목공 자투리 우드칩)']],
    feats: [
      ['arch','아치 라인을 따라 가득','Arch-contour design','발 아치 라인을 따라 채우는 형태로 설계했습니다.','Shaped to follow the contour of the foot arch.'],
      ['tire','우드칩 배합 소재','Wood-chip blended material','목공소 자투리 우드칩을 배합한 소재입니다.','Made with offcut wood chips from woodworking shops.'],
      ['heel','뒤꿈치 컵','Heel cup','뒤꿈치를 감싸는 컵 형태 구조입니다.','A cup-shaped structure that cradles the heel.'],
      ['vent','통기 도트','Ventilation dots','도트 패턴으로 통기 구조를 더했습니다.','A dot pattern adds a ventilation structure.'],
    ],
    coverIcons: [['arch','아치 라인을','따라 가득'],['tire','우드칩','배합 소재'],['heel','뒤꿈치','컵'],['vent','통기','도트']],
    quotes: [
      ['좋은 하루는 좋은 걸음에서 시작된다.','A good day starts with a good step.'],
      ['발이 편해야 일이 편하다.','When your feet are at ease, work is easier.'],
      ['버려진 타이어가, 다시 걷는 길이 되었습니다.','Discarded tires, now a path to walk again.'],
    ],
    introKR: '발 아치 라인을 따라 가득 채우는 형태에 쿼드그립 4점, 뒤꿈치 컵, 통기 도트를 더한 인솔입니다. 신고 있는 신발 속에 넣어 사용합니다.',
    introEN: 'An insole shaped to fill along the arch, with Quad Grip 4-point, a heel cup and ventilation dots. Place it inside your shoes.',
    who: ['오래 서 있거나 걷는 일이 많은 분','신발 속 구성을 바꿔보고 싶은 분'],
    whoEN: ['People who stand or walk a lot','People who want to change their in-shoe setup'],
    caution: [
      ['고온·직사광선·화기를 피해 보관하세요.','Store away from high heat, direct sunlight and open flame.','高温・直射日光・火気を避けて保管してください。'],
      ['신발 안 깔창 용도 외 사용을 금지합니다.','Do not use for purposes other than as a shoe insole.','靴の中敷用途以外には使用しないでください。'],
      ['사용 중 이상이 있으면 사용을 중단하세요.','Stop using it if you notice anything unusual.','異常を感じた場合は使用を中止してください。'],
    ],
    paper: 'insole',
  },
};

// ---------- 전개도 기하 (mm, 바깥면 좌표) ----------
const W = 228, H = 165, PW = 240, PH = 180, OX = 6, OY = 6, BLEED = 3;
const PX = (i) => 8 + 55 * i;
const BOT = 1;       // 바닥 정사각이 붙는 칸 인덱스
const outline = `M8,0 L0,6 L0,104 L8,110 L12,120 L59,120 L63,110 L63,165 L118,165 L118,110 L122,120 L169,120 L173,110 L177,120 L224,120 L228,110 L228,0 Z`;
const outlineNoFlap = `M8,0 L8,110 L12,120 L59,120 L63,110 L63,165 L118,165 L118,110 L122,120 L169,120 L173,110 L177,120 L224,120 L228,110 L228,0 Z`;
const folds = `M8,0 V110 M63,0 V110 M118,0 V110 M173,0 V110 M8,110 H228`;
const HOLE = { cx: PX(0) + 27.5, cy: 7.5, r: 2.5 };

// ---------- 패널 내용 ----------
function cover(p) {
  return `<div class="cov">
  <div class="cov-top">${logo('lg')}<div class="cov-brand"><b>RhaRa Shoe</b><span>라라슈</span></div></div>
  <div class="photo"><span>제품 누끼 사진 삽입</span><em>Product cutout photo here</em></div>
  <div class="cov-name"><div class="k1">${p.kr1} ${p.kr2}</div><div class="k2">${p.kr3}</div><div class="e">${p.en1}<i></i>${p.en2}</div></div>
  <div class="cov-ic">${p.coverIcons.map(c=>`<div>${icon(c[0])}<p>${c[1]}<br>${c[2]}</p></div>`).join('')}</div>
</div>`;
}
function quote(p, n) {
  const [k, e] = p.quotes[n];
  const id = `h${n}${p.paper}`;
  const ys = [30, 50, 22];
  return `${herring(id)}<svg class="bgsvg" viewBox="0 0 55 110" preserveAspectRatio="none">${dots(n===0?1:n===1?2:4, 12)}${zig(n===2? 92 : 88)}</svg>
  <div class="quote ${n===2?'q3':''}"><div class="num">0${n+1} / 03</div><div class="qk">${k}</div><div class="qe">${e}</div></div>
  <div class="qfoot">${logo('sm')}<span>RhaRa Shoe · 라라슈</span></div>`;
}
function story(p) {
  return `<div class="inp" style="padding-top:12.5mm"><h3>BRAND STORY<small>브랜드 스토리</small></h3>
  <p class="kr">폐타이어 고무, 실크벽지 자투리, 목공소 우드칩 — 버려지던 자원을 새활용해 신발로 만드는 브랜드, 라라슈(RhaRa Shoe)입니다.</p>
  <p class="kr">하루 종일 서서 일하는 사람들의 걸음 곁에서, 버려진 것이 다시 걷는 길이 되도록 만듭니다.</p>
  <p class="en">RhaRa Shoe makes footwear by upcycling discarded resources: waste-tire rubber, silk-wallpaper offcuts and wood chips.</p>
  <p class="en">For people on their feet all day, we turn what was discarded into a path to walk again.</p>
  <div class="zz"><svg viewBox="0 0 55 8" preserveAspectRatio="none">${zig(2)}</svg></div>
  <div class="sig">${logo('sm')}<span>RhaRa Shoe · 라라슈</span></div></div>`;
}
function intro(p) {
  return `<div class="inp"><h3>PRODUCT<small>제품 소개</small></h3>
  <div class="pname">${p.nameKR}<br><span>${p.en1} / ${p.en2}</span></div>
  <p class="kr">${p.introKR}</p><p class="en">${p.introEN}</p>
  <div class="who"><div class="wl">추천 · For</div>${p.who.map((w,i)=>`<div class="wi"><b></b><div>${w}<br><em>${p.whoEN[i]}</em></div></div>`).join('')}</div>
  <div class="photo sm"><span>제품 사진·도해 자리</span><em>Product photo / diagram</em></div></div>`;
}
function feat(p) {
  return `<div class="inp"><h3>KEY FEATURES<small>핵심 기능</small></h3>
  ${p.feats.map(f=>`<div class="ft">${icon(f[0])}<div><b>${f[1]}</b><i>${f[2]}</i><p>${f[3]}<br><em>${f[4]}</em></p></div></div>`).join('')}</div>`;
}
function quality(p) {
  const mats = p.material.map(m=>`<div class="mrow"><span>${m[0]}<em> ${m[1]} · <span lang="ja">${m[2]}</span></em></span>${m[3] ? `<span class="mv">${m[3]}</span>` : NEED}</div>`).join('');
  return `<div class="inq">
  <h3>품질표시<small>Quality Label · <span lang="ja">品質表示</span></small></h3>
  <div class="qr1"><div class="l">제품명 · Product · <span lang="ja">製品名</span></div><div class="v">${p.nameKR}<br><em>${p.nameEN}</em><br><em>RhaRa Shoe <span lang="ja">${p.nameJA}</span></em></div></div>
  <div class="qr1"><div class="l">품목 · Item · <span lang="ja">品目</span></div><div class="v">${p.itemKR}<br><em>${p.itemEN}</em> · <em lang="ja">${p.itemJA}</em></div></div>
  <div class="qr1"><div class="l">재질 · Material · <span lang="ja">素材</span></div><div class="v">${mats}</div></div>
  <div class="qg"><div class="qr1"><div class="l">치수 · Size · <span lang="ja">サイズ</span></div><div class="v">${NEED}</div></div>
  <div class="qr1"><div class="l">색상 · Color · <span lang="ja">色</span></div><div class="v">${NEED}</div></div>
  <div class="qr1"><div class="l">제조연월 · Mfd. · <span lang="ja">製造年月</span></div><div class="v">${NEED}</div></div>
  <div class="qr1"><div class="l">제조국 · Origin · <span lang="ja">原産国</span></div><div class="v">${NEED}</div></div></div>
  <div class="qr1"><div class="l">제조자·판매자 · Maker/Seller · <span lang="ja">製造・販売元</span></div><div class="v">주식회사 알앤디메이커스</div></div>
  <div class="qg"><div class="qr1"><div class="l">주소 · Address · <span lang="ja">住所</span></div><div class="v">${NEED}</div></div>
  <div class="qr1"><div class="l">고객센터 · Contact · <span lang="ja">連絡先</span></div><div class="v">${NEED}</div></div></div>
  <div class="qr1"><div class="l">취급상 주의 · Care · <span lang="ja">取扱上の注意</span></div>
  <ul class="care">${p.caution.map(c=>`<li>${c[0]}<br><em>${c[1]}</em><br><em lang="ja">${c[2]}</em></li>`).join('')}</ul></div>
  <div class="qrbox"><div class="qr"><span>QR</span></div><div class="qrt"><b>박람회 리드폼 / 홈페이지 연결 예정</b><br><em>Lead form / website — TBD</em><div class="l2">바코드·분리배출표시 · Barcode / Recycling mark</div>${NEED}</div></div>
  </div>`;
}

// ---------- 페이지 조립 ----------
function bottomOutside() {
  return `<div class="botp out">${logo('md')}<div class="bb"><b>RhaRa Shoe</b><span>라라슈</span></div></div>`;
}
function page(p, side) {
  const out = side === 'out';
  const mx = (x, w) => out ? x : W - x - w;     // 안쪽면은 좌우 반전 배치(양면 인쇄 시 뒷면 정렬)
  const panels = [0,1,2,3].map(i => {
    const x = mx(PX(i), 55);
    let inner, cls;
    if (out) { cls = i===0 ? 'cover' : 'quotep'; inner = i===0 ? cover(p) : quote(p, i-1); }
    else { cls = i===3 ? 'qual' : 'innerp'; inner = [story,intro,feat,quality][i](p); }
    return `<div class="panel ${cls}" style="left:${x}mm;top:0">${inner}</div>`;
  }).join('');
  const bx = mx(PX(BOT), 55);
  const bottom = `<div class="panel botpanel" style="left:${bx}mm;top:110mm;width:55mm;height:55mm">${out ? bottomOutside() : ''}</div>`;
  const tf = out ? '' : `transform="translate(${W},0) scale(-1,1)"`;
  const hole = `<circle cx="${HOLE.cx}" cy="${HOLE.cy}" r="${HOLE.r}"/>`;
  const holeBlack = `<circle cx="${HOLE.cx}" cy="${HOLE.cy}" r="${HOLE.r}" fill="#fff"/>`;
  // 안쪽면 품질표시 칸(밝은 배경) — 재단 여백까지 연장 (원본 좌표 x=173..228 → 안쪽면에서는 반전)
  const lightRect = out ? '' : `<rect x="${mx(PX(3),55)-BLEED}" y="${-BLEED}" width="${55+BLEED}" height="${123+BLEED}" fill="#F3F2EC"/>`;
  const base = `<svg class="layer base" viewBox="0 0 ${W} ${H}" style="overflow:visible"><g ${tf}><path d="${out?outline:outlineNoFlap}" fill="#111111" stroke="#111111" stroke-width="${BLEED*2}" stroke-linejoin="miter"/></g>${lightRect}</svg>`;
  const flapY = out ? '' : `<g ${tf}><path d="M8,0 L0,6 L0,104 L8,110 Z" fill="#fff" stroke="none"/></g>`;
  const lines = `<svg class="layer lines" viewBox="0 0 ${W} ${H}" style="overflow:visible">
  <g ${tf}>
   <path class="cut" d="${outline}" fill="none"/>
   <path class="fold" d="${folds}" fill="none"/>
   <circle class="cut" cx="${HOLE.cx}" cy="${HOLE.cy}" r="${HOLE.r}" fill="none"/>
  </g>
  <g class="guide" ${tf}>${[0,1,2,3].map(i=>`<rect x="${PX(i)+3}" y="3" width="49" height="104"/>`).join('')}<rect x="${PX(BOT)+3}" y="113" width="49" height="49"/></g>
  <g class="gluetxt">${out?`<text x="4" y="55" transform="rotate(-90 4 55)" text-anchor="middle">풀칠 날개 GLUE 8mm</text>`:`<text x="${W-4}" y="55" transform="rotate(90 ${W-4} 55)" text-anchor="middle">풀칠 날개 GLUE 8mm (안쪽면 무인쇄 권장)</text>`}</g>
  </svg>`;
  const note = `<div class="note lines">${out?'바깥면 OUTSIDE':'안쪽면 INSIDE (좌우 반전 배치)'} · ${p.nameKR}<br>전개 ${W}×${H}mm (날개 8 + 55×4 / 높이 110 + 바닥 55) · 재단여백 3mm · 안전선 3mm<br>마젠타 실선=칼선 0.25pt · 시안 점선=접는선 · 녹색 점선=안전선(인쇄 제외)<br>종이: 350g 이상 재생지/크라프트 권장 · 행거 구멍 Ø5mm</div>`;
  return `<section class="page ${side}"><div class="net" style="left:${OX}mm;top:${OY}mm;width:${W}mm;height:${H}mm">${base}${panels}${bottom}${lines}${note}</div></section>`;
}

const css = fs.readFileSync(here + 'hangtag.css', 'utf8');
for (const key of Object.keys(products)) {
  const p = products[key];
  const html = `<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8">
<title>${p.nameKR} 행택 인쇄 데이터</title>
<!--
 RS (RhaRa Shoe · 라라슈) 행택 인쇄 데이터 — ${p.nameKR}
 - 이 파일은 build.mjs 로 생성됨 (직접 수정 시 다음 빌드에서 덮어써짐)
 - 컬러: 배경 #111111 / 포인트 네온 라임 #C6F432 (2026-10-02 화면색 확정, 인쇄 팬톤 별색 확정 필요) / 보조 화이트·그레이
 - 로고: 대표 확정 RS 로고(원본 PNG 재색) — 인쇄용 벡터 수령 후 교체
 - 종이: 350g 이상 재생지/크라프트 권장
 - ?lines=0 쿼리 또는 body.nolines → 칼선·접는선·안전선 제외본
 - 한글은 전부 HTML 텍스트(Noto Sans KR/JP 로컬 폰트 임베드 렌더) — AI 이미지 생성 사용 안 함
-->
<style>
@page { size: ${PW}mm ${PH}mm; margin: 0; }
${css}
</style></head>
<body>
${page(p,'out')}
${page(p,'in')}
<script>if(/[?&]lines=0/.test(location.search))document.body.classList.add('nolines');</script>
</body></html>`;
  fs.writeFileSync(here + p.file, html);
  console.log('wrote', p.file);
}
