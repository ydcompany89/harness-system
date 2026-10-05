// 행택 HTML 생성기: node build.mjs  -> hangtag-walking.html / hangtag-insole.html
// 수정은 이 파일(데이터/레이아웃)에서 하고 다시 실행한다. 렌더: node render.mjs
import fs from 'fs';
import { badgeSVG, glyph } from '../brand/icons/icons.mjs';
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
  onepiece: `<path d="M2.5 17 H21.5 V14.5 Q21.5 12.5 18.5 12 L14.5 10.5 L11.5 6 H7.5 L6 11.5 Q2.5 12.5 2.5 15 Z"/><path d="M2.5 20.5 H21.5"/><path d="M6 14.5 H19" stroke-dasharray="0"/>`,
  collar: `<path d="M3 19 H21 V16.5 Q21 14.5 18 14 L14 12.5 L12 8.5"/><path d="M12 8.5 L9.5 4 H6.5 L5.5 13 Q3 14 3 16.5 Z"/><path d="M8 7.5 V2.5 M6.5 4 L8 2.5 L9.5 4"/>`,
  vent: [6,12,18].flatMap(x=>[6,12,18].map(y=>`<circle cx="${x}" cy="${y}" r="1.6"/>`)).join(''),
};
// 2026-10-02: RS 기술 배지(육각) 세트로 통일 — 원본 ../brand/icons/icons.mjs
const BMAP = { grip4: 'quadgrip' };
let _bi = 0;
const icon = (k) => { const key = BMAP[k] || k; const id = `b${_bi++}`;
  const custom = glyph[key] ? null : `<g transform="scale(2)" stroke-width="1.3">${ic[k]}</g>`;
  return badgeSVG(key, { id, custom }).replace('class="badge"', 'class="ico"'); };

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
    material: [['갑피·밑창','Upper·Outsole','アッパー・ソール','합성수지(EVA·실리콘 복합 E-실리폴리렌)'],['안창(일체형)','Footbed (one-piece)','中敷（一体型）','합성수지(EVA)'],['그립패드','Grip pad','グリップパッド','재생고무(폐타이어)·재생 PVC(실크벽지)']],
    feats: [
      ['grip4','쿼드그립 4점 패드','Quad Grip 4-point pads','밑창에 원형 그립 패드 4개를 배치했습니다.','Four round grip pads are placed on the outsole.'],
      ['onepiece','깔창 없는 일체형 안창','One-piece footbed','EVA·실리콘 배합 자체 소재 E-실리폴리렌으로 안창까지 하나로 만들어, 깔창을 따로 넣지 않습니다.','Moulded in one piece from E-Silipolyrene, our own EVA–silicone blend — no separate insole needed.'],
      ['collar','도톰한 발목 테두리','Thick collar rim','발목이 들어가는 입구 테두리를 다른 부분보다 두껍게 둘렀습니다.','The rim around the opening is made thicker than the rest of the shoe.'],
      ['tire','폐타이어·폐벽지 새활용 패드','Upcycled grip pads','그립 패드에 폐타이어 고무와 실크벽지 재생 PVC를 배합했습니다.','Grip pads blend waste-tire rubber with PVC recovered from silk wallpaper.'],
    ],
    coverIcons: [['grip4','쿼드그립','4점 패드'],['onepiece','깔창 없는','일체형 안창'],['collar','도톰한','발목 테두리'],['tire','폐타이어·폐벽지','새활용 패드']],
    quotes: [
      ['오늘도, 내 속도로.','Today, at my own pace.'],
      ['하루 종일 서 있는 당신에게.','For you, on your feet all day.'],
      ['버려진 타이어가, 다시 걷는 길이 되었습니다.','Discarded tires, now a path to walk again.'],
    ],
    introKR: 'EVA와 실리콘을 배합한 자체 소재 E-실리폴리렌으로 안창까지 하나로 만든 워킹화입니다. 발목 입구 테두리를 도톰하게 두르고, 쿼드그립 4점 패드와 헤링본 트레드를 더했습니다. 물을 많이 쓰는 주방 현장의 목소리를 듣고 설계했습니다.',
    introEN: 'Moulded in one piece, footbed included, from E-Silipolyrene, our own EVA–silicone blend. A thick collar rim, Quad Grip 4-point pads and a herringbone tread — designed by listening to people who work in wet kitchens.',
    who: ['조리·서비스·매장 등 서서 일하는 분','하루 종일 걷는 분'],
    whoEN: ['People who work on their feet','People who walk all day'],
    caution: [
      ['고온·직사광선을 피해 보관하세요.','Store away from high heat and direct sunlight.','高温・直射日光を避けて保管してください。'],
      ['젖은 바닥·기름진 바닥에서는 주의해서 보행하세요.','Walk with care on wet or oily floors.','濡れた床・油のついた床では注意して歩行してください。'],
      ['용도 외 사용을 금지합니다.','Do not use for other purposes.','用途以外には使用しないでください。'],
    ],
    paper: 'walking',
    img: 'assets/walking-cut.png', detail: 'assets/outsole-lime.jpg', detailCap: '밑창 그립 패드 · 양산 컬러(라임)',
    q: { size: '230~280mm', color: '차콜 · 그레이 · 민트화이트', mfd: '2026년 11월', origin: '대한민국', addr: '대전시 유성구 국제과학7로 8', tel: '0507-1317-2516' },
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
      ['woodchip','우드칩 배합 소재','Wood-chip blended material','목공소 자투리 우드칩을 배합한 소재입니다.','Made with offcut wood chips from woodworking shops.'],
      ['heel','뒤꿈치 컵','Heel cup','뒤꿈치를 감싸는 컵 형태 구조입니다.','A cup-shaped structure that cradles the heel.'],
      ['vent','통기 도트','Ventilation dots','도트 패턴으로 통기 구조를 더했습니다.','A dot pattern adds a ventilation structure.'],
    ],
    coverIcons: [['arch','아치 라인을','따라 가득'],['woodchip','우드칩','배합 소재'],['heel','뒤꿈치','컵'],['vent','통기','도트']],
    quotes: [
      ['좋은 하루는 좋은 걸음에서 시작된다.','A good day starts with a good step.'],
      ['발이 편해야 일이 편하다.','When your feet are at ease, work is easier.'],
      ['버려진 타이어가, 다시 걷는 길이 되었습니다.','Discarded tires, now a path to walk again.'],
    ],
    introKR: '발 아치 라인을 따라 가득 채우는 형태에 쿼드그립 4점, 뒤꿈치 컵, 통기 도트를 더한 인솔입니다. 신고 있는 신발 속에 넣어 사용합니다.',
    introEN: 'An insole shaped to fill along the arch, with Quad Grip 4-point, a heel cup and ventilation dots. Place it inside your shoes.',
    who: ['발 아치가 낮은 편인 분','오래 서 있거나 걷는 일이 많은 분'],
    whoEN: ['People with lower foot arches','People who stand or walk a lot'],
    caution: [
      ['고온·직사광선·화기를 피해 보관하세요.','Store away from high heat, direct sunlight and open flame.','高温・直射日光・火気を避けて保管してください。'],
      ['신발 안 깔창 용도 외 사용을 금지합니다.','Do not use for purposes other than as a shoe insole.','靴の中敷用途以外には使用しないでください。'],
      ['사용 중 이상이 있으면 사용을 중단하세요.','Stop using it if you notice anything unusual.','異常を感じた場合は使用を中止してください。'],
    ],
    paper: 'insole',
    img: 'assets/insole-cut.png', detail: null, detailCap: '',
    q: { size: null, color: null, mfd: null, origin: null, addr: '대전시 유성구 국제과학7로 8', tel: '0507-1317-2516' },
  },
};

