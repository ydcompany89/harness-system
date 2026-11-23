// 알앤디메이커스 회사·상품 소개서 v3 — 자사몰 디자인(RS 차콜그린+라임 / re.feeel 라임+잉크, 둥근 카드·알약 버튼) 일관 적용
const pptxgen = require("pptxgenjs");
const D = __dirname + "/", CARD = D + "cards/", R = "/home/user/harness-system/launch/rs/";
const LOGO = { rf: R + "design/fair-print/assets/refeeel-logo.png", rs: R + "design/fair-print/assets/rs-logo-lime.png" };
const C = { ink: "0B0F0C", forest: "0D1B14", card: "14281D", line: "2C4A37", lime: "C6F432", white: "FFFFFF", paper: "F6F7F4", sub: "9FB3A6", gray: "5F6B64", mute: "3A4A40" };
const F = "맑은 고딕", W = 13.33, H = 7.5, M = 0.7;
const p = new pptxgen(); p.layout = "LAYOUT_WIDE"; p.title = "R&D MAKERS — RHARA SHOE · re.feeel 회사·상품 소개서";
const t = (s, x, y, w, h, txt, o) => s.addText(txt, Object.assign({ x, y, w, h, fontFace: F, color: C.white, margin: 0, valign: "top" }, o));
const eyebrow = (s, x, y, txt, color) => t(s, x, y, 6, 0.3, txt, { fontSize: 10, bold: true, color, charSpacing: 3 });
const pill = (s, x, y, w, txt, fill, color) => { s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.36, rectRadius: 0.18, fill: { color: fill }, line: { color: fill, width: 0 } }); t(s, x, y + 0.06, w, 0.26, txt, { fontSize: 10.5, bold: true, color, align: "center" }); };
const btn = (s, x, y, w, txt, dark) => { s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.5, rectRadius: 0.25, fill: { color: dark ? C.ink : C.lime }, line: { color: dark ? C.ink : C.lime, width: 0 } });
  t(s, x + 0.25, y + 0.13, w - 0.8, 0.3, txt, { fontSize: 12, bold: true, color: dark ? C.lime : C.ink });
  s.addShape(p.ShapeType.ellipse, { x: x + w - 0.45, y: y + 0.07, w: 0.36, h: 0.36, fill: { color: dark ? C.lime : C.ink }, line: { width: 0, color: dark ? C.lime : C.ink } });
  t(s, x + w - 0.45, y + 0.1, 0.36, 0.3, "→", { fontSize: 12, bold: true, color: dark ? C.ink : C.lime, align: "center" }); };
const bullets = (s, x, y, w, items, color, dot) => items.forEach((b, i) => { s.addShape(p.ShapeType.ellipse, { x, y: y + i * 0.34 + 0.1, w: 0.09, h: 0.09, fill: { color: dot }, line: { width: 0, color: dot } }); t(s, x + 0.22, y + i * 0.34, w - 0.22, 0.3, b, { fontSize: 11.5, color }); });
const foot = (s, n, dark) => t(s, M, 7.08, 8, 0.25, `R&D MAKERS · 회사·상품 소개서 2026   ${String(n).padStart(2, "0")}`, { fontSize: 8.5, color: dark ? C.sub : C.gray, charSpacing: 1 });
const bg = (s, color) => (s.background = { color });
const rfMark = (s, x, y, size) => t(s, x, y, 3, size / 50, "refeeel.", { fontSize: size, bold: true, color: C.ink, fontFace: "Arial Rounded MT Bold", charSpacing: -1 });

