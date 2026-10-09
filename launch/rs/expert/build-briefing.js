// 정형외과 전문의 자문 미팅 브리핑 (16:9, 9p) — node build-briefing.js
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const IMG = (f) => path.join(__dirname, "../design/fair-print/assets", f);
const OUT = path.join(__dirname, "doctor-briefing.pptx");
const THEME = { name: "RS Briefing", headFontFace: "Malgun Gothic", bodyFontFace: "Malgun Gothic",
  colors: { dk1: "232323", lt1: "FFFFFF", dk2: "0D0D0D", lt2: "F5F2EC", accent1: "C6F432", accent2: "3D4A12", accent3: "7E9C7E", accent4: "8A8A86", accent5: "D9D6CF", accent6: "FF6B3D", hlink: "3D4A12", folHlink: "7E9C7E" } };
const H = { ink: "232323", black: "0D0D0D", lime: "C6F432", olive: "3D4A12", cream: "F5F2EC", mute: "8A8A86", line: "D9D6CF", white: "FFFFFF", panel: "F1F1F1" };
const pres = new pptxgen(); pres.layout = "LAYOUT_WIDE";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "RS 전문의 자문 제안 브리핑"; pres.author = "㈜알앤디메이커스";
const T = (s, t, o) => s.addText(t, Object.assign({ isTextBox: true, margin: 0, fontFace: THEME.bodyFontFace, color: H.ink }, o));
const R = (s, o) => s.addShape(o.r ? pres.shapes.ROUNDED_RECTANGLE : pres.shapes.RECTANGLE, Object.assign({}, o, { line: { color: (o.fill && o.fill.color) || H.white, width: 0 } }, o.r ? { rectRadius: o.r } : {}));
let n = 0;
function slide(title, eyebrow, dark) {
  const s = pres.addSlide(); n++;
  s.background = { color: dark ? H.black : H.white };
  T(s, eyebrow, { x: 0.7, y: 0.5, w: 8, h: 0.3, fontSize: 11, bold: true, charSpacing: 3, color: dark ? H.lime : H.olive });
  T(s, title, { x: 0.7, y: 0.85, w: 11.9, h: 0.7, fontSize: 28, bold: true, color: dark ? H.white : H.ink });
  T(s, `RS · RhaRa Shoe  ·  전문의 자문 제안  ·  ${n}`, { x: 7.6, y: 7.0, w: 5.0, h: 0.3, fontSize: 9, color: H.mute, align: "right" });
  return s;
}
function cards(s, items, y, h, cols, opt = {}) {
  const gap = 0.3, w = (11.9 - gap * (cols - 1)) / cols;
  items.forEach((it, i) => {
    const x = 0.7 + (i % cols) * (w + gap), yy = y + Math.floor(i / cols) * (h + gap);
    R(s, { x, y: yy, w, h, fill: { color: opt.fill || H.panel }, r: 0.08 });
    T(s, [{ text: it[0], options: { bold: true, fontSize: 15, color: opt.head || H.ink, breakLine: true } },
          { text: it[1], options: { fontSize: 13, color: opt.body || H.ink } }],
      { x: x + 0.25, y: yy + 0.2, w: w - 0.5, h: h - 0.4, valign: "top", paraSpaceAfter: 6 });
  });
}

// 1 표지
let s = pres.addSlide(); n++; s.background = { color: H.black };
s.addImage({ path: IMG("outsole-studio.jpg"), x: 5.8, y: 0, w: 7.53, h: 7.5, sizing: { type: "cover", w: 7.53, h: 7.5 } });
R(s, { x: 0, y: 0, w: 6.3, h: 7.5, fill: { color: H.black } });
s.addImage({ path: IMG("rs-logo-lime.png"), x: 0.8, y: 1.0, w: 1.43, h: 1.2 });
T(s, "정형외과 전문의\n설계 자문 제안", { x: 0.8, y: 2.6, w: 5.3, h: 1.7, fontSize: 36, bold: true, color: H.white, valign: "top" });
T(s, "서서 일하는 사람을 위한 신발 RS — 워킹화 · 아치 인솔", { x: 0.8, y: 4.4, w: 5.3, h: 0.4, fontSize: 14, color: H.lime });
T(s, "㈜알앤디메이커스  대표이사 신동규\n2026. 10", { x: 0.8, y: 5.9, w: 5.3, h: 0.7, fontSize: 12, color: "BFBFBF" });

