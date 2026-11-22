// 워킹화 상세 재설계 기획(도입·히어로·페인·문제) PPT — commerce-detail-page-copy(13섹션 1~3) + 우리 9구역 규칙 · rs-brand-designer 사양
const pptxgen = require("pptxgenjs");
const R = "/home/user/harness-system/launch/rs/";
const REF = R + "design/ai-gen/ref/";
const C = { ink: "0D1B14", card: "14281D", sub: "66736A", sage: "9FB3A6", line: "DADFD9", paper: "F6F7F4", lime: "C6F432", white: "F2F4F2", red: "C0392B" };
const F = "맑은 고딕", W = 13.33, M = 0.75;
const p = new pptxgen(); p.layout = "LAYOUT_WIDE"; p.title = "워킹화 상세 재설계 — 도입·히어로·페인·문제";

const t = (s, txt, o) => s.addText(txt, Object.assign({ fontFace: F, color: C.ink, margin: 0, valign: "top" }, o));
const label = (s, txt, dark) => t(s, txt, { x: M, y: 0.45, w: 8, h: 0.3, fontSize: 10, bold: true, color: dark ? C.lime : C.sub, charSpacing: 2 });
const foot = (s, n, dark) => t(s, `RHARA SHOE · 워킹화 상세 재설계  ${n}`, { x: M, y: 7.05, w: 8, h: 0.25, fontSize: 9, color: dark ? C.sage : C.sub });
const light = () => { const s = p.addSlide(); s.background = { color: C.paper }; return s; };
const dark = () => { const s = p.addSlide(); s.background = { color: C.ink }; return s; };
const chip = (s, txt, x, y, w, on) => { s.addShape(p.ShapeType.roundRect, { x, y, w, h: 0.42, rectRadius: 0.21, fill: { color: on ? C.lime : C.card }, line: { color: on ? C.lime : C.sage, width: 0.75 } }); t(s, txt, { x, y: y + 0.08, w, h: 0.3, fontSize: 12, bold: true, align: "center", color: on ? C.ink : C.white }); };

// 1 표지
let s = dark();
s.addImage({ path: REF + "walking-pair-stand.jpg", x: 7.4, y: 0, w: 5.93, h: 7.5, sizing: { type: "cover", w: 5.93, h: 7.5 } });
label(s, "DETAIL PAGE REDESIGN · 2026.11", true);
t(s, "쿼드그립 종일편한 워킹화\n상세페이지 재설계", { x: M, y: 1.6, w: 6.4, h: 1.8, fontSize: 40, bold: true, color: C.white });
t(s, "도입 · 히어로 · 페인 · 문제 (첫 30초)", { x: M, y: 3.6, w: 6.4, h: 0.5, fontSize: 20, color: C.lime, bold: true });
t(s, "기준: commerce-detail-page-copy 13섹션 중 Hero·Pain·Problem\n+ 우리 9구역(01 히어로·02 트러스트 바·03 페인) 규칙 우선", { x: M, y: 4.5, w: 6.4, h: 0.9, fontSize: 14, color: C.sage });
foot(s, "01", true);

// 2 방향
s = light(); label(s, "WHAT CHANGES");
t(s, "무엇을 바꾸나", { x: M, y: 0.85, w: 11, h: 0.7, fontSize: 28, bold: true });
const rows = [["타깃", "식당 친구·자영업 이야기", "발·무릎·허리가 피곤한, 오래 서 있는 모든 사람\n(매장·병원·주방·물류·출퇴근)"],
 ["포지셔닝", "주방화·작업화", "하루 종일 신는 데일리 워킹화 (출근길→일터→산책)"],
 ["첫 화면", "로고+제품명, 후킹 없음", "공감 한 문장 → 제품 → 근거 4칩 (30초 안)"],
 ["근거", "MADE IN KOREA 4회 반복, 미확인 수치", "공식 통계 1개 + 확인된 사실 4개만"],
 ["사진", "주방 70%", "일상 60 : 일터 40, 제품은 실물 사진 기준"]];
