// 알앤디메이커스 회사·상품 소개서 v3 — 자사몰 디자인(RS 차콜그린+라임 / re.feeel 라임+잉크, 둥근 카드·알약 버튼) 일관 적용
const pptxgen = require("pptxgenjs");
const D = __dirname + "/", CARD = D + "cards/", R = "/home/user/harness-system/launch/rs/";
const LOGO = { rf: R + "design/fair-print/assets/refeeel-logo.png", rs: R + "design/fair-print/assets/rs-logo-lime.png" };
const C = { ink: "0B0F0C", forest: "0D1B14", card: "14281D", line: "2C4A37", lime: "C6F432", white: "FFFFFF", paper: "F6F7F4", sub: "9FB3A6", gray: "5F6B64", mute: "3A4A40" };
const F = "맑은 고딕", W = 13.33, H = 7.5, M = 0.7;
const p = new pptxgen(); p.layout = "LAYOUT_WIDE"; p.title = "RHARA SHOE 라라슈 — 브랜드·상품 소개서";
const t = (s, x, y, w, h, txt, o) => s.addText(txt, Object.assign({ x, y, w, h, fontFace: F, color: C.white, margin: 0, valign: "top" }, o));
const eyebrow = (s, x, y, txt, color) => t(s, x, y, 6, 0.3, txt, { fontSize: 10, bold: true, color, charSpacing: 3 });
const pill = (s, x, y, w, txt, fill, color) => { s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.36, rectRadius: 0.18, fill: { color: fill }, line: { color: fill, width: 0 } }); t(s, x, y + 0.06, w, 0.26, txt, { fontSize: 10.5, bold: true, color, align: "center" }); };
const btn = (s, x, y, w, txt, dark) => { s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.5, rectRadius: 0.25, fill: { color: dark ? C.ink : C.lime }, line: { color: dark ? C.ink : C.lime, width: 0 } });
  t(s, x + 0.25, y + 0.13, w - 0.8, 0.3, txt, { fontSize: 12, bold: true, color: dark ? C.lime : C.ink });
  s.addShape(p.ShapeType.ellipse, { x: x + w - 0.45, y: y + 0.07, w: 0.36, h: 0.36, fill: { color: dark ? C.lime : C.ink }, line: { width: 0, color: dark ? C.lime : C.ink } });
  t(s, x + w - 0.45, y + 0.1, 0.36, 0.3, "→", { fontSize: 12, bold: true, color: dark ? C.ink : C.lime, align: "center" }); };
const bullets = (s, x, y, w, items, color, dot) => items.forEach((b, i) => { s.addShape(p.ShapeType.ellipse, { x, y: y + i * 0.34 + 0.1, w: 0.09, h: 0.09, fill: { color: dot }, line: { width: 0, color: dot } }); t(s, x + 0.22, y + i * 0.34, w - 0.22, 0.3, b, { fontSize: 11.5, color }); });
const foot = (s, n, dark) => t(s, M, 7.08, 8, 0.25, `RHARA SHOE · 브랜드·상품 소개서 2026   ${String(n).padStart(2, "0")}`, { fontSize: 8.5, color: dark ? C.sub : C.gray, charSpacing: 1 });
const bg = (s, color) => (s.background = { color });
const rfMark = (s, x, y, size) => t(s, x, y, 3, size / 50, "refeeel.", { fontSize: size, bold: true, color: C.ink, fontFace: "Arial Rounded MT Bold", charSpacing: -1 });

// 01 표지
s = p.addSlide(); bg(s, C.forest);
s.addImage({ path: LOGO.rs, x: M, y: 0.45, w: 0.72, h: 0.6 });
eyebrow(s, W - 3.0, 0.6, "SHOES & INSOLE", C.sub);
s.addImage({ path: CARD + "rs_onfoot.png", x: 7.4, y: 0.85, w: 4.9, h: 5.65 });
eyebrow(s, M, 2.55, "라라슈 · 서서 일하는 하루", C.lime);
t(s, M, 2.9, 7, 1.0, "Made for", { fontSize: 60, bold: true }); t(s, M, 3.85, 7, 1.0, "Standing.", { fontSize: 60, bold: true, color: C.lime });
t(s, M, 5.15, 6, 1.0, "식당·주방·매장·병원에서\n오래 서는 분들을 위한 신발과 인솔", { fontSize: 14, color: C.sub, lineSpacingMultiple: 1.3 });