// 01 표지 — 두 브랜드 좌우 분할
let s = p.addSlide(); bg(s, C.forest);
s.addShape(p.ShapeType.rect, { x: W / 2, y: 0, w: W / 2, h: H, fill: { color: C.lime }, line: { width: 0, color: C.lime } });
s.addImage({ path: LOGO.rs, x: M, y: 0.45, w: 0.72, h: 0.6 });
eyebrow(s, 4.6, 0.6, "SHOES & INSOLE", C.sub);
s.addImage({ path: CARD + "cover_rs.png", x: 3.55, y: 0.9, w: 2.85, h: 3.3 });
eyebrow(s, M, 4.05, "라라슈 · 서서 일하는 하루", C.lime);
t(s, M, 4.4, 6, 0.9, "Made for", { fontSize: 50, bold: true });
t(s, M, 5.15, 6, 0.9, "Standing.", { fontSize: 50, bold: true, color: C.lime });
t(s, M, 6.15, 5.6, 0.6, "식당·주방·매장에서 오래 서는 분들을 위한\n신발과 인솔", { fontSize: 13, color: C.sub });
rfMark(s, W / 2 + M, 0.42, 30);
eyebrow(s, W - 3.0, 0.6, "ORAL CARE · BATH", C.mute);
s.addImage({ path: CARD + "cover_rf.png", x: W - 3.3, y: 0.9, w: 2.85, h: 3.3 });
eyebrow(s, W / 2 + M, 4.05, "re.feeel · 욕실의 하루", C.ink);
t(s, W / 2 + M, 4.4, 6, 1.7, "REFILL\nYOUR DAY", { fontSize: 50, bold: true, color: C.ink, lineSpacingMultiple: 0.9 });
t(s, W / 2 + M, 6.15, 5.6, 0.6, "남은 것의 다음 모양.\n공장·목공소에서 남은 자투리 소재를 일부 배합한 욕실 도구", { fontSize: 13, color: C.mute });

// 02 우리는
s = p.addSlide(); bg(s, C.paper);
eyebrow(s, M, 0.6, "R&D MAKERS · ABOUT", C.gray);
t(s, M, 0.95, 8, 1.6, "남은 것을,\n다음 쓰임으로.", { fontSize: 44, bold: true, color: C.ink });
t(s, M, 2.75, 6.3, 1.2, "알앤디메이커스는 공장과 목공소에서 남은 자투리 소재를 다시 가공해, 매일 손이 가는 물건을 만듭니다. 서서 일하는 사람의 신발 브랜드 RHARA SHOE와 욕실의 하루를 채우는 re.feeel, 두 브랜드를 운영합니다.", { fontSize: 14, color: C.mute, lineSpacingMultiple: 1.3 });
const ab = [["설립", "2023 · 대전"], ["주력", "새활용 욕실화 — 전국 다이소 납품"], ["지원", "환경부 새활용 산업 육성 지원사업 수행(2024·2026)"]];
ab.forEach((r, i) => { t(s, M, 4.3 + i * 0.55, 1.2, 0.4, r[0], { fontSize: 12, bold: true, color: C.gray }); t(s, M + 1.2, 4.3 + i * 0.55, 5.3, 0.4, r[1], { fontSize: 13, bold: true, color: C.ink }); });
[[C.forest, LOGO.rs, "RHARA SHOE", "신발 · 인솔", C.white, C.lime], [C.lime, LOGO.rf, "욕실의 하루", "칫솔 · 치실 · 양치컵 · 욕실화 · 볼펜", C.ink, C.ink]].forEach((b, i) => {
  const x = 7.6, y = 0.95 + i * 3.0; s.addShape(p.ShapeType.roundRect, { x, y, w: 5.03, h: 2.75, rectRadius: 0.3, fill: { color: b[0] }, line: { width: 0, color: b[0] } });
  if (i) rfMark(s, x + 0.4, y + 0.4, 28); else s.addImage({ path: b[1], x: x + 0.4, y: y + 0.4, w: 0.72, h: 0.6 });
  t(s, x + 0.4, y + 1.45, 4.3, 0.5, b[2], { fontSize: 24, bold: true, color: b[4] }); t(s, x + 0.4, y + 2.0, 4.3, 0.4, b[3], { fontSize: 13, color: i ? C.mute : C.sub }); });
foot(s, 2);