// ---------- 전개도 기하 (mm, 바깥면 좌표) ----------
// 2026-10-05 대표 스케치 반영: ①전면 ②측면 ③후면 ④측면(외부 4면) + ⑤보강면(① 뒤로 삽입·접착, 비노출) + 접착 날개
// 바닥: ①~④ 아래 날개 4장(깊이 27.5 = 55/2) → 마주보는 두 쌍이 가운데서 만나 이중 바닥. ⑤ 덕분에 전면 이중벽 → 연필꽂이로 세웠을 때 흔들림↓
const FL = 27.5, GL = 10, CH = 4;           // 바닥 날개 깊이, 접착 날개 폭, 날개 모서리 사선
const W = 55 * 5 + GL, H = 110 + FL, PW = 300, PH = 150, OX = 7.5, OY = 6, BLEED = 3;
const PX = (i) => 55 * i;
const flapPath = (i) => { const x = PX(i); return `L${x+55-CH},${H} L${x+CH},${H} L${x},110`; };
const outline = `M0,0 H275 L285,5 V105 L275,110 H220 ` + [3,2,1,0].map(i => `L${PX(i)+55},110 ${flapPath(i)}`).join(' ') + ` L0,0 Z`;
const folds = `M55,0 V110 M110,0 V110 M165,0 V110 M220,0 V110 M275,0 V110 M0,110 H220`;
const HOLES = [{ cx: 27.5, cy: 7.5, r: 2.5 }, { cx: 247.5, cy: 7.5, r: 2.5 }];   // ① + ⑤ (접으면 겹침)
const GLUEFLAP = `M275,0 L285,5 V105 L275,110 Z`;