// 02 브랜드 스토리
s = p.addSlide(); bg(s, C.paper);
eyebrow(s, M, 0.6, "BRAND STORY", C.gray);
t(s, M, 0.95, 7, 1.6, "\"깔창이 자꾸\n딸려 나와요.\"", { fontSize: 40, bold: true, color: C.ink });
t(s, M, 2.85, 6.2, 2.4, "서서 일하는 친구가 지나가듯 한 말이었습니다.\n하루 종일 서 있는 사람에게 신발은 도구입니다.\n\n그래서 바닥에 닿는 곳부터 다시 만들었습니다.\n깔창이 빠지지 않는 일체형 신발, 그리고 신던 신발에 한 장 까는 인솔.", { fontSize: 15, color: C.mute, lineSpacingMultiple: 1.35 });
s.addShape(p.ShapeType.roundRect, { x: 7.6, y: 0.95, w: 5.03, h: 5.6, rectRadius: 0.3, fill: { color: C.forest }, line: { width: 0, color: C.forest } });
s.addImage({ path: LOGO.rs, x: 8.0, y: 1.35, w: 0.72, h: 0.6 });
t(s, 8.0, 2.4, 4.3, 1.6, "Made for\nStanding.", { fontSize: 40, bold: true, color: C.lime });
t(s, 8.0, 4.3, 4.3, 1.6, "식당 · 주방 · 매장 · 병원\n오래 서는 사람의 하루를 위한\n신발과 인솔", { fontSize: 15, color: C.white, lineSpacingMultiple: 1.35 });
foot(s, 2);

// 03 숫자
s = p.addSlide(); bg(s, C.forest);
eyebrow(s, M, 0.6, "RHARA SHOE IN NUMBERS", C.lime);
t(s, M, 0.95, 12, 0.8, "숫자로 보는 라라슈", { fontSize: 32, bold: true });
[["63켤레", "메가쇼 4일 현장 판매", "아치가득 인솔 · 2026.11"], ["257g", "워킹화 한쪽 무게", "270mm 기준"], ["4점", "바닥에 닿는 곳만 그립 패드", "쿼드그립"], ["2 + 2", "디자인 등록 2 · 특허 출원 2", "워킹화 · 인솔"], ["3건", "제품 시험 완료", "미끄럼 저항 · 유해물질 · 소재 물성"], ["0개", "따로 빠지는 깔창", "일체형 안창"]].forEach((n, i) => { const x = M + (i % 3) * 4.05, y = 2.0 + Math.floor(i / 3) * 2.45;
  s.addShape(p.ShapeType.roundRect, { x, y, w: 3.85, h: 2.25, rectRadius: 0.25, fill: { color: C.card }, line: { color: C.line, width: 0.75 } });
  t(s, x + 0.35, y + 0.3, 3.3, 0.8, n[0], { fontSize: 36, bold: true, color: C.lime }); t(s, x + 0.35, y + 1.2, 3.3, 0.4, n[1], { fontSize: 14, bold: true }); t(s, x + 0.35, y + 1.6, 3.3, 0.35, n[2], { fontSize: 11, color: C.sub }); });
foot(s, 3, true);

// 04 RS 상품 카드 (자사몰 상품 카드 그대로)
s = p.addSlide(); bg(s, C.forest);
eyebrow(s, M, 0.55, "RHARA SHOE · PRODUCTS", C.lime);
t(s, M, 0.85, 12, 0.7, "바닥부터 다시 만든 두 가지", { fontSize: 28, bold: true });
const rsP = [["p_insole", "11.25 와디즈 펀딩", "쿼드그립 아치가득 인솔", "21,500원", ["아치 라인을 따라 빈 곳을 채운 형태", "가운데를 비운 링 컵이 뒤꿈치를 감쌈", "쓰던 깔창 밑에 한 장 — 자르지 않는 반굽"], "M 15cm(신발 220~255) · L 17cm(260~290) · 그레이 · 모카무스 · 대한민국 제조"],
 ["p_walk", "자사몰 판매", "쿼드그립 종일편한 워킹화", "42,500원", ["바닥에 닿는 길을 따라 그립 패드 4곳 배치", "깔창 없는 일체형 안창 — 따로 빠지는 깔창 없음", "도톰한 발목 입구 테두리 · 슬립온 클로그"], "230~280mm(10mm 단위) · 차콜 · 그레이 · 민트화이트 · 한쪽 257g(270mm) · 대한민국 제조"]];