// 03 숫자로 보는 우리
s = p.addSlide(); bg(s, C.forest);
eyebrow(s, M, 0.6, "TRACK RECORD", C.lime);
t(s, M, 0.95, 12, 0.8, "숫자로 보는 알앤디메이커스", { fontSize: 32, bold: true });
const nums = [["다이소", "전국 매장 납품", "새활용 욕실화"], ["10억+", "새활용 소비재 누적 매출", "3년, B2B·B2C"], ["63켤레", "메가쇼 4일 현장 판매", "아치가득 인솔 · 2026.11"], ["4.9", "욕실화 평점 · 리뷰 105개", "자사몰 · 2026.10 기준"], ["2 + 2", "디자인 등록 2 · 특허 출원 2", "워킹화 · 인솔"], ["3건", "제품 시험 완료", "미끄럼 저항 · 유해물질 · 소재 물성"]];
nums.forEach((n, i) => { const x = M + (i % 3) * 4.05, y = 2.0 + Math.floor(i / 3) * 2.45;
  s.addShape(p.ShapeType.roundRect, { x, y, w: 3.85, h: 2.25, rectRadius: 0.25, fill: { color: C.card }, line: { color: C.line, width: 0.75 } });
  t(s, x + 0.35, y + 0.3, 3.3, 0.8, n[0], { fontSize: 36, bold: true, color: C.lime }); t(s, x + 0.35, y + 1.2, 3.3, 0.4, n[1], { fontSize: 14, bold: true }); t(s, x + 0.35, y + 1.6, 3.3, 0.35, n[2], { fontSize: 11, color: C.sub }); });
foot(s, 3, true);

// 04 RS 브랜드
s = p.addSlide(); bg(s, C.forest);
s.addImage({ path: LOGO.rs, x: M, y: 0.45, w: 0.72, h: 0.6 });
eyebrow(s, W - 3.0, 0.6, "BRAND 01 · RHARA SHOE", C.sub);
s.addImage({ path: CARD + "rs_onfoot.png", x: 7.4, y: 0.85, w: 4.9, h: 5.65 });
eyebrow(s, M, 2.55, "라라슈 · 서서 일하는 하루", C.lime);
t(s, M, 2.9, 7, 1.0, "Made for", { fontSize: 60, bold: true }); t(s, M, 3.85, 7, 1.0, "Standing.", { fontSize: 60, bold: true, color: C.lime });
t(s, M, 5.15, 6, 1.0, "\"깔창이 자꾸 딸려 나와요.\"\n서서 일하는 친구의 한마디에서 시작했습니다.\n바닥에 닿는 곳부터 다시 만든 신발과 인솔.", { fontSize: 14, color: C.sub, lineSpacingMultiple: 1.3 });
foot(s, 4, true);

// 05 RS 상품 카드 (자사몰 상품 카드 그대로)
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
foot(s, 6, true);

// 07 re.feeel 브랜드
s = p.addSlide(); bg(s, C.lime);
rfMark(s, M, 0.42, 30);
eyebrow(s, W - 3.2, 0.6, "BRAND 02 · re.feeel", C.mute);
s.addImage({ path: CARD + "rf_cup_big.png", x: 7.6, y: 0.8, w: 4.75, h: 5.1 });
eyebrow(s, M, 2.55, "re.feeel · 욕실의 하루", C.ink);
t(s, M, 2.9, 7, 2.0, "REFILL\nYOUR DAY", { fontSize: 60, bold: true, color: C.ink, lineSpacingMultiple: 0.9 });
t(s, M, 5.15, 6.4, 1.0, "남은 것의 다음 모양.\n아침에 쓰는 칫솔부터 욕실 바닥의 슬리퍼까지,\n생활을 다시 채우는 욕실 도구.", { fontSize: 14, color: C.mute, lineSpacingMultiple: 1.3 });
foot(s, 7);

