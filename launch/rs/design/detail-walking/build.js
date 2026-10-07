// 쿼드그립 종일편한 워킹화 — 상세페이지 기획안 PPT
// 양식: 대표 제공 "라라슈 아치쿠션 깔창 와디즈 기획안" (CUT · 레퍼런스 | 구성레이아웃 | 기획안멘트)
// 실행: node build.js  →  rs-walking-detail-plan.pptx
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");

const DIR = __dirname;
const IMG = (f) => path.join(DIR, "img", f);
const REF = (f) => path.join(DIR, "ref", f);
const OUT = path.join(DIR, "rs-walking-detail-plan.pptx");

const THEME = {
  name: "RhaRa Shoe Detail",
  headFontFace: "Malgun Gothic",
  bodyFontFace: "Malgun Gothic",
  colors: {
    dk1: "232323", lt1: "FFFFFF", dk2: "0D0D0D", lt2: "F1F1F1",
    accent1: "C6F432", accent2: "3D4A12", accent3: "FF6B3D", accent4: "7E9C7E",
    accent5: "A8CF8A", accent6: "C2F0B8", hlink: "3D4A12", folHlink: "7E9C7E",
  },
};
// raw hex (for places that need hex) — kept equal to THEME
const H = { ink: "232323", black: "0D0D0D", lime: "C6F432", olive: "3D4A12", orange: "FF6B3D",
  sage: "7E9C7E", refHead: "A8CF8A", layHead: "C2F0B8", panel: "F1F1F1", cream: "F5F2EC",
  mute: "8A8A8A", line: "D9D6CF", white: "FFFFFF", dark: "1C1C1C", tan: "D8D2C6" };

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "쿼드그립 종일편한 워킹화 상세페이지 기획안";
pres.author = "RhaRa Shoe";

const PROJECT = "라라슈 쿼드그립 종일편한 워킹화 · 스마트스토어/자사몰";
const TOTAL = 28;
const TAGS = {
  후킹: { fill: H.orange, color: H.white },
  공감: { fill: H.orange, color: H.white },
  제품: { fill: H.ink, color: H.white },
  안전: { fill: H.lime, color: H.ink },
  편안: { fill: H.olive, color: H.white },
  신뢰: { fill: H.sage, color: H.white },
  구매: { fill: H.black, color: H.white },
};

// ---------- common helpers ----------
const T = (s, text, o) => s.addText(text, Object.assign({ isTextBox: true, margin: 0, fontFace: THEME.bodyFontFace, color: H.ink }, o));
const R = (s, o) => s.addShape(o.r ? pres.shapes.ROUNDED_RECTANGLE : pres.shapes.RECTANGLE,
  Object.assign({}, o, { line: { color: o.lineColor || (o.fill && o.fill.color) || H.white, width: o.lineColor ? 0.75 : 0 } }, o.r ? { rectRadius: o.r } : {}));

function header(s, tag, title) {
  const tg = TAGS[tag];
  R(s, { x: 0.56, y: 0.94, w: 0.62, h: 0.3, fill: { color: tg.fill }, r: 0.05 });
  T(s, tag, { x: 0.56, y: 0.94, w: 0.62, h: 0.3, fontSize: 10, bold: true, color: tg.color, align: "center", valign: "middle" });
  T(s, title, { x: 1.3, y: 0.9, w: 8.4, h: 0.38, fontSize: 16, bold: true, valign: "middle" });
  T(s, PROJECT, { x: 8.2, y: 0.94, w: 3.98, h: 0.3, fontSize: 9, color: H.mute, align: "right", valign: "middle" });
}

const COLS = [
  { x: 0.56, label: "레퍼런스", fill: H.refHead, color: H.white },
  { x: 4.47, label: "구성레이아웃", fill: H.layHead, color: H.ink },
  { x: 8.38, label: "기획안멘트", fill: H.black, color: H.white },
];
const CW = 3.8, HY = 1.4, HH = 0.47, PY = 1.87, PH = 5.1;

function columns(s) {
  COLS.forEach((c) => {
    R(s, { x: c.x, y: HY, w: CW, h: HH, fill: { color: c.fill } });
    T(s, c.label, { x: c.x, y: HY, w: CW, h: HH, fontSize: 18, color: c.color, align: "center", valign: "middle" });
    R(s, { x: c.x, y: PY, w: CW, h: PH, fill: { color: H.panel } });
  });
}

// reference column: cards (brand + block + what) and/or real images
function refCol(s, ref) {
  const X = 0.76, W = 3.4;
  if (ref.img) {
    const ih = ref.imgH || 2.6;
    s.addImage({ path: ref.img, x: X + (W - ref.imgW) / 2, y: 2.15, w: ref.imgW, h: ih, sizing: { type: "cover", w: ref.imgW, h: ih } });
  }
  let y = ref.img ? 2.15 + (ref.imgH || 2.6) + 0.18 : 2.15;
  const cards = ref.cards || [];
  const avail = 5.95 - y;
  const ch = Math.min(1.25, (avail - 0.12 * (cards.length - 1)) / Math.max(cards.length, 1));
  cards.forEach((c) => {
    R(s, { x: X, y, w: W, h: ch, fill: { color: H.white }, r: 0.06, lineColor: H.line });
    T(s, [
      { text: c.brand, options: { bold: true, fontSize: 11, color: H.ink } },
      { text: "  " + c.block, options: { fontSize: 9, color: H.mute, breakLine: true } },
      { text: c.what, options: { fontSize: 10, color: H.ink, breakLine: !!c.take } },
      ...(c.take ? [{ text: "→ " + c.take, options: { fontSize: 10, bold: true, color: H.olive } }] : []),
    ], { x: X + 0.15, y: y + 0.08, w: W - 0.3, h: ch - 0.16, valign: "middle", paraSpaceAfter: 2 });
    y += ch + 0.12;
  });
  T(s, "REF · " + ref.caption, { x: 0.66, y: 6.22, w: 3.6, h: 0.5, fontSize: 10, color: H.mute, align: "center", valign: "top" });
}

// layout column: wireframe frame + elements (coords relative to frame)
const FX = 4.97, FY = 2.15, FW = 2.8, FH = 3.85;
function layCol(s, lay) {
  const dark = !!lay.dark;
  R(s, { x: FX, y: FY, w: FW, h: FH, fill: { color: dark ? H.dark : H.cream }, lineColor: dark ? H.dark : H.line });
  const ink = dark ? H.white : H.ink;
  (lay.els || []).forEach((e) => {
    const x = FX + e.x, y = FY + e.y;
    if (e.t === "chip") {
      R(s, { x, y, w: e.w, h: e.h || 0.2, fill: { color: e.fill || H.lime }, r: 0.03 });
      T(s, e.text, { x, y, w: e.w, h: e.h || 0.2, fontSize: 8, bold: true, color: e.color || H.ink, align: "center", valign: "middle" });
    } else if (e.t === "txt") {
      T(s, e.text, { x, y, w: e.w, h: e.h, fontSize: e.size || 9, bold: !!e.bold, color: e.color || ink, align: e.align || "center", valign: e.valign || "middle" });
    } else if (e.t === "box") {
      R(s, { x, y, w: e.w, h: e.h, fill: { color: e.fill || H.tan }, r: e.r || 0.03, lineColor: e.lineColor });
      if (e.text) T(s, e.text, { x: x + 0.04, y, w: e.w - 0.08, h: e.h, fontSize: e.size || 8, bold: !!e.bold, color: e.color || H.ink, align: e.align || "center", valign: "middle" });
    } else if (e.t === "img") {
      s.addImage({ path: e.path, x, y, w: e.w, h: e.h, sizing: { type: e.fit || "cover", w: e.w, h: e.h } });
    } else if (e.t === "circ") {
      s.addShape(pres.shapes.OVAL, { x, y, w: e.d, h: e.d, fill: { color: e.fill || H.lime }, line: { color: e.lineColor || e.fill || H.lime, width: e.lineColor ? 1 : 0 } });
      if (e.text) T(s, e.text, { x, y, w: e.d, h: e.d, fontSize: e.size || 8, bold: true, color: e.color || H.ink, align: "center", valign: "middle" });
    } else if (e.t === "line") {
      s.addShape(pres.shapes.LINE, { x, y, w: e.w || 0, h: e.h || 0, line: { color: e.color || H.lime, width: e.width || 1.5, dashType: e.dash || "solid" } });
    }
  });
  T(s, lay.caption, { x: 4.57, y: 6.22, w: 3.6, h: 0.5, fontSize: 10, color: H.mute, align: "center", valign: "top" });
}

function copyCol(s, copy) {
  const runs = [];
  runs.push({ text: copy.head, options: { bold: true, fontSize: 16, breakLine: true } });
  if (copy.body) {
    runs.push({ text: " ", options: { fontSize: 8, breakLine: true } });
    copy.body.split("\n").forEach((l, i, a) => runs.push({ text: l, options: { fontSize: 14, breakLine: i < a.length - 1 } }));
  }
  T(s, runs, { x: 8.58, y: 2.2, w: 3.4, h: 3.6, align: "center", valign: "middle", lineSpacingMultiple: 1.25 });
  if (copy.flag) {
    R(s, { x: 8.68, y: 6.0, w: 3.2, h: 0.62, fill: { color: H.white }, r: 0.06, lineColor: H.orange });
    T(s, "⚠ " + copy.flag, { x: 8.8, y: 6.0, w: 2.96, h: 0.62, fontSize: 9, color: H.ink, valign: "middle" });
  }
}

function cut(c) {
  const s = pres.addSlide({ sectionTitle: c.section });
  s.background = { color: H.white };
  header(s, c.tag, `CUT ${String(c.n).padStart(2, "0")} / ${TOTAL}   ${c.title}`);
  columns(s);
  refCol(s, c.ref);
  layCol(s, c.lay);
  copyCol(s, c.copy);
  if (c.notes) s.addNotes(c.notes);
}

// ---------- front matter ----------
function cover() {
  pres.addSection({ title: "개요" });
  const s = pres.addSlide({ sectionTitle: "개요" });
  s.background = { color: H.black };
  s.addImage({ path: IMG("outsole-studio.jpg"), x: 5.6, y: 0, w: 7.73, h: 7.5, sizing: { type: "cover", w: 7.73, h: 7.5 } });
  R(s, { x: 0, y: 0, w: 6.2, h: 7.5, fill: { color: H.black } });
  R(s, { x: 0.8, y: 1.3, w: 1.9, h: 0.36, fill: { color: H.lime }, r: 0.05 });
  T(s, "DETAIL PAGE PLAN v1", { x: 0.8, y: 1.3, w: 1.9, h: 0.36, fontSize: 10, bold: true, align: "center", valign: "middle" });
  T(s, "쿼드그립 종일편한 워킹화\n상세페이지 기획안", { x: 0.8, y: 2.0, w: 5.2, h: 2.1, fontSize: 36, bold: true, color: H.white, valign: "top", lineSpacingMultiple: 1.1 });
  T(s, "서서 일하는 사람의 신발은, 바닥부터 달라야 한다.", { x: 0.8, y: 4.35, w: 5.2, h: 0.4, fontSize: 16, color: H.lime });
  T(s, [
    { text: "레퍼런스  제뉴인그립 3400 · 스티코 NEC-03 · 슈니엘 SL-100", options: { breakLine: true } },
    { text: "보조  Clove · 르무통 메이트 · HOKA Bondi SR", options: { breakLine: true } },
    { text: "28 CUT · 860px 세로형 · 2026-10-08 · 대표 검토용" },
  ], { x: 0.8, y: 5.4, w: 5.2, h: 1.0, fontSize: 11, color: "BFBFBF", paraSpaceAfter: 4 });
  s.addNotes("표지. 상세페이지 전체 = 28 CUT. 성적서가 필요한 CUT은 🔒 표시, 오픈 시점에 없으면 블록째 빼고 오픈 → 수령 즉시 삽입.");
}