s.addTable([[{ text: "", options: { fill: { color: C.ink } } }, { text: "지금", options: { fill: { color: C.ink }, color: C.white, bold: true } }, { text: "재설계", options: { fill: { color: C.ink }, color: C.lime, bold: true } }]]
  .concat(rows.map(r => [{ text: r[0], options: { bold: true } }, { text: r[1], options: { color: C.sub } }, { text: r[2], options: { bold: true } }])),
  { x: M, y: 1.8, w: W - 2 * M, colW: [1.8, 3.6, 6.43], fontFace: F, fontSize: 14, color: C.ink, border: { type: "solid", color: C.line, pt: 0.75 }, rowH: 0.75, valign: "middle", margin: 0.12 });
foot(s, "02");

// 3 흐름
s = light(); label(s, "FIRST 30 SECONDS");
t(s, "첫 30초 흐름 (모바일 5화면)", { x: M, y: 0.85, w: 11, h: 0.7, fontSize: 28, bold: true });
const flow = [["도입", "0~5초", "공감 한 문장\n+ 일상 영상"], ["히어로", "5~12초", "제품 공개\n+ 가치 제안 + CTA"], ["트러스트", "12~16초", "확인된 사실 4칩"], ["페인", "16~23초", "피곤한 순간 4개\n(제품 숨김)"], ["문제", "23~30초", "진짜 원인 3개\n→ 해결로 연결"]];
flow.forEach((f, i) => { const x = M + i * 2.4; s.addShape(p.ShapeType.rect, { x, y: 2.2, w: 2.2, h: 3.2, fill: { color: i === 1 ? C.ink : "FFFFFF" }, line: { color: C.line, width: 0.75 } });
  t(s, f[0], { x: x + 0.2, y: 2.45, w: 1.8, h: 0.5, fontSize: 22, bold: true, color: i === 1 ? C.lime : C.ink });
  t(s, f[1], { x: x + 0.2, y: 3.0, w: 1.8, h: 0.3, fontSize: 12, color: i === 1 ? C.sage : C.sub });
  t(s, f[2], { x: x + 0.2, y: 3.6, w: 1.8, h: 1.4, fontSize: 14, color: i === 1 ? C.white : C.ink }); });
t(s, "13섹션 매핑: 도입+히어로 = Hero · 트러스트 = (9구역 02) · 페인 = Pain · 문제 = Problem → 다음 단계 Solution(제품 기능)", { x: M, y: 5.9, w: 11.8, h: 0.4, fontSize: 12, color: C.sub });
foot(s, "03");

// 4 도입
s = dark(); label(s, "01 · 도입 (0~5초)", true);
s.addImage({ path: REF + "walking-onfoot.jpg", x: 7.0, y: 0, w: 6.33, h: 7.5, sizing: { type: "cover", w: 6.33, h: 7.5 } });
t(s, "오래 서 있는 날,\n발에서 시작해\n허리까지 올라옵니다", { x: M, y: 1.2, w: 6, h: 2.9, fontSize: 40, bold: true, color: C.white });
t(s, "하루 종일 서 있는 사람을 위한 워킹화", { x: M, y: 4.3, w: 6, h: 0.4, fontSize: 18, color: C.lime });
t(s, "다른 안 (A/B 테스트)\nB. 퇴근길, 무릎보다 발이 먼저 무거워지는 분께\nC. 하루 8시간 서 있으면, 발이 가장 먼저 압니다", { x: M, y: 5.2, w: 6, h: 1.1, fontSize: 12, color: C.sage });
t(s, "비주얼: 출근길·매장·저녁 산책 3초 컷 영상(일상 톤), 얼굴 없이 무릎 아래", { x: M, y: 6.45, w: 6, h: 0.3, fontSize: 10, color: C.sage }); foot(s, "04", true);

