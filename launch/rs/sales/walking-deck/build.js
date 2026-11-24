// 쿼드그립 종일편한 워킹화 — B2B 상품소개서 · 인솔 소개서와 같은 디자인 토큰
const pptxgen = require("pptxgenjs");
const D = __dirname + "/", CARD = D + "cards/", R = "/home/user/harness-system/launch/rs/";
const LOGO = R + "design/fair-print/assets/rs-logo-lime.png", DOC = R + "sales/deck-v3/cards/doctor.png";
const C = { ink: "0B0F0C", forest: "0D1B14", card: "14281D", line: "2C4A37", lime: "C6F432", white: "FFFFFF", paper: "F6F7F4", sub: "9FB3A6", gray: "5F6B64", mute: "3A4A40" };
const F = "맑은 고딕", W = 13.33, M = 0.7;
const p = new pptxgen(); p.layout = "LAYOUT_WIDE"; p.title = "RHARA SHOE 쿼드그립 종일편한 워킹화 — 상품소개서";
const t = (s, x, y, w, h, txt, o) => s.addText(txt, Object.assign({ x, y, w, h, fontFace: F, color: C.white, margin: 0, valign: "top" }, o));
const eyebrow = (s, x, y, txt, color) => t(s, x, y, 7, 0.3, txt, { fontSize: 10, bold: true, color, charSpacing: 3 });
const pill = (s, x, y, w, txt, fill, color) => { s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.36, rectRadius: 0.18, fill: { color: fill }, line: { color: fill, width: 0 } }); t(s, x, y + 0.06, w, 0.26, txt, { fontSize: 10.5, bold: true, color, align: "center" }); };
const box = (s, x, y, w, h, fill, line) => s.addShape(p.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.22, fill: { color: fill }, line: { color: line || fill, width: 0.75 } });
const foot = (s, n, dark) => t(s, M, 7.08, 8, 0.25, `RHARA SHOE · 쿼드그립 종일편한 워킹화 상품소개서   ${String(n).padStart(2, "0")}`, { fontSize: 8.5, color: dark ? C.sub : C.gray, charSpacing: 1 });
const img = (s, name, x, y, w, h) => s.addImage({ path: CARD + name + ".png", x, y, w, h });
const bg = (s, c) => (s.background = { color: c });
let s, n = 0;

// 01 표지
s = p.addSlide(); bg(s, C.forest); n++;
s.addImage({ path: LOGO, x: M, y: 0.45, w: 0.72, h: 0.6 });
eyebrow(s, W - 3.2, 0.6, "PRODUCT INTRODUCTION", C.sub);
img(s, "cover", 7.25, 0.7, 5.3, 5.9);
eyebrow(s, M, 2.2, "RHARA SHOE · 쿼드그립 종일편한 워킹화", C.lime);
t(s, M, 2.6, 6.6, 2.2, "깔창이 빠지지 않는,\n서서 일하는 신발.", { fontSize: 44, bold: true, lineSpacingMultiple: 1.1 });
t(s, M, 4.6, 6.3, 1.0, "바닥에 닿는 네 곳만 다시 설계한 슬립온 워킹화\n매장 · 주방 · 병원 · 물류, 오래 서는 하루를 위해", { fontSize: 15, color: C.sub, lineSpacingMultiple: 1.35 });
pill(s, M, 5.75, 2.3, "정형외과 전문의 설계 자문", C.lime, C.ink);
pill(s, M + 2.45, 5.75, 1.7, "MADE IN KOREA", C.card, C.white);