function summary() {
  const s = pres.addSlide({ sectionTitle: "개요" });
  s.background = { color: H.white };
  T(s, "프로젝트 제목 (상품명 · 상세 타이틀 후보)", { x: 0.7, y: 0.6, w: 8, h: 0.45, fontSize: 20, bold: true });
  const names = [
    ["상품명 SEO", "라라슈 쿼드그립 종일편한 워킹화 국산 주방화 조리화 경량 그립패드 식당 급식실 작업화"],
    ["타이틀 A", "[국산] 바닥부터 다른 주방화 ㅣ 4점 쿼드그립 패드 · 깔창 없는 일체형"],
    ["타이틀 B", "하루 1만 보 서서 일한다면 ㅣ 가볍고 탄탄한 쿼드그립 워킹화"],
    ["타이틀 C", "폐타이어 고무를 그립 패드로 ㅣ 국내에서 만든 라라슈 워킹화"],
  ];
  names.forEach(([k, v], i) => {
    R(s, { x: 0.7, y: 1.2 + i * 0.5, w: 1.3, h: 0.38, fill: { color: i === 0 ? H.lime : H.panel }, r: 0.05 });
    T(s, k, { x: 0.7, y: 1.2 + i * 0.5, w: 1.3, h: 0.38, fontSize: 11, bold: true, align: "center", valign: "middle" });
    T(s, v, { x: 2.15, y: 1.2 + i * 0.5, w: 10.4, h: 0.38, fontSize: 13, valign: "middle" });
  });
  T(s, "⚠ '미끄럼방지·논슬립' 키워드는 C02 미끄럼 시험 성적서 수령 후 상품명·태그에 추가", { x: 0.7, y: 3.25, w: 11.8, h: 0.3, fontSize: 11, color: H.orange });

  T(s, "프로젝트 요약", { x: 0.7, y: 3.8, w: 8, h: 0.45, fontSize: 20, bold: true });
  const sums = [
    ["1) 한 줄", "국내에서 만든, 바닥부터 다른 워킹화. 미끄럼은 4점 쿼드그립 패드로, 하루 종일 서 있는 무게는 가벼움과 탄력으로 덜어냅니다."],
    ["2) 구조", "안전(쿼드그립) → 편안(가벼움 · 고탄력 E-실리폴리렌 · 일체형) → 국산 · 새활용 → 증거 → 구매. 축마다 문제 → 해결 → 증거 루프."],
    ["3) 차별", "경쟁사는 '안전 장비' 또는 '숫자 1등'. 라라슈는 서서 일하는 사람의 하루 전체(미끄럼 + 무게 + 탄력)와 국산 · 새활용 이야기로 42,500원을 설명합니다."],
  ];
  sums.forEach(([k, v], i) => {
    T(s, k, { x: 0.7, y: 4.4 + i * 0.85, w: 1.3, h: 0.7, fontSize: 13, bold: true, color: H.olive, valign: "top" });
    T(s, v, { x: 2.15, y: 4.4 + i * 0.85, w: 10.4, h: 0.7, fontSize: 14, valign: "top" });
  });
  s.addNotes("템플릿 2페이지 형식. 상품명 SEO는 네이버 50자 내외. 가격 42,500원 = 국산 · 새활용 소재 · 특허출원 구조가 근거(대표 결정 10/08).");
}

function refsOverview() {
  const s = pres.addSlide({ sectionTitle: "개요" });
  s.background = { color: H.white };
  T(s, "레퍼런스 3사 — 무엇을 가져오고 무엇을 버리나", { x: 0.7, y: 0.6, w: 11, h: 0.45, fontSize: 20, bold: true });
  const hdr = ["", "제뉴인그립 3400 (대표 제공)", "스티코 NEC-03 (대표 제공)", "슈니엘 SL-100 (대표 제공)"];
  const rows = [
    ["포지션", "미국 주방화 · '안전 장비' 톤 · 식자재몰 B2B", "패드 삽입 아웃솔 원조격 · 친환경 프로젝트", "스마트스토어 1위권 · 33,000원 · 리뷰 3.5천"],
    ["가져올 것", "일상 코디 라이프스타일컷 · 번호형 기능 01~06 · 각도기 수치 그래픽", "밑창 들어 보이는 모델컷 · 다크 3D 렌더 · Re:born 프로젝트 + 라벨 마크", "2축(안전→편안) 구조 · 증명 3단 · 기능 네이밍 · FAQ · 썸네일 10장 순서"],
    ["버릴 것", "깔창 분리형 강조 (우리는 일체형)", "다점 도트 구도 · '무공해' 문구 (C11 FTO 진행 중)", "모든 수치 · '세계 1위' · 낙상 공포 · 부상 사진 · 타사 비교 카드"],
    ["우리가 이길 곳", "스토리 0 · 소재 차별 없음", "일반 고무 패드 vs 폐타이어 재생 패드", "중국 생산 vs 국산 · 분리 인솔 vs 일체형"],
  ];
  const tbl = [hdr.map((h, i) => ({ text: h, options: { bold: true, color: i ? H.white : H.ink, fill: { color: i ? H.ink : H.white }, fontSize: 12 } }))];
  rows.forEach((r) => tbl.push(r.map((c, i) => ({ text: c, options: { fontSize: 11, bold: i === 0, color: i === 0 ? H.olive : H.ink, fill: { color: i === 0 ? H.panel : H.white } } }))));
  s.addTable(tbl, { x: 0.7, y: 1.3, w: 11.9, colW: [1.6, 3.43, 3.43, 3.44], rowH: [0.45, 0.85, 1.0, 0.95, 0.85], border: { type: "solid", color: H.line, pt: 0.75 }, valign: "middle", fontFace: THEME.bodyFontFace, margin: 0.08 });
  T(s, "보조 레퍼런스 (Claude 선정): Clove — 직업인 타깃·관리 편의 / 르무통 — 소재 네이밍·발볼 고민 호명 / HOKA Bondi SR — 바닥 조건 명시·스펙표", { x: 0.7, y: 6.0, w: 11.9, h: 0.4, fontSize: 11, color: H.mute });
  s.addNotes("상세 분석 원문: research/detail-page-references.md, research/competitor-shuniel-sl100.md, content/detail-walking-plan.md §0~0-3");
}

function positioning() {
  const s = pres.addSlide({ sectionTitle: "개요" });
  s.background = { color: H.black };
  T(s, "42,500원의 이유 — 3가지 기능 + 2가지 바탕", { x: 0.7, y: 0.6, w: 11, h: 0.5, fontSize: 22, bold: true, color: H.white });
  const p = [
    ["01", "미끄럼", "4점 쿼드그립 패드", "밑창 4곳에 별도 배합 그립 패드를 끼워 넣은 구조 (특허 출원)", "C02 KS M ISO 13287 성적서"],
    ["02", "가벼움", "한쪽 [000]g", "하루 1만 보면, 신발 무게도 1만 번 듭니다", "무게 실측 (230mm 한쪽)"],
    ["03", "탄력", "E-실리폴리렌", "눌렀다 돌아오는 고탄력 소재 · 안창까지 일체형", "C09 반발탄성 · 압축영구줄음률"],
  ];
  p.forEach(([n, k, name, d, need], i) => {
    const x = 0.7 + i * 4.05;
    R(s, { x, y: 1.5, w: 3.8, h: 3.3, fill: { color: H.dark }, r: 0.08 });
    s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: 1.8, w: 0.7, h: 0.7, fill: { color: H.lime }, line: { color: H.lime, width: 0 } });
    T(s, n, { x: x + 0.3, y: 1.8, w: 0.7, h: 0.7, fontSize: 16, bold: true, align: "center", valign: "middle" });
    T(s, k, { x: x + 1.15, y: 1.8, w: 2.4, h: 0.7, fontSize: 22, bold: true, color: H.white, valign: "middle" });
    T(s, name, { x: x + 0.3, y: 2.7, w: 3.2, h: 0.4, fontSize: 15, bold: true, color: H.lime });
    T(s, d, { x: x + 0.3, y: 3.15, w: 3.2, h: 0.85, fontSize: 13, color: "D9D9D9", valign: "top" });
    T(s, "증거: " + need, { x: x + 0.3, y: 4.15, w: 3.2, h: 0.45, fontSize: 11, color: H.mute, valign: "top" });
  });
  const b = [["국산", "국내에서 만듭니다 — 원산지 표시와 동일하게"], ["새활용", "From Road to Floor — 폐타이어 고무를 그립 패드로"]];
  b.forEach(([k, d], i) => {
    const x = 0.7 + i * 6.08;
    R(s, { x, y: 5.1, w: 5.85, h: 1.0, fill: { color: H.olive }, r: 0.08 });
    T(s, k, { x: x + 0.3, y: 5.1, w: 1.3, h: 1.0, fontSize: 20, bold: true, color: H.lime, valign: "middle" });
    T(s, d, { x: x + 1.6, y: 5.1, w: 4.1, h: 1.0, fontSize: 14, color: H.white, valign: "middle" });
  });
  T(s, "대표 의도 \"오래 신어도 발 아프지 않게\" → 상세에서는 효능 대신 사실(무게 g · 반발탄성 % · 구조)로 말합니다", { x: 0.7, y: 6.35, w: 11.9, h: 0.4, fontSize: 12, color: H.orange });
  s.addNotes("2026-10-08 대표: 국산이라 더 비싸게 판다 / 미끄럼 + 경량 + 고탄력으로 오래 서 있는 사람의 피로를 줄이려 했다. 표시광고법·카피 가드상 '피로 감소·발 안 아픔'은 효능 주장 → 무게·반발탄성 수치와 구조 설명으로 치환.");
}

function flowMap() {
  const s = pres.addSlide({ sectionTitle: "개요" });
  s.background = { color: H.white };
  T(s, "전체 흐름 — 28 CUT, 4막", { x: 0.7, y: 0.6, w: 11, h: 0.45, fontSize: 20, bold: true });
  const acts = [
    ["1막 · 후킹", H.orange, ["01 첫 화면", "02 신뢰 바", "03 공감 3장면", "04 세 가지 불만", "05 제품 등장", "06 창업 서사"]],
    ["2막 · 안전 축", H.lime, ["07 쿼드그립 4점", "08 왜 4점인가", "09 패드 소재", "10 성적서 🔒", "11 현장 테스트"]],
    ["3막 · 편안 축", H.olive, ["12 가벼움 🔒", "13 고탄력 🔒", "14 오래 신어도 🔒", "15 깔창 없는 일체형", "16 발목 테두리", "17 국산"]],
    ["4막 · 신뢰 · 구매", H.ink, ["18 From Road to Floor", "19 이런 분께", "20 일상 착화", "21 관리", "22 사이즈 · FAQ", "23 증거 모음 🔒", "24 컬러", "25 단체 구매", "26 런칭 혜택", "27 스펙 · 주의", "28 엔딩"]],
  ];
  acts.forEach(([name, col, items], i) => {
    const x = 0.7 + i * 3.0;
    R(s, { x, y: 1.3, w: 2.8, h: 0.5, fill: { color: col }, r: 0.06 });
    T(s, name, { x, y: 1.3, w: 2.8, h: 0.5, fontSize: 14, bold: true, color: col === H.lime ? H.ink : H.white, align: "center", valign: "middle" });
    items.forEach((it, j) => {
      R(s, { x, y: 1.95 + j * 0.42, w: 2.8, h: 0.34, fill: { color: H.panel }, r: 0.04 });
      T(s, it, { x: x + 0.15, y: 1.95 + j * 0.42, w: 2.5, h: 0.34, fontSize: 11, valign: "middle" });
    });
  });
  T(s, "리듬: 다크(문제) ↔ 라이트(해결) 교차 · 시그니처 = 라임 4점 (썸네일부터 엔딩까지 반복) · 🔒 = 성적서/실측 필요", { x: 0.7, y: 6.6, w: 11.9, h: 0.35, fontSize: 11, color: H.mute });
}

