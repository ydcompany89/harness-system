// 알앤디메이커스 회사·상품 소개서 v2 — rs-brand-designer 사양(2026-11-17) 적용, 국문/영문
// 사양: 5단계 글자(44/28/18/14/10), 12단 그리드(여백 0.75), 사진 흰 상자 금지·가장자리 3면 붙임, 브랜드별 바탕 분리
const pptxgen = require("pptxgenjs");
const R = "/home/user/harness-system/launch/rs/";
const IMG = require(R + "sales/assets/meta.json");
const A = R + "design/fair-print/assets/";
const C = { ink: "0D1B14", sub: "66736A", sage: "9FB3A6", line: "DADFD9", paper: "F6F7F4", paper2: "EFEEE9", lime: "C6F432", rf: "2E6B4F", white: "F2F4F2" };
const W = 13.33, H = 7.5, M = 0.75;
const col = n => M + (n - 1) * 1.007;          // n번째 단의 x
const span = n => n * 0.757 + (n - 1) * 0.25;  // n단 폭

const T = {
  ko: {
    font: "맑은 고딕", file: "알앤디메이커스_회사상품소개서_KR.pptx",
    cover: ["COMPANY & PRODUCT INTRODUCTION 2026", "남은 것을,\n다음 쓰임으로.", "공장·목공소에서 남은 자투리 소재를 일부 배합해\n서서 일하는 사람의 신발과 매일 쓰는 생활용품을 만듭니다."],
    about: ["ABOUT", "자투리 소재 가공부터 완제품까지,\n협력 공장과 함께.", "알앤디메이커스는 남은 소재를 다시 가공해 두 개의 브랜드로 선보입니다. 서서 일하는 사람을 위한 RHARA SHOE, 매일 쓰는 생활용품 re.feeel.",
      [["회사명", "알앤디메이커스 주식회사"], ["대표이사", "신동규"], ["사업자등록번호", "709-81-02967"], ["본점", "대전광역시 유성구 국제과학7로 8"], ["사무실", "경기도 고양시 일산서구 중앙로 1542"], ["브랜드", "RHARA SHOE · re.feeel"]]],
    mat: ["MATERIALS", "다시 가공해 쓰는 소재 3가지", [["01", "폐타이어 고무", "워킹화 그립 패드"], ["02", "공장 자투리 실크벽지 PVC", "욕실화 · 그립 패드"], ["03", "간벌재 CXP", "칫솔 손잡이 · 양치컵 · 볼펜"]]],
    proof: ["TRACK RECORD", "숫자와 기록으로 말합니다.", [["63", "켤레", "킨텍스 메가쇼 4일간 현장 판매 (인솔, 2026.11)"], ["0.36", "", "미끄럼 저항 시험 마찰계수 (강철+세제, 뒤꿈치)"], ["3", "종", "다시 가공해 쓰는 소재 (폐타이어 고무 · 자투리 벽지 PVC · 간벌재 CXP)"]],
      ["다이소에 욕실화를 납품해 온 제조사 (회사 실적)", "환경부 새활용 산업 육성 지원사업 수행 기업", "디자인등록 제30-○호 · 특허출원 제10-○호 외 1건 · 상표 출원", "KS M ISO 13287 시험 · 한국소재융합연구원 (S-26-0313)"]],
    rs: ["BRAND 01 · RHARA SHOE", "Made for Standing.", "서서 일하는 사람을 위한 근무화·인솔.\n\"깔창이 자꾸 딸려 나와요.\" 식당을 하는 친구의 한마디에서 시작해, 깔창 없는 워킹화와 깔창 밑에 까는 인솔을 만들었습니다."],
    walk: ["RHARA SHOE · 근무화", "쿼드그립 종일편한 워킹화", "출근부터 퇴근까지, 한 켤레로.", [["쿼드그립", "밑창 네 곳에 그립 패드를 배치했습니다."], ["일체형 안창", "깔창이 따로 없는 한 덩어리 — 빠지지 않습니다."], ["발목 테두리", "발이 들어가는 입구를 도톰하게 둘렀습니다."]]],
    how: ["RHARA SHOE · 구조", "바닥에 닿는 네 곳에, 그립 패드.", [["쿼드그립 4점 패드", "폐타이어 고무·자투리 실크벽지 PVC를 배합한 패드를 밑창 네 곳에 박았습니다."], ["헤링본 밑창", "패드 사이는 지그재그 홈 패턴으로 채웠습니다."], ["E-실리폴리렌 본체", "EVA·실리콘 배합 소재로 본체와 안창을 한 몸으로 만들었습니다."]], "밑창 실물 · 2026.10 시제품"],
    spec: ["RHARA SHOE · 사양", "사양", [["사이즈", "230 ~ 280 mm"], ["컬러", "차콜 · 그레이 · 민트화이트"], ["무게", "한쪽 257g (270mm 실측)"], ["본체·밑창", "E-실리폴리렌 (EVA·실리콘 배합)"], ["그립 패드", "폐타이어 고무 · 자투리 실크벽지 PVC"]]],
    slip: ["RHARA SHOE · 시험 · 직원 근무화 제안", "매장 직원 근무화로 제안합니다.", "마찰계수 · 강철 바닥 + 세제 · 뒤꿈치", [["시험 방법", "KS M ISO 13287:2019"], ["시료", "260mm 좌 1족 · 2026.11"], ["시험 기관", "한국소재융합연구원 (S-26-0313)"], ["글리세롤", "강철 바닥 + 글리세롤 · 뒤꿈치: 0.17"]], "시험 결과이며 안전화 인증이 아닙니다. 기름 바닥 시험은 하지 않았습니다.",
      "대상: 계산대 · 진열 직원 (기름 없는 바닥 · 안전화 의무 현장 제외)", ["230~280mm · 3색으로 직무 구분", "단체 사이즈 구성 · 포장 협의", "샘플로 현장 착화 테스트"]],
    ins: ["RHARA SHOE · 인솔", "쿼드그립 아치가득 인솔", "신던 깔창은 그대로, 그 밑에 한 장.", [["밑에 까는 방식", "쓰던 깔창을 빼지 않고 그 밑에 깝니다. 자를 필요가 없습니다."], ["반굽 길이", "뒤꿈치부터 아치까지만 와서 발가락 쪽 높이는 그대로입니다."], ["구조", "아치가득 구조 · 뒤꿈치 컵 · 통기 구멍 · 우드칩 배합"]]],
    insHow: ["RHARA SHOE · 인솔 구조", "깔창 밑에 한 장 — 아치 라인까지 가득.", [["01", "깔창을 들어 올리고"], ["02", "뒤꿈치에 맞춰 깔고"], ["03", "깔창을 다시 덮으면 끝"]],
      [["사이즈", "M 15cm (신발 220~255) · L 17cm (신발 260~290)"], ["두께", "뒤꿈치 3mm · 아치 최고 15mm"], ["컬러", "그레이 · 모카무스"], ["소재", "E-실리폴리렌 + 목공소 자투리 우드칩"]], "의료기기가 아닙니다."],
    rf: ["BRAND 02 · re.feeel", "남은 것의 다음 모양.", "REFILL YOUR DAY — 매일 손이 가는 물건을, 남은 소재로.\n간벌재 CXP와 공장 자투리 벽지로 칫솔부터 욕실화까지 만듭니다."],
    oral: ["re.feeel · 구강케어", "손잡이와 컵은 간벌재 CXP로.", [["DAY2NIGHT 칫솔", "CXP 손잡이 · 아침과 저녁, 목적이 다른 칫솔 2종"], ["양치컵", "CXP 소재 · 엎어서 40° 기울여 세워 말리는 구조"], ["칫솔형 치실", "칫솔처럼 손잡이를 쥐고 쓰는 치실"], ["판촉용 로고 칫솔", "협력사 굴껍데기 소재 칫솔에 re.feeel 로고를 각인해 판촉물로 공급"]]],
    bath: ["re.feeel · 욕실화 · 문구", "자투리 벽지, 욕실화에 다시 쓰였습니다.", [["스마일 욕실화 2종", "공장 자투리 실크벽지 PVC 배합 · 바닥에 물 빠짐 구멍"], ["CXP 볼펜", "간벌재 CXP 바디 · 노크식"]]],
    moq: ["SUPPLY TERMS", "MOQ & 공급 조건", [["600", "족", "워킹화 · 인솔 · 욕실화"], ["600", "개", "CXP 볼펜"], ["2,000", "개", "칫솔 · 치실 · 양치컵"]],
      [["패키지 변경", "MOQ 이상 주문 시 가능"], ["단가", "품목·수량별 견적"], ["납기", "생산 일정 확인 후 협의"], ["샘플", "품평용 제공 가능"], ["인증", "구강용품 FDA 등록 등 고비용 절차는 별도 협의"]]],
    contact: ["CONTACT", "샘플·견적·사양서를 보내드립니다.", [["담당", "신동규 대표이사"], ["이메일", "rndceo@rndmakers.kr"], ["전화", "0507-1317-2516"], ["홈페이지", "rndmakers.kr"]]],
    foot: { co: "R&D MAKERS", rs: "RHARA SHOE", rf: "re.feeel" }
  },
  en: {
    font: "Arial", file: "RnDMakers_Company_Product_Introduction_EN.pptx",
    cover: ["COMPANY & PRODUCT INTRODUCTION 2026", "Leftovers,\nmade useful again.", "We blend factory and woodshop off-cuts into\nwork footwear and everyday goods."],
    about: ["ABOUT", "From off-cut materials to finished goods,\nwith our partner factory.", "R&D Makers reprocesses leftover materials into two brands: RHARA SHOE for people who stand all day, and re.feeel for everyday goods.",
      [["Company", "R&D Makers Co., Ltd."], ["CEO", "Dongkyu Shin"], ["Business reg. no.", "709-81-02967"], ["Head office", "8, Gukjegwahak 7-ro, Yuseong-gu, Daejeon"], ["Office", "1542, Jungang-ro, Ilsanseo-gu, Goyang-si"], ["Brands", "RHARA SHOE · re.feeel"]]],
    mat: ["MATERIALS", "Three reclaimed materials we blend in", [["01", "End-of-life tire rubber", "Shoe grip pads"], ["02", "Factory off-cut silk-wallpaper PVC", "Bath slippers · grip pads"], ["03", "Forest-thinning wood (CXP)", "Toothbrush handles · rinse cups · pens"]]],
    proof: ["TRACK RECORD", "Facts and records.", [["63", "pairs", "Insoles sold on site in 4 days, KINTEX MegaShow (Nov 2026)"], ["0.36", "", "Slip resistance coefficient (steel + detergent, heel)"], ["3", "", "Reclaimed materials we blend in (tire rubber · off-cut wallpaper PVC · CXP)"]],
      ["Bath-slipper supplier to Daiso (company record)", "Participant, Ministry of Environment upcycling industry support program", "Design Reg. No. 30-○ · Patent Appl. No. 10-○ and 1 other · Trademark filed", "KS M ISO 13287 test · Korea Inst. of Materials Convergence Tech. (S-26-0313)"]],
    rs: ["BRAND 01 · RHARA SHOE", "Made for Standing.", "Work shoes and insoles for people who stand all day.\n\"My insole keeps slipping out.\" One line from a friend who runs a restaurant led us to a shoe with no loose insole — and an insole that goes under the one you already have."],
    walk: ["RHARA SHOE · Work shoe", "Quad-Grip All-Day Walking Shoe", "One pair, from commute to closing.", [["Quad-Grip", "Four grip pads placed on the outsole."], ["One-piece footbed", "No loose insole — nothing slips out."], ["Soft collar", "A thick, rounded opening."]]],
    how: ["RHARA SHOE · Structure", "Grip pads where the sole meets the floor.", [["Four-point grip pads", "Pads blended with tire rubber and off-cut wallpaper PVC, set into four points of the outsole."], ["Herringbone outsole", "A zigzag groove pattern between the pads."], ["E-Silipolyrene body", "An EVA + silicone blend that forms the body and footbed as one piece."]], "Actual outsole · prototype, Oct 2026"],
    spec: ["RHARA SHOE · Specs", "Specifications", [["Sizes", "230 – 280 mm"], ["Colors", "Charcoal · Gray · Mint White"], ["Weight", "257 g per shoe (270 mm)"], ["Upper & sole", "E-Silipolyrene (EVA + silicone blend)"], ["Grip pads", "Tire rubber · off-cut silk-wallpaper PVC"]]],
    slip: ["RHARA SHOE · Test · Staff shoe", "A work shoe for your store team.", "Coefficient of friction · steel + detergent · heel", [["Method", "KS M ISO 13287:2019"], ["Sample", "Size 260 mm, left, 1 shoe · Nov 2026"], ["Laboratory", "Korea Inst. of Materials Convergence Tech. (S-26-0313)"], ["Glycerol", "Steel floor + glycerol, heel: 0.17"]], "Test result only — not a safety-shoe certification. Not tested on oily floors.",
      "For: checkout · stocking staff (non-oily floors; not for sites requiring safety shoes)", ["230–280 mm · 3 colors to separate teams", "Bulk size-run packing on request", "Samples for on-site wear trials"]],
    ins: ["RHARA SHOE · Insole", "Quad-Grip Arch-Full Insole", "Keep your insole. Add one layer underneath.", [["Goes underneath", "Place it under the existing insole. No cutting."], ["Half-length", "Heel to arch only, so the toe area keeps its height."], ["Structure", "Arch-full shape · heel cup · air holes · wood-chip blend"]]],
    insHow: ["RHARA SHOE · Insole structure", "One layer under the insole — filled to the arch line.", [["01", "Lift the insole"], ["02", "Lay it in, heel first"], ["03", "Put the insole back"]],
      [["Sizes", "M 15 cm (shoe 220–255) · L 17 cm (shoe 260–290)"], ["Thickness", "Heel 3 mm · arch up to 15 mm"], ["Colors", "Gray · Mocha Mousse"], ["Material", "E-Silipolyrene + woodshop off-cut wood chips"]], "Not a medical device."],
    rf: ["BRAND 02 · re.feeel", "The next shape of what's left.", "REFILL YOUR DAY — everyday things, from leftover materials.\nFrom forest-thinning wood (CXP) and off-cut wallpaper, we make everything from toothbrushes to bath slippers."],
    oral: ["re.feeel · Oral care", "Handles and cups in thinning-wood CXP.", [["DAY2NIGHT toothbrush", "CXP handle · two brushes for morning and night"], ["Rinse cup", "CXP · stands upside down at 40° to dry"], ["Floss pick", "Floss you hold like a toothbrush"], ["Promotional logo toothbrush", "Partner-made oyster-shell material toothbrush, engraved with the re.feeel logo"]]],
    bath: ["re.feeel · Bath & stationery", "Off-cut wallpaper, reused in bath slippers.", [["Smile bath slippers (2 types)", "With off-cut silk-wallpaper PVC · drain holes in the footbed"], ["CXP ballpoint pen", "Thinning-wood (CXP) body · click type"]]],
    moq: ["SUPPLY TERMS", "MOQ & terms", [["600", "pairs", "Shoes · insoles · bath slippers"], ["600", "pcs", "CXP ballpoint pen"], ["2,000", "pcs", "Toothbrush · floss pick · rinse cup"]],
      [["Custom packaging", "Available at or above MOQ"], ["Pricing", "Quotation by item and quantity"], ["Lead time", "Confirmed with production schedule"], ["Samples", "Available for evaluation"], ["Certification", "Costly steps such as U.S. FDA registration for oral care are agreed separately"]]],
    contact: ["CONTACT", "Samples, spec sheets and quotations on request.", [["Contact", "Dongkyu Shin, CEO"], ["Email", "rndceo@rndmakers.kr"], ["Phone", "+82 507-1317-2516"], ["Web", "rndmakers.kr"]]],
    foot: { co: "R&D MAKERS", rs: "RHARA SHOE", rf: "re.feeel" }
  }
};