// ---------- 패널 내용 ----------
function cover(p) {
  return `<div class="cov">
  <div class="cov-top">${logo('lg')}<div class="cov-brand"><b>RhaRa Shoe</b><span>라라슈</span></div></div>
  <div class="photo img"><img src="${p.img}" alt=""></div>
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
  ${p.detail ? `<div class="detail"><img src="${p.detail}" alt=""><span>${p.detailCap}</span></div>` : ''}</div>`;
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
  <div class="qg"><div class="qr1"><div class="l">치수 · Size · <span lang="ja">サイズ</span></div><div class="v">${p.q.size || NEED}</div></div>
  <div class="qr1"><div class="l">색상 · Color · <span lang="ja">色</span></div><div class="v">${p.q.color || NEED}</div></div>
  <div class="qr1"><div class="l">제조연월 · Mfd. · <span lang="ja">製造年月</span></div><div class="v">${p.q.mfd || NEED}</div></div>
  <div class="qr1"><div class="l">제조국 · Origin · <span lang="ja">原産国</span></div><div class="v">${p.q.origin || NEED}${p.q.origin==='대한민국'?' <em>Korea · <span lang="ja">韓国</span></em>':''}</div></div></div>
  <div class="qr1"><div class="l">제조자·판매자 · Maker/Seller · <span lang="ja">製造・販売元</span></div><div class="v">주식회사 알앤디메이커스</div></div>
  <div class="qg"><div class="qr1"><div class="l">주소 · Address · <span lang="ja">住所</span></div><div class="v">${p.q.addr || NEED}</div></div>
  <div class="qr1"><div class="l">고객센터 · Contact · <span lang="ja">連絡先</span></div><div class="v">${p.q.tel || NEED}</div></div></div>
  <div class="qr1"><div class="l">취급상 주의 · Care · <span lang="ja">取扱上の注意</span></div>
  <ul class="care">${p.caution.map(c=>`<li>${c[0]}<br><em>${c[1]}</em><br><em lang="ja">${c[2]}</em></li>`).join('')}</ul></div>
  <div class="qrbox"><img class="qrimg" src="assets/qr-hangtag.svg" alt="QR"><div class="qrt"><b>오픈 알림<br>체험단 신청</b><br><em>rharashoe.netlify.app</em></div><div class="barcode"><span class="lines">바코드 자리</span></div></div>
  </div>`;
}

// ---------- 페이지 조립 ----------
function bottomOutside() {
  return `<div class="botp out">${logo('md')}<div class="bb"><b>RhaRa Shoe</b><span>라라슈</span><i>Made for Standing.</i></div></div>`;
}
function page(p, side) {
  const out = side === 'out';
  const mx = (x, w) => out ? x : W - x - w;     // 안쪽면은 좌우 반전 배치(양면 인쇄 시 뒷면 정렬)
  const panels = [0,1,2,3,4].map(i => {
    const x = mx(PX(i), 55);
    let inner = '', cls;
    if (out) {
      if (i === 4) { cls = 'blank'; inner = `<div class="glabel lines">⑤ 보강면 · 무인쇄 접착면<br>① 뒤로 접어 넣고 접착</div>`; }
      else { cls = i===0 ? 'cover' : 'quotep'; inner = i===0 ? cover(p) : quote(p, i-1); }
    } else {
      if (i === 0) { cls = 'blank'; inner = `<div class="glabel lines">① 안쪽 · 무인쇄 접착면<br>(⑤ 보강면이 붙는 자리)</div>`; }
      else { cls = i===4 ? 'qual' : 'innerp'; inner = [null, intro, feat, story, quality][i](p); }
    }
    return `<div class="panel ${cls}" style="left:${x}mm;top:0">${inner}</div>`;
  }).join('');
  const fx = mx(PX(2), 55);
  const bottom = out ? `<div class="panel botpanel" style="left:${fx}mm;top:110mm;width:55mm;height:${FL}mm">${bottomOutside()}</div>` : '';
  const tf = out ? '' : `transform="translate(${W},0) scale(-1,1)"`;
  // 무인쇄(흰) 영역: 접착 날개 양면, ⑤ 바깥면, ① 안쪽면 / 품질표시(⑤ 안쪽) 밝은 배경
  const white = (d) => `<g ${tf}><path d="${d}" fill="#fff"/></g>`;
  const blanks = `<g ${tf}><path d="${GLUEFLAP}" fill="#fff" stroke="#fff" stroke-width="${BLEED*2}" stroke-linejoin="miter"/></g>` + white(out ? 'M220,0 H275 V110 H220 Z' : 'M0,0 H55 V110 H0 Z');
  const lightRect = out ? '' : `<g ${tf}><rect x="220" y="${-BLEED}" width="55" height="${110+2*BLEED}" fill="#F3F2EC"/></g>`;
  const base = `<svg class="layer base" viewBox="0 0 ${W} ${H}" style="overflow:visible"><g ${tf}><path d="${outline}" fill="#111111" stroke="#111111" stroke-width="${BLEED*2}" stroke-linejoin="miter"/></g>${blanks}${lightRect}</svg>`;
  const lines = `<svg class="layer lines" viewBox="0 0 ${W} ${H}" style="overflow:visible">
  <g ${tf}>
   <path class="cut" d="${outline}" fill="none"/>
   <path class="fold" d="${folds}" fill="none"/>
   ${HOLES.map(h=>`<circle class="cut" cx="${h.cx}" cy="${h.cy}" r="${h.r}" fill="none"/>`).join('')}
  </g>
  <g class="guide" ${tf}>${[0,1,2,3,4].map(i=>`<rect x="${PX(i)+3}" y="3" width="49" height="104"/>`).join('')}${[0,1,2,3].map(i=>`<rect x="${PX(i)+5}" y="113" width="45" height="${FL-6}"/>`).join('')}</g>
  <g class="gluetxt">${[0,1,2,3].map(i=>{const cx = mx(PX(i),55)+27.5; return `<text x="${cx}" y="${110+FL-3}" text-anchor="middle">바닥 날개 ${'①②③④'[i]} (깊이 ${FL})</text>`;}).join('')}
   <text x="${out?280:5}" y="55" transform="rotate(${out?90:-90} ${out?280:5} 55)" text-anchor="middle">접착 날개 ${GL}mm · 무인쇄</text>
   ${[0,1,2,3,4].map(i=>`<text x="${mx(PX(i),55)+27.5}" y="${-1}" text-anchor="middle">${'①②③④⑤'[i]}</text>`).join('')}</g>
  </svg>`;
  const note = `<div class="note lines" style="${out?'':'left:1mm'}">${out?'바깥면 OUTSIDE':'안쪽면 INSIDE (좌우 반전 배치)'} · ${p.nameKR}<br>전개 ${W}×${H}mm · ①전면 ②측면 ③후면 ④측면(외부) + ⑤보강면(① 뒤 삽입·접착, 비노출) + 접착날개 ${GL}<br>바닥 날개 4장(깊이 ${FL}) 이중 바닥 · 재단여백 3 · 안전선 3<br>마젠타=칼선 0.25pt · 시안 점선=접는선 · 녹색=안전선<br>행거 구멍 Ø5 ×2(① · ⑤ 겹침) · 350g 이상 권장</div>`;
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