// 02 왜
s = p.addSlide(); bg(s, C.paper); n++;
eyebrow(s, M, 0.6, "WHY · 시작", C.gray);
t(s, M, 0.95, 7, 1.6, "\"깔창이 자꾸\n딸려 나와요.\"", { fontSize: 36, bold: true, color: C.ink, lineSpacingMultiple: 1.1 });
t(s, M, 2.75, 6.4, 1.3, "서서 일하는 사람에게 신발은 도구입니다.\n신고 벗을 때마다 깔창이 빠지고, 젖은 바닥에서 미끄러지면 일이 멈춥니다.\n그래서 바닥에 닿는 부분부터 다시 만들었습니다.", { fontSize: 13.5, color: C.mute, lineSpacingMultiple: 1.4 });
[["식당 · 주방", "젖은 바닥, 하루 종일 서서"], ["매장 · 병원", "신고 벗기 잦은 근무화"], ["물류 · 현장", "걷고 서기를 반복하는 일"]].forEach((q, i) => { const y = 4.3 + i * 0.85;
  box(s, M, y, 6.4, 0.72, C.white, "DADFD9"); s.addShape(p.ShapeType.ellipse, { x: M + 0.3, y: y + 0.25, w: 0.22, h: 0.22, fill: { color: C.lime }, line: { width: 0, color: C.lime } });
  t(s, M + 0.75, y + 0.13, 2.6, 0.5, q[0], { fontSize: 15, bold: true, color: C.ink }); t(s, M + 3.1, y + 0.17, 3.2, 0.45, q[1], { fontSize: 12, color: C.gray }); });
img(s, "onfoot", 7.3, 1.2, 5.6, 4.18);
foot(s, n);

// 03 제품 한눈에
s = p.addSlide(); bg(s, C.forest); n++;
img(s, "main", 0.35, 0.65, 5.6, 6.3);
eyebrow(s, 6.5, 0.85, "PRODUCT · 제품 한눈에", C.lime);
t(s, 6.5, 1.2, 6.2, 0.8, "쿼드그립 종일편한 워킹화", { fontSize: 30, bold: true });
t(s, 6.5, 1.95, 6, 0.4, "권장 소비자가 42,500원 (1켤레)", { fontSize: 15, bold: true, color: C.lime });
const spec = [["사이즈", "230~280mm (10mm 단위)"], ["컬러", "차콜 · 그레이 · 민트화이트"], ["무게", "한쪽 257g (270mm 기준)"], ["형태", "슬립온 클로그 · 깔창 없는 일체형 안창"], ["소재", "본체·밑창 합성수지(E-실리폴리렌: EVA·실리콘 배합)\n그립 패드: 재생고무 · 재생 PVC 일부 배합"], ["제조", "대한민국"]];
let yy = 2.65; spec.forEach(r => { const h = r[1].includes("\n") ? 0.78 : 0.5;
  s.addShape(p.ShapeType.line, { x: 6.5, y: yy, w: 6.1, h: 0, line: { color: C.line, width: 0.75 } });
  t(s, 6.5, yy + 0.13, 1.4, 0.4, r[0], { fontSize: 13, bold: true, color: C.sub }); t(s, 8.0, yy + 0.13, 4.6, h, r[1], { fontSize: 13, lineSpacingMultiple: 1.25 }); yy += h + 0.12; });
foot(s, n, true);

// 04 쿼드그립
s = p.addSlide(); bg(s, C.forest); n++;
img(s, "sole", 0.35, 0.6, 6.1, 6.1);
eyebrow(s, 7.0, 0.95, "QUAD GRIP · 쿼드그립", C.lime);
t(s, 7.0, 1.3, 5.8, 1.5, "바닥에 닿는 4곳만,\n따로 만들었습니다.", { fontSize: 32, bold: true });
[["01", "뒤꿈치 중앙", "처음 닿는 곳"], ["02", "후족부 바깥", "이어서 닿는 곳"], ["03", "앞꿈치 바깥", "앞으로 구르는 곳"], ["04", "엄지 볼", "마지막에 밀어내는 곳"]].forEach((q, i) => { const x = 7.0 + (i % 2) * 2.95, y = 3.0 + Math.floor(i / 2) * 1.2;
  box(s, x, y, 2.8, 1.05, C.card, C.line);
  t(s, x + 0.25, y + 0.2, 0.6, 0.4, q[0], { fontSize: 16, bold: true, color: C.lime }); t(s, x + 0.85, y + 0.18, 1.9, 0.35, q[1], { fontSize: 14, bold: true }); t(s, x + 0.85, y + 0.58, 1.9, 0.3, q[2], { fontSize: 10.5, color: C.sub }); });
t(s, 7.0, 5.55, 5.8, 1.0, "걸을 때 발이 바닥에 닿는 순서를 따라 패드를 배치했습니다.\n특허 출원 제10-2026-0211466호 (우선심사 신청)\n디자인 등록 제30-1366495호", { fontSize: 11.5, color: C.sub, lineSpacingMultiple: 1.35 });
foot(s, n, true);