function build(lang) {
  const t = T[lang], F = t.font, p = new pptxgen(); p.layout = "LAYOUT_WIDE"; let n = 0;
  const tx = (s, v, o) => s.addText(v, Object.assign({ fontFace: F, color: C.ink, margin: 0, valign: "top" }, o));
  const sz = { d: 44, h1: 28, h2: 18, b: 14, c: 10 };
  // 사진 칸: 흰 배경/어두운 배경 = 모서리 색 칸 + contain(안쪽 0.6, 아래 정렬) / lifestyle = cover
  function panel(s, key, x, y, w, h, mode = "contain", bgOverride) {
    const im = IMG[key];
    if (mode === "cover") { s.addImage({ path: im.p, x, y, w, h, sizing: { type: "cover", w, h } }); return; }
    const bg = bgOverride || (im.bg === "000000" && key === "pen" ? C.paper2 : im.bg);
    s.addShape(p.ShapeType.rect, { x, y, w, h, fill: { color: bg }, line: { color: bg } });
    const pad = 0.6, aw = w - 2 * pad, ah = h - 2 * pad, r = im.w / im.h;
    let iw = aw, ih = aw / r; if (ih > ah) { ih = ah; iw = ah * r; }
    s.addImage({ path: im.p, x: x + (w - iw) / 2, y: y + h - pad - ih, w: iw, h: ih });
  }
  function slide(bg, brand) {
    const s = p.addSlide(); s.background = { color: bg }; n++;
    const dark = bg === C.ink;
    tx(s, t.foot[brand].toUpperCase() === "RE.FEEEL" ? t.foot[brand] : t.foot[brand], { x: M, y: 6.95, w: 4, h: 0.3, fontSize: sz.c, bold: true, charSpacing: 2, color: dark ? C.sage : C.sub });
    tx(s, String(n).padStart(2, "0"), { x: W - M - 1, y: 6.95, w: 1, h: 0.3, fontSize: sz.c, align: "right", color: dark ? C.sage : C.sub });
    return s;
  }
  const label = (s, v, x, y, w, dark, accent) => tx(s, v, { x, y, w, h: 0.3, fontSize: sz.c, bold: true, charSpacing: 2, color: accent || (dark ? C.sage : C.sub) });
  function table(s, rows, x, y, w, lw, dark) {
    rows.forEach(([k, v], i) => {
      const yy = y + i * 0.5;
      s.addShape(p.ShapeType.line, { x, y: yy, w, h: 0, line: { color: dark ? "2A3A31" : C.line, width: 0.5 } });
      tx(s, k, { x, y: yy + 0.13, w: lw, h: 0.3, fontSize: sz.c, color: dark ? C.sage : C.sub });
      tx(s, v, { x: x + lw, y: yy + 0.1, w: w - lw, h: 0.35, fontSize: sz.b - 1, color: dark ? C.white : C.ink });
    });
    s.addShape(p.ShapeType.line, { x, y: y + rows.length * 0.5, w, h: 0, line: { color: dark ? "2A3A31" : C.line, width: 0.5 } });
  }
  function items(s, list, x, y, w, gap, dark) {
    list.forEach(([h, b], i) => {
      const yy = y + i * gap;
      tx(s, h, { x, y: yy, w, h: 0.4, fontSize: sz.h2, bold: true, color: dark ? C.white : C.ink });
      tx(s, b, { x, y: yy + 0.42, w, h: gap - 0.5, fontSize: sz.b, color: dark ? C.sage : C.sub, lineSpacingMultiple: 1.2 });
    });
  }
  const logoRS = (s, x, y, h, light) => s.addImage({ path: A + (light ? "rs-logo-white.png" : "rs-logo-ink.png"), x, y, w: h * 1.19, h, sizing: { type: "contain", w: h * 1.19, h } });
  const logoRF = (s, x, y, h) => s.addImage({ path: A + "refeeel-logo.png", x, y, w: h * 0.7, h, sizing: { type: "contain", w: h * 0.7, h } });

  // 1 표지 (T1)
  let s = slide(C.paper, "co");
  label(s, t.cover[0], M, 0.6, span(6));
  tx(s, t.cover[1], { x: M, y: 2.4, w: span(6), h: 1.8, fontSize: sz.d, bold: true, lineSpacingMultiple: 1.0 });
  tx(s, t.cover[2], { x: M, y: 4.3, w: span(6), h: 1.0, fontSize: sz.b, color: C.sub, lineSpacingMultiple: 1.4 });
  logoRS(s, M, 6.25, 0.45); logoRF(s, M + 0.85, 6.25, 0.45);
  panel(s, "booth", 7.8, 0, W - 7.8, H, "cover");

  // 2 회사 소개
  s = slide(C.paper, "co");
  label(s, t.about[0], M, 0.6, 6);
  tx(s, t.about[1], { x: M, y: 0.95, w: span(7), h: 1.1, fontSize: sz.h1, bold: true });
  tx(s, t.about[2], { x: M, y: 2.6, w: span(5), h: 2.0, fontSize: sz.b, color: C.sub, lineSpacingMultiple: 1.4 });
  table(s, t.about[3], col(7), 2.6, span(6), 1.6, false);

  // 3 소재 (T5 변형)
  s = slide(C.paper, "co");
  label(s, t.mat[0], M, 0.6, 6); tx(s, t.mat[1], { x: M, y: 0.95, w: 11, h: 0.6, fontSize: sz.h1, bold: true });
  const mimg = ["outsole_dark", "sl_trio", "rf_brush"];
  t.mat[2].forEach(([no, h, b], i) => {
    const x = col(1 + i * 4), w = span(4);
    panel(s, mimg[i], x, 2.1, w, 2.6, i === 0 ? "contain" : "cover");
    label(s, no, x, 4.95, w);
    tx(s, h, { x, y: 5.25, w, h: 0.5, fontSize: sz.h2, bold: true });
    tx(s, "→ " + b, { x, y: 5.8, w, h: 0.4, fontSize: sz.b, color: C.sub });
  });

  // 4 근거 (T5)
  s = slide(C.paper, "co");
  label(s, t.proof[0], M, 0.6, 6); tx(s, t.proof[1], { x: M, y: 0.95, w: 11, h: 0.6, fontSize: sz.h1, bold: true });
  t.proof[2].forEach(([num, unit, cap], i) => {
    const x = col(1 + i * 4), w = span(4);
    tx(s, [{ text: num, options: { fontSize: sz.d, bold: true } }, { text: unit ? " " + unit : "", options: { fontSize: sz.h2, bold: true } }], { x, y: 2.1, w, h: 0.9 });
    tx(s, cap, { x, y: 3.1, w, h: 0.8, fontSize: sz.c + 1, color: C.sub, lineSpacingMultiple: 1.3 });
  });
  s.addShape(p.ShapeType.line, { x: M, y: 4.4, w: W - 2 * M, h: 0, line: { color: C.line, width: 0.5 } });
  t.proof[3].forEach((v, i) => tx(s, v, { x: col(1 + (i % 2) * 6), y: 4.65 + Math.floor(i / 2) * 0.7, w: span(6), h: 0.6, fontSize: sz.b }));

  // 5 RHARA SHOE 구분 장 (T2)
  s = slide(C.ink, "rs");
  logoRS(s, M, 0.6, 0.6, true);
  label(s, t.rs[0], M, 2.6, 6, true, C.lime);
  tx(s, t.rs[1], { x: M, y: 2.95, w: 5.8, h: 1.0, fontSize: sz.d, bold: true, color: C.white });
  tx(s, t.rs[2], { x: M, y: 4.3, w: 5.8, h: 2.2, fontSize: sz.b, color: C.sage, lineSpacingMultiple: 1.4 });
  panel(s, "walk_top", 6.67, 0, 6.66, H);

  // 6 워킹화 대표 (T3)
  s = slide(C.paper2, "rs");
  label(s, t.walk[0], M, 0.6, 6); tx(s, t.walk[1], { x: M, y: 0.95, w: span(5), h: 1.1, fontSize: sz.h1, bold: true });
  tx(s, t.walk[2], { x: M, y: 2.1, w: span(5), h: 0.5, fontSize: sz.b, color: C.sub });
  items(s, t.walk[3], M, 2.9, span(5), 1.25, false);
  panel(s, "walk_pair", 6.67, 0, 6.66, H);

  // 7 워킹화 구조 (T4) — 밑창 실물 + 번호
  s = slide(C.paper2, "rs");
  panel(s, "walk_sole", 0, 0, 7.3, H, "cover");
  // 번호 ① — 실물 사진의 패드 위치(왼쪽 밑창 둘째 패드)에 맞춤: 이미지 1441x1600 기준 (294,630) → cover 배치 환산
  { const iw = 1441, ih = 1600, bw = 7.3, bh = H, sc = Math.max(bw / iw, bh / ih), ox = (bw - iw * sc) / 2, oy = (bh - ih * sc) / 2;
    const mk = (px, py, no) => { const x = ox + px * sc - 0.15, y = oy + py * sc - 0.15;
      s.addShape(p.ShapeType.ellipse, { x, y, w: 0.3, h: 0.3, fill: { color: C.ink }, line: { color: C.white, width: 1 } });
      tx(s, no, { x, y: y + 0.05, w: 0.3, h: 0.2, fontSize: sz.c, bold: true, color: C.white, align: "center" }); };
    mk(294, 630, "1"); mk(160, 1150, "2"); }
  label(s, t.how[0], 7.8, 0.6, 5); tx(s, t.how[1], { x: 7.8, y: 0.95, w: 4.78, h: 1.1, fontSize: sz.h1 - 4, bold: true });
  t.how[2].forEach(([h, b], i) => { const y = 2.3 + i * 1.4;
    tx(s, String(i + 1), { x: 7.8, y, w: 0.4, h: 0.4, fontSize: sz.h2, bold: true, color: C.sub });
    tx(s, h, { x: 8.25, y, w: 4.3, h: 0.4, fontSize: sz.h2, bold: true });
    tx(s, b, { x: 8.25, y: y + 0.42, w: 4.3, h: 0.9, fontSize: sz.b - 1, color: C.sub, lineSpacingMultiple: 1.2 }); });
  tx(s, t.how[3], { x: 7.8, y: 6.55, w: 4.78, h: 0.3, fontSize: sz.c, color: C.sub });

  // 8 시험·직원 근무화 (근거 장, 차콜)
  s = slide(C.ink, "rs");
  label(s, t.slip[0], M, 0.6, 8, true); tx(s, t.slip[1], { x: M, y: 0.95, w: 11, h: 0.6, fontSize: sz.h1, bold: true, color: C.white });
  tx(s, "0.36", { x: M, y: 2.1, w: span(4), h: 0.9, fontSize: sz.d, bold: true, color: C.white });
  s.addShape(p.ShapeType.rect, { x: M, y: 3.05, w: 0.6, h: 0.05, fill: { color: C.lime }, line: { color: C.lime } });
  tx(s, t.slip[2], { x: M, y: 3.25, w: span(5), h: 0.4, fontSize: sz.c + 1, color: C.sage });
  table(s, t.slip[3], M, 3.9, span(6), 1.5, true);
  tx(s, t.slip[4], { x: M, y: 6.05, w: span(6), h: 0.5, fontSize: sz.c, color: C.sage });
  tx(s, t.slip[5], { x: col(8), y: 2.1, w: span(5), h: 1.1, fontSize: sz.h2, bold: true, color: C.white, lineSpacingMultiple: 1.2 });
  t.slip[6].forEach((v, i) => tx(s, "— " + v, { x: col(8), y: 3.6 + i * 0.6, w: span(5), h: 0.5, fontSize: sz.b, color: C.sage }));

  // 9 인솔 대표 (T3)
  s = slide(C.paper2, "rs");
  label(s, t.ins[0], M, 0.6, 6); tx(s, t.ins[1], { x: M, y: 0.95, w: span(5), h: 1.1, fontSize: sz.h1, bold: true });
  tx(s, t.ins[2], { x: M, y: 2.1, w: span(5), h: 0.5, fontSize: sz.b, color: C.sub });
  items(s, t.ins[3], M, 2.9, span(5), 1.25, false);
  panel(s, "ins_pack", 6.67, 0, 6.66, H);

  // 10 인솔 구조 (T4 + T6)
  s = slide(C.paper2, "rs");
  panel(s, "ins_layer", 0, 0, 6.4, H);
  label(s, t.insHow[0], 6.79, 0.6, 6); tx(s, t.insHow[1], { x: 6.79, y: 0.95, w: 5.79, h: 1.1, fontSize: sz.h1 - 4, bold: true });
  t.insHow[2].forEach(([no, v], i) => { const x = 6.79 + i * 1.98;
    label(s, no, x, 2.25, 1.8); tx(s, v, { x, y: 2.55, w: 1.85, h: 0.7, fontSize: sz.b, bold: true }); });
  table(s, t.insHow[3], 6.79, 3.6, 5.79, 1.3, false);
  tx(s, lang === "ko" ? "왼쪽: 구조 설명 그림 (실제 색상과 다름)" : "Left: structure illustration (not actual colors)", { x: 0.3, y: 6.95, w: 6, h: 0.3, fontSize: 10, color: "9FB3A6", fontFace: F, margin: 0 });
  tx(s, t.insHow[4], { x: 6.79, y: 5.75, w: 5.79, h: 0.3, fontSize: sz.c, color: C.sub });

  // 11 re.feeel 구분 장 (T2)
  s = slide(C.paper2, "rf");
  logoRF(s, M, 0.5, 0.8);
  label(s, t.rf[0], M, 2.6, 6, false, C.rf);
  tx(s, t.rf[1], { x: M, y: 2.95, w: 5.8, h: 1.1, fontSize: sz.d - 4, bold: true });
  tx(s, t.rf[2], { x: M, y: 4.3, w: 5.8, h: 2.2, fontSize: sz.b, color: C.sub, lineSpacingMultiple: 1.4 });
  panel(s, "rf_brush", 6.67, 0, 6.66, H, "cover");

  // 12 구강케어 (T3)
  s = slide(C.paper2, "rf");
  label(s, t.oral[0], M, 0.6, 6, false, C.rf); tx(s, t.oral[1], { x: M, y: 0.95, w: span(6), h: 1.1, fontSize: sz.h1, bold: true });
  items(s, t.oral[2], M, 2.2, span(5), 1.1, false);
  panel(s, "cup_tilt", 6.67, 0, 6.66, H);

  // 13 욕실화·볼펜 (T3)
  s = slide(C.paper2, "rf");
  label(s, t.bath[0], M, 0.6, 6, false, C.rf); tx(s, t.bath[1], { x: M, y: 0.95, w: span(6), h: 1.1, fontSize: sz.h1, bold: true });
  items(s, t.bath[2], M, 2.4, span(5), 1.5, false);
  panel(s, "sl_trio", 6.67, 0, 6.66, H, "cover");

  // 14 MOQ (T7)
  s = slide(C.paper, "co");
  label(s, t.moq[0], M, 0.6, 6); tx(s, t.moq[1], { x: M, y: 0.95, w: 11, h: 0.6, fontSize: sz.h1, bold: true });
  t.moq[2].forEach(([num, unit, cap], i) => { const x = col(1 + i * 4), w = span(4);
    tx(s, [{ text: num, options: { fontSize: sz.h1 + 8, bold: true } }, { text: " " + unit, options: { fontSize: sz.h2, bold: true } }], { x, y: 2.1, w, h: 0.7 });
    tx(s, cap, { x, y: 2.85, w, h: 0.4, fontSize: sz.b, color: C.sub }); });
  table(s, t.moq[3], M, 3.8, W - 2 * M, 2.4, false);

  // 15 문의 (T8)
  s = slide(C.ink, "co");
  label(s, t.contact[0], M, 0.6, 6, true);
  tx(s, t.contact[1], { x: M, y: 1.5, w: 9, h: 1.6, fontSize: sz.d - 8, bold: true, color: C.white });
  table(s, t.contact[2], M, 3.6, span(6), 1.6, true);
  logoRS(s, 10.2, 5.9, 0.6, true);
  s.addShape(p.ShapeType.ellipse, { x: 11.35, y: 5.8, w: 0.8, h: 0.8, fill: { color: "FFFFFF" }, line: { color: "FFFFFF" } });
  logoRF(s, 11.47, 5.83, 0.74);

  return p.writeFile({ fileName: R + "sales/" + t.file });
}
Promise.all([build("ko"), build("en")]).then(f => console.log(f.join("\n")));
