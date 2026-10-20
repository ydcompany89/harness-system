// 라라슈(RhaRa Shoe) 회사소개서 v1 — B2B 파트너·바이어·박람회 배포용
// 실행: NODE_PATH=<pptxgenjs 설치 경로>/node_modules node build.js <출력.pptx> <스킬 pptx 폴더>
// 에셋: node prep-assets.mjs <기존 상품소개서 unzip 폴더>  (img/ 생성)
const path = require("path");
const pptxgen = require("pptxgenjs");
const OUT = process.argv[2] || path.join(__dirname, "라라슈_회사소개서_v1.pptx");
const SKILL = process.argv[3];
const { applyTheme } = require(path.join(SKILL, "scripts/apply_theme.js"));
const img = (f) => path.join(__dirname, "img", f);

// ---------- THEME (블랙 + 네온 라임, 기존 상품소개서 팔레트와 동일) ----------
const FONT = "Malgun Gothic"; // 기존 덱 테마 폰트(맑은 고딕)와 동일
const THEME = {
  name: "RhaRa Shoe",
  headFontFace: FONT,
  bodyFontFace: FONT,
  colors: {
    dk1: "0D0D0D", lt1: "FFFFFF", dk2: "1A1A1A", lt2: "EDEDE8",
    accent1: "C6F432", accent2: "3D4A12", accent3: "8C8C86",
    accent4: "A47864", accent5: "2A2A2A", accent6: "D8D8D2",
    hlink: "C6F432", folHlink: "8C8C86",
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625
pres.theme = { headFontFace: FONT, bodyFontFace: FONT };
pres.title = "라라슈 회사소개서";
pres.author = "㈜알앤디메이커스";
pres.company = "알앤디메이커스";
const C = pres.SchemeColor;
const W = 10, M = 0.5;

const FOOT = "RhaRa Shoe 라라슈  ·  ㈜알앤디메이커스";
pres.defineSlideMaster({
  title: "COVER",
  background: { color: "0D0D0D" },
  objects: [],
});
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: "0D0D0D" },
  objects: [
    { text: { text: FOOT, options: { x: M, y: 5.16, w: 3.2, h: 0.25, fontSize: 9, color: C.accent3, fontFace: FONT, valign: "middle", margin: 0 } } },
    { rect: { x: 3.9, y: 5.2, w: 1.4, h: 0.18, fill: { color: C.accent1 } } },
    { text: { text: "MADE FOR STANDING", options: { x: 3.9, y: 5.2, w: 1.4, h: 0.18, fontSize: 6.5, bold: true, color: C.text1, fontFace: FONT, align: "center", valign: "middle", margin: 0 } } },
  ],
  slideNumber: { x: 9.0, y: 5.16, w: 0.5, h: 0.25, fontSize: 9, color: C.accent3, fontFace: FONT, align: "right" },
});
// 제목은 레이아웃 오브젝트가 아니라 슬라이드마다 동일 위치로 직접 배치(placeholder 미사용: 한글 제목 길이 제어)
function content(title, section, notes) {
  pres.addSection({ title: section });
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
  s.addText(title, { x: M, y: 0.35, w: 9, h: 0.7, fontSize: 28, bold: true, color: C.background1, fontFace: FONT, valign: "top", margin: 0, isTextBox: true });
  if (notes) s.addNotes(notes);
  return s;
}
const card = (s, x, y, w, h, name, fill) =>
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: fill || C.text2 }, line: { color: fill || C.text2, width: 0 }, objectName: name });
const txt = (s, t, o) => s.addText(t, Object.assign({ fontFace: FONT, margin: 0, isTextBox: true, valign: "top" }, o));
const badge = (s, num, x, y, d, name) => {
  s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: C.accent1 }, line: { color: C.accent1, width: 0 }, objectName: name + "-badge" });
  txt(s, num, { x, y, w: d, h: d, fontSize: 13, bold: true, color: C.text1, align: "center", valign: "middle", objectName: name + "-num" });
};