// 05 기능
s = p.addSlide(); bg(s, C.paper); n++;
eyebrow(s, M, 0.6, "FUNCTION · 기능", C.gray);
t(s, M, 0.95, 12, 0.8, "서서 일하는 하루에 맞춘 네 가지", { fontSize: 30, bold: true, color: C.ink });
[["01", "일체형 안창", "깔창이 따로 없어\n신고 벗을 때 딸려 나오지 않습니다."], ["02", "한쪽 257g", "270mm 기준.\n하루 1만 보면 신발 무게도 1만 번."], ["03", "도톰한 입구 테두리", "발목 입구를 두툼하게 마감해\n신고 벗을 때 닿는 느낌을 줄였습니다."], ["04", "물로 헹구는 관리", "합성수지 일체형 구조라\n오염된 날은 물로 헹궈 말립니다."]].forEach((q, i) => { const x = M + i * 3.03;
  box(s, x, 2.1, 2.85, 3.6, C.white, "DADFD9");
  t(s, x + 0.3, 2.4, 1, 0.5, q[0], { fontSize: 22, bold: true, color: C.forest }); t(s, x + 0.3, 3.05, 2.4, 0.5, q[1], { fontSize: 16, bold: true, color: C.ink });
  t(s, x + 0.3, 3.7, 2.4, 1.6, q[2], { fontSize: 11.5, color: C.gray, lineSpacingMultiple: 1.35 }); });
t(s, M, 6.1, 12, 0.6, "슬립온 클로그 형태 · 신발 끈 없음 · 작업화처럼 투박하지 않은 데일리 디자인", { fontSize: 12.5, bold: true, color: C.mute });
foot(s, n);

// 06 컬러
s = p.addSlide(); bg(s, C.forest); n++;
eyebrow(s, M, 0.6, "COLORS · 3컬러", C.lime);
t(s, M, 0.95, 12, 0.8, "차콜 · 민트화이트 · 그레이", { fontSize: 30, bold: true });
img(s, "colors", 0.75, 1.75, 11.83, 5.86 * 0.94 * 0.97);
foot(s, n, true);

// 07 설계 자문
s = p.addSlide(); bg(s, C.paper); n++;
eyebrow(s, M, 0.6, "DESIGN ADVISORY · 설계 자문", C.gray);
t(s, M, 0.95, 9, 1.6, "패드 위치 하나까지,\n정형외과 전문의와 함께 봤습니다.", { fontSize: 30, bold: true, color: C.ink, lineSpacingMultiple: 1.1 });
box(s, M, 2.85, 5.4, 3.7, C.forest);
s.addImage({ path: DOC, x: M + 0.45, y: 3.25, w: 1.6, h: 1.6 });
t(s, M + 2.3, 3.45, 3.0, 0.4, "이문홍 원장", { fontSize: 22, bold: true });
t(s, M + 2.3, 3.95, 3.0, 0.4, "정형외과 전문의 · 설계 자문", { fontSize: 13, color: C.lime, bold: true });
t(s, M + 0.45, 5.15, 4.6, 1.2, "걸을 때 발바닥 압력이 지나는 길을 함께 살피고,\n그립 패드 4곳의 위치를 검토했습니다.", { fontSize: 14, lineSpacingMultiple: 1.35 });
[["01", "보행 경로 검토", "뒤꿈치 → 바깥쪽 → 앞꿈치 → 엄지 볼, 발이 닿는 순서"], ["02", "패드 위치 조정", "닿는 순서를 따라 4곳 배치, 고치고 또 고쳐 완성"], ["03", "근무화 형태 검토", "깔창이 빠지지 않는 일체형 안창 구조"]].forEach((q, i) => { const x = 6.5, y = 2.85 + i * 1.25;
  box(s, x, y, 6.13, 1.1, C.white, "DADFD9");
  t(s, x + 0.3, y + 0.3, 0.6, 0.5, q[0], { fontSize: 18, bold: true, color: C.forest }); t(s, x + 1.0, y + 0.2, 5, 0.4, q[1], { fontSize: 15, bold: true, color: C.ink }); t(s, x + 1.0, y + 0.6, 5, 0.35, q[2], { fontSize: 11.5, color: C.gray }); });