// 2 회사
s = slide("폐타이어 고무를 다시 신발로 만드는 제조사", "WHO WE ARE");
cards(s, [
  ["새활용 소재", "폐타이어 재생고무 · 실크벽지에서 분리한 재생 PVC를 신발 소재로 씁니다."],
  ["제조 이력", "2023 다이소 전국 매장 욕실화 입점 · 오피스디포 · 롯데패키징앤솔루션 · 서브원 납품"],
  ["공공 과제", "창업진흥원 국가과제(2023) · 환경부 새활용 산업 육성 지원사업(2024, 2026 2차)"],
  ["RS 라라슈", "2026.11.11 첫 런칭 — 서서 일하는 사람을 위한 워킹화와 아치 인솔"],
], 1.9, 2.1, 2);
T(s, "환경부 지원사업은 '수행'이며 인증이 아닙니다.", { x: 0.7, y: 6.55, w: 8, h: 0.3, fontSize: 10, color: H.mute });

// 3 문제
s = slide("하루를 서서 보내는 사람들의 신발", "WHY", true);
cards(s, [
  ["급식 조리사", "젖은 바닥 · 물청소 · 무거운 조리 도구"],
  ["식당 사장님 · 셰프", "앉을 틈 없는 피크 타임, 기름 묻은 주방"],
  ["매장 · 병원 · 미화", "단단한 바닥 위에서 하루 종일 서서 이동"],
], 1.9, 1.6, 3, { fill: "1C1C1C", head: H.lime, body: "DDDDDD" });
T(s, "\"퇴근하면 신발부터 벗고 싶다\" — 친구 셋의 가게에서 시작했습니다.", { x: 0.7, y: 3.9, w: 11.9, h: 0.5, fontSize: 18, bold: true, color: H.white });
T(s, "그래서 원장님께 여쭙고 싶습니다: 이 사람들의 발을 위해, 신발 설계에서 무엇을 놓치고 있을까요?", { x: 0.7, y: 4.6, w: 11.9, h: 0.5, fontSize: 14, color: "BFBFBF" });

// 4 워킹화
s = slide("쿼드그립 종일편한 워킹화", "PRODUCT 01");
s.addImage({ path: IMG("walking-cut.png"), x: 0.7, y: 1.8, w: 3.8, h: 4.6, sizing: { type: "contain", w: 3.8, h: 4.6 } });
const pts = [["쿼드그립 4점 패드", "밑창 4곳에 별도 배합(폐타이어 재생고무 + 재생 PVC) 그립 패드를 끼워 넣은 구조 · 특허 출원"],
  ["깔창 없는 일체형 안창", "E-실리폴리렌(EVA + 실리콘 배합)으로 안창까지 한 몸"],
  ["도톰한 발목 테두리", "발이 들어가는 입구를 다른 부분보다 두껍게"],
  ["무게", "270mm 한쪽 257g (실측)"]];
pts.forEach((p, i) => { T(s, [{ text: p[0], options: { bold: true, fontSize: 15, breakLine: true } }, { text: p[1], options: { fontSize: 13, color: "555555" } }], { x: 5.0, y: 1.9 + i * 1.1, w: 7.6, h: 0.95, valign: "top" }); });
T(s, "230~280mm · 국내 제조 · 미끄럼 저항(KS M ISO 13287)·반발탄성 시험 의뢰 예정", { x: 5.0, y: 6.4, w: 7.6, h: 0.3, fontSize: 11, color: H.olive, bold: true });

// 5 인솔
s = slide("쿼드그립 아치가득 인솔", "PRODUCT 02");
s.addImage({ path: IMG("insole-cut.png"), x: 0.7, y: 1.9, w: 4.4, h: 4.2, sizing: { type: "contain", w: 4.4, h: 4.2 } });
[["아치가득 구조", "발 아치 라인을 따라 가득 채운 형태"], ["뒤꿈치 컵", "뒤꿈치를 감싸는 컵 모양"], ["우드칩 배합", "목공소 자투리 우드칩을 E-실리폴리렌에 배합"], ["용도", "가지고 계신 운동화·구두에 넣어 쓰는 인솔 (워킹화에는 필요 없음)"]]
  .forEach((p, i) => T(s, [{ text: p[0], options: { bold: true, fontSize: 15, breakLine: true } }, { text: p[1], options: { fontSize: 13, color: "555555" } }], { x: 5.6, y: 1.9 + i * 1.1, w: 7.0, h: 0.95, valign: "top" }));
T(s, "의료기기가 아닌 공산품입니다 — 교정·치료 효능을 표방하지 않습니다.", { x: 5.6, y: 6.4, w: 7.0, h: 0.3, fontSize: 11, color: H.olive, bold: true });