function toneGuide() {
  const s = pres.addSlide({ sectionTitle: "개요" });
  s.background = { color: H.white };
  T(s, "톤 & 비주얼 가이드", { x: 0.7, y: 0.6, w: 11, h: 0.45, fontSize: 20, bold: true });
  s.addImage({ path: IMG("outsole.jpg"), x: 0.7, y: 1.3, w: 5.6, h: 2.29 });
  s.addImage({ path: IMG("shoes.jpg"), x: 0.7, y: 3.75, w: 2.7, h: 2.8, sizing: { type: "cover", w: 2.7, h: 2.8 } });
  s.addImage({ path: REF("stico-render.jpg"), x: 3.6, y: 3.75, w: 2.7, h: 2.8, sizing: { type: "cover", w: 2.7, h: 2.8 } });
  T(s, "참고: 스티코 다크 렌더 (구도 복제 ✗)", { x: 3.6, y: 6.6, w: 2.7, h: 0.3, fontSize: 10, color: H.mute, align: "center" });
  const sw = [["차콜", "232323", H.white], ["블랙", "0D0D0D", H.white], ["라임", "C6F432", H.ink], ["올리브", "3D4A12", H.white], ["크림", "F5F2EC", H.ink]];
  sw.forEach(([k, c, tc], i) => {
    R(s, { x: 6.8 + i * 1.18, y: 1.3, w: 1.08, h: 1.2, fill: { color: c }, lineColor: H.line });
    T(s, k + "\n#" + c, { x: 6.8 + i * 1.18, y: 1.3, w: 1.08, h: 1.2, fontSize: 10, bold: true, color: tc, align: "center", valign: "middle" });
  });
  const rules = [
    "제품은 블랙, 포인트는 라임 패드 하나 — 슈니엘의 '레드 밑창' 자리를 라임 4점이 맡는다",
    "문제 CUT은 다크(1C1C1C), 해결 CUT은 크림/화이트 — 공포 대신 공감 톤 (부상 사진 ✗)",
    "기능 CUT은 'POINT 0N' 라임 칩 + 한 블록 한 기능 한 사진",
    "숫자는 크게(라임) — 단, 실측/성적서 숫자만. 자리 표시는 [시험값]",
    "모델: 조리복 · 앞치마 · 일상복(데님+흰 양말) 3종. 얼굴보다 발 · 밑창",
    "AI 생성 이미지는 배경·연출에만, 신발 실물은 실사 합성 원칙 유지",
  ];
  T(s, rules.map((r, i) => ({ text: r, options: { bullet: true, breakLine: i < rules.length - 1 } })), { x: 6.8, y: 2.8, w: 5.8, h: 3.8, fontSize: 13, paraSpaceAfter: 8, valign: "top" });
}