rsP.forEach((q, i) => { const x = M + i * 6.05, y = 1.75, w = 5.85;
  s.addShape(p.ShapeType.roundRect, { x, y, w, h: 5.15, rectRadius: 0.3, fill: { color: C.card }, line: { color: C.line, width: 0.75 } });
  s.addImage({ path: CARD + q[0] + ".png", x, y, w, h: 2.25 });
  pill(s, x + 0.35, y + 2.45, 1.75, q[1], C.lime, C.ink);
  t(s, x + 0.35, y + 2.95, w - 0.7, 0.4, q[2], { fontSize: 17, bold: true }); t(s, x + 0.35, y + 3.38, 3, 0.4, q[3], { fontSize: 16, bold: true });
  bullets(s, x + 0.35, y + 3.85, w - 0.7, q[4], C.white, C.lime);
  t(s, x + 0.35, y + 4.85, w - 0.7, 0.25, q[5], { fontSize: 8.5, color: C.sub }); });
t(s, M, 7.0, 6, 0.25, "가격은 권장 소비자가 · 공급가는 품목·수량별 견적", { fontSize: 9, color: C.sub, align: "left" });

// 06 쿼드그립 구조
s = p.addSlide(); bg(s, C.forest);
s.addImage({ path: CARD + "rs_sole.png", x: 0.35, y: 0.75, w: 6.0, h: 6.0 });
eyebrow(s, 7.0, 0.95, "QUAD GRIP · 쿼드그립", C.lime);
t(s, 7.0, 1.3, 5.8, 1.5, "바닥에 닿는 4곳만,\n따로 만들었습니다.", { fontSize: 32, bold: true });
const q4 = [["01", "뒤꿈치 중앙", "처음 닿는 곳"], ["02", "후족부 바깥", "이어서 닿는 곳"], ["03", "앞꿈치 바깥", "앞으로 구르는 곳"], ["04", "엄지 볼", "마지막에 밀어내는 곳"]];
q4.forEach((q, i) => { const x = 7.0 + (i % 2) * 2.95, y = 3.05 + Math.floor(i / 2) * 1.2;
  s.addShape(p.ShapeType.roundRect, { x, y, w: 2.8, h: 1.05, rectRadius: 0.2, fill: { color: C.card }, line: { color: C.line, width: 0.75 } });
  t(s, x + 0.25, y + 0.2, 0.6, 0.4, q[0], { fontSize: 16, bold: true, color: C.lime }); t(s, x + 0.85, y + 0.18, 1.9, 0.35, q[1], { fontSize: 14, bold: true }); t(s, x + 0.85, y + 0.58, 1.9, 0.3, q[2], { fontSize: 10.5, color: C.sub }); });
t(s, 7.0, 5.65, 5.8, 0.8, "패드 = 폐타이어 재생고무 + 공장 자투리 실크벽지 PVC 배합\n특허 출원 · 디자인 등록", { fontSize: 12.5, color: C.sub, lineSpacingMultiple: 1.3 });
foot(s, 5, true);