// 6 질문
s = slide("원장님께 여쭙고 싶은 설계 질문", "QUESTIONS");
const qs = ["패드 4점 배치 — 뒤꿈치 후방(처음 딛는 바깥 모서리)에도 패드가 필요할까요?", "일체형 안창의 아치 높이 — 평발·요족도 무리 없을까요?", "발볼(라스트 폭) — 발볼이 넓거나 무지외반인 분 기준으로는?", "뒤꿈치 트임(클로그형) — 장시간 기립 근무에 괜찮은 형태일까요?", "인솔의 아치 높이 · 길이 · 뒤꿈치 컵 깊이", "오래 서서 일하는 분이 신발을 고를 때 보는 일반 기준 3가지", "원장님 이름과 함께 쓰기 불편한 표현"];
qs.forEach((q, i) => {
  const y = 1.75 + i * 0.68;
  s.addShape(pres.shapes.OVAL, { x: 0.7, y, w: 0.48, h: 0.48, fill: { color: H.lime }, line: { color: H.lime, width: 0 } });
  T(s, String(i + 1), { x: 0.7, y, w: 0.48, h: 0.48, fontSize: 14, bold: true, align: "center", valign: "middle" });
  T(s, q, { x: 1.4, y, w: 11.2, h: 0.48, fontSize: 15, valign: "middle" });
});

// 7 자문 범위
s = slide("자문 범위 제안 — 세 가지 중 편하신 방식으로", "SCOPE");
cards(s, [
  ["A. 1회 자문", "샘플 착용 평가 1회\n상세페이지용 코멘트 1~2문장\n프로필 사진 · 사용 1년"],
  ["B. 연간 자문위원", "A + 분기 1회 설계 리뷰\n신제품(조리화·주방화) 자문\n교육 콘텐츠 1편 (인터뷰/칼럼)"],
  ["C. 착용 의견", "제품 착용 후 의견만\n이름·사진 사용은 별도 동의"],
], 1.9, 2.6, 3);
T(s, "자문료 · 기간 · 사용 매체(상세페이지 · 홈페이지 · SNS · 보도자료 · B2B 제안서)는 협의 후 계약서에 명시합니다.", { x: 0.7, y: 4.9, w: 11.9, h: 0.5, fontSize: 14 });

// 8 약속
s = slide("저희가 먼저 약속드리는 것", "OUR PROMISE", true);
cards(s, [
  ["의료 효능 표방 안 함", "교정 · 통증 · 질환명 표현을 쓰지 않습니다."],
  ["사전 검수", "원장님 코멘트 · 사진은 검수 후에만 게시, 문장 임의 편집 없음"],
  ["대가 관계 공개", "'자문위원으로 자문료를 받았습니다'를 함께 표기"],
  ["'추천'이 아닌 '설계 자문'", "상품 추천자가 아니라 설계 자문으로 소개합니다."],
  ["노출 범위 선택", "병원명 노출 여부는 원장님 선택"],
  ["종료 후 정리", "계약 종료 시 기한 내 게시물 정리"],
], 1.9, 1.45, 3, { fill: "1C1C1C", head: H.lime, body: "DDDDDD" });

// 9 일정
s = slide("일정과 다음 단계", "NEXT");
[["오늘", "샘플 착용 · 설계 의견 · 자문 방식 선택"], ["~10/17", "계약서 · 대가 공개 문구 확정"], ["~10/21", "코멘트 초안 전달 → 원장님 검수"], ["~10/24", "확정 코멘트 · 프로필 사진"], ["11/11", "RS 런칭 (메가쇼 킨텍스 11/12~15)"]]
  .forEach(([d, t], i) => {
    const y = 1.9 + i * 0.85;
    R(s, { x: 0.7, y, w: 1.8, h: 0.6, fill: { color: H.lime }, r: 0.06 });
    T(s, d, { x: 0.7, y, w: 1.8, h: 0.6, fontSize: 14, bold: true, align: "center", valign: "middle" });
    T(s, t, { x: 2.8, y, w: 9.8, h: 0.6, fontSize: 16, valign: "middle" });
  });
T(s, "㈜알앤디메이커스 대표이사 신동규  ·  010-6880-2516  ·  rndceo@rndmakers.kr", { x: 0.7, y: 6.4, w: 11.9, h: 0.3, fontSize: 12, color: H.olive, bold: true });

(async () => { await pres.writeFile({ fileName: OUT }); await applyTheme(OUT, THEME); console.log("wrote", OUT); })();