// ---------- CUTS ----------
const P = (t) => t; // readability
const CUTS = [
  { n: 1, section: "1막 후킹", tag: "후킹", title: "첫 화면 — 바닥이 주인공",
    ref: { img: REF("stico-render.jpg"), imgW: 3.4, imgH: 2.45, caption: "스티코 3D 렌더 / 슈니엘 썸네일 01",
      cards: [{ brand: "스티코", block: "다크 플로팅 렌더", what: "검정 배경에 밑창 패드가 보이게 띄움", take: "라임 4점이 보이는 각도, 구도는 다르게" }] },
    lay: { dark: true, caption: "첫 화면 860×1075 안에 카피 완결", els: [
      { t: "txt", x: 0.15, y: 0.2, w: 2.5, h: 0.5, text: "서서 일하는 사람의 신발은,\n바닥부터 달라야 한다.", size: 10, bold: true, color: H.white },
      { t: "txt", x: 0.15, y: 0.72, w: 2.5, h: 0.25, text: "발이 편해야, 일이 편하다.", size: 8, color: H.lime },
      { t: "img", x: 0.1, y: 1.15, w: 2.6, h: 1.55, path: IMG("outsole-studio.jpg") },
      { t: "box", x: 0.6, y: 2.95, w: 1.6, h: 0.3, fill: H.lime, text: "RS · 쿼드그립 종일편한 워킹화", size: 7, bold: true },
      { t: "txt", x: 0.1, y: 3.35, w: 2.6, h: 0.3, text: "모션: 신발이 천천히 회전 → 밑창 정면에서 정지", size: 7, color: H.mute },
    ] },
    copy: { head: "서서 일하는 사람의 신발은,\n바닥부터 달라야 한다.", body: "발이 편해야, 일이 편하다.\n\nRS 쿼드그립 종일편한 워킹화" },
    notes: "첫 3초에 '바닥이 다른 신발'임을 각인. 히어로 A안(다크 렌더). B안 = CUT 05 모델 밑창 들기 컷을 첫 화면으로 올리는 버전 → A/B 테스트.\n샷: 다크 플로팅 렌더(브랜드 필름 outsole-studio 소스 활용).\n스티코 렌더와 같은 각도·오렌지 톤 금지(C11 FTO 진행 중)." },

  { n: 2, section: "1막 후킹", tag: "신뢰", title: "신뢰 바 — 국산 · 오늘출발 · 새활용",
    ref: { caption: "슈니엘 #00 배송·공식판매처 배너",
      cards: [{ brand: "슈니엘", block: "#00 상단 배너 2장", what: "N배송 오늘도착 / 1등급·프리미엄 스토어·정품 인증마크", take: "첫 스크롤 전에 신뢰부터" },
              { brand: "우리", block: "대체 근거", what: "국산 · 오늘출발 조건 · 환경부 새활용 지원사업 수행 기업", take: "숫자 없이도 쓸 수 있는 사실만" }] },
    lay: { caption: "얇은 띠 2줄 · 아이콘 3개", els: [
      { t: "box", x: 0.1, y: 0.3, w: 2.6, h: 0.55, fill: H.ink, text: "MADE IN KOREA  ·  국내에서 만듭니다", color: H.white, size: 8, bold: true },
      { t: "circ", x: 0.25, y: 1.15, d: 0.6, fill: H.lime, text: "국산" },
      { t: "circ", x: 1.1, y: 1.15, d: 0.6, fill: H.lime, text: "오늘\n출발" },
      { t: "circ", x: 1.95, y: 1.15, d: 0.6, fill: H.lime, text: "새활용" },
      { t: "txt", x: 0.1, y: 1.85, w: 2.6, h: 0.5, text: "환경부 새활용 산업 육성 지원사업\n수행 기업이 만들었습니다", size: 8 },
      { t: "box", x: 0.1, y: 2.6, w: 2.6, h: 0.8, fill: H.white, lineColor: H.line, text: "(다음: CUT 03 공감)", color: H.mute },
    ] },
    copy: { head: "국내에서 만듭니다", body: "오늘 출발 [주문 마감 시각]\n환경부 새활용 산업 육성 지원사업\n수행 기업", flag: "'환경부 인증' 표기 금지 — 지원사업 ≠ 인증" },
    notes: "국산은 가격 차액(슈니엘 33,000원 중국 생산 대비 +9,500원)의 첫 근거. 원산지 표시와 반드시 일치.\n배송 조건은 물류 확정 후 기입." },

  { n: 3, section: "1막 후킹", tag: "공감", title: "공감 3장면 — 서서 보내는 하루",
    ref: { caption: "슈니엘 #02 문제제기 → 공포를 공감으로 치환",
      cards: [{ brand: "슈니엘", block: "#02~03 공포 소구", what: "미끄러지는 다리 · 부상 사진 · 낙상 통계", take: "버림. 같은 문제를 '장면'으로" },
              { brand: "아치쿠션 기획안", block: "CUT 05 공감 3장면", what: "3분할 사진 + 기존 방법 칩", take: "같은 형식 재사용" }] },
    lay: { dark: true, caption: "3분할 사진 · 얼굴은 프레임 밖 · 발 중심", els: [
      { t: "txt", x: 0.1, y: 0.15, w: 2.6, h: 0.5, text: "퇴근하면 신발부터\n벗고 싶다면", size: 10, bold: true, color: H.white },
      { t: "box", x: 0.1, y: 0.8, w: 0.83, h: 1.6, fill: "3A3A3A", text: "젖은\n주방 바닥", color: H.white },
      { t: "box", x: 0.98, y: 0.8, w: 0.83, h: 1.6, fill: "3A3A3A", text: "급식실\n물청소", color: H.white },
      { t: "box", x: 1.86, y: 0.8, w: 0.83, h: 1.6, fill: "3A3A3A", text: "매장\n카운터", color: H.white },
      { t: "chip", x: 0.1, y: 2.6, w: 0.8, text: "조심조심" }, { t: "chip", x: 0.98, y: 2.6, w: 0.8, text: "종종걸음" }, { t: "chip", x: 1.86, y: 2.6, w: 0.8, text: "앉을 틈 0" },
      { t: "txt", x: 0.1, y: 3.0, w: 2.6, h: 0.5, text: "서서 일하는 사람이면\n다 아는 그 순간", size: 8, color: H.mute },
    ] },
    copy: { head: "퇴근하면\n신발부터 벗고 싶다면", body: "젖은 바닥은 조심조심,\n바쁜 시간엔 종종걸음,\n앉을 틈은 없고.\n\n서서 일하는 사람이면\n다 아는 그 순간" },
    notes: "샷 #3장면: 주방 젖은 바닥 / 급식실 물청소 / 매장 카운터. 크림·저채도 아닌 다크 톤이지만 공포 이미지 금지.\n'발 아프다·통증' 금지 → 상황 묘사만 (사회적증거 전략 ②)." },

  { n: 4, section: "1막 후킹", tag: "공감", title: "주방화의 세 가지 불만",
    ref: { caption: "슈니엘 #18 CHECK LIST / 아치쿠션 CUT 03 문제 3단",
      cards: [{ brand: "슈니엘", block: "#18 기존 주방화가 발이 아픈 이유", what: "딱딱한 바닥 · 꺼지는 인솔 · 힘이 들어감 · 붓는 발", take: "체크리스트 형식만, 의학 표현 버림" }] },
    lay: { caption: "3단 카드 · 문제 → 다음 CUT에서 해답", els: [
      { t: "txt", x: 0.1, y: 0.2, w: 2.6, h: 0.35, text: "그동안 신던 주방화, 이랬다면", size: 9, bold: true },
      { t: "box", x: 0.2, y: 0.7, w: 2.4, h: 0.65, fill: H.dark, text: "01  젖은 바닥에서 자꾸 조심하게 된다", color: H.white, align: "left" },
      { t: "box", x: 0.2, y: 1.45, w: 2.4, h: 0.65, fill: H.dark, text: "02  오후가 되면 신발이 무겁게 느껴진다", color: H.white, align: "left" },
      { t: "box", x: 0.2, y: 2.2, w: 2.4, h: 0.65, fill: H.dark, text: "03  딱딱한 바닥이 그대로 올라온다", color: H.white, align: "left" },
      { t: "txt", x: 0.1, y: 3.05, w: 2.6, h: 0.4, text: "→ 미끄럼 · 무게 · 탄력", size: 9, bold: true, color: H.olive },
    ] },
    copy: { head: "그동안 신던 주방화,\n이랬다면", body: "01 젖은 바닥에서 자꾸 조심하게 된다\n02 오후가 되면 신발이 무겁게 느껴진다\n03 딱딱한 바닥이 그대로 올라온다" },
    notes: "대표 의도 3가지(미끄럼 · 경량 · 고탄력)를 '불만'으로 먼저 제시 → 2막·3막이 하나씩 답하는 구조.\n'통증 · 붓기 · 족저' 단어 금지." },

  { n: 5, section: "1막 후킹", tag: "제품", title: "제품 등장 — 그래서 바닥부터 다시",
    ref: { caption: "스티코 모델 밑창 들기 / 슈니엘 #05 GOOD POINT 3",
      cards: [{ brand: "스티코", block: "모델이 밑창을 카메라로", what: "조리복 모델이 신발 바닥을 들어 보임", take: "히어로 B안 · 썸네일 05" },
              { brand: "슈니엘", block: "#05 GOOD POINT 3", what: "모델 + 부위별 핀 포인트 3개", take: "미끄럼 · 가벼움 · 탄력 3핀" }] },
    lay: { caption: "모델 밑창 들기 + 3핀", els: [
      { t: "txt", x: 0.1, y: 0.15, w: 2.6, h: 0.45, text: "그래서\n바닥부터 다시 만들었습니다", size: 9, bold: true },
      { t: "box", x: 0.5, y: 0.7, w: 1.8, h: 2.1, fill: H.tan, text: "조리복 모델\n(얼굴 미소 · 밑창 정면)" },
      { t: "img", x: 0.85, y: 1.6, w: 1.1, h: 0.45, path: IMG("outsole.jpg") },
      { t: "circ", x: 0.1, y: 1.0, d: 0.45, text: "미끄럼" }, { t: "circ", x: 2.25, y: 1.3, d: 0.45, text: "가벼움" }, { t: "circ", x: 2.25, y: 2.1, d: 0.45, text: "탄력" },
      { t: "box", x: 0.4, y: 3.0, w: 2.0, h: 0.35, fill: H.ink, text: "RS 쿼드그립 종일편한 워킹화", color: H.white, size: 7 },
    ] },
    copy: { head: "그래서\n바닥부터 다시 만들었습니다", body: "미끄럼은 4점 쿼드그립 패드로\n무게는 가볍게\n바닥은 탄력 있게" },
    notes: "샷 #1 '모델이 밑창 들어 보이는 컷' — 썸네일 05와 공용. 대표 본인 출연도 OK(창업 서사와 연결)." },

  { n: 6, section: "1막 후킹", tag: "신뢰", title: "창업 서사 — 친구 셋의 발",
    ref: { caption: "르무통 브랜드 철학 / 사회적 증거 ⑤ 서사",
      cards: [{ brand: "르무통", block: "브랜드 철학 한 줄", what: "'편하지 않으면 출시하지 않는다'", take: "우리는 '발이 편해야, 일이 편하다.'" },
              { brand: "3사 공통", block: "약점", what: "왜·누가 만들었는지 없음", take: "서사가 곧 차별화" }] },
    lay: { caption: "대표 실사진 + 손글씨 톤 인용", els: [
      { t: "box", x: 0.2, y: 0.25, w: 2.4, h: 1.6, fill: H.tan, text: "대표 실사진\n(친구 가게 주방 · 작업장)" },
      { t: "txt", x: 0.1, y: 2.0, w: 2.6, h: 0.55, text: "\"식당 하는 친구 셋이\n퇴근하면 신발부터 벗더라고요\"", size: 9, bold: true },
      { t: "txt", x: 0.1, y: 2.65, w: 2.6, h: 0.5, text: "— 라라슈 대표 신동규", size: 8, color: H.mute },
      { t: "txt", x: 0.1, y: 3.15, w: 2.6, h: 0.35, text: "발이 편해야, 일이 편하다.", size: 9, bold: true, color: H.olive },
    ] },
    copy: { head: "식당 하는 친구 셋의 발에서\n시작했습니다", body: "매일 서서 일하는 친구들이\n퇴근하면 신발부터 벗었습니다.\n\n발이 편해야, 일이 편하다." },
    notes: "사회적 증거 치환 ⑤ — 신제품이 지금 당장 쓸 수 있는 가장 강한 증거. 대표 실화(스레드 팩 §2) 기준으로 문장 다듬기. 대표 사진 필요." },

  { n: 7, section: "2막 안전", tag: "안전", title: "POINT 01 · 쿼드그립 4점 패드",
    ref: { caption: "제뉴인그립 #4 아웃솔 / 슈니엘 #15 ZERO GRIP 네이밍",
      cards: [{ brand: "제뉴인그립", block: "01 미끄럼방지 아웃솔", what: "밑창 클로즈업 1장", take: "한 블록 한 기능 한 사진" },
              { brand: "슈니엘·스티코", block: "기능 네이밍", what: "ZERO GRIP · 자연통기 시스템", take: "QUAD GRIP 시스템으로 이름 붙이기" }] },
    lay: { caption: "밑창 탑뷰 · 4점 라임 하이라이트 순차 점등 GIF", els: [
      { t: "chip", x: 1.0, y: 0.15, w: 0.8, text: "POINT 01" },
      { t: "txt", x: 0.1, y: 0.45, w: 2.6, h: 0.35, text: "QUAD GRIP · 4점 쿼드그립 패드", size: 9, bold: true },
      { t: "img", x: 0.1, y: 0.95, w: 2.6, h: 1.06, path: IMG("outsole.jpg") },
      { t: "txt", x: 0.1, y: 2.15, w: 2.6, h: 0.5, text: "밑창 4곳에 그립 패드를\n끼워 넣었습니다", size: 9 },
      { t: "box", x: 0.3, y: 2.8, w: 2.2, h: 0.5, fill: H.white, lineColor: H.line, text: "패드 확대 원형 크롭 ×4", size: 8 },
    ] },
    copy: { head: "QUAD GRIP\n4점 쿼드그립 패드", body: "밑창 4곳에\n그립 패드를 끼워 넣었습니다.\n\n라임색 4점이 바닥을 딛습니다." },
    notes: "샷 #2 밑창 탑뷰(기존 리터칭본 outsole.jpg 사용 가능).\n'미끄럽지 않은 · 논슬립' 금지 — 구조 사실만. 성능은 CUT 10 성적서가 말한다." },

  { n: 8, section: "2막 안전", tag: "안전", title: "왜 4점인가 — 딛는 순서대로",
    ref: { caption: "스티코 다점 도트 (차별) / 제뉴인그립 각도기 그래픽",
      cards: [{ brand: "스티코", block: "오렌지 원형 도트 다수", what: "밑창 전체에 패드 여러 개", take: "우리는 4점 — 구조 차이를 정면으로" },
              { brand: "제뉴인그립", block: "04 앞코 각도 ○○°", what: "각도기로 수치를 그림으로", take: "발바닥 위 4점 + 보행 화살표" }] },
    lay: { caption: "발 윤곽 일러스트 · 화살표 애니메이션", els: [
      { t: "chip", x: 1.0, y: 0.15, w: 0.8, text: "POINT 01-2" },
      { t: "txt", x: 0.1, y: 0.45, w: 2.6, h: 0.35, text: "발이 바닥에 닿는 순서대로", size: 9, bold: true },
      { t: "box", x: 0.95, y: 0.9, w: 0.9, h: 2.3, fill: H.white, lineColor: H.line, r: 0.4, text: "" },
      { t: "circ", x: 1.18, y: 2.8, d: 0.3, text: "1" }, { t: "circ", x: 1.05, y: 2.15, d: 0.3, text: "2" },
      { t: "circ", x: 1.35, y: 1.55, d: 0.3, text: "3" }, { t: "circ", x: 1.2, y: 1.0, d: 0.3, text: "4" },
      { t: "line", x: 2.05, y: 3.05, h: -2.0, color: H.olive },
      { t: "txt", x: 1.95, y: 1.9, w: 0.8, h: 0.4, text: "뒤꿈치\n→ 앞꿈치", size: 7 },
      { t: "txt", x: 0.1, y: 3.3, w: 2.6, h: 0.3, text: "특허 출원 제10-[번호] (C07)", size: 7, color: H.mute },
    ] },
    copy: { head: "왜 4점일까요?", body: "발이 바닥에 닿는 순서\n뒤꿈치 → 발 중간 → 발볼 → 앞꿈치\n그 길을 따라 4곳을 골랐습니다.\n\n패드를 밑창에 끼워 넣는 구조로\n특허를 출원했습니다.", flag: "C11 변리사 FTO 의견 후 문구 확정 · '입증' 표현 ✗" },
    notes: "근거: research/quadgrip-placement-evidence.md — 직접 입증 논문 없음, '설계 가설' 수준. '과학적으로 입증' 금지.\n특허 표기는 출원번호 수령 후(C07). 스티코 특허 청구항과 겹치는 표현 피할 것(C11, 10/31)." },

  { n: 9, section: "2막 안전", tag: "안전", title: "패드 소재 — 패턴이 아니라, 따로 만든 패드",
    ref: { caption: "슈니엘 #09 '패턴이 아니라 소재'",
      cards: [{ brand: "슈니엘", block: "#09 핵심 USP", what: "'패턴만 특별하다고 미끄럼 방지가 될까요? 차이는 소재'", take: "우리는 소재 + 구조 둘 다" }] },
    lay: { caption: "단면 분해도: 본체 / 패드 / 끼움 구조", els: [
      { t: "chip", x: 1.0, y: 0.15, w: 0.8, text: "POINT 01-3" },
      { t: "txt", x: 0.1, y: 0.45, w: 2.6, h: 0.45, text: "밑창과 패드는\n다른 재료로 만듭니다", size: 9, bold: true },
      { t: "box", x: 0.3, y: 1.05, w: 2.2, h: 0.5, fill: "3A3A3A", text: "본체 · E-실리폴리렌", color: H.white },
      { t: "circ", x: 0.55, y: 1.7, d: 0.55, text: "패드" }, { t: "circ", x: 1.65, y: 1.7, d: 0.55, text: "패드" },
      { t: "txt", x: 0.1, y: 2.35, w: 2.6, h: 0.5, text: "폐타이어 재생고무\n+ 실크벽지 재생 PVC 배합", size: 8 },
      { t: "box", x: 0.3, y: 2.95, w: 2.2, h: 0.4, fill: H.lime, text: "패턴 + 별도 배합 패드 = 2중", size: 8, bold: true },
    ] },
    copy: { head: "무늬만 바꾼 게 아닙니다", body: "밑창은 헤링본 패턴,\n바닥에 닿는 4곳은\n따로 배합한 그립 패드.\n\n두 가지 재료가\n한 바닥을 만듭니다." },
    notes: "슈니엘이 '패턴 어필'을 무력화하는 논리를 쓰므로, 우리는 '패턴 + 별도 배합 패드'로 그 논리 밖에 선다.\n재질 표기는 행택 확정값과 일치(K07): 패드 = 폐타이어 재생고무 + 실크벽지 재생 PVC." },

  { n: 10, section: "2막 안전", tag: "신뢰", title: "증명 1단 — 미끄럼 저항 시험 🔒",
    ref: { caption: "슈니엘 #09 성적서 · #12 막대그래프",
      cards: [{ brand: "슈니엘", block: "#09·#12 공인 성적서", what: "KATRI · KS M ISO 13287 · 세제수용액/글리세린 두 조건", take: "같은 규격 · 같은 두 조건으로 의뢰" },
              { brand: "HOKA SR", block: "바닥 조건 명시", what: "물 · 기름 · 세제 바닥에서 테스트", take: "조건을 먼저 보여준다" }] },
    lay: { caption: "성적서 스캔 + 막대그래프 GIF · 수치는 수령 후", els: [
      { t: "txt", x: 0.1, y: 0.15, w: 2.6, h: 0.45, text: "말로만 하지 않고\n재봤습니다", size: 9, bold: true },
      { t: "box", x: 0.15, y: 0.75, w: 1.1, h: 1.45, fill: H.white, lineColor: H.line, text: "시험성적서\n스캔", color: H.mute },
      { t: "box", x: 1.45, y: 1.6, w: 0.35, h: 0.6, fill: H.tan, text: "" },
      { t: "box", x: 1.95, y: 0.95, w: 0.35, h: 1.25, fill: H.lime, text: "" },
      { t: "txt", x: 1.3, y: 2.25, w: 1.2, h: 0.3, text: "세제  ·  글리세린", size: 7 },
      { t: "box", x: 0.15, y: 2.7, w: 2.5, h: 0.6, fill: H.ink, text: "KS M ISO 13287 · [시험기관]\n[시험값] (세제) / [시험값] (글리세린)", color: H.white, size: 7 },
    ] },
    copy: { head: "말로만 하지 않고\n재봤습니다", body: "KS M ISO 13287 미끄럼 저항 시험\n세제 바닥 [시험값]\n기름(글리세린) 바닥 [시험값]\n\n[시험기관] · [성적서 번호]", flag: "🔒 C02 — 차주 의뢰(대표 10/08). 없으면 이 CUT 빼고 오픈" },
    notes: "C02 의뢰 시 반드시: KS M ISO 13287, 세제수용액 + 글리세린 두 조건, 쿼드그립 A(패드 있음)/B(없음) 비교.\n경쟁사 수치(0.82 등) 언급·비교 금지. '1등급' 등급 표현은 성적서에 등급이 명시될 때만." },

  { n: 11, section: "2막 안전", tag: "안전", title: "증명 2단 — 현장 그대로",
    ref: { caption: "슈니엘 #10~11·#21 / 스티코 거품 바닥",
      cards: [{ brand: "슈니엘", block: "#10~11 극한 테스트", what: "기름 경사로 · 워터슬라이드 역행", take: "버림 — 과장 연출" },
              { brand: "스티코", block: "거품 바닥 · 마대걸레", what: "실제 물청소 중 착화", take: "실제 업무 장면만 가져옴" }] },
    lay: { dark: true, caption: "급식실 물청소 GIF 3초 · 발 클로즈업", els: [
      { t: "txt", x: 0.1, y: 0.15, w: 2.6, h: 0.45, text: "물청소하는 급식실,\n그 바닥 그대로", size: 9, bold: true, color: H.white },
      { t: "box", x: 0.15, y: 0.75, w: 2.5, h: 1.7, fill: "3A3A3A", text: "GIF · 마대걸레 거품 바닥\n위를 걷는 발 (측면 로우앵글)", color: H.white },
      { t: "box", x: 0.15, y: 2.6, w: 1.2, h: 0.75, fill: "3A3A3A", text: "주방 타일", color: H.white },
      { t: "box", x: 1.45, y: 2.6, w: 1.2, h: 0.75, fill: "3A3A3A", text: "매장 바닥", color: H.white },
    ] },
    copy: { head: "물청소하는 급식실,\n그 바닥 그대로", body: "연출 무대가 아니라\n실제로 일하는 바닥에서\n찍었습니다." },
    notes: "증명 3단 중 '현실' 단계. 미끄러질 뻔한 연출 · 안 미끄러진다는 연출 모두 금지(오인 광고). 업무 장면만.\n샷: 급식실 물청소, 주방 타일, 매장 바닥 — 실제 현장 섭외(친구 가게)." },

  { n: 12, section: "3막 편안", tag: "편안", title: "POINT 02 · 가벼움 🔒",
    ref: { caption: "HOKA Bondi SR 스펙표 / 슈니엘 220g",
      cards: [{ brand: "HOKA", block: "스펙 표", what: "무게 · 드롭 · 미드솔 숫자", take: "무게를 큰 숫자 하나로" },
              { brand: "슈니엘", block: "스펙", what: "230mm 한쪽 220g", take: "우리 실측이 기준선 (비교 표기 ✗)" }] },
    lay: { caption: "큰 숫자 + 저울 위 한 짝 사진", els: [
      { t: "chip", x: 1.0, y: 0.15, w: 0.8, text: "POINT 02", fill: H.olive, color: H.white },
      { t: "txt", x: 0.1, y: 0.45, w: 2.6, h: 0.3, text: "한쪽 무게", size: 9, bold: true },
      { t: "txt", x: 0.1, y: 0.8, w: 2.6, h: 0.75, text: "[000] g", size: 26, bold: true, color: H.olive },
      { t: "box", x: 0.6, y: 1.65, w: 1.6, h: 1.05, fill: H.tan, text: "저울 위 신발 한 짝\n(230mm)" },
      { t: "txt", x: 0.1, y: 2.85, w: 2.6, h: 0.55, text: "하루 1만 보면,\n신발 무게도 1만 번 듭니다", size: 9, bold: true },
    ] },
    copy: { head: "한쪽 [000]g", body: "하루 1만 보를 걸으면\n신발 무게도 1만 번 들어 올립니다.\n\n그래서 가볍게 만들었습니다." },
    flag: null,
    notes: "대표 의도: 경량성으로 오래 서 있는 사람의 부담을 덜어준다. '피로 감소'는 효능 주장 → 무게 실측(g)과 '1만 번 든다'는 산수 사실로 치환.\n🔒 무게 실측 필요(230mm 한쪽, 사이즈별 표는 CUT 27). 경쟁사 무게 비교 표기 금지." },

  { n: 13, section: "3막 편안", tag: "편안", title: "POINT 03 · 고탄력 E-실리폴리렌 🔒",
    ref: { caption: "르무통 H1-TEX 소재 네이밍 / 슈니엘 #20 누르기 GIF",
      cards: [{ brand: "르무통", block: "특허 원단 H1-TEX", what: "소재에 이름을 붙여 브랜드 자산화", take: "E-실리폴리렌™" },
              { brand: "슈니엘", block: "#20 소재 설명 GIF", what: "갑피 누르기 · 인솔 구부리기", take: "엄지로 눌렀다 돌아오는 GIF" }] },
    lay: { caption: "엄지 누르기 GIF + 반발탄성 그래프", els: [
      { t: "chip", x: 1.0, y: 0.15, w: 0.8, text: "POINT 03", fill: H.olive, color: H.white },
      { t: "txt", x: 0.1, y: 0.45, w: 2.6, h: 0.3, text: "E-실리폴리렌™", size: 10, bold: true },
      { t: "box", x: 0.15, y: 0.9, w: 1.25, h: 1.3, fill: H.tan, text: "GIF\n엄지로 꾹 →\n다시 돌아옴" },
      { t: "box", x: 1.6, y: 1.5, w: 0.4, h: 0.7, fill: H.tan, text: "" },
      { t: "box", x: 2.15, y: 1.0, w: 0.4, h: 1.2, fill: H.lime, text: "" },
      { t: "txt", x: 1.5, y: 2.25, w: 1.2, h: 0.3, text: "일반 EVA · 우리", size: 7 },
      { t: "box", x: 0.15, y: 2.7, w: 2.5, h: 0.6, fill: H.ink, text: "반발탄성 [시험값]% (KS 규격)\nEVA · 실리콘 직접 배합", color: H.white, size: 7 },
    ] },
    copy: { head: "눌렀다,\n다시 돌아옵니다", body: "EVA에 실리콘을 직접 배합한\nE-실리폴리렌™\n\n반발탄성 [시험값]%\n(일반 EVA [시험값]%)", flag: "🔒 C09 반발탄성 시험 후 수치 · 전엔 소재 설명만" },
    notes: "대표 의도: 고탄력 원료로 오래 신어도 발이 편하게. '발 아프지 않게 · 충격 흡수 · 쿠션감 ○배'는 근거 전 금지 → 반발탄성 % 와 눌렀다 돌아오는 GIF로 '보여주기'.\nC09 마감 10/10. 일반 EVA 대조 시료 같이 시험." },

  { n: 14, section: "3막 편안", tag: "편안", title: "오래 신어도 꺼지지 않게 🔒",
    ref: { caption: "스티코 ANTI-SHRINK / 슈니엘 #17 '마모돼도 성능 유지'",
      cards: [{ brand: "스티코", block: "ANTI-SHRINK 수축방지", what: "소재 성질에 영문 이름", take: "KEEP SHAPE 같은 이름 후보" },
              { brand: "슈니엘", block: "#17 내구", what: "'80% 마모돼도 성능 그대로'", take: "수치 클레임은 버림, 형식만" }] },
    lay: { caption: "새 신발 vs [N]개월 착용 신발 단면 비교", els: [
      { t: "txt", x: 0.1, y: 0.2, w: 2.6, h: 0.45, text: "몇 달을 신어도\n처음 그 높이", size: 9, bold: true },
      { t: "box", x: 0.2, y: 0.85, w: 1.1, h: 1.4, fill: H.tan, text: "새 신발\n단면" },
      { t: "box", x: 1.5, y: 0.85, w: 1.1, h: 1.4, fill: H.tan, text: "[N]개월\n착용 단면" },
      { t: "box", x: 0.2, y: 2.45, w: 2.4, h: 0.5, fill: H.lime, text: "압축영구줄음률 [시험값]%", size: 8, bold: true },
      { t: "txt", x: 0.1, y: 3.05, w: 2.6, h: 0.35, text: "깔창 없음 = 꺼질 깔창도 없음", size: 8, color: H.olive, bold: true },
    ] },
    copy: { head: "몇 달을 신어도\n처음 그 높이", body: "눌린 채 굳지 않는 소재,\n압축영구줄음률 [시험값]%\n\n꺼질 깔창도 없습니다." },
    notes: "C09의 '유지' 측정값(압축영구줄음률). 장기 착용 단면 사진은 체험단 실착 샘플로 런칭 후 교체 가능.\n🔒 수치 없으면 '꺼질 깔창도 없습니다' 구조 문장만 사용." },

  { n: 15, section: "3막 편안", tag: "편안", title: "POINT 04 · 깔창 없는 일체형",
    ref: { caption: "제뉴인그립 #9 EVA 인솔 / 슈니엘 리뷰 '깔창이 푹신해요'",
      cards: [{ brand: "제뉴인그립·슈니엘", block: "분리형 인솔 강조", what: "인솔을 빼서 보여주고 따로 판매", take: "역이용: 빠지고 밀리는 깔창이 없다" },
              { brand: "VOC", block: "현장 목소리", what: "'깔창이 자꾸 딸려 나와요'", take: "문제로 제시 (인용은 프리미엄 톤으로)" }] },
    lay: { caption: "단면 일러스트: 안창까지 한 몸", els: [
      { t: "chip", x: 1.0, y: 0.15, w: 0.8, text: "POINT 04", fill: H.olive, color: H.white },
      { t: "txt", x: 0.1, y: 0.45, w: 2.6, h: 0.35, text: "안창까지 한 몸", size: 9, bold: true },
      { t: "img", x: 0.4, y: 0.9, w: 2.0, h: 1.6, path: IMG("shoes.jpg"), fit: "cover" },
      { t: "box", x: 0.15, y: 2.65, w: 1.2, h: 0.65, fill: H.white, lineColor: H.line, text: "✗ 딸려 나오는\n깔창", size: 7 },
      { t: "box", x: 1.45, y: 2.65, w: 1.2, h: 0.65, fill: H.lime, text: "✓ 일체형 안창", size: 8, bold: true },
    ] },
    copy: { head: "깔창이 없습니다", body: "E-실리폴리렌으로 안창까지 한 몸.\n벗을 때 딸려 나오지도,\n걷다가 앞으로 밀리지도 않습니다." },
    notes: "'깔창 없음'이 '쿠션 없음'으로 읽히지 않게 CUT 13(탄력) 바로 뒤에 배치. 물세척 후 깔창 말릴 필요 없음도 CUT 21과 연결." },

  { n: 16, section: "3막 편안", tag: "편안", title: "POINT 05 · 도톰한 발목 테두리",
    ref: { caption: "제뉴인그립 #5~6 측면 디테일",
      cards: [{ brand: "제뉴인그립", block: "02~03 측면·앞코", what: "부위 하나를 클로즈업 한 장", take: "발목 테두리 클로즈업" }] },
    lay: { caption: "측면 클로즈업 · 손가락으로 테두리 집기", els: [
      { t: "chip", x: 1.0, y: 0.15, w: 0.8, text: "POINT 05", fill: H.olive, color: H.white },
      { t: "txt", x: 0.1, y: 0.45, w: 2.6, h: 0.35, text: "발이 들어가는 입구", size: 9, bold: true },
      { t: "img", x: 0.3, y: 0.95, w: 2.2, h: 1.7, path: IMG("shoes2-cut.png"), fit: "contain" },
      { t: "circ", x: 1.9, y: 1.0, d: 0.5, fill: H.white, lineColor: H.olive, text: "두께\n[mm]", size: 7 },
      { t: "txt", x: 0.1, y: 2.85, w: 2.6, h: 0.5, text: "다른 부분보다 두껍게\n둘렀습니다", size: 9 },
    ] },
    copy: { head: "입구는 더 도톰하게", body: "발이 들어가는 테두리를\n다른 부분보다 두껍게 둘렀습니다." },
    notes: "구조 사실만. 두께 mm 실측 있으면 원형 라벨에 기입." },

  { n: 17, section: "3막 편안", tag: "신뢰", title: "국산 — 국내에서 만듭니다",
    ref: { caption: "슈니엘 원산지 중국 (비교 표기 ✗) / 다이소 납품 제조사",
      cards: [{ brand: "슈니엘", block: "스펙표 원산지", what: "워크워크코리아 · 원산지 중국", take: "우리는 국산을 한 CUT으로 크게" },
              { brand: "우리", block: "제조 이력", what: "대형 생활용품 매장 욕실화 납품 제조사", take: "회사 근거로만 (라라슈 실적 ✗)" }] },
    lay: { caption: "공장 다큐 3컷 + MADE IN KOREA 스탬프", els: [
      { t: "box", x: 0.15, y: 0.2, w: 2.5, h: 0.55, fill: H.ink, text: "MADE IN KOREA", color: H.lime, size: 11, bold: true },
      { t: "box", x: 0.15, y: 0.9, w: 0.8, h: 1.2, fill: H.tan, text: "사출" },
      { t: "box", x: 1.0, y: 0.9, w: 0.8, h: 1.2, fill: H.tan, text: "패드\n끼움" },
      { t: "box", x: 1.85, y: 0.9, w: 0.8, h: 1.2, fill: H.tan, text: "검수" },
      { t: "txt", x: 0.1, y: 2.25, w: 2.6, h: 0.6, text: "다이소 · 오피스디포 등에\n납품해 온 제조사가 만듭니다", size: 8 },
      { t: "txt", x: 0.1, y: 2.95, w: 2.6, h: 0.4, text: "주식회사 알앤디메이커스", size: 8, color: H.mute },
    ] },
    copy: { head: "국내에서 만듭니다", body: "사출부터 패드 끼움, 검수까지\n국내 공장에서.\n\n대형 매장에 신발을 납품해 온\n제조사가 만듭니다." },
    notes: "대표 결정(10/08): 국산이라 더 비싸게 판다 → 가격 정당화 핵심 CUT. 원산지 표시(스펙표·행택)와 완전 일치 필수.\n납품처 실명 사용은 대표 승인(10/06) — 단 '라라슈 제품 실적'처럼 쓰지 않음. 타사 원산지 비교 문구 금지." },

  { n: 18, section: "4막 신뢰·구매", tag: "신뢰", title: "From Road to Floor — 새활용",
    ref: { img: REF("stico-reborn.jpg"), imgW: 1.55, imgH: 2.5, caption: "스티코 Re:born Eco Project",
      cards: [{ brand: "스티코", block: "Re:born Eco", what: "프로젝트명 + 라벨 마크", take: "행택 새활용 마크로" }] },
    lay: { caption: "타이어 → 칩 → 패드 3단 + 행택 마크 확대", els: [
      { t: "txt", x: 0.1, y: 0.15, w: 2.6, h: 0.35, text: "From Road to Floor.", size: 11, bold: true },
      { t: "txt", x: 0.1, y: 0.5, w: 2.6, h: 0.3, text: "도로를 달리던 고무, 주방 바닥으로", size: 8 },
      { t: "circ", x: 0.2, y: 1.0, d: 0.65, fill: H.tan, text: "폐타이어" },
      { t: "circ", x: 1.08, y: 1.0, d: 0.65, fill: H.tan, text: "고무 칩" },
      { t: "circ", x: 1.95, y: 1.0, d: 0.65, text: "그립\n패드" },
      { t: "box", x: 0.2, y: 1.95, w: 2.4, h: 0.8, fill: H.white, lineColor: H.line, text: "행택 새활용 마크 확대\n\"이 마크를 확인하세요\"", size: 8 },
      { t: "txt", x: 0.1, y: 2.9, w: 2.6, h: 0.45, text: "환경부 새활용 산업 육성\n지원사업 수행 기업", size: 8, color: H.mute },
    ] },
    copy: { head: "From Road to Floor.", body: "그립 패드 4개,\n한때 도로를 달리던 고무입니다.\n\n환경부 새활용 산업 육성\n지원사업 수행 기업이 만들었습니다.", flag: "'타이어로 만든 신발' ✗ · '무공해·인증' ✗" },
    notes: "From Road to Floor 는 소재 맥락에서만(히어로와 한 화면 금지).\n새활용 마크는 자체 표식임을 명확히(인증 마크처럼 보이면 안 됨). 행택 K07 마감 10/12에 맞춰 마크 시안 필요." },

  { n: 19, section: "4막 신뢰·구매", tag: "공감", title: "이런 분께 — 하나라도 해당되면",
    ref: { caption: "아치쿠션 기획안 CUT 12 / 슈니엘 축사 리뷰 (확장 타깃)",
      cards: [{ brand: "아치쿠션 기획안", block: "체크리스트", what: "하나라도 해당되면 라라슈 차례", take: "같은 형식" },
              { brand: "슈니엘 리뷰", block: "확장 타깃", what: "축사 작업자 장화 대체", take: "런칭 후 2차 타깃 후보" }] },
    lay: { caption: "체크 4줄 · 직업 아이콘", els: [
      { t: "txt", x: 0.1, y: 0.2, w: 2.6, h: 0.45, text: "하나라도 해당되면\n라라슈 차례입니다", size: 9, bold: true },
      { t: "box", x: 0.2, y: 0.85, w: 2.4, h: 0.5, fill: H.white, lineColor: H.line, text: "✓ 하루 7시간 이상 서서 일한다", align: "left" },
      { t: "box", x: 0.2, y: 1.45, w: 2.4, h: 0.5, fill: H.white, lineColor: H.line, text: "✓ 바닥이 자주 젖는 곳에서 일한다", align: "left" },
      { t: "box", x: 0.2, y: 2.05, w: 2.4, h: 0.5, fill: H.white, lineColor: H.line, text: "✓ 깔창이 자꾸 딸려 나왔다", align: "left" },
      { t: "box", x: 0.2, y: 2.65, w: 2.4, h: 0.5, fill: H.white, lineColor: H.line, text: "✓ 퇴근길에도 신고 싶은 작업화", align: "left" },
    ] },
    copy: { head: "하나라도 해당되면\n라라슈 차례입니다", body: "✓ 하루 7시간 이상 서서 일한다\n✓ 바닥이 자주 젖는 곳에서 일한다\n✓ 깔창이 자꾸 딸려 나왔다\n✓ 퇴근길에도 신고 싶은 작업화" },
    notes: "타깃: 급식 조리사 / 식당 사장님·셰프 / 매장 직원 / 병원·미화. 질병명(족저근막염 등) 체크 항목 금지." },

  { n: 20, section: "4막 신뢰·구매", tag: "제품", title: "일상 착화 — 주방에서도, 퇴근길에도",
    ref: { caption: "제뉴인그립 #2 라이프스타일 4컷 / 슈니엘 썸네일 07",
      cards: [{ brand: "제뉴인그립", block: "라이프스타일 4컷", what: "잔디 · 주방 · 데님+흰 양말", take: "작업화 같지 않은 작업화" },
              { brand: "슈니엘", block: "썸네일 07", what: "후드 · 캐주얼 착화", take: "일상복 모델 1컷" }] },
    lay: { caption: "2×2 그리드 · 텍스트 최소", els: [
      { t: "txt", x: 0.1, y: 0.15, w: 2.6, h: 0.35, text: "주방에서도, 퇴근길에도.", size: 9, bold: true },
      { t: "box", x: 0.15, y: 0.6, w: 1.2, h: 1.35, fill: H.tan, text: "주방\n조리복" },
      { t: "box", x: 1.45, y: 0.6, w: 1.2, h: 1.35, fill: H.tan, text: "전통시장\n앞치마" },
      { t: "box", x: 0.15, y: 2.05, w: 1.2, h: 1.35, fill: H.tan, text: "퇴근길\n데님+흰 양말" },
      { t: "box", x: 1.45, y: 2.05, w: 1.2, h: 1.35, fill: H.tan, text: "매장\n카운터" },
    ] },
    copy: { head: "주방에서도,\n퇴근길에도.", body: "갈아 신지 않아도 되는\n워킹화." },
    notes: "촬영 중 가장 오래 걸리는 컷(로케 4곳). 같은 날 친구 가게 + 시장 + 퇴근길 동선으로 묶기." },

  { n: 21, section: "4막 신뢰·구매", tag: "제품", title: "관리 — 물로 헹구면 끝",
    ref: { caption: "Clove 'wipe clean' / 슈니엘 #24 주의사항",
      cards: [{ brand: "Clove", block: "관리 편의", what: "닦아내면 끝 · 밑창 세탁", take: "헹굼 GIF 한 컷" },
              { brand: "슈니엘", block: "#24 금지 아이콘", what: "건조기 · 드라이어 · 직사광선 · 표백제", take: "주의사항은 CUT 27로" }] },
    lay: { caption: "싱크대 헹굼 GIF + 3스텝", els: [
      { t: "txt", x: 0.1, y: 0.15, w: 2.6, h: 0.35, text: "헹구고, 닦고, 말리면", size: 9, bold: true },
      { t: "box", x: 0.15, y: 0.6, w: 2.5, h: 1.5, fill: H.tan, text: "GIF · 싱크대 물줄기에 헹굼" },
      { t: "circ", x: 0.25, y: 2.3, d: 0.6, text: "헹굼" }, { t: "circ", x: 1.1, y: 2.3, d: 0.6, text: "닦기" }, { t: "circ", x: 1.95, y: 2.3, d: 0.6, text: "그늘\n건조" },
    ] },
    copy: { head: "물로 헹구면 끝", body: "헹구고, 닦고, 그늘에 말리면.\n말릴 깔창도 따로 없습니다." },
    notes: "⏳ 세탁 테스트 결과 확인 후 확정(세제 종류 · 건조 방법). 표백제·고온 금지는 CUT 27 주의사항과 일치." },

  { n: 22, section: "4막 신뢰·구매", tag: "구매", title: "사이즈 가이드 + FAQ 🔒",
    ref: { caption: "슈니엘 #23 FAQ / 르무통 발볼 고민 호명",
      cards: [{ brand: "슈니엘", block: "#23 FAQ", what: "Q 사이즈? 운동화와 동일 · 발볼 넓으면 한 치수 업", take: "Q바 카드 형식" },
              { brand: "르무통", block: "발볼·발등 고민", what: "고민을 직접 불러줌", take: "발볼 넓은 분 안내" }] },
    lay: { caption: "사이즈표 + Q바 4개", els: [
      { t: "box", x: 0.15, y: 0.15, w: 2.5, h: 0.9, fill: H.white, lineColor: H.line, text: "230 · 240 · 250 · 260 · 270 · 280\n발 길이 / 발볼 [mm] 실측표", size: 7 },
      { t: "box", x: 0.15, y: 1.2, w: 2.5, h: 0.42, fill: H.lime, text: "Q 사이즈는 어떻게 고르나요?", align: "left", bold: true },
      { t: "box", x: 0.15, y: 1.72, w: 2.5, h: 0.42, fill: H.lime, text: "Q 깔창은 왜 없나요?", align: "left", bold: true },
      { t: "box", x: 0.15, y: 2.24, w: 2.5, h: 0.42, fill: H.lime, text: "Q 패드가 떨어지지 않나요?", align: "left", bold: true },
      { t: "box", x: 0.15, y: 2.76, w: 2.5, h: 0.42, fill: H.lime, text: "Q 물세척 되나요?", align: "left", bold: true },
    ] },
    copy: { head: "사이즈, 이렇게 고르세요", body: "평소 운동화 사이즈 그대로\n발볼이 넓으면 [안내]\n\nQ 깔창은 왜 없나요?\nQ 패드가 떨어지지 않나요?\nQ 물세척 되나요?", flag: "🔒 P03 사이즈 체계 · P16 발볼 · P10 패드 박리 테스트" },
    notes: "반품 1순위 원인 = 사이즈. P03(사이즈 체계)·P16(발볼) 확정 전에는 표 비워 두지 말고 CUT 자체를 보류.\n'패드 떨어지지 않나요?' 답은 P10 박리 테스트(물 24h·유분) 결과로만." },

  { n: 23, section: "4막 신뢰·구매", tag: "신뢰", title: "증거 모음 — 성적서 · 디자인 · 특허 🔒",
    ref: { caption: "제뉴인그립 #10 성적서 2장 / 슈니엘 #09 네이비+골드",
      cards: [{ brand: "제뉴인그립", block: "#10 검증된 신발", what: "시험성적서 · 인증서 이미지 2장", take: "받은 서류만 이미지로" },
              { brand: "슈니엘", block: "인증 구간 톤", what: "네이비 + 골드로 톤 전환", take: "우리는 블랙 + 라임" }] },
    lay: { dark: true, caption: "서류 썸네일 4장 · 번호 표기", els: [
      { t: "txt", x: 0.1, y: 0.15, w: 2.6, h: 0.35, text: "받은 것만, 보여드립니다", size: 9, bold: true, color: H.white },
      { t: "box", x: 0.15, y: 0.65, w: 1.2, h: 1.25, fill: H.white, text: "미끄럼 저항\n성적서 (C02)", size: 7 },
      { t: "box", x: 1.45, y: 0.65, w: 1.2, h: 1.25, fill: H.white, text: "유해물질\n성적서 (C03)", size: 7 },
      { t: "box", x: 0.15, y: 2.0, w: 1.2, h: 1.25, fill: H.white, text: "디자인 등록\n2건", size: 7 },
      { t: "box", x: 1.45, y: 2.0, w: 1.2, h: 1.25, fill: H.white, text: "특허 출원\n제10-[번호]", size: 7 },
    ] },
    copy: { head: "받은 것만,\n보여드립니다", body: "미끄럼 저항 시험 성적서\n유해물질 시험 성적서\n디자인 등록 2건\n특허 출원 제10-[번호]", flag: "🔒 C02 · C03 · C07 — 받은 서류만 노출" },
    notes: "서류가 안 나온 칸은 빈칸 대신 칸째 삭제. '특허' 단독 표기 ✗ → '특허 출원'. 디자인 등록번호 기재." },

  { n: 24, section: "4막 신뢰·구매", tag: "제품", title: "컬러 & 제품컷",
    ref: { caption: "스티코 COLOR · 슈니엘 #22 룩북 · 제뉴인그립 #11",
      cards: [{ brand: "3사 공통", block: "제품컷", what: "측면 · 뒤 3/4 · 밑창 · 페어", take: "컬러별 4앵글" }] },
    lay: { caption: "컬러 3종 × 4앵글 · 스튜디오 연회색", els: [
      { t: "txt", x: 0.1, y: 0.15, w: 2.6, h: 0.35, text: "COLOR", size: 10, bold: true },
      { t: "img", x: 0.3, y: 0.55, w: 2.2, h: 1.5, path: IMG("shoes.jpg"), fit: "cover" },
      { t: "circ", x: 0.75, y: 2.25, d: 0.4, fill: H.ink, lineColor: H.line },
      { t: "circ", x: 1.2, y: 2.25, d: 0.4, fill: H.tan, lineColor: H.line },
      { t: "circ", x: 1.65, y: 2.25, d: 0.4, fill: H.white, lineColor: H.line },
      { t: "txt", x: 0.1, y: 2.8, w: 2.6, h: 0.5, text: "[컬러명 1] · [컬러명 2] · [컬러명 3]\n밑창 패드는 모두 라임", size: 8 },
    ] },
    copy: { head: "COLOR", body: "[컬러명 1] · [컬러명 2] · [컬러명 3]\n\n어떤 색이든, 바닥은 라임." },
    notes: "Drive 상품정보: 워킹화 3색 × 6사이즈 = 18 SKU. 컬러명 확정 필요(K02 바코드와 동일 명칭)." },

  { n: 25, section: "4막 신뢰·구매", tag: "구매", title: "단체 구매 — 유니폼은 맞췄는데",
    ref: { caption: "Clove 직업인 B2B / 제뉴인그립 식자재몰 유통",
      cards: [{ brand: "제뉴인그립", block: "B2B 유통", what: "급식·병원 식자재몰 공급", take: "단체 구매 문의 동선을 상세 안에" }] },
    lay: { dark: true, caption: "B2B 배너 + 문의 버튼(랜딩 폼 QR)", els: [
      { t: "txt", x: 0.1, y: 0.3, w: 2.6, h: 0.6, text: "유니폼은 맞췄는데,\n신발은요?", size: 11, bold: true, color: H.white },
      { t: "box", x: 0.15, y: 1.1, w: 2.5, h: 1.3, fill: "3A3A3A", text: "급식실 · 주방 팀 단체 착화 사진", color: H.white },
      { t: "box", x: 0.45, y: 2.6, w: 1.9, h: 0.45, fill: H.lime, text: "단체 구매 문의 →", bold: true },
      { t: "txt", x: 0.1, y: 3.15, w: 2.6, h: 0.3, text: "수량별 개별 견적 · 로고 각인 상담", size: 7, color: H.mute },
    ] },
    copy: { head: "유니폼은 맞췄는데,\n신발은요?", body: "급식실 · 주방 · 매장 단체 구매\n수량별 개별 견적으로 안내합니다." },
    notes: "B2B 카피(copy-system). 문의는 rharashoe.netlify.app 랜딩 폼(?src=detail) 연결. 단가표는 F03/F04 확정 후." },

  { n: 26, section: "4막 신뢰·구매", tag: "구매", title: "런칭 혜택 + 인솔 함께 보기",
    ref: { caption: "슈니엘 최상단 인솔 크로스셀 / 이벤트 배너",
      cards: [{ brand: "슈니엘", block: "크로스셀", what: "상세 최상단 인솔 추가구매 링크", take: "우리는 하단 · '다른 신발용'으로" }] },
    lay: { caption: "혜택 배너 + 인솔 카드", els: [
      { t: "box", x: 0.15, y: 0.2, w: 2.5, h: 1.2, fill: H.ink, text: "OPEN 혜택\n[혜택 내용 · 기간]\n알림 신청 [N]명 ([날짜] 기준)", color: H.lime, size: 8, bold: true },
      { t: "txt", x: 0.1, y: 1.55, w: 2.6, h: 0.35, text: "신던 다른 신발엔", size: 8, color: H.mute },
      { t: "box", x: 0.15, y: 1.95, w: 2.5, h: 1.3, fill: H.white, lineColor: H.line, text: "쿼드그립 아치가득 인솔\n신던 신발은 그대로, 바닥만 새로.\n21,500원 →", size: 8 },
    ] },
    copy: { head: "오픈 혜택", body: "[혜택 내용 · 기간]\n\n신던 다른 신발에는\n쿼드그립 아치가득 인솔", flag: "알림 신청 수는 실제 수치 + 날짜만" },
    notes: "인솔은 워킹화용이 아님(워킹화는 깔창 없음) → '가지고 계신 다른 신발용'으로만 제안. 이 역설 자체가 후킹 소재(스레드 실측).\n할인 정책은 marketing-expert 가격·프로모션 정책 확정 후." },

  { n: 27, section: "4막 신뢰·구매", tag: "구매", title: "스펙 · 주의사항",
    ref: { caption: "제뉴인그립 #12~13 / 슈니엘 #24",
      cards: [{ brand: "제뉴인그립·슈니엘", block: "PRODUCT SPEC + 금지 아이콘", what: "소재 · 무게 · 원산지 · 고열/표백제 금지", take: "법정 표시 + 분쟁 예방" }] },
    lay: { caption: "스펙 표 + 금지 아이콘 6개", els: [
      { t: "txt", x: 0.1, y: 0.1, w: 2.6, h: 0.3, text: "PRODUCT SPEC", size: 10, bold: true },
      { t: "box", x: 0.15, y: 0.45, w: 2.5, h: 1.6, fill: H.white, lineColor: H.line, text: "제품명 · 모델명\n소재: 본체 E-실리폴리렌 / 패드 재생고무+재생PVC\n사이즈 230~280 · 무게 [000]g\n제조국 대한민국 · 제조자 (주)알앤디메이커스\nA/S · 품질보증 기준", size: 7, align: "left" },
      { t: "circ", x: 0.2, y: 2.3, d: 0.42, fill: H.white, lineColor: H.orange, text: "고열", size: 6 },
      { t: "circ", x: 0.62, y: 2.3, d: 0.42, fill: H.white, lineColor: H.orange, text: "건조기", size: 6 },
      { t: "circ", x: 1.04, y: 2.3, d: 0.42, fill: H.white, lineColor: H.orange, text: "직사광", size: 6 },
      { t: "circ", x: 1.46, y: 2.3, d: 0.42, fill: H.white, lineColor: H.orange, text: "표백제", size: 6 },
      { t: "circ", x: 1.88, y: 2.3, d: 0.42, fill: H.white, lineColor: H.orange, text: "날카\n로움", size: 6 },
      { t: "txt", x: 0.1, y: 2.9, w: 2.6, h: 0.45, text: "행택 품질표시와 1:1 일치 (K04)", size: 8, color: H.mute },
    ] },
    copy: { head: "PRODUCT SPEC", body: "소재 · 사이즈 · 무게 · 제조국 · 제조자\n\n고열 · 건조기 · 직사광선 · 표백제 ·\n날카로운 물건 주의" },
    notes: "K04 표시사항 대조표와 같은 값. 친환경 문구는 성적서 없으면 제외. KC/생활용품 안전관리 대상 여부(C01) 확인 후 표기." },

  { n: 28, section: "4막 신뢰·구매", tag: "제품", title: "엔딩 — Made for Standing.",
    ref: { caption: "제뉴인그립 #16 엔딩 / 슈니엘 #14 브랜드 선언",
      cards: [{ brand: "슈니엘", block: "#14 브랜드 선언", what: "셰프가 밑창 들어 보이기 + 선언 카피", take: "엔딩도 밑창 · 라임" }] },
    lay: { dark: true, caption: "라이프스타일 + 로고 락업", els: [
      { t: "box", x: 0.15, y: 0.2, w: 2.5, h: 2.0, fill: "3A3A3A", text: "퇴근길 뒷모습\n밑창 라임 살짝", color: H.white },
      { t: "img", x: 1.05, y: 2.35, w: 0.7, h: 0.59, path: IMG("rs-logo.png"), fit: "contain" },
      { t: "txt", x: 0.1, y: 3.0, w: 2.6, h: 0.4, text: "Made for Standing.", size: 11, bold: true, color: H.lime },
    ] },
    copy: { head: "Made for Standing.", body: "RS · RhaRa Shoe" },
    notes: "로고 락업: RS · RhaRa Shoe · Made for Standing. 영상 엔딩과 동일. From Road to Floor 와 같은 화면 금지." },
];

