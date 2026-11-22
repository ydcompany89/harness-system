// 2026 새활용 도약 최종평가 발표 PPT (7분) — 알앤디메이커스. 대본은 슬라이드 노트에 포함.
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const R = "/home/user/harness-system/launch/rs/";
const IMG = { stand: R + "design/ai-gen/ref/walking-pair-stand.jpg", sole: R + "design/ai-gen/ref/walking-sole-closeup.jpg", onfoot: R + "design/ai-gen/ref/walking-onfoot.jpg", booth: R + "sales/assets/kintex-booth.jpg", insole: R + "design/fair-print/assets/insole-main.jpg" };
const C = { ink: "0D1B14", card: "14281D", sub: "5E6B63", sage: "9FB3A6", line: "D5DBD6", paper: "F6F7F4", white: "FFFFFF", lime: "C6F432", green: "2E6B4F", warn: "B03A2E" };
const F = "맑은 고딕", W = 13.33, M = 0.6;
const script = fs.readFileSync(__dirname + "/대본_최종평가_7분.md", "utf8");
const part = n => { const m = script.split(/\n## /).find(s => s.startsWith(n + ".")); return m ? m.split("\n").slice(1).join("\n").trim() : ""; };

const p = new pptxgen(); p.layout = "LAYOUT_WIDE"; p.title = "2026 새활용 산업 육성 지원사업 최종평가 — 알앤디메이커스";
const t = (s, txt, o) => s.addText(txt, Object.assign({ fontFace: F, color: C.ink, margin: 0, valign: "top" }, o));
function base(no, sec, title, time) {
  const s = p.addSlide(); s.background = { color: C.white };
  s.addShape(p.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.12, fill: { color: C.ink }, line: { color: C.ink, width: 0 } });
  t(s, sec, { x: M, y: 0.35, w: 9, h: 0.3, fontSize: 12, bold: true, color: C.green });
  if (time) t(s, time, { x: W - M - 2, y: 0.35, w: 2, h: 0.3, fontSize: 11, color: C.sub, align: "right" });
  t(s, title, { x: M, y: 0.7, w: W - 2 * M, h: 0.7, fontSize: 26, bold: true });
  t(s, "알앤디메이커스(주) · 2026 새활용 산업 육성 지원사업(도약) 최종평가", { x: M, y: 7.1, w: 9, h: 0.25, fontSize: 9, color: C.sub });
  t(s, String(no), { x: W - M - 1, y: 7.1, w: 1, h: 0.25, fontSize: 9, color: C.sub, align: "right" });
  return s;
}
const box = (s, x, y, w, h, fill) => s.addShape(p.ShapeType.rect, { x, y, w, h, fill: { color: fill || C.paper }, line: { color: C.line, width: 0.75 } });
const pic = (s, path, x, y, w, h) => s.addImage({ path, x, y, w, h, sizing: { type: "cover", w, h } });
const tbl = (s, rows, o) => s.addTable(rows, Object.assign({ fontFace: F, fontSize: 13, color: C.ink, border: { type: "solid", color: C.line, pt: 0.75 }, valign: "middle", margin: 0.08 }, o));
const H = txt => ({ text: txt, options: { bold: true, color: C.white, fill: { color: C.ink }, align: "center" } });

// 1 표지
let s = p.addSlide(); s.background = { color: C.ink };
pic(s, IMG.stand, 7.6, 0, 5.73, 7.5);
t(s, "2026 새활용 산업 육성 지원사업 · 도약분야 최종평가", { x: M, y: 0.8, w: 6.8, h: 0.4, fontSize: 14, color: C.lime, bold: true });
t(s, "폐타이어 고무 및 폐목재 기반 CXP를\n새활용한 논슬립 주방화 제조", { x: M, y: 1.6, w: 6.8, h: 1.6, fontSize: 30, bold: true, color: C.white });
t(s, "결과물 · RHARA SHOE 쿼드그립 종일편한 워킹화", { x: M, y: 3.5, w: 6.8, h: 0.4, fontSize: 18, color: C.sage });
t(s, "알앤디메이커스(주)  대표 신동규\n정부지원금 124,040,000원 · 민간부담금 53,160,000원", { x: M, y: 5.6, w: 6.8, h: 0.8, fontSize: 14, color: C.white });

// 2 기업소개
s = base(2, "1. 기업소개 · 주력제품", "버려지는 소재를 생활 속 제품으로 — 새활용 소비재 기업", "1분");
tbl(s, [[{ text: "설립", options: { bold: true } }, "2023.07.28 · 대전 유성구"], [{ text: "주력 제품", options: { bold: true } }, "실크벽지 자투리 PVC 새활용 욕실화 — 전국 다이소 납품, 매출의 약 70%"], [{ text: "확장 제품", options: { bold: true } }, "임업 부산물 CXP 칫솔·치실 (2024 중국 수출)"], [{ text: "누적 실적", options: { bold: true } }, "새활용 소비재 3년 누적 매출 10억 원 이상"], [{ text: "지원 이력", options: { bold: true } }, "2023 창업중심대학 · 2024 새활용 지원사업 → 2026 도약"]],
  { x: M, y: 1.7, w: 7.4, colW: [1.7, 5.7], rowH: 0.75, fontSize: 14 });
box(s, 8.4, 1.7, 4.33, 4.6, C.paper);
t(s, "2026 도약 과제의 결과물", { x: 8.7, y: 1.9, w: 3.8, h: 0.35, fontSize: 13, bold: true, color: C.green });
pic(s, IMG.stand, 8.7, 2.35, 3.73, 3.1);
t(s, "RHARA SHOE\n쿼드그립 종일편한 워킹화", { x: 8.7, y: 5.55, w: 3.8, h: 0.7, fontSize: 14, bold: true });
s.addNotes(part("1"));

// 3 추진계획
s = base(3, "2. 기존 사업추진계획 (신청 시)", "폐타이어의 '접지력'을 그대로 살려, 미끄러운 바닥을 딛는 신발로", "1분 30초");
box(s, M, 1.65, 5.6, 2.2); t(s, "새활용 소재", { x: M + 0.25, y: 1.8, w: 5, h: 0.3, fontSize: 13, bold: true, color: C.green });
t(s, "• 폐타이어 파쇄 고무 — 국내 하루 46.5톤 발생, 약 30%는 연료(TDF)로 소각\n• 폐목재 기반 CXP — 임업 부산물, 1kg당 CO₂ 19.36kg 저장\n• 목표: 주방화 1켤레당 CO₂ 약 2.5kg 저감", { x: M + 0.25, y: 2.2, w: 5.2, h: 1.5, fontSize: 13 });
const plan = [["시제품", "바디(남·여)·인솔·논슬립 패드 시금형, 시제품 500set"], ["인·검증", "미끄럼 저항·유해물질 시험, KC·환경성적표지"], ["자문·지재권", "정형외과 전문의·변리사 자문, 특허·디자인·상표"], ["홍보", "BI·홈페이지·상세페이지·영상·홍보물"], ["판로", "메가쇼(11.12~15)·서울디자인페스티벌(11.26~29), SNS 광고"]];
tbl(s, [[H("분야"), H("계획")]].concat(plan.map(r => [{ text: r[0], options: { bold: true } }, r[1]])), { x: 6.5, y: 1.65, w: 6.23, colW: [1.5, 4.73], rowH: 0.42, fontSize: 12 });
t(s, "정량 목표", { x: M, y: 4.2, w: 5, h: 0.35, fontSize: 14, bold: true, color: C.green });
[["3억 원", "매출"], ["15건", "바이어 상담"], ["3건", "지재권·인증"], ["2명", "신규 고용"]].forEach((k, i) => { const x = M + i * 3.04; box(s, x, 4.65, 2.85, 1.7, C.ink);
  t(s, k[0], { x, y: 4.95, w: 2.85, h: 0.6, fontSize: 30, bold: true, color: C.lime, align: "center" }); t(s, k[1], { x, y: 5.65, w: 2.85, h: 0.4, fontSize: 14, color: C.white, align: "center" }); });
s.addNotes(part("2"));

// 4 달성 요약
s = base(4, "3. 사업화 목표 대비 달성 현황 — 요약", "계획 5개 분야 모두 수행, 정량 목표는 아래와 같습니다", "2분 30초 중");
tbl(s, [[H("성과지표"), H("목표"), H("달성 (11월 기준)"), H("비고")],
  ["매출액", "3억 원", "[ ]원", "11월 판매 개시 — 킨텍스 현장 인솔 63켤레, 11.25 와디즈 펀딩"],
  ["국내 판로 (바이어 상담)", "15건", "[ ]건", "메가쇼 상담 — 일본 수출사·美 H마트 소싱사·복지몰·라이브커머스 등"],
  ["지식재산권·인증", "3건", "[ ]건", "디자인 등록 2 · 특허 출원 2 · 상표 출원 · 시험성적서 3"],
  ["신규 고용", "2명", "[ ]명", "1명 → [ ]명"],
  ["기술적 신뢰도 (정성)", "우수", "달성", "정형외과 전문의 설계 자문 · 이질 소재(EVA+재생고무 패드) 결합 양산 적용"],
  ["브랜드 인지도 (정성)", "우수", "달성", "메가쇼 부스 · 메타 광고 CTR 9.6% · 와디즈 알림 [ ]명"]],
  { x: M, y: 1.7, w: W - 2 * M, colW: [2.6, 1.3, 2.1, 6.13], rowH: 0.62, fontSize: 13 });
s.addNotes("(요약 화면 — 바로 다음 장으로 넘기며 시제품부터 설명)");

// 5 시제품
s = base(5, "3-1. 시제품", "금형 4종 완성 · 시사출 완료 — 현장 의견으로 설계 고도화", "");
pic(s, IMG.sole, M, 1.65, 5.2, 3.9);
tbl(s, [[H("구분"), H("결과")], ["바디 시금형", "남성용·여성용 완료"], ["인솔 시금형", "완료"], ["아웃솔 논슬립 패드 금형", "완료"], ["시사출", "완료 · 결합도 확인"]], { x: 6.1, y: 1.65, w: 6.63, colW: [2.8, 3.83], rowH: 0.45, fontSize: 13 });
box(s, 6.1, 4.05, 6.63, 2.6, C.ink);
t(s, "설계 고도화 (계획 → 결과)", { x: 6.35, y: 4.2, w: 6, h: 0.35, fontSize: 14, bold: true, color: C.lime });
t(s, "• 밑창 전면 고무 → 바닥에 닿는 4곳에만 재생 그립 패드 (폐타이어 재생고무 + 실크벽지 PVC)\n• 결과: 한쪽 257g(270mm) 경량화, 깔창 없는 일체형\n• 주방 → 매장·병원 등 '오래 서서 일하는 사람' 전체로 시장 확대", { x: 6.35, y: 4.65, w: 6.2, h: 1.9, fontSize: 13, color: C.white });
t(s, "바닥 4점 쿼드그립 패드 (실물)", { x: M, y: 5.65, w: 5.2, h: 0.3, fontSize: 11, color: C.sub });
s.addNotes(part("3").split("다음은 인·검증")[0].trim());

// 6 인검증
s = base(6, "3-2. 인·검증", "한국소재융합연구원 시험 3건 완료", "");
const tests = [["미끄럼 저항", "KS M ISO 13287", "세제 바닥 0.36\n글리세린 바닥 0.17", "S-26-0313"], ["유해물질", "어린이제품 공통안전기준·KS M 9721 준용", "프탈레이트 3종·납·카드뮴·PAHs\n모두 불검출", "A-26-0929"], ["소재 물성", "KS M 6518 · KS M ISO 8307", "볼 반발 탄성 49%\n압축 영구 줄음률 47.2%", "T-26-1844"]];
tests.forEach((q, i) => { const x = M + i * 4.1; box(s, x, 1.7, 3.9, 3.6);
  t(s, q[0], { x: x + 0.25, y: 1.9, w: 3.4, h: 0.4, fontSize: 18, bold: true, color: C.green });
  t(s, q[1], { x: x + 0.25, y: 2.4, w: 3.4, h: 0.5, fontSize: 11, color: C.sub });
  t(s, q[2], { x: x + 0.25, y: 3.1, w: 3.4, h: 1.2, fontSize: 17, bold: true });
  t(s, "성적서 " + q[3], { x: x + 0.25, y: 4.75, w: 3.4, h: 0.3, fontSize: 11, color: C.sub }); });
box(s, M, 5.55, W - 2 * M, 0.9, C.paper);
t(s, "KC 공급자적합성 · 환경성적표지(EPD): [진행 현황 기입]   ※ 시험성적서는 시료 기준 결과이며 KOLAS 인정과 무관", { x: M + 0.25, y: 5.75, w: W - 2 * M - 0.5, h: 0.5, fontSize: 12 });
s.addNotes((part("3").split("다음은 인·검증")[1] || "").split("자문과 지식재산권")[0].trim());

// 7 자문·지재권
s = base(7, "3-3. 컨설팅 · 지식재산권", "전문가 자문으로 구조를 검증하고, 권리로 남겼습니다", "");
box(s, M, 1.7, 5.8, 4.7);
t(s, "컨설팅", { x: M + 0.25, y: 1.9, w: 5, h: 0.4, fontSize: 18, bold: true, color: C.green });
t(s, "• 정형외과 전문의 설계 자문\n  — 패드 위치(보행 시 발바닥 압력 경로) 공동 검토\n\n• 변리사 자문\n  — 재생고무 패드·EVA 바디 결합 구조, 특허 명세서·청구항 설계\n  — 선행기술·유사상표 조사", { x: M + 0.25, y: 2.4, w: 5.4, h: 3.8, fontSize: 14 });
tbl(s, [[H("구분"), H("내용"), H("상태")], ["특허", "보행 궤적 배치형 미끄럼 방지 신발", "출원"], ["특허", "아치 인솔 구조", "출원"], ["디자인", "쿼드그립 워킹화", "등록"], ["디자인", "아치가득 인솔", "등록"], ["상표", "리타이어렌(RETIRENE) 재생소재", "[출원]"]],
  { x: 6.7, y: 1.7, w: 6.03, colW: [1.1, 3.73, 1.2], rowH: 0.62, fontSize: 13 });
t(s, "※ 출원·등록 번호는 발표 자료 최종본에 기입", { x: 6.7, y: 5.6, w: 6, h: 0.3, fontSize: 11, color: C.sub });
s.addNotes((part("3").split("자문과 지식재산권")[1] || "").split("마지막으로 홍보와 판로")[0].trim());

// 8 홍보·판로
s = base(8, "3-4. 홍보 · 판로", "브랜드 구축 → 박람회 현장 판매 → 온라인 펀딩으로 연결", "");
pic(s, IMG.booth, M, 1.65, 5.4, 3.4);
t(s, "2026 메가쇼 시즌2 (킨텍스, 11.12~15) 부스", { x: M, y: 5.1, w: 5.4, h: 0.3, fontSize: 11, color: C.sub });
const kp = [["63켤레", "메가쇼 4일 현장 판매 (인솔)"], ["[ ]곳", "바이어 상담 (일본 수출·美 H마트 소싱·복지몰 등)"], ["9.6%", "메타 광고 클릭률 (6소재)"], ["[ ]명", "와디즈 펀딩 알림 신청 (11.25 오픈)"]];
kp.forEach((k, i) => { const x = 6.3 + (i % 2) * 3.25, y = 1.65 + Math.floor(i / 2) * 1.75; box(s, x, y, 3.1, 1.6, i < 1 ? C.ink : C.paper);
  t(s, k[0], { x: x + 0.2, y: y + 0.2, w: 2.7, h: 0.6, fontSize: 28, bold: true, color: i < 1 ? C.lime : C.green }); t(s, k[1], { x: x + 0.2, y: y + 0.9, w: 2.8, h: 0.6, fontSize: 12, color: i < 1 ? C.white : C.ink }); });
t(s, "제작물: 브랜드 BI·로고 가이드 · 패키지·행택 · 반응형 홈페이지·랜딩 · 상세페이지 · 브랜드 영상·숏폼 · 리플렛·부스 홍보물", { x: 6.3, y: 5.25, w: 6.43, h: 0.6, fontSize: 12 });
t(s, "다음 일정: 11.25 와디즈 펀딩 오픈 · 11.26~29 서울디자인페스티벌", { x: M, y: 6.1, w: 12, h: 0.35, fontSize: 13, bold: true, color: C.green });
s.addNotes((part("3").split("마지막으로 홍보와 판로")[1] || "").trim());

// 9 매출·고용
s = base(9, "4. 전년 대비 매출 및 고용인원 변화", "매출과 인력 모두 성장 중입니다", "30초");
tbl(s, [[H("구분"), H("2024"), H("2025"), H("2026 ([ ]월 기준)")], [{ text: "매출액", options: { bold: true } }, "543,129,284원", "622,287,774원", "[ ]원"], [{ text: "임직원 수", options: { bold: true } }, "—", "1명 (사업 신청 시)", "[ ]명"]],
  { x: M, y: 1.8, w: W - 2 * M, colW: [2.2, 3.2, 3.2, 3.53], rowH: 0.85, fontSize: 16, align: "center" });
t(s, "※ 2024·2025 매출은 사업 신청서 기재 금액 · 2026 수치와 신규 채용 직무는 최종 확인 후 기입", { x: M, y: 4.6, w: 12, h: 0.3, fontSize: 11, color: C.sub });
s.addNotes(part("4"));

// 10 사업비
s = base(10, "5. 사업비 집행 내역 (e나라도움, 11.22 기준 + 11월 인건비 집행 예정)", "총사업비 1억 7,720만 원 중 95.4% 집행 예정", "30초");
tbl(s, [[H("비목"), H("계획"), H("집행"), H("11월 집행 예정"), H("집행 후 잔액"), H("집행률")],
  ["인건비 (현물·자부담)", "26,580,000", "22,280,000", "4,300,000 *", "0", "100%"],
  ["재료비", "13,000,000", "13,000,000", "—", "0", "100%"],
  ["일반용역비 (시제품·금형·홍보제작·자문)", "86,828,000", "86,824,727", "—", "3,273", "≈100%"],
  ["일반수용비 (홍보물·수수료·행사·홍보비)", "50,792,000", "42,655,509", "—", "8,136,491", "84.0%"],
  [{ text: "합계", options: { bold: true } }, { text: "177,200,000", options: { bold: true } }, { text: "164,760,236", options: { bold: true } }, { text: "4,300,000", options: { bold: true } }, { text: "8,139,764", options: { bold: true } }, { text: "95.4%", options: { bold: true, color: C.green } }]],
  { x: M, y: 1.7, w: W - 2 * M, colW: [3.9, 1.65, 1.65, 1.75, 1.6, 1.58], rowH: 0.62, fontSize: 13, align: "center" });
t(s, "정부지원금 124,040,000원 중 115,903,509원 집행(93.4%) · 민간부담금 53,160,000원\n* 11월 인건비 실지급 4,560,000원 중 e나라도움 집행등록 가능액은 4,300,000원 — 차액 260,000원은 자부담 처리(집행 전 확인)", { x: M, y: 5.6, w: 12.1, h: 0.8, fontSize: 12, color: C.sub });
s.addNotes(part("5"));

// 11 향후 계획
s = base(11, "6. 지원사업 수행 이후 향후 계획 · 발전 전략", "폐타이어를 '태우는 연료'에서 '딛는 바닥'으로", "1분");
const steps = [["1단계 · 2026~27", "시장 검증", "와디즈·자사몰 소비자 판매\n급식·매장·병원 근무화 B2B 납품\n매출 3억 · 고용 2명"], ["2단계 · 2027~28", "공공·수출", "특허 등록 후 조달청 혁신제품·우수제품\n학교·관공서 급식실 진입\n일본·미국 수출 계약 전환 · 매출 8억"], ["3단계 · 2028~", "라인업 확장", "재생소재 '리타이어렌'을\n조리화·슬리퍼·욕실화로 확장\n새활용 신발 대표 기업 · 매출 20억"]];
steps.forEach((q, i) => { const x = M + i * 4.1; box(s, x, 1.7, 3.9, 4.3, i === 2 ? C.ink : C.paper);
  t(s, q[0], { x: x + 0.25, y: 1.9, w: 3.4, h: 0.35, fontSize: 12, bold: true, color: i === 2 ? C.lime : C.green });
  t(s, q[1], { x: x + 0.25, y: 2.35, w: 3.4, h: 0.5, fontSize: 22, bold: true, color: i === 2 ? C.white : C.ink });
  t(s, q[2], { x: x + 0.25, y: 3.1, w: 3.5, h: 2.6, fontSize: 14, color: i === 2 ? C.white : C.ink }); });
t(s, "환경 효과: 폐타이어 재생고무를 기능 소재로 전환 · 재생 패드 적용 확대에 따라 탄소 저감 성과 정량화(EPD) 추진", { x: M, y: 6.25, w: 12.1, h: 0.4, fontSize: 13, bold: true, color: C.green });
s.addNotes(part("6"));

// 12 마무리
s = p.addSlide(); s.background = { color: C.ink };
pic(s, IMG.onfoot, 6.9, 0, 6.43, 7.5);
t(s, "감사합니다", { x: M, y: 2.6, w: 6, h: 1, fontSize: 44, bold: true, color: C.white });
t(s, "알앤디메이커스(주) · RHARA SHOE\nrndceo@rndmakers.kr · 0507-1317-2516", { x: M, y: 3.8, w: 6, h: 0.9, fontSize: 16, color: C.sage });

p.writeFile({ fileName: __dirname + "/알앤디메이커스_새활용도약_최종평가_발표.pptx" }).then(f => console.log("saved", f));