// 08 re.feeel 상품 카드 (자사몰 흰 카드)
s = p.addSlide(); bg(s, C.lime);
rfMark(s, M, 0.35, 26);
t(s, M + 2.3, 0.42, 9, 0.6, "남은 것의 다음 모양.", { fontSize: 26, bold: true, color: C.ink });
const rfP = [["p_brush", "ORAL CARE · DAY 2 NIGHT", "아침과 저녁,\n양치의 목적은 조금 다르니까.", ["간벌재 CXP 손잡이", "블루 스파이럴모 · 블랙 이중미세모", "칫솔형 치실 1세트 = 손잡이 1 + 헤드 20 · 9,400원"]],
 ["p_cup", "RINSE CUP · CXP", "40° 기울여\n세워 말리는 양치컵.", ["간벌재 CXP 소재", "기울여 세워 물이 고이지 않게 말리는 구조", "칫솔과 세트 구성 가능"]],
 ["p_slipper", "BATH SLIPPER · RECYCLED PVC", "자투리 실크벽지가\n욕실화로 새로 태어났습니다.", ["원료의 50%를 벽지 공장 재단 자투리로", "바닥 물빠짐 구멍 · 남녀공용 · 14,900원", "리뷰 105개 · 평점 4.9 (2026.10 기준)"]]];
rfP.forEach((q, i) => { const x = M + i * 4.05, y = 1.35, w = 3.85;
  s.addShape(p.ShapeType.roundRect, { x, y, w, h: 5.55, rectRadius: 0.3, fill: { color: C.white }, line: { width: 0, color: C.white } });
  s.addImage({ path: CARD + q[0] + ".png", x, y, w, h: 2.7 });
  t(s, x + 0.3, y + 2.95, w - 0.6, 0.25, q[1], { fontSize: 8.5, bold: true, color: C.gray, charSpacing: 1.5 });
  t(s, x + 0.3, y + 3.3, w - 0.6, 0.85, q[2], { fontSize: 15, bold: true, color: C.ink });
  bullets(s, x + 0.3, y + 4.3, w - 0.6, q[3], C.mute, C.ink); });
foot(s, 8);

// 09 채널별 제안
s = p.addSlide(); bg(s, C.paper);
eyebrow(s, M, 0.6, "WHERE IT SELLS", C.gray);
t(s, M, 0.95, 12, 0.8, "이렇게 팔면 잘 팔립니다", { fontSize: 32, bold: true, color: C.ink });
t(s, M, 1.7, 12, 0.4, "채널마다 먼저 보여 드릴 상품과 보여 주는 방법을 정리했습니다.", { fontSize: 13, color: C.gray });
const ch = [["편의점 · 역사 매장", "여행·출퇴근길에 바로 사는 소형 상품", ["인솔 — 사용법이 보이는 진열", "칫솔·양치컵 — 여행·생활 코너"], ["RS", "rf"]],
 ["복지몰 · 기업 특판", "서서 일하는 임직원 + 매일 쓰는 소모품", ["워킹화 — 매장·병원·주방 근무화", "욕실화·칫솔 — 생활 소모품"], ["RS", "rf"]],
 ["라이브 · 공동구매", "화면에서 바로 보여 주는 시연형", ["인솔 — 깔창 들고, 깔고, 덮는 장면", "양치컵 — 40° 기울여 세우는 장면"], ["RS", "rf"]],
 ["수출 · 해외 리빙", "일본 리빙숍 · 미국 아시안 마트", ["re.feeel 생활용품 전 품목", "현지어 표기 패키지 협의"], ["RS", "rf"]]];
ch.forEach((q, i) => { const x = M + i * 3.04, y = 2.35, w = 2.88;
  s.addShape(p.ShapeType.roundRect, { x, y, w, h: 4.35, rectRadius: 0.25, fill: { color: C.white }, line: { color: "DADFD9", width: 0.75 } });
  t(s, x + 0.25, y + 0.3, w - 0.5, 0.45, q[0], { fontSize: 16, bold: true, color: C.ink }); t(s, x + 0.25, y + 0.8, w - 0.5, 0.6, q[1], { fontSize: 11, color: C.gray });
  q[2].forEach((b, j) => t(s, x + 0.25, y + 1.6 + j * 0.75, w - 0.5, 0.65, b, { fontSize: 12, bold: true, color: C.mute }));
  pill(s, x + 0.25, y + 3.7, 1.05, "RHARA SHOE", C.forest, C.lime); pill(s, x + 1.4, y + 3.7, 0.9, "re.feeel", C.lime, C.ink); });
