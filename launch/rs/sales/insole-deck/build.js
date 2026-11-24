// 쿼드그립 아치가득 인솔 — B2B 상품소개서 (공급가 포함) · 자사몰 디자인 토큰 동일
const pptxgen = require("pptxgenjs");
const D = __dirname + "/", CARD = D + "cards/", R = "/home/user/harness-system/launch/rs/";
const LOGO = R + "design/fair-print/assets/rs-logo-lime.png", DOC = R + "sales/deck-v3/cards/doctor.png";
const C = { ink: "0B0F0C", forest: "0D1B14", card: "14281D", line: "2C4A37", lime: "C6F432", white: "FFFFFF", paper: "F6F7F4", sub: "9FB3A6", gray: "5F6B64", mute: "3A4A40" };
const F = "맑은 고딕", W = 13.33, M = 0.7;
const p = new pptxgen(); p.layout = "LAYOUT_WIDE"; p.title = "RHARA SHOE 쿼드그립 아치가득 인솔 — 상품소개서";
const t = (s, x, y, w, h, txt, o) => s.addText(txt, Object.assign({ x, y, w, h, fontFace: F, color: C.white, margin: 0, valign: "top" }, o));
const eyebrow = (s, x, y, txt, color) => t(s, x, y, 7, 0.3, txt, { fontSize: 10, bold: true, color, charSpacing: 3 });
const pill = (s, x, y, w, txt, fill, color) => { s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.36, rectRadius: 0.18, fill: { color: fill }, line: { color: fill, width: 0 } }); t(s, x, y + 0.06, w, 0.26, txt, { fontSize: 10.5, bold: true, color, align: "center" }); };
const box = (s, x, y, w, h, fill, line) => s.addShape(p.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.22, fill: { color: fill }, line: { color: line || fill, width: 0.75 } });
const foot = (s, n, dark) => t(s, M, 7.08, 8, 0.25, `RHARA SHOE · 쿼드그립 아치가득 인솔 상품소개서   ${String(n).padStart(2, "0")}`, { fontSize: 8.5, color: dark ? C.sub : C.gray, charSpacing: 1 });
const img = (s, name, x, y, w, h) => s.addImage({ path: CARD + name + ".png", x, y, w, h });
const bg = (s, c) => (s.background = { color: c });
let s, n = 0;

// 01 표지
s = p.addSlide(); bg(s, C.forest); n++;
s.addImage({ path: LOGO, x: M, y: 0.45, w: 0.72, h: 0.6 });
eyebrow(s, W - 3.2, 0.6, "PRODUCT INTRODUCTION", C.sub);
img(s, "cover", 7.25, 0.7, 5.3, 5.9);
eyebrow(s, M, 2.2, "RHARA SHOE · 쿼드그립 아치가득 인솔", C.lime);
t(s, M, 2.6, 6.6, 2.2, "신던 신발 그대로,\n바닥만 바꿉니다.", { fontSize: 44, bold: true, lineSpacingMultiple: 1.1 });
t(s, M, 4.6, 6.3, 1.0, "쓰던 깔창 밑에 한 장 까는 반굽 인솔\n오래 서고 오래 걷는 사람의 하루를 위해", { fontSize: 15, color: C.sub, lineSpacingMultiple: 1.35 });
pill(s, M, 5.75, 2.3, "정형외과 전문의 설계 자문", C.lime, C.ink);
pill(s, M + 2.45, 5.75, 1.7, "MADE IN KOREA", C.card, C.white);

// 02 왜 필요한가
s = p.addSlide(); bg(s, C.paper); n++;
eyebrow(s, M, 0.6, "WHY · 왜 이 인솔인가", C.gray);
t(s, M, 0.95, 7.2, 1.6, "신발 바닥은 평평한데,\n발바닥은 평평하지 않습니다.", { fontSize: 32, bold: true, color: C.ink, lineSpacingMultiple: 1.1 });
t(s, M, 2.55, 6.6, 1.2, "대부분의 신발 깔창은 평평해서 아치 아래가 떠 있습니다.\n아치가득 인솔은 그 빈 곳을 채워, 발바닥이 닿는 면을 넓힙니다.", { fontSize: 14, color: C.mute, lineSpacingMultiple: 1.4 });
[["오래 서서 일하는 분", "매장 · 주방 · 병원 · 물류 · 미용"], ["오래 걷는 분", "여행 · 출퇴근 · 산책"], ["신발을 바꾸기 싫은 분", "아끼는 운동화 · 근무화 그대로"]].forEach((q, i) => { const y = 3.95 + i * 0.95;
  box(s, M, y, 6.4, 0.8, C.white, "DADFD9"); s.addShape(p.ShapeType.ellipse, { x: M + 0.3, y: y + 0.29, w: 0.22, h: 0.22, fill: { color: C.lime }, line: { width: 0, color: C.lime } });
  t(s, M + 0.75, y + 0.15, 2.6, 0.5, q[0], { fontSize: 15, bold: true, color: C.ink }); t(s, M + 3.3, y + 0.19, 3.0, 0.45, q[1], { fontSize: 12, color: C.gray }); });