t(s, M, 6.75, 12, 0.25, "※ 이문홍 원장은 제품 설계 자문에 참여하고 자문료를 받았습니다.", { fontSize: 9.5, color: C.gray });
foot(s, n);

// 08 시험 · 런칭
s = p.addSlide(); bg(s, C.forest); n++;
eyebrow(s, M, 0.6, "TEST · LAUNCH", C.lime);
t(s, M, 0.95, 7, 0.8, "시험하고, 공개합니다.", { fontSize: 30, bold: true });
[["미끄럼 저항", "KS M ISO 13287 · 뒷굽\n글리세린 0.17 · 세제 0.36", "KIMC S-26-0313"], ["유해물질", "프탈레이트 · 납 · 카드뮴 · PAHs\n모두 검출 안 됨", "KIMC A-26-0929"], ["11.26~29", "서울디자인페스티벌 2026\n코엑스 A홀에서 첫 공개", "현장 착화 가능"]].forEach((q, i) => { const y = 2.0 + i * 1.55;
  box(s, M, y, 6.3, 1.38, C.card, C.line);
  t(s, M + 0.35, y + 0.3, 2.3, 0.8, q[0], { fontSize: i == 2 ? 26 : 19, bold: true, color: C.lime }); t(s, M + 2.75, y + 0.25, 3.4, 0.8, q[1], { fontSize: 12.5, bold: true, lineSpacingMultiple: 1.25 }); t(s, M + 2.75, y + 0.95, 3.4, 0.3, q[2], { fontSize: 10, color: C.sub }); });
img(s, "pair", 7.3, 0.85, 5.3, 5.9);
t(s, M, 6.72, 12, 0.3, "※ 시험 결과는 B2B 검토용입니다(시험기관 사전 동의 없이 광고 사용 불가). 미끄럼 결과는 시험 조건에서의 수치이며 미끄럼 없음을 보장하지 않습니다.", { fontSize: 8.5, color: C.sub });
foot(s, n, true);

// 09 공급 조건
s = p.addSlide(); bg(s, C.paper); n++;
eyebrow(s, M, 0.6, "SUPPLY TERMS · 공급 조건", C.gray);
[["권장 소비자가", "42,500원", "부가세 포함 · 1켤레", C.white, C.ink, C.gray]].forEach((q, i) => { const x = M + i * 4.05; box(s, x, 1.3, 3.85, 2.0, q[3], q[3] == C.white ? "DADFD9" : q[3]);
  t(s, x + 0.35, 1.55, 3.2, 0.35, q[0], { fontSize: 13, bold: true, color: q[5] }); t(s, x + 0.35, 2.0, 3.3, 0.8, q[1], { fontSize: 34, bold: true, color: q[4] }); t(s, x + 0.35, 2.8, 3.3, 0.35, q[2], { fontSize: 10.5, color: q[5] }); });
[["출고", "판매처 선입고 기준 · 위탁배송(직출고)은 배송비 별도 협의"], ["패키지", "단품 박스 · 채널 전용 구성 협의"], ["채널", "근무화(단체 구매) · 복지몰·특판 · 매장 · 라이브커머스 · 수출"], ["납기", "발주 확정 후 생산 일정 협의"]].forEach((r, i) => { const y = 3.8 + i * 0.55; t(s, M, y, 1.6, 0.4, r[0], { fontSize: 13, bold: true, color: C.forest }); t(s, M + 1.6, y, 10.5, 0.4, r[1], { fontSize: 13, color: C.mute }); });
box(s, M, 6.55, 11.93, 0.42, C.forest);
t(s, M + 0.3, 6.64, 11.4, 0.3, "알앤디메이커스 주식회사 · 신동규 대표이사 · rndceo@rndmakers.kr · rndmakers.kr", { fontSize: 11.5, bold: true, color: C.lime });
foot(s, n);

p.writeFile({ fileName: D + "RHARA_SHOE_종일편한워킹화_상품소개서.pptx" }).then(f => console.log("saved", f));
