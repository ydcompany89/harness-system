// 알앤디메이커스 × 라라슈 소개서 요약판 (16:9, 4p): NODE_PATH=./node_modules node build4.js → rndmakers-rharashoe-intro-4p.pptx
const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/5d3bce6c-bc48-4bd0-b0e5-3edd7d02f77d_b6ab80fe-3f67-4e27-b365-659a453d117a/pptx/scripts/apply_theme.js');
const THEME = { name: 'R&amp;D MAKERS x RhaRa Shoe', headFontFace: 'Malgun Gothic', bodyFontFace: 'Malgun Gothic',
  colors: { dk1: '181478', lt1: 'FFFFFF', dk2: '4A4868', lt2: 'EEECE2', accent1: 'E0E828', accent2: 'FF6A48',
    accent3: '5650C4', accent4: 'F1F0FA', accent5: '2A2591', accent6: 'C6F432', hlink: '5650C4', folHlink: '5650C4' } };
const W = 13.333, H = 7.5, M = 0.65, CW = W - 2 * M, NAVY = '181478', INK = '0B0B0B', LIME = 'C6F432', YEL = 'E0E828';
(async () => {
  const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = '알앤디메이커스 × 라라슈 소개서 (요약)'; pres.author = '㈜알앤디메이커스';
  const C = pres.SchemeColor;
  const titlePh = (color) => ({ placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.82, w: CW, h: 0.75, fontSize: 30, bold: true, color, margin: 0, valign: 'middle', align: 'left' }, text: '' } });
  const foot = (color) => [{ text: { text: 'R&D MAKERS  ×  RhaRa Shoe', options: { x: M, y: H - 0.5, w: 5, h: 0.25, fontSize: 8, charSpacing: 3, color, margin: 0 } } }];
  const sn = (color) => ({ x: W - M - 0.6, y: H - 0.5, w: 0.6, h: 0.25, fontSize: 8, color, align: 'right' });
  pres.defineSlideMaster({ title: 'NAVY', background: { color: NAVY }, objects: [titlePh(C.background1), ...foot(C.background2)], slideNumber: sn(C.background2) });
  pres.defineSlideMaster({ title: 'PAPER', background: { color: 'FFFFFF' }, objects: [titlePh(C.text1), ...foot(C.text2)], slideNumber: sn(C.text2) });
  pres.defineSlideMaster({ title: 'INK', background: { color: INK }, objects: [titlePh(C.background1), ...foot('8A8A85')], slideNumber: sn('8A8A85') });
  pres.defineSlideMaster({ title: 'IVORY', background: { color: 'F2EDE1' }, objects: [{ placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.82, w: CW, h: 0.75, fontSize: 30, bold: true, color: '1F472C', margin: 0, valign: 'middle', align: 'left' }, text: '' } }, ...foot('6B6B5E')], slideNumber: sn('6B6B5E') });
  pres.defineSlideMaster({ title: 'BLANK_NAVY', background: { color: NAVY }, objects: [] });
  const T = (s, text, o) => s.addText(text, Object.assign({ margin: 0, isTextBox: true, valign: 'top' }, o));
  const eb = (s, text, color) => T(s, text, { x: M, y: 0.5, w: CW, h: 0.28, fontSize: 10, bold: true, charSpacing: 4, color, objectName: '아이브로' });
  const rr = (s, x, y, w, h, color, name, r = 0.08) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: r, fill: { color }, line: { type: 'none' }, objectName: name });
  const circ = (s, x, y, d, color, name) => s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { type: 'none' }, objectName: name });

  // 1 표지
  pres.addSection({ title: '표지' });
  let s = pres.addSlide({ masterName: 'BLANK_NAVY', sectionTitle: '표지' });
  T(s, 'R&D MAKERS', { x: M, y: 0.55, w: 4, h: 0.3, fontSize: 12, bold: true, charSpacing: 5, color: C.background1 });
  T(s, 'COMPANY & BRAND 2026', { x: W - M - 4, y: 0.55, w: 4, h: 0.3, fontSize: 10, charSpacing: 4, color: C.background2, align: 'right' });
  circ(s, 8.2, 1.6, 0.55, C.accent3, '보라 원'); circ(s, 9.3, 4.2, 1.0, C.accent2, '코랄 도넛'); circ(s, 9.62, 4.52, 0.36, NAVY, '도넛 속');
  circ(s, 10.0, 1.3, 2.4, YEL, '라임 타깃'); circ(s, 10.6, 1.9, 1.2, NAVY, '타깃 속'); circ(s, 10.93, 2.23, 0.54, YEL, '타깃 중심');
  T(s, '남은 것의\n다음 모양.', { x: M, y: 2.0, w: 7, h: 2.6, fontSize: 60, bold: true, color: C.background2, lineSpacingMultiple: 0.95, objectName: '헤드라인' });
  T(s, '버려지는 소재로 제품을 만드는 제조사, 알앤디메이커스\n그리고 그 소재로 만든 두 브랜드, re.feeel과 라라슈', { x: M, y: 4.85, w: 7.5, h: 0.8, fontSize: 15, color: C.background1, lineSpacingMultiple: 1.3, objectName: '부제' });
  T(s, '㈜알앤디메이커스  ·  re.feeel  ·  RhaRa Shoe 라라슈', { x: M, y: H - 0.85, w: 7, h: 0.3, fontSize: 11, bold: true, color: YEL, objectName: '하단' });

  // 2 re.feeel 구강용품
  pres.addSection({ title: 're.feeel' });
  s = pres.addSlide({ masterName: 'IVORY', sectionTitle: 're.feeel' });
  const GR = '1F472C';
  eb(s, 'RE.FEEEL  ·  ORAL CARE', '3F7A52'); s.addText('생활을 다시 채우다.', { placeholder: 'title' });
  T(s, '숲을 가꾸며 솎아낸 간벌재(임업부산물)를 CXP 소재로 바꿔, 매일 쓰는 구강용품으로 만듭니다.', { x: M, y: 1.6, w: 9.6, h: 0.35, fontSize: 13, color: '4A4A40', objectName: '브랜드 설명' });
  s.addImage({ path: 'img/refeeel-seal.png', x: W - M - 1.35, y: 0.35, w: 1.35, h: 1.35 * 500 / 490, objectName: 're.feeel 로고' });
  const RP = [
    ['img/toothbrush.jpg', "나이스샷 '왕모' 칫솔", ['CXP 소재 핸들 · 6개입', '넓은 헤드 · 이중미세모 / 스파이럴모']],
    ['img/floss.jpg', '칫솔형 치실', ['ㄱ자 헤드 · 칫솔처럼 쥐는 손잡이', '리필 20개입 교체형 · 세트 4,900원']],
    ['img/cup-tilt.jpg', '물때 제로 양치컵', ['40° 셀프 드레인 설계 — 기울여 세워 말림', 'CXP 소재 · 110g · 국내 제조']]];
  const rw = (CW - 0.5) / 3;
  RP.forEach(([img, name, lines], i) => {
    const x = M + i * (rw + 0.25);
    rr(s, x, 2.15, rw, 4.0, 'FFFFFF', '제품 카드');
    s.addImage({ path: img, x: x + 0.15, y: 2.3, w: rw - 0.3, h: 2.35, sizing: { type: 'cover', w: rw - 0.3, h: 2.35 }, objectName: name });
    T(s, name, { x: x + 0.3, y: 4.85, w: rw - 0.6, h: 0.4, fontSize: 16, bold: true, color: GR, objectName: '제품명' });
    T(s, lines.map((t, j) => ({ text: t, options: { breakLine: j < lines.length - 1 } })), { x: x + 0.3, y: 5.3, w: rw - 0.6, h: 0.75, fontSize: 11, color: '4A4A40', lineSpacingMultiple: 1.3, objectName: '제품 설명' });
  });
  rr(s, M, 6.35, CW, 0.45, GR, 'CXP 띠', 0.06);
  T(s, [{ text: 'CXP   ', options: { bold: true, color: 'FBD827' } }, { text: '간벌재 등 임업부산물을 활용한 셀룰로스 기반 복합소재  ·  칫솔·치실·양치컵 공통 소재', options: { color: 'F2EDE1' } }],
    { x: M + 0.3, y: 6.35, w: CW - 0.6, h: 0.45, fontSize: 11, valign: 'middle', objectName: 'CXP 설명' });
  s.addNotes('출처: Drive refeeel_brand_concept.docx §6 라인업, SALKO 린스컵 소개서(110g·40°·국내 제조). 효능 표현(충치·잇몸·물때 방지) 배제 — 의약외품 아님. CXP의 PEFC/KFCC-CoC는 소재 제조사 인증이라 미표기. 치실 세트가는 회사 소개서(2601ver) 권장가 기준.');

  // 3 라라슈
  pres.addSection({ title: '라라슈' });
  s = pres.addSlide({ masterName: 'INK', sectionTitle: '라라슈' });
  eb(s, 'RHARA SHOE  ·  라라슈  ·  2026.11.11 OPEN', LIME); s.addText('Made for Standing.', { placeholder: 'title' });
  T(s, '친구 셋의 식당에서 매일 10~12시간 서서 일하는 모습을 보고 시작한, 서서 일하는 사람들을 위한 워킹화와 인솔.', { x: M, y: 1.6, w: CW, h: 0.35, fontSize: 13, color: 'C9C9C4' });
  const lw = (CW - 0.3) / 2;
  const P = [{ img: 'img/tile-shoes.png', r: 1.2, name: '쿼드그립 종일편한 워킹화', price: '42,500원', d: '쿼드그립 4점 패드 · 깔창 없는 일체형 안창 · 도톰한 발목 테두리' },
    { img: 'img/tile-insole.png', r: 1.6, name: '쿼드그립 아치가득 인솔', price: '21,500원', d: '아치가득 구조 · 뒤꿈치 컵 · 우드칩 배합 소재' }];
  P.forEach((p, i) => { const x = M + i * (lw + 0.3);
    rr(s, x, 2.15, lw, 3.75, '161616', '제품 카드');
    const ih = 2.25, iw = ih * p.r;
    s.addImage({ path: p.img, x: x + (lw - iw) / 2, y: 2.25, w: iw, h: ih, objectName: p.name });
    T(s, p.name, { x: x + 0.35, y: 4.65, w: lw - 2.2, h: 0.42, fontSize: 17, bold: true, color: 'EDEDE8', valign: 'middle' });
    T(s, p.price, { x: x + lw - 1.85, y: 4.65, w: 1.5, h: 0.42, fontSize: 17, bold: true, color: LIME, align: 'right', valign: 'middle' });
    T(s, p.d, { x: x + 0.35, y: 5.15, w: lw - 0.7, h: 0.5, fontSize: 11.5, color: 'A8A8A3', objectName: '핵심 구조' }); });
  rr(s, M, 6.1, CW, 0.62, '1A1A1A', '소재 띠');
  T(s, [{ text: '새활용 소재   ', options: { bold: true, color: LIME } }, { text: '그립 패드: 폐타이어 고무 + 실크벽지 폐PVC  ·  본체: E-실리폴리렌(EVA·실리콘 배합)  ·  인솔: 목공소 우드칩 배합', options: { color: 'C9C9C4' } }],
    { x: M + 0.3, y: 6.1, w: CW - 0.6, h: 0.62, fontSize: 11.5, valign: 'middle', objectName: '소재' });
  s.addNotes('밑창 라임 패드는 양산 컬러 확정(10/6 대표 승인). 워킹화 사진: 대표 제공 리터칭, 인솔: 9/30 실물 리터칭.');

  // 4 회사 + 상담
  pres.addSection({ title: '알앤디메이커스' });
  s = pres.addSlide({ masterName: 'NAVY', sectionTitle: '알앤디메이커스' });
  eb(s, 'COMPANY  ·  OEM / ODM', YEL); s.addText('소재부터 납품까지, 한 회사에서', { placeholder: 'title' });
  const steps = [['01  소재', '실크벽지 PVC · 폐타이어 고무 · CXP 목재 복합소재'], ['02  기획 · 설계', '제품 디자인 · 금형 · 상표/특허 출원 · 라이선싱'], ['03  생산 · 납품', '국내 제조 · 대형 매장 전국 납품 · B2B/OEM']];
  const sw = (CW - 0.4) / 3;
  steps.forEach(([t, d], i) => { const x = M + i * (sw + 0.2);
    rr(s, x, 1.8, sw, 1.2, C.accent5, '역량 카드');
    T(s, [{ text: t, options: { bold: true, fontSize: 15, color: YEL, breakLine: true } }, { text: d, options: { fontSize: 11, color: C.background1 } }], { x: x + 0.3, y: 1.98, w: sw - 0.6, h: 0.9, lineSpacingMultiple: 1.25, objectName: '역량' }); });
  T(s, 'HISTORY', { x: M, y: 3.35, w: 3, h: 0.28, fontSize: 10, bold: true, charSpacing: 4, color: YEL });
  const HW = 7.55, hw = (HW - 0.45) / 4;
  s.addShape(pres.shapes.LINE, { x: M, y: 3.9, w: HW, h: 0, line: { color: '4B46B0', width: 2 }, objectName: '타임라인' });
  const HIS = [['2023', '창업진흥원 국가과제\n㈜알앤디메이커스 창립\n다이소 전국 매장 입점'], ['2024', '환경부 새활용\n지원사업 수행\n오피스디포·오피스웨이\n중국 첫 수출'],
    ['2025', '상표권·BM 특허 출원\n꿈돌이 라이선싱\n롯데패키징앤솔루션\n· 서브원 납품'], ['2026', '환경부 새활용\n지원사업 2차\n라라슈 브랜드 런칭']];
  HIS.forEach(([y, t], i) => { const x = M + i * (hw + 0.15), hot = y === '2026';
    circ(s, x, 3.76, 0.28, hot ? LIME : C.accent3, '연혁 점');
    T(s, y, { x, y: 4.2, w: hw, h: 0.45, fontSize: 20, bold: true, color: hot ? YEL : C.background1 });
    T(s, t, { x, y: 4.75, w: hw, h: 1.6, fontSize: 10, color: hot ? YEL : C.background2, bold: hot, lineSpacingMultiple: 1.35, objectName: '연혁 ' + y }); });
  rr(s, 8.6, 3.35, W - M - 8.6, 2.65, YEL, '상담 박스', 0.1);
  T(s, [{ text: 'B2B · OEM/ODM · 납품 상담', options: { bold: true, fontSize: 15, color: NAVY } }], { x: 8.9, y: 3.55, w: 3.6, h: 0.4 });
  T(s, [{ text: '㈜알앤디메이커스  신동규 대표', options: { bold: true, breakLine: true } }, { text: '대전시 유성구 국제과학7로 8', options: { breakLine: true } },
        { text: 'T  010-6880-2516', options: { breakLine: true } }, { text: 'E  rndceo@rndmakers.kr', options: { breakLine: true } }, { text: 'www.rndmakers.kr', options: {} }],
    { x: 8.9, y: 4.1, w: 2.5, h: 1.9, fontSize: 10.5, color: NAVY, lineSpacingMultiple: 1.3, objectName: '연락처' });
  s.addImage({ path: 'img/qr-deck.png', x: 11.38, y: 4.15, w: 1.1, h: 1.1, objectName: 'QR' });
  T(s, '라라슈 알림', { x: 11.18, y: 5.3, w: 1.5, h: 0.25, fontSize: 8.5, bold: true, color: NAVY, align: 'center' });

  await pres.writeFile({ fileName: 'rndmakers-rharashoe-intro-4p.pptx' });
  await applyTheme('rndmakers-rharashoe-intro-4p.pptx', THEME);
  console.log('ok');
})();