// ============ 1. 표지 ============
{
  pres.addSection({ title: "표지" });
  const s = pres.addSlide({ masterName: "COVER", sectionTitle: "표지" });
  s.addImage({ path: img("logo-lime.png"), x: M, y: 0.45, w: 0.85, h: 0.85 * 481 / 587, altText: "RS 로고", objectName: "logo" });
  s.addShape(pres.ShapeType.ellipse, { x: 5.55, y: 1.15, w: 3.95, h: 3.95, fill: { color: C.accent2 }, line: { color: C.accent2, width: 0 }, objectName: "circle" });
  s.addImage({ path: img("walking-cut.png"), x: 5.85, y: 1.3, w: 2.55, h: 2.55 * 900 / 742, altText: "쿼드그립 종일편한 워킹화", objectName: "walking" });
  s.addImage({ path: img("insole-cut.png"), x: 7.55, y: 3.15, w: 1.95, h: 1.95 * 769 / 900, altText: "쿼드그립 아치가득 인솔", objectName: "insole" });
  txt(s, "Made for Standing.", { x: M, y: 1.75, w: 5, h: 0.4, fontSize: 20, bold: true, color: C.accent1 });
  txt(s, "서서 일하는 하루를 위한 신발과 인솔", { x: M, y: 2.25, w: 5, h: 0.35, fontSize: 14, color: C.accent6 });
  txt(s, "라라슈 회사소개서", { x: M, y: 2.95, w: 5, h: 0.8, fontSize: 36, bold: true, color: C.background1 });
  txt(s, "RhaRa Shoe  ·  ㈜알앤디메이커스  ·  2026.10", { x: M, y: 4.75, w: 5, h: 0.25, fontSize: 11, color: C.accent3 });
  s.addNotes("회사소개서 v1 (B2B·박람회 배포용).");
}

// ============ 2. 우리가 보는 문제 ============
{
  const s = content("서서 일하는 하루에서 시작된 질문", "문제",
    "현장 운영자 의견을 구조 설명으로만 소개. 효과 단정 표현 없음.");
  const chips = ["식당 · 주방", "카페 · 베이커리", "매장 · 서비스"];
  chips.forEach((c, i) => {
    const x = M + i * 1.75;
    s.addShape(pres.ShapeType.roundRect, { x, y: 1.2, w: 1.6, h: 0.34, rectRadius: 0.17, fill: { color: C.accent5 }, line: { color: C.accent5, width: 0 }, objectName: "chip" + (i + 1) });
    txt(s, c, { x, y: 1.2, w: 1.6, h: 0.34, fontSize: 12, bold: true, color: C.accent1, align: "center", valign: "middle" });
  });
  txt(s, "오래 서서 일하는 현장에서 직접 들은 이야기", { x: 5.85, y: 1.2, w: 3.65, h: 0.34, fontSize: 12, color: C.accent3, align: "right", valign: "middle" });
  const q = [
    ["01", "깔창이 분리되면", "신발과 깔창 사이 틈에 물이 고인다고 합니다."],
    ["02", "젖은 상태로 신으면", "깔창이 같이 딸려 나와 불편하다고 합니다."],
    ["03", "입구 테두리가 둥글면", "물이 테두리를 타고 넘어온다고 합니다."],
  ];
  q.forEach(([n, h, b], i) => {
    const x = M + i * 3.05, w = 2.9;
    card(s, x, 1.8, w, 2.0, "voice" + (i + 1));
    txt(s, "“", { x: x + 0.25, y: 1.85, w: 0.6, h: 0.6, fontSize: 40, bold: true, color: C.accent1 });
    txt(s, h, { x: x + 0.25, y: 2.5, w: w - 0.5, h: 0.4, fontSize: 16, bold: true, color: C.background1 });
    txt(s, b, { x: x + 0.25, y: 2.95, w: w - 0.5, h: 0.65, fontSize: 12, color: C.accent6 });
  });
  card(s, M, 4.05, 9, 0.85, "answer-bar", C.accent5);
  txt(s, "그래서", { x: M + 0.3, y: 4.05, w: 0.9, h: 0.85, fontSize: 14, bold: true, color: C.accent1, valign: "middle" });
  txt(s, "깔창 없는 일체형 안창과 도톰한 발목 입구 테두리 구조로 설계했습니다.", { x: M + 1.15, y: 4.05, w: 7.6, h: 0.85, fontSize: 14, color: C.background1, valign: "middle" });
}