// 5 히어로
s = dark(); label(s, "02 · 히어로 (5~12초) · 제품 공개", true);
s.addImage({ path: REF + "walking-pair-stand.jpg", x: M, y: 1.0, w: 4.4, h: 5.6, sizing: { type: "cover", w: 4.4, h: 5.6 } });
const hx = 5.6;
t(s, "MADE FOR STANDING", { x: hx, y: 1.0, w: 7, h: 0.3, fontSize: 12, bold: true, color: C.sage, charSpacing: 3 });
t(s, "쿼드그립 종일편한 워킹화", { x: hx, y: 1.45, w: 7, h: 0.7, fontSize: 32, bold: true, color: C.white });
t(s, "바닥에 닿는 4곳만 따로 만든, 한쪽 257g 워킹화", { x: hx, y: 2.25, w: 7, h: 0.45, fontSize: 18, color: C.lime });
t(s, "발이 편해야, 일이 편하다.", { x: hx, y: 2.8, w: 7, h: 0.4, fontSize: 14, color: C.white });
chip(s, "한쪽 257g", hx, 3.6, 1.6); chip(s, "깔창 없는 일체형", hx + 1.75, 3.6, 2.0); chip(s, "바닥 4점 그립 패드", hx + 3.9, 3.6, 2.1);
chip(s, "국내 생산", hx, 4.15, 1.6); chip(s, "정형외과 전문의 설계 자문", hx + 1.75, 4.15, 2.9);
chip(s, "와디즈 알림 받기 · 자사몰 구매하기", hx, 4.95, 4.2, true);
t(s, "CTA는 채널에 맞게 1개만 · 전문의 칩을 쓰면 하단에 자문료 고지 1줄(필수)\n13섹션 기준: 헤드라인 15자 안팎 · 서브 30자 이내 · CTA 8자 안팎 · 과장 형용사 금지", { x: hx, y: 5.7, w: 7, h: 0.8, fontSize: 11, color: C.sage });
foot(s, "05 · 비주얼: 차콜 한 켤레 — 옆모습 + 밑창 라임 4점, 차콜그린 배경 + 라임 대각선 빛", true);

// 6 페인
s = light(); label(s, "03 · 페인 (16~23초) · 제품은 보여 주지 않는다");
t(s, "오늘도 이런 순간, 있으셨죠?", { x: M, y: 0.85, w: 11, h: 0.7, fontSize: 28, bold: true });
const pains = [["오후 3시", "발바닥이 먼저 무거워지고"], ["퇴근길 계단", "무릎이 한 칸씩 느껴지고"], ["집에 오면", "허리부터 펴고 눕고 싶고"], ["젖은 바닥 위", "한 걸음마다 발끝에 힘이 들어가고"]];
pains.forEach((q, i) => { const x = M + (i % 2) * 5.95, y = 1.9 + Math.floor(i / 2) * 1.75;
  s.addShape(p.ShapeType.rect, { x, y, w: 5.75, h: 1.55, fill: { color: "FFFFFF" }, line: { color: C.line, width: 0.75 } });
  s.addShape(p.ShapeType.rect, { x, y, w: 0.12, h: 1.55, fill: { color: C.lime }, line: { color: C.lime, width: 0 } });
  t(s, q[0], { x: x + 0.4, y: y + 0.3, w: 5, h: 0.4, fontSize: 14, color: C.sub, bold: true });
  t(s, q[1], { x: x + 0.4, y: y + 0.75, w: 5.2, h: 0.5, fontSize: 20, bold: true }); });
t(s, "그런데 그게, 하루 탓만은 아닐 수도 있습니다.", { x: M, y: 5.6, w: 11.8, h: 0.5, fontSize: 20, bold: true });
t(s, "비주얼: 4컷 모두 무릎 아래 일상 장면(카페 카운터·병원 복도·지하철 계단·주방) · 신발은 기존 신발로, 라라슈 노출 금지 · 부상·통증 부위 강조(빨간 표시) 금지", { x: M, y: 6.2, w: 11.8, h: 0.5, fontSize: 11, color: C.sub });
foot(s, "06");