img(s, "sneaker", 7.35, 1.2, 5.6, 3.98);
t(s, 7.75, 5.55, 5.0, 0.8, "운동화 · 워킹화 · 근무화 안에\n지금 쓰는 깔창과 함께", { fontSize: 13, color: C.gray, lineSpacingMultiple: 1.3 });
foot(s, n);

// 03 제품 한눈에
s = p.addSlide(); bg(s, C.forest); n++;
img(s, "main", 0.35, 0.65, 5.6, 6.3);
eyebrow(s, 6.5, 0.85, "PRODUCT · 제품 한눈에", C.lime);
t(s, 6.5, 1.2, 6.2, 0.8, "쿼드그립 아치가득 인솔", { fontSize: 30, bold: true });
t(s, 6.5, 1.95, 6, 0.4, "권장 소비자가 21,500원 (1켤레)", { fontSize: 15, bold: true, color: C.lime });
const spec = [["사이즈", "M 15cm — 신발 220~255mm\nL 17cm — 신발 260~290mm"], ["길이", "반굽 (뒤꿈치~아치)"], ["두께", "뒤꿈치 3mm · 아치 최고 15mm"], ["컬러", "그레이 · 모카무스"], ["사용법", "쓰던 깔창 밑에 깔기 · 자를 필요 없음"], ["제조", "대한민국"]];
let yy = 2.65; spec.forEach(r => { const h = r[1].includes("\n") ? 0.78 : 0.5;
  s.addShape(p.ShapeType.line, { x: 6.5, y: yy, w: 6.1, h: 0, line: { color: C.line, width: 0.75 } });
  t(s, 6.5, yy + 0.13, 1.4, 0.4, r[0], { fontSize: 13, bold: true, color: C.sub }); t(s, 8.0, yy + 0.13, 4.6, h, r[1], { fontSize: 13.5, lineSpacingMultiple: 1.25 }); yy += h + 0.12; });
foot(s, n, true);

// 04 기능
s = p.addSlide(); bg(s, C.forest); n++;
eyebrow(s, M, 0.6, "FUNCTION · 기능", C.lime);
t(s, M, 0.95, 7, 0.8, "작은 한 장에 담은 네 가지", { fontSize: 30, bold: true });
img(s, "cut", 7.6, 0.45, 5.2, 4.45);
const fn = [["01", "아치가득 구조", "아치 라인을 따라 높이를 올려\n신발 속 떠 있던 아치 아래를 채웁니다. (최고 15mm)"], ["02", "뒤꿈치 링 컵", "가운데를 비운 링 형태의 컵이\n뒤꿈치를 둥글게 감쌉니다. (뒤꿈치 3mm)"], ["03", "반굽 길이", "뒤꿈치부터 아치까지만 오는 길이라\n앞쪽 공간이 그대로, 자를 필요가 없습니다."], ["04", "리브 패턴 · 통기 구멍", "윗면 가로 리브 패턴과 뚫린 뒤꿈치 구조로\n쓰던 깔창 밑에 겹쳐 까는 형태입니다."]];
fn.forEach((q, i) => { const x = M + (i % 2) * 3.4, y = 2.0 + Math.floor(i / 2) * 2.45;
  box(s, x, y, 3.25, 2.3, C.card, C.line);
  t(s, x + 0.3, y + 0.25, 1, 0.45, q[0], { fontSize: 18, bold: true, color: C.lime }); t(s, x + 0.3, y + 0.75, 2.8, 0.45, q[1], { fontSize: 15.5, bold: true });
  t(s, x + 0.3, y + 1.25, 2.8, 1.0, q[2], { fontSize: 10.5, color: C.sub, lineSpacingMultiple: 1.3 }); });
box(s, 7.95, 5.3, 4.6, 1.3, C.card, C.line);
t(s, 8.25, 5.5, 4.1, 1.0, "족저압 실험 완료\n한국소재융합연구원 E-2026-0095", { fontSize: 13, bold: true, lineSpacingMultiple: 1.35 });
foot(s, n, true);