// 06 정형외과 전문의 설계 자문
s = p.addSlide(); bg(s, C.paper);
eyebrow(s, M, 0.6, "DESIGN ADVISORY", C.gray);
t(s, M, 0.95, 8, 1.6, "패드 위치 하나까지,\n정형외과 전문의와 함께 봤습니다.", { fontSize: 34, bold: true, color: C.ink });
s.addShape(p.ShapeType.roundRect, { x: M, y: 2.85, w: 5.4, h: 3.7, rectRadius: 0.3, fill: { color: C.forest }, line: { width: 0, color: C.forest } });
s.addImage({ path: CARD + "doctor.png", x: M + 0.45, y: 3.25, w: 1.6, h: 1.6 });
t(s, M + 2.3, 3.45, 3.0, 0.4, "이문홍 원장", { fontSize: 22, bold: true });
t(s, M + 2.3, 3.95, 3.0, 0.4, "정형외과 전문의 · 설계 자문", { fontSize: 13, color: C.lime, bold: true });
t(s, M + 0.45, 5.15, 4.6, 1.2, "걸을 때 발바닥 압력이 지나는 길을 함께 살피고, 그립 패드 4곳의 위치를 검토했습니다.", { fontSize: 14, color: C.white, lineSpacingMultiple: 1.35 });
const adv = [["01", "보행 경로 검토", "뒤꿈치 → 바깥쪽 → 앞꿈치 → 엄지 볼, 발이 닿는 순서"], ["02", "패드 위치 조정", "닿는 순서를 따라 4곳 배치, 고치고 또 고쳐 완성"], ["03", "인솔 형태 검토", "아치 아래 빈 곳을 채우는 반굽 형태"]];
adv.forEach((q, i) => { const x = 6.5, y = 2.85 + i * 1.25;
  s.addShape(p.ShapeType.roundRect, { x, y, w: 6.13, h: 1.1, rectRadius: 0.2, fill: { color: C.white }, line: { color: "DADFD9", width: 0.75 } });
  t(s, x + 0.3, y + 0.3, 0.6, 0.5, q[0], { fontSize: 18, bold: true, color: C.forest }); t(s, x + 1.0, y + 0.2, 5, 0.4, q[1], { fontSize: 15, bold: true, color: C.ink }); t(s, x + 1.0, y + 0.6, 5, 0.35, q[2], { fontSize: 11.5, color: C.gray }); });
t(s, M, 6.75, 12, 0.25, "※ 이문홍 원장은 제품 설계 자문에 참여하고 자문료를 받았습니다.", { fontSize: 9.5, color: C.gray });
foot(s, 6);

// 07 공급 조건·연락처
s = p.addSlide(); bg(s, C.forest);
eyebrow(s, M, 0.6, "SUPPLY TERMS", C.lime);
t(s, M, 0.95, 12, 0.8, "공급 조건 · 연락처", { fontSize: 32, bold: true });
const moq = [["600", "족", "워킹화"], ["600", "족", "아치가득 인솔"], ["견적", "", "품목·수량·채널별"]];
moq.forEach((m, i) => { const x = M + i * 4.05; s.addShape(p.ShapeType.roundRect, { x, y: 2.0, w: 3.85, h: 2.0, rectRadius: 0.25, fill: { color: C.card }, line: { color: C.line, width: 0.75 } });
  t(s, x + 0.35, y = 2.3, 3.3, 0.8, m[0], { fontSize: 40, bold: true, color: C.lime }); t(s, x + 0.35 + (m[0].length * 0.36) + 0.05, 2.62, 0.6, 0.4, m[1], { fontSize: 16, bold: true }); t(s, x + 0.35, 3.25, 3.3, 0.4, m[2], { fontSize: 13, color: C.sub }); });
t(s, M, 1.65, 6, 0.3, "최소 주문 수량 (MOQ)", { fontSize: 12, bold: true, color: C.sub });
const terms = [["패키지", "MOQ 이상이면 채널 전용 · 현지어 패키지 협의"], ["단가", "품목·수량·채널별 견적서"], ["납기", "생산 일정 확인 후 협의"], ["채널", "편의점·역사 매장 · 복지몰·특판 · 라이브 · 수출"]];
terms.forEach((r, i) => { const y = 4.35 + i * 0.55; t(s, M, y, 1.8, 0.4, r[0], { fontSize: 13, bold: true, color: C.lime }); t(s, M + 1.8, y, 10, 0.4, r[1], { fontSize: 13 }); });


t(s, M, 6.72, 12, 0.3, "알앤디메이커스 주식회사 · 신동규 대표이사 · rndceo@rndmakers.kr · 0507-1317-2516 · rndmakers.kr", { fontSize: 12, bold: true, color: C.lime });
foot(s, 7, true);

p.writeFile({ fileName: D + "RHARA_SHOE_라라슈_소개서_7p.pptx" }).then(f => console.log("saved", f));