foot(s, 9);

// 10 공급 조건
s = p.addSlide(); bg(s, C.forest);
eyebrow(s, M, 0.6, "SUPPLY TERMS", C.lime);
t(s, M, 0.95, 12, 0.8, "공급 조건", { fontSize: 32, bold: true });
const moq = [["600", "족", "워킹화 · 인솔 · 욕실화"], ["600", "개", "CXP 볼펜"], ["2,000", "개", "칫솔 · 치실 · 양치컵"]];
moq.forEach((m, i) => { const x = M + i * 4.05; s.addShape(p.ShapeType.roundRect, { x, y: 2.0, w: 3.85, h: 2.0, rectRadius: 0.25, fill: { color: C.card }, line: { color: C.line, width: 0.75 } });
  t(s, x + 0.35, y = 2.3, 3.3, 0.8, m[0], { fontSize: 40, bold: true, color: C.lime }); t(s, x + 0.35 + (m[0].length * 0.36) + 0.05, 2.62, 0.6, 0.4, m[1], { fontSize: 16, bold: true }); t(s, x + 0.35, 3.25, 3.3, 0.4, m[2], { fontSize: 13, color: C.sub }); });
t(s, M, 1.65, 6, 0.3, "최소 주문 수량 (MOQ)", { fontSize: 12, bold: true, color: C.sub });
const terms = [["패키지", "MOQ 이상이면 채널 전용 · 현지어 패키지 협의"], ["단가", "품목·수량·채널별 견적서"], ["납기", "생산 일정 확인 후 협의"], ["해외 인증", "구강용품 FDA 등 비용·시간이 큰 절차는 별도 협의"]];
terms.forEach((r, i) => { const y = 4.45 + i * 0.6; t(s, M, y, 1.8, 0.4, r[0], { fontSize: 13, bold: true, color: C.lime }); t(s, M + 1.8, y, 10, 0.4, r[1], { fontSize: 13 }); });
foot(s, 10, true);

// 11 연락처 — 분할 마무리
s = p.addSlide(); bg(s, C.forest);
s.addShape(p.ShapeType.rect, { x: W / 2, y: 0, w: W / 2, h: H, fill: { color: C.lime }, line: { width: 0, color: C.lime } });
s.addImage({ path: CARD + "booth.png", x: 7.2, y: 1.2, w: 5.4, h: 4.33 });
t(s, W / 2 + M, 5.8, 6, 0.4, "2026 메가쇼 · 킨텍스 부스", { fontSize: 11, bold: true, color: C.ink });
eyebrow(s, M, 1.4, "CONTACT", C.lime);
t(s, M, 1.8, 6, 1.6, "함께 팔아 주실\n파트너를 찾습니다.", { fontSize: 34, bold: true });
const ct = [["회사", "알앤디메이커스 주식회사"], ["담당", "신동규 대표이사"], ["메일", "rndceo@rndmakers.kr"], ["전화", "0507-1317-2516"], ["웹", "rndmakers.kr"]];
ct.forEach((r, i) => { t(s, M, 3.85 + i * 0.5, 1.0, 0.4, r[0], { fontSize: 12, bold: true, color: C.sub }); t(s, M + 1.0, 3.85 + i * 0.5, 5, 0.4, r[1], { fontSize: 14, bold: true }); });
btn(s, M, 6.55, 3.2, "샘플·견적 요청하기", false);

p.writeFile({ fileName: D + "알앤디메이커스_회사상품소개서_v3.pptx" }).then(f => console.log("saved", f));