// 05 사용법
s = p.addSlide(); bg(s, C.paper); n++;
eyebrow(s, M, 0.6, "HOW TO USE · 사용법", C.gray);
t(s, M, 0.95, 12, 0.8, "깔창을 들고, 깔고, 덮으면 끝.", { fontSize: 30, bold: true, color: C.ink });
img(s, "step_before", M - 0.25, 2.0, 5.9, 4.19); img(s, "step_after", 6.85, 2.0, 5.9, 4.19);
pill(s, M + 0.35, 2.5, 1.2, "BEFORE", C.white, C.ink); pill(s, 7.45, 2.5, 1.2, "AFTER", C.lime, C.ink);
[["STEP 1", "신발 속 깔창을 들어 올립니다"], ["STEP 2", "그 밑에 인솔을 한 장 깝니다"], ["STEP 3", "깔창을 다시 덮고 신습니다"]].forEach((q, i) => { const x = M + i * 4.05;
  t(s, x, 6.2, 1.0, 0.35, q[0], { fontSize: 12, bold: true, color: C.forest }); t(s, x + 0.95, 6.2, 3.0, 0.35, q[1], { fontSize: 12.5, color: C.mute }); });
t(s, M, 6.62, 12, 0.3, "매장 시연 · 라이브 방송에서 10초 안에 보여 줄 수 있는 제품입니다.", { fontSize: 11, bold: true, color: C.gray });
foot(s, n);

// 06 족저압 분포
s = p.addSlide(); bg(s, C.forest); n++;
eyebrow(s, M, 0.6, "PRESSURE MAP · 족저압 분포", C.lime);
t(s, M, 0.95, 12, 1.2, "깔기 전과 후,\n발바닥이 닿는 자리가 달라졌습니다.", { fontSize: 26, bold: true, lineSpacingMultiple: 1.1 });
const ph = 2.2, pw = ph * 1584 / 687;
[["BEFORE", "맨발", "pm_before", 2.2], ["AFTER", "아치가득 인솔", "pm_after", 4.4]].forEach(r => {
  t(s, M, r[3] + 0.75, 1.8, 0.3, r[0], { fontSize: 11, bold: true, color: r[0] == "AFTER" ? C.lime : C.sub, charSpacing: 2 }); t(s, M, r[3] + 1.05, 1.8, 0.6, r[1], { fontSize: 15, bold: true });
  img(s, r[2], 2.2, r[3], pw, ph); });
[["POINT 01", "비어 있던 아치 아래까지\n닿습니다", "맨발에서 끊겨 있던 가운데 부분이\n인솔 위에서는 이어집니다."], ["POINT 02", "압력이 한곳에\n덜 몰립니다", "주황·빨간 구간이 줄고\n파란·초록 구간이 넓어졌습니다."]].forEach((q, i) => { const y = 2.45 + i * 2.2;
  box(s, 7.75, y, 4.85, 1.95, C.card, C.line);
  t(s, 8.05, y + 0.22, 2, 0.3, q[0], { fontSize: 10, bold: true, color: C.lime, charSpacing: 2 }); t(s, 8.05, y + 0.5, 4.4, 0.75, q[1], { fontSize: 15, bold: true, lineSpacingMultiple: 1.15 }); t(s, 8.05, y + 1.25, 4.4, 0.6, q[2], { fontSize: 10.5, color: C.sub, lineSpacingMultiple: 1.25 }); });
t(s, M, 6.78, 12, 0.25, "※ 한국소재융합연구원 실험보고서 E-2026-0095(2026.11) · 맨발 대비 인솔 착용 · 피험자 1인 보행 3.8km/h · 족압분포도는 특정 보행 1회 결과이며 발 모양·걸음걸이·신발에 따라 다를 수 있습니다. B2B 검토용.", { fontSize: 9, color: C.sub });
foot(s, n, true);

// 07 정형외과 전문의 설계 자문
s = p.addSlide(); bg(s, C.paper); n++;
eyebrow(s, M, 0.6, "DESIGN ADVISORY · 설계 자문", C.gray);
t(s, M, 0.95, 9, 1.6, "형태와 신는 방식,\n만들기 전부터 정형외과 전문의와 함께 봤습니다.", { fontSize: 30, bold: true, color: C.ink, lineSpacingMultiple: 1.1 });
box(s, M, 2.85, 5.4, 3.7, C.forest);
s.addImage({ path: DOC, x: M + 0.45, y: 3.25, w: 1.6, h: 1.6 });
t(s, M + 2.3, 3.45, 3.0, 0.4, "이문홍 원장", { fontSize: 22, bold: true });
t(s, M + 2.3, 3.95, 3.0, 0.4, "정형외과 전문의 · 설계 자문", { fontSize: 13, color: C.lime, bold: true });
t(s, M + 0.45, 5.15, 4.6, 1.2, "발바닥이 신발에 닿는 방식을 함께 살피고,\n인솔의 형태와 까는 위치를 검토했습니다.", { fontSize: 14, lineSpacingMultiple: 1.35 });
[["01", "아치 라인", "발 안쪽 아치를 따라 높이가 올라가는 곡선 형태"], ["02", "뒤꿈치 컵", "뒤꿈치를 둥글게 감싸는 링 형태의 컵"], ["03", "까는 방식", "신발을 바꾸지 않고 쓰던 깔창 밑에 까는 방식"]].forEach((q, i) => { const x = 6.5, y = 2.85 + i * 1.25;
  box(s, x, y, 6.13, 1.1, C.white, "DADFD9");
  t(s, x + 0.3, y + 0.3, 0.6, 0.5, q[0], { fontSize: 18, bold: true, color: C.forest }); t(s, x + 1.0, y + 0.2, 5, 0.4, q[1], { fontSize: 15, bold: true, color: C.ink }); t(s, x + 1.0, y + 0.6, 5, 0.35, q[2], { fontSize: 11.5, color: C.gray }); });