function backMatter() {
  pres.addSection({ title: "실행" });
  // shot list
  let s = pres.addSlide({ sectionTitle: "실행" });
  s.background = { color: H.white };
  T(s, "촬영 리스트", { x: 0.7, y: 0.6, w: 11, h: 0.45, fontSize: 20, bold: true });
  const shots = [
    ["#", "컷", "CUT", "장소 · 연출", "비고"],
    ["1", "모델 밑창 들어 보이기", "05 · 썸네일", "주방, 조리복, 정면 미소", "썸네일 1순위"],
    ["2", "다크 플로팅 렌더", "01 · 07", "검정 배경, 밑창 4점 사선", "브랜드 필름 소스"],
    ["3", "공감 3장면", "03", "젖은 주방 · 급식실 물청소 · 매장", "얼굴 프레임 밖"],
    ["4", "현장 착화 GIF", "11", "급식실 마대걸레 거품 바닥", "미끄럼 연출 ✗"],
    ["5", "저울 · 누르기 GIF", "12 · 13", "스튜디오", "무게 실측 · C09 후"],
    ["6", "공장 다큐", "17", "사출 · 패드 끼움 · 검수", "국산 근거"],
    ["7", "라이프스타일 4컷", "20", "주방 · 시장 · 퇴근길 · 매장", "가장 오래 걸림"],
    ["8", "헹굼 GIF", "21", "싱크대", "세탁 테스트 후"],
    ["9", "컬러 × 4앵글", "24", "연회색 스튜디오", "양산 컬러로"],
    ["10", "대표 실사진", "06", "친구 가게 · 작업장", "서사"],
  ];
  s.addTable(shots.map((r, i) => r.map((c) => ({ text: c, options: { bold: i === 0, color: i === 0 ? H.white : H.ink, fill: { color: i === 0 ? H.ink : (i % 2 ? H.white : H.panel) }, fontSize: 12 } }))),
    { x: 0.7, y: 1.3, w: 11.9, colW: [0.5, 2.8, 1.6, 4.2, 2.8], rowH: 0.42, border: { type: "solid", color: H.line, pt: 0.5 }, valign: "middle", fontFace: THEME.bodyFontFace, margin: 0.06 });

  // evidence gate
  s = pres.addSlide({ sectionTitle: "실행" });
  s.background = { color: H.white };
  T(s, "증거 게이트 — 🔒 CUT은 무엇이 있어야 열리나", { x: 0.7, y: 0.6, w: 11, h: 0.45, fontSize: 20, bold: true });
  const gate = [
    ["CUT", "필요한 것", "트래커", "상태 · 마감", "없으면"],
    ["10 · 23", "미끄럼 저항 성적서 (KS M ISO 13287, 세제+글리세린)", "C02", "차주 의뢰 (대표 10/08)", "CUT 삭제하고 오픈 → 수령 즉시 삽입"],
    ["12 · 27", "무게 실측 (230mm 한쪽 + 사이즈별)", "신규", "공장 확인", "숫자 자리 비우지 말고 CUT 보류"],
    ["13 · 14", "반발탄성 · 압축영구줄음률 (일반 EVA 대조)", "C09", "10/10", "소재 설명 + GIF만"],
    ["08", "특허 출원번호 · 스티코 FTO 의견", "C07 · C11", "10/08 · 10/31", "출원 사실 문장 보류"],
    ["22", "사이즈 체계 · 발볼 · 패드 박리 테스트", "P03 · P16 · P10", "지연 중", "CUT 보류 (반품 리스크)"],
    ["23", "유해물질 성적서", "C03", "대기", "칸 삭제"],
    ["18", "새활용 마크 디자인", "K07", "10/12", "마크 없이 3단 그래픽만"],
  ];
  s.addTable(gate.map((r, i) => r.map((c, j) => ({ text: c, options: { bold: i === 0 || j === 2, color: i === 0 ? H.white : H.ink, fill: { color: i === 0 ? H.ink : (i % 2 ? H.white : H.panel) }, fontSize: 12 } }))),
    { x: 0.7, y: 1.3, w: 11.9, colW: [1.1, 4.3, 1.5, 2.0, 3.0], rowH: 0.5, border: { type: "solid", color: H.line, pt: 0.5 }, valign: "middle", fontFace: THEME.bodyFontFace, margin: 0.06 });

  // copy guard
  s = pres.addSlide({ sectionTitle: "실행" });
  s.background = { color: H.white };
  T(s, "카피 가드 — 대표 의도를 이렇게 바꿔 씁니다", { x: 0.7, y: 0.6, w: 11, h: 0.45, fontSize: 20, bold: true });
  const guard = [
    ["대표 의도 / 쓰고 싶은 말", "❌ 그대로 쓰면", "✅ 상세에서는"],
    ["오래 신어도 발 아프지 않게", "효능 · 의학 오인 (표시광고법)", "반발탄성 [시험값]% · 눌렀다 돌아오는 GIF"],
    ["피로감을 줄이는 경량성", "'피로 감소' 효능 주장", "한쪽 [000]g · '하루 1만 보면 신발도 1만 번 든다'"],
    ["주방 미끄럼 방지", "'미끄럽지 않은 · 논슬립' (성적서 전)", "4점 쿼드그립 패드(구조) → 성적서 후 KS 수치"],
    ["종일 편한", "'종일 편합니다' 효능 문장", "'종일편한'은 제품명으로만"],
    ["국산이라 더 좋다", "타사 원산지 비교", "'국내에서 만듭니다' + 공장 다큐"],
    ["친환경", "'무공해 · 환경부 인증'", "'폐타이어 고무를 그립 패드로' · 지원사업 수행 기업"],
  ];
  s.addTable(guard.map((r, i) => r.map((c, j) => ({ text: c, options: { bold: i === 0, color: i === 0 ? H.white : (j === 1 ? "B5341C" : (j === 2 ? H.olive : H.ink)), fill: { color: i === 0 ? H.ink : (i % 2 ? H.white : H.panel) }, fontSize: 13 } }))),
    { x: 0.7, y: 1.3, w: 11.9, colW: [3.4, 3.9, 4.6], rowH: 0.62, border: { type: "solid", color: H.line, pt: 0.5 }, valign: "middle", fontFace: THEME.bodyFontFace, margin: 0.08 });

  // next steps
  s = pres.addSlide({ sectionTitle: "실행" });
  s.background = { color: H.black };
  T(s, "다음 단계", { x: 0.7, y: 0.6, w: 11, h: 0.5, fontSize: 22, bold: true, color: H.white });
  const steps = [
    ["대표", "히어로 A(다크 렌더) / B(밑창 들기 모델) 선택 · CUT 순서 승인", "이번 주"],
    ["대표", "C02 미끄럼 시험 의뢰 — KS M ISO 13287 · 세제+글리세린 · 패드 A/B", "차주"],
    ["공장", "무게 실측 · 발볼 사양(P16) · 사이즈 체계(P03) · 패드 박리(P10)", "10/10"],
    ["대표", "촬영 10/28 확정(DP01) — 이 샷 리스트로 외주 브리핑 · 로케 4곳 섭외", "10/20 확정"],
    ["Claude", "승인된 CUT부터 860px HTML 시안 렌더링 (🔒 CUT은 자리만)", "승인 즉시"],
    ["변리사", "C11 스티코 FTO 의견 → CUT 08 문구 확정", "10/31"],
  ];
  steps.forEach(([who, what, when], i) => {
    const y = 1.45 + i * 0.82;
    R(s, { x: 0.7, y, w: 1.3, h: 0.6, fill: { color: H.lime }, r: 0.06 });
    T(s, who, { x: 0.7, y, w: 1.3, h: 0.6, fontSize: 13, bold: true, align: "center", valign: "middle" });
    T(s, what, { x: 2.2, y, w: 8.4, h: 0.6, fontSize: 15, color: H.white, valign: "middle" });
    T(s, when, { x: 10.6, y, w: 2.0, h: 0.6, fontSize: 13, color: H.lime, align: "right", valign: "middle" });
  });
}

(async () => {
  cover(); summary(); refsOverview(); positioning(); flowMap(); toneGuide();
  let cur = null;
  CUTS.forEach((c) => { if (c.section !== cur) { pres.addSection({ title: c.section }); cur = c.section; } cut(c); });
  backMatter();
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