// ============ 3. 브랜드 스토리 ============
{
  const s = content("현장에서 출발한 제조사", "브랜드",
    "연혁은 회사 브로셔 기준. 지원사업 선정은 제품 인증이 아님.");
  txt(s, [
    { text: "알앤디메이커스는 폐벽지·폐타이어처럼 버려지는 소재를 원료로 바꿔 생활 제품을 만들어 왔습니다.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true, fontSize: 8 } },
    { text: "라라슈는 그 소재 경험을 서서 일하는 사람의 신발과 인솔로 옮긴 브랜드입니다. 기능보다 먼저 하루의 동선을 봤습니다.", options: {} },
  ], { x: M, y: 1.35, w: 4.2, h: 2.3, fontSize: 14, color: C.accent6, paraSpaceAfter: 4, lineSpacingMultiple: 1.2 });
  s.addImage({ path: img("logo-lime.png"), x: M, y: 3.85, w: 0.7, h: 0.7 * 481 / 587, altText: "RS 로고", objectName: "logo" });
  txt(s, "RhaRa Shoe  라라슈", { x: 1.4, y: 3.9, w: 3.3, h: 0.3, fontSize: 14, bold: true, color: C.background1 });
  txt(s, "Made for Standing.", { x: 1.4, y: 4.22, w: 3.3, h: 0.3, fontSize: 12, bold: true, color: C.accent1 });
  // 연혁 카드 (우측)
  card(s, 5.2, 1.3, 4.3, 3.6, "history-card");
  const hist = [
    ["2023.07", "㈜알앤디메이커스 창립"],
    ["2023.09", "다이소 전국 매장 입점"],
    ["2026", "환경부 새활용산업육성 지원사업 ‘도약’ 선정"],
    ["2026.11", "라라슈 첫 제품 인솔 OPEN 예정"],
  ];
  s.addShape(pres.ShapeType.line, { x: 5.62, y: 1.85, w: 0, h: 2.45, line: { color: C.accent3, width: 1 }, objectName: "history-line" });
  hist.forEach(([d, t], i) => {
    const y = 1.62 + i * 0.85;
    const last = i === hist.length - 1;
    s.addShape(pres.ShapeType.ellipse, { x: 5.52, y: y + 0.12, w: 0.2, h: 0.2, fill: { color: last ? C.accent1 : C.accent3 }, line: { color: last ? C.accent1 : C.accent3, width: 0 }, objectName: "dot" + (i + 1) });
    txt(s, d, { x: 5.95, y, w: 3.3, h: 0.3, fontSize: 14, bold: true, color: last ? C.accent1 : C.background1 });
    txt(s, t, { x: 5.95, y: y + 0.3, w: 3.3, h: 0.45, fontSize: 12, color: C.accent6 });
  });
}

// ============ 4. 자체 소재 R&D ============
{
  const s = content("소재부터 직접 개발합니다", "소재",
    "리타이어렌은 상표 출원 단계(등록 아님). E-실리폴리렌은 명칭만 표기.");
  const cols = [
    { x: M, badges: ["badge-tire.png", "badge-wallpaper.png"], name: "리타이어렌", tag: "상표 출원 단계",
      line1: "폐타이어 고무 + 폐벽지 PVC 배합", line2: "워킹화 그립 패드에 적용합니다.", sub: "타이어 재생고무를 포함한 자체 배합 소재" },
    { x: 5.1, badges: ["badge-esp.png"], name: "E-실리폴리렌", tag: "자체 개발",
      line1: "인솔과 워킹화 본체에 쓰는 자체 소재", line2: "본체는 안창까지 통째로 성형합니다.", sub: "깔창 없는 일체형 안창 구조" },
  ];
  cols.forEach((c, i) => {
    card(s, c.x, 1.3, 4.4, 3.6, "mat-card" + (i + 1));
    c.badges.forEach((b, j) => s.addImage({ path: img(b), x: c.x + 0.3 + j * 1.0, y: 1.55, w: 0.9, h: 0.9, altText: "RS 소재 배지", objectName: `mat${i + 1}-badge${j + 1}` }));
    txt(s, c.name, { x: c.x + 0.3, y: 2.65, w: 2.6, h: 0.5, fontSize: 24, bold: true, color: C.accent1 });
    s.addShape(pres.ShapeType.roundRect, { x: c.x + 2.95, y: 2.75, w: 1.15, h: 0.3, rectRadius: 0.15, fill: { color: C.accent5 }, line: { color: C.accent5, width: 0 }, objectName: "tag" + (i + 1) });
    txt(s, c.tag, { x: c.x + 2.95, y: 2.75, w: 1.15, h: 0.3, fontSize: 10, bold: true, color: C.background1, align: "center", valign: "middle" });
    txt(s, c.line1, { x: c.x + 0.3, y: 3.3, w: 3.8, h: 0.35, fontSize: 14, bold: true, color: C.background1 });
    txt(s, c.line2, { x: c.x + 0.3, y: 3.7, w: 3.8, h: 0.3, fontSize: 12, color: C.accent6 });
    txt(s, c.sub, { x: c.x + 0.3, y: 4.25, w: 3.8, h: 0.3, fontSize: 11, color: C.accent3 });
  });
}

// ============ 5. 전문의 설계 자문 + 논문 참고 설계 ============
{
  const s = content("설계 단계의 두 가지 근거", "설계",
    "전문의는 설계 자문 사실만 표기(실명·병원명 미기재). 추천·보증 아님. 논문은 설계 참고 자료.");
  // 좌: 전문의
  card(s, M, 1.3, 4.4, 2.2, "advisor-card");
  txt(s, "정형외과 전문의", { x: M + 0.3, y: 1.5, w: 3.8, h: 0.4, fontSize: 20, bold: true, color: C.accent1 });
  txt(s, "설계 자문", { x: M + 0.3, y: 1.92, w: 3.8, h: 0.3, fontSize: 14, bold: true, color: C.background1 });
  ["패드 위치", "인솔 형태"].forEach((t, i) => {
    const x = M + 0.3 + i * 1.85;
    s.addShape(pres.ShapeType.roundRect, { x, y: 2.4, w: 1.7, h: 0.4, rectRadius: 0.2, fill: { color: C.accent5 }, line: { color: C.accent5, width: 0 }, objectName: "chip-a" + (i + 1) });
    txt(s, t, { x, y: 2.4, w: 1.7, h: 0.4, fontSize: 13, bold: true, color: C.background1, align: "center", valign: "middle" });
  });
  txt(s, "설계 단계에서 함께 검토했습니다.", { x: M + 0.3, y: 2.95, w: 3.8, h: 0.35, fontSize: 12, color: C.accent6 });
  // 우: 논문
  card(s, 5.1, 1.3, 4.4, 2.2, "paper-card");
  txt(s, "2편", { x: 5.4, y: 1.35, w: 1.9, h: 0.95, fontSize: 48, bold: true, color: C.accent1, valign: "middle" });
  txt(s, "국내 논문", { x: 7.1, y: 1.55, w: 2.2, h: 0.4, fontSize: 20, bold: true, color: C.accent1 });
  txt(s, "참고 설계", { x: 7.1, y: 1.97, w: 2.2, h: 0.3, fontSize: 14, bold: true, color: C.background1 });
  s.addShape(pres.ShapeType.roundRect, { x: 5.4, y: 2.4, w: 1.7, h: 0.4, rectRadius: 0.2, fill: { color: C.accent5 }, line: { color: C.accent5, width: 0 }, objectName: "chip-b1" });
  txt(s, "패드 무늬", { x: 5.4, y: 2.4, w: 1.7, h: 0.4, fontSize: 13, bold: true, color: C.background1, align: "center", valign: "middle" });
  txt(s, "무늬 설계의 참고 자료로 사용했습니다.", { x: 5.4, y: 2.95, w: 3.8, h: 0.35, fontSize: 12, color: C.accent6 });
  // 하: 결과 바
  card(s, M, 3.75, 9, 0.55, "result-bar", C.accent5);
  txt(s, "이 근거 위에서 설계한 제품", { x: M + 0.3, y: 3.75, w: 2.5, h: 0.55, fontSize: 12, bold: true, color: C.accent1, valign: "middle" });
  txt(s, "쿼드그립 종일편한 워킹화  ·  쿼드그립 아치가득 인솔", { x: M + 2.9, y: 3.75, w: 5.9, h: 0.55, fontSize: 14, bold: true, color: C.background1, valign: "middle" });
  txt(s, "정형외과 전문의의 설계 자문 사실을 알리는 내용이며, 제품에 대한 추천·보증이 아닙니다. 논문은 설계 참고 자료이며 제품의 성능을 보증하지 않습니다. 본 제품은 의료기기가 아닙니다.",
    { x: M, y: 4.5, w: 9, h: 0.4, fontSize: 10, color: C.accent3 });
}

// ============ 6. 제품 라인업 2종 ============
{
  const s = content("제품 라인업 2종", "제품",
    "가격은 소비자가. 기능 문구는 구조 설명만 표기.");
  const P = [
    { x: M, img: "walking-cut.png", ar: 900 / 742, name: "쿼드그립 종일편한 워킹화", price: "42,500원  ·  2026.12 OPEN",
      desc: ["바닥에 닿는 길을 따라 그립 패드 4곳 배치", "깔창 없는 일체형 안창"],
      rows: [["사이즈", "230~280mm (10mm 단위 6종)"], ["컬러", "그레이 · 차콜 블랙 · 민트 화이트"], ["소재", "본체 E-실리폴리렌 / 패드 리타이어렌"], ["제조", "대한민국"]] },
    { x: 5.1, img: "insole-cut.png", ar: 769 / 900, name: "쿼드그립 아치가득 인솔", price: "21,500원  ·  2026.11.11 OPEN",
      desc: ["아치 라인을 따라 채운 형태", "뒤꿈치를 감싸는 링 컵"],
      rows: [["사이즈", "M 160mm · L 175mm"], ["컬러", "그레이 · 모카무스"], ["소재", "E-실리폴리렌"], ["형태", "반굽 인솔 (뒤꿈치~아치)"]] },
  ];
  P.forEach((p, i) => {
    card(s, p.x, 1.2, 4.4, 3.75, "product-card" + (i + 1));
    const iw = 1.3, ih = iw * p.ar; // 누끼 비율 유지
    const ih2 = Math.min(ih, 1.5), iw2 = ih2 / p.ar;
    s.addImage({ path: img(p.img), x: p.x + 0.2 + (1.5 - iw2) / 2, y: 1.35 + (1.5 - ih2) / 2, w: iw2, h: ih2, altText: p.name, objectName: "product-img" + (i + 1) });
    txt(s, p.name, { x: p.x + 1.85, y: 1.38, w: 2.4, h: 0.35, fontSize: 14, bold: true, color: C.background1 });
    txt(s, p.price, { x: p.x + 1.85, y: 1.78, w: 2.4, h: 0.3, fontSize: 12, bold: true, color: C.accent1 });
    txt(s, p.desc.map((d, k) => ({ text: d, options: { breakLine: k < p.desc.length - 1 } })), { x: p.x + 1.85, y: 2.15, w: 2.4, h: 0.7, fontSize: 11, color: C.accent6, paraSpaceAfter: 3 });
    p.rows.forEach(([k, v], r) => {
      const y = 3.05 + r * 0.46;
      s.addShape(pres.ShapeType.roundRect, { x: p.x + 0.2, y, w: 4.0, h: 0.4, rectRadius: 0.04, fill: { color: C.accent5 }, line: { color: C.accent5, width: 0 }, objectName: `spec-row${i + 1}-${r + 1}` });
      txt(s, k, { x: p.x + 0.35, y, w: 0.7, h: 0.4, fontSize: 11, bold: true, color: C.accent1, valign: "middle" });
      txt(s, v, { x: p.x + 1.1, y, w: 3.0, h: 0.4, fontSize: 11, color: C.background1, valign: "middle" });
    });
  });
}

// ============ 7. 새활용 · ESG ============
{
  const s = content("새활용 R&D, 환경부 ‘도약’ 선정", "ESG",
    "선정은 과제 수행 기업 선정이며 제품 인증·보증이 아님.");
  card(s, M, 1.3, 4.4, 3.6, "grant-card");
  txt(s, "환경부 새활용산업육성 지원사업", { x: M + 0.3, y: 1.55, w: 3.8, h: 0.3, fontSize: 12, color: C.accent6 });
  txt(s, "‘도약’ 선정", { x: M + 0.3, y: 1.9, w: 3.8, h: 0.45, fontSize: 22, bold: true, color: C.background1 });
  txt(s, "1억 2,404만원", { x: M + 0.3, y: 2.7, w: 3.9, h: 0.7, fontSize: 30, bold: true, color: C.accent1 });
  txt(s, "정부지원금 규모 과제", { x: M + 0.3, y: 3.5, w: 3.8, h: 0.3, fontSize: 14, color: C.background1 });
  txt(s, "과제 선정은 수행 기업 선정이며, 제품에 대한 인증·보증이 아닙니다.", { x: M + 0.3, y: 4.2, w: 3.8, h: 0.5, fontSize: 10, color: C.accent3 });
  const rows = [
    ["badge-tire.png", "폐타이어 고무", "타이어 재생고무를 워킹화 그립 패드 배합에 사용"],
    ["badge-wallpaper.png", "폐벽지 PVC", "폐벽지에서 분리한 PVC를 같은 패드 배합에 사용"],
  ];
  rows.forEach(([b, h, t], i) => {
    const y = 1.3 + i * 1.85;
    card(s, 5.1, y, 4.4, 1.75, "mat-row" + (i + 1));
    s.addImage({ path: img(b), x: 5.35, y: y + 0.42, w: 0.9, h: 0.9, altText: h, objectName: "mat-badge" + (i + 1) });
    txt(s, h, { x: 6.45, y: y + 0.4, w: 2.85, h: 0.4, fontSize: 18, bold: true, color: C.accent1 });
    txt(s, t, { x: 6.45, y: y + 0.85, w: 2.85, h: 0.65, fontSize: 12, color: C.accent6 });
  });
}

// ============ 8. 단체 공급 안내 ============
{
  const s = content("단체 공급 · 입점 안내", "B2B",
    "B2B 단가는 수량별 개별 견적. 소비자가는 참고용.");
  const cols = [
    ["01", "공급 대상", ["외식 프랜차이즈", "급식", "리테일 매장"]],
    ["02", "공급 방식", ["단체 구매", "직원 지급", "유통 입점"]],
    ["03", "단가 · 거래", ["수량별 개별 견적", "세금계산서 발행"]],
  ];
  cols.forEach(([n, h, items], i) => {
    const x = M + i * 3.05, w = 2.9;
    card(s, x, 1.3, w, 2.5, "b2b-card" + (i + 1));
    badge(s, n, x + 0.25, 1.55, 0.42, "b2b" + (i + 1));
    txt(s, h, { x: x + 0.25, y: 2.2, w: w - 0.5, h: 0.4, fontSize: 18, bold: true, color: C.background1 });
    txt(s, items.map((t, k) => ({ text: t, options: { breakLine: k < items.length - 1 } })), { x: x + 0.25, y: 2.7, w: w - 0.5, h: 0.95, fontSize: 14, color: C.accent6, paraSpaceAfter: 4 });
  });
  card(s, M, 4.05, 9, 0.85, "price-bar", C.accent5);
  txt(s, "소비자가", { x: M + 0.3, y: 4.05, w: 1.1, h: 0.85, fontSize: 14, bold: true, color: C.accent1, valign: "middle" });
  txt(s, "쿼드그립 종일편한 워킹화 42,500원   ·   쿼드그립 아치가득 인솔 21,500원", { x: M + 1.4, y: 4.05, w: 7.4, h: 0.85, fontSize: 14, color: C.background1, valign: "middle" });
}

// ============ 9. 2026 로드맵 ============
{
  const s = content("2026 로드맵", "로드맵",
    "일정은 변경될 수 있음.");
  const T = [
    ["11.11", "인솔 펀딩 OPEN", "쿼드그립 아치가득 인솔", true],
    ["11.12–15", "메가쇼 킨텍스", "부스에서 직접 신어 보기", false],
    ["11.20", "워킹화 예약구매 OPEN", "쿼드그립 종일편한 워킹화", true],
    ["11.26–29", "서울디자인페스티벌", "코엑스 · 부스 운영", false],
    ["12월", "워킹화 OPEN", "쿼드그립 종일편한 워킹화", true],
  ];
  const colW = 1.8;
  s.addShape(pres.ShapeType.line, { x: M + 0.1, y: 1.7, w: 8.6, h: 0, line: { color: C.accent5, width: 3 }, objectName: "timeline" });
  T.forEach(([d, h, sub, key], i) => {
    const x = M + i * colW;
    s.addShape(pres.ShapeType.ellipse, { x, y: 1.58, w: 0.24, h: 0.24, fill: { color: key ? C.accent1 : C.accent3 }, line: { color: key ? C.accent1 : C.accent3, width: 0 }, objectName: "node" + (i + 1) });
    txt(s, d, { x, y: 2.05, w: colW - 0.1, h: 0.5, fontSize: 22, bold: true, color: key ? C.accent1 : C.background1 });
    txt(s, h, { x, y: 2.65, w: colW - 0.15, h: 0.55, fontSize: 13, bold: true, color: C.background1 });
    txt(s, sub, { x, y: 3.3, w: colW - 0.15, h: 0.5, fontSize: 11, color: C.accent3 });
  });
  card(s, M, 3.95, 9, 0.6, "expo-bar", C.text2);
  txt(s, "2026.11  ㈜라라슈 법인 설립 예정", { x: M, y: 4.72, w: 9, h: 0.25, fontSize: 11, color: C.accent3 });
  txt(s, "박람회 현장에서 실물을 보고 상담하세요  ·  메가쇼(킨텍스) · 서울디자인페스티벌(코엑스)", { x: M + 0.3, y: 3.95, w: 8.4, h: 0.6, fontSize: 13, color: C.background1, valign: "middle" });
}

// ============ 10. 연락처 ============
{
  pres.addSection({ title: "연락처" });
  const s = pres.addSlide({ masterName: "COVER", sectionTitle: "연락처" });
  s.addNotes("단체 구매·입점 문의 안내.");
  s.addImage({ path: img("logo-lime.png"), x: M, y: 0.45, w: 0.85, h: 0.85 * 481 / 587, altText: "RS 로고", objectName: "logo" });
  txt(s, "Made for Standing.", { x: M, y: 1.75, w: 5, h: 0.4, fontSize: 20, bold: true, color: C.accent1 });
  txt(s, "단체 구매 · 입점 · 제휴 문의", { x: M, y: 2.35, w: 5, h: 0.4, fontSize: 18, bold: true, color: C.background1 });
  txt(s, "rndceo@rndmakers.kr", { x: M, y: 2.95, w: 5, h: 0.5, fontSize: 24, bold: true, color: C.accent1 });
  txt(s, "RhaRa Shoe 라라슈  ·  ㈜알앤디메이커스", { x: M, y: 3.7, w: 5, h: 0.3, fontSize: 12, color: C.accent6 });
  txt(s, "2026.11.11 인솔 OPEN  ·  11.12–15 메가쇼  ·  11.26–29 서울디자인페스티벌", { x: M, y: 4.1, w: 5.2, h: 0.5, fontSize: 11, color: C.accent3 });
  card(s, 6.1, 1.45, 3.4, 3.4, "qr-card");
  s.addShape(pres.ShapeType.rect, { x: 6.55, y: 1.8, w: 2.5, h: 2.5, fill: { color: C.background1 }, line: { color: C.background1, width: 0 }, objectName: "qr-bg" });
  s.addImage({ path: img("qr-b2b.png"), x: 6.65, y: 1.9, w: 2.3, h: 2.3, altText: "단체 구매·입점 문의 QR", objectName: "qr" });
  txt(s, "rharashoe.netlify.app", { x: 6.1, y: 4.4, w: 3.4, h: 0.3, fontSize: 12, color: C.accent6, align: "center" });
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("written", OUT);
})();