t(s, M, 6.75, 12, 0.25, "※ 이문홍 원장은 제품 설계 자문에 참여하고 자문료를 받았습니다.", { fontSize: 9.5, color: C.gray });
foot(s, n);

// 08 판매 검증 · 패키지
s = p.addSlide(); bg(s, C.forest); n++;
eyebrow(s, M, 0.6, "PROOF · 판매 검증", C.lime);
t(s, M, 0.95, 7, 0.8, "현장에서 먼저 팔렸습니다.", { fontSize: 30, bold: true });
[["63켤레", "킨텍스 메가쇼 4일 현장 판매", "2026.11 · 오프라인 현장 판매"], ["11.25", "와디즈 펀딩 오픈", "온라인 첫 판매 · 리뷰 확보"], ["3건", "KIMC 제품 시험 완료", "족저압 실험(E-2026-0095) · 폼 시트 물성 포함"]].forEach((q, i) => { const y = 2.0 + i * 1.55;
  box(s, M, y, 6.3, 1.38, C.card, C.line);
  t(s, M + 0.35, y + 0.28, 2.3, 0.8, q[0], { fontSize: 32, bold: true, color: C.lime }); t(s, M + 2.75, y + 0.3, 3.4, 0.4, q[1], { fontSize: 14.5, bold: true }); t(s, M + 2.75, y + 0.75, 3.4, 0.4, q[2], { fontSize: 10.5, color: C.sub }); });
img(s, "pack", 7.15, 1.0, 5.7, 4.57);
t(s, 7.6, 5.75, 5.0, 0.8, "단품 박스 패키지 · 매장 진열 가능\nMOQ 이상이면 채널 전용 패키지 협의", { fontSize: 12.5, color: C.sub, lineSpacingMultiple: 1.35 });
foot(s, n, true);

// 09 공급 조건
s = p.addSlide(); bg(s, C.paper); n++;
eyebrow(s, M, 0.6, "SUPPLY TERMS · 공급 조건", C.gray);
const pr = [["권장 소비자가", "21,500원", "부가세 포함 · 1켤레", C.white, C.ink, C.gray], ["공급가", "10,750원", "부가세 포함 · 소비자가의 50%", C.forest, C.lime, C.sub], ["판매처 이익", "10,750원", "1켤레당 · 이익률 50%", C.lime, C.ink, C.mute]];
pr.forEach((q, i) => { const x = M + i * 4.05; box(s, x, 1.3, 3.85, 2.0, q[3], q[3] == C.white ? "DADFD9" : q[3]);
  t(s, x + 0.35, 1.55, 3.2, 0.35, q[0], { fontSize: 13, bold: true, color: q[5] }); t(s, x + 0.35, 2.0, 3.3, 0.8, q[1], { fontSize: 34, bold: true, color: q[4] }); t(s, x + 0.35, 2.8, 3.3, 0.35, q[2], { fontSize: 10.5, color: q[5] }); });
t(s, M, 3.4, 12, 0.3, "공급가액 9,773원 + 부가세 977원 = 10,750원 (세금계산서 발행)", { fontSize: 10.5, color: C.gray });
const terms = [["출고", "판매처 선입고 기준 · 위탁배송(직출고)은 배송비 별도 협의"], ["패키지", "단품 박스 · MOQ 이상 채널 전용 구성(2켤레 세트 등) 협의"], ["채널", "편의점·역사 매장 · 복지몰·특판 · 라이브커머스 · 수출"]];
terms.forEach((r, i) => { const y = 4.1 + i * 0.55; t(s, M, y, 1.6, 0.4, r[0], { fontSize: 13, bold: true, color: C.forest }); t(s, M + 1.6, y, 10.5, 0.4, r[1], { fontSize: 13, color: C.mute }); });
box(s, M, 6.55, 11.93, 0.42, C.forest);
t(s, M + 0.3, 6.64, 11.4, 0.3, "알앤디메이커스 주식회사 · 신동규 대표이사 · rndceo@rndmakers.kr · rndmakers.kr", { fontSize: 11.5, bold: true, color: C.lime });
foot(s, n);

p.writeFile({ fileName: D + "RHARA_SHOE_아치가득인솔_상품소개서.pptx" }).then(f => console.log("saved", f));