// 7 문제
s = dark(); label(s, "04 · 문제 (23~30초) · 반전 훅 + 원인 3개", true);
t(s, "문제는 체력이 아니라,\n하루 종일 딛고 있는 신발 바닥일지도 모릅니다", { x: M, y: 0.9, w: 11.8, h: 1.4, fontSize: 30, bold: true, color: C.white });
const probs = [["01", "무게", "하루 1만 보를 걸으면\n신발 무게도 1만 번 들어 올립니다.", "→ 해결: 한쪽 257g"],
 ["02", "바닥", "일하다 다친 사람 5명 중 1명은\n넘어져서 다쳤습니다. (19.8%)", "→ 해결: 바닥 4점 그립 패드"],
 ["03", "깔창", "신고 벗을 때마다 깔창이 밀리고\n딸려 나옵니다.", "→ 해결: 깔창 없는 일체형"]];
probs.forEach((q, i) => { const x = M + i * 3.98;
  s.addShape(p.ShapeType.rect, { x, y: 2.7, w: 3.78, h: 3.0, fill: { color: C.card }, line: { color: C.card, width: 0 } });
  t(s, q[0], { x: x + 0.3, y: 2.95, w: 1, h: 0.5, fontSize: 24, bold: true, color: C.lime });
  t(s, q[1], { x: x + 1.2, y: 3.02, w: 2.4, h: 0.45, fontSize: 20, bold: true, color: C.white });
  t(s, q[2], { x: x + 0.3, y: 3.75, w: 3.3, h: 1.1, fontSize: 14, color: C.white });
  t(s, q[3], { x: x + 0.3, y: 5.05, w: 3.3, h: 0.4, fontSize: 12, bold: true, color: C.lime }); });
t(s, "전환 문장 → 그래서 바닥부터 다시 만들었습니다.   (다음 화면: Solution — 쿼드그립 4점 구조)", { x: M, y: 6.0, w: 11.8, h: 0.4, fontSize: 16, bold: true, color: C.lime });
t(s, "※ 19.8% 출처 표기: 고용노동부 「2024년 산업재해 현황」, 전체 산업 기준(넘어짐 28,244명/재해자 142,771명) · '넘어짐을 막는다'는 문장은 붙이지 않음", { x: M, y: 6.5, w: 11.8, h: 0.4, fontSize: 10, color: C.sage });
foot(s, "07", true);

// 8 제작·감수 체크
s = light(); label(s, "BEFORE PUBLISHING");
t(s, "제작 전 확인", { x: M, y: 0.85, w: 11, h: 0.7, fontSize: 28, bold: true });
const chk = [["촬영", "도입 영상 3컷(출근길·매장·산책) · 히어로 부양 컷 · 페인 4컷 — 프롬프트: design/ai-gen/prompts/walking-daily-flow-nanobanana-EN.md"],
 ["통계", "고용노동부 원문에서 넘어짐 28,244명 1회 대조 후 게시"],
 ["전문의", "히어로 칩에 쓰면 하단 고지: 이문홍 원장은 제품 설계 자문에 참여하고 자문료를 받았습니다."],
 ["표현", "'미끄러지지 않는·피로 회복·통증 완화' 등 효과 단정 없음 — 최종 문구는 rs-compliance 감수"],
 ["다음 구간", "Solution(쿼드그립)·How·Proof·Benefits·Compare·CTA는 9구역 순서로 이어서 설계"]];
s.addTable(chk.map(r => [{ text: r[0], options: { bold: true } }, { text: r[1] }]), { x: M, y: 1.8, w: W - 2 * M, colW: [1.8, 10.03], fontFace: F, fontSize: 14, color: C.ink, border: { type: "solid", color: C.line, pt: 0.75 }, rowH: 0.8, valign: "middle", margin: 0.12 });
foot(s, "08");

p.writeFile({ fileName: R + "content/detail-walking-intro-deck/라라슈_워킹화_상세재설계_도입히어로페인문제.pptx" }).then(f => console.log("saved", f));
