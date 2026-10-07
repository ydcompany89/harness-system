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
  pres.defineSlideMaster({ title: 'BLANK_NAVY', background: { color: NAVY }, objects: [] });
  const T = (s, text, o) => s.addText(text, Object.assign({ margin: 0, isTextBox: true, valign: 'top' }, o));
  const eb = (s, text, color) => T(s, text, { x: M, y: 0.5, w: CW, h: 0.28, fontSize: 10, bold: true, charSpacing: 4, color, objectName: '아이브로' });
  const rr = (s, x, y, w, h, color, name, r = 0.08) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: r, fill: { color }, line: { type: 'none' }, objectName: name });
  const circ = (s, x, y, d, color, name) => s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { type: 'none' }, objectName: name });

  // 1 표지 + 회사 한눈에
  pres.addSection({ title: '표지' });
  let s = pres.addSlide({ masterName: 'BLANK_NAVY', sectionTitle: '표지' });
  T(s, 'R&D MAKERS', { x: M, y: 0.55, w: 4, h: 0.3, fontSize: 12, bold: true, charSpacing: 5, color: C.background1 });
  T(s, 'COMPANY & BRAND 2026', { x: W - M - 4, y: 0.55, w: 4, h: 0.3, fontSize: 10, charSpacing: 4, color: C.background2, align: 'right' });
  circ(s, 4.6, 1.35, 0.45, C.accent3, '보라 원'); circ(s, 5.55, 1.15, 1.3, YEL, '라임 타깃'); circ(s, 5.88, 1.48, 0.64, NAVY, '타깃 속'); circ(s, 6.06, 1.66, 0.28, YEL, '타깃 중심');
  T(s, '남은 것의\n다음 모양.', { x: M, y: 2.3, w: 6.2, h: 2.3, fontSize: 54, bold: true, color: C.background2, lineSpacingMultiple: 0.95, objectName: '헤드라인' });
  T(s, '버려지는 소재로 제품을 만드는 제조사, 알앤디메이커스\n그리고 서서 일하는 사람들을 위한 새 브랜드, 라라슈', { x: M, y: 4.85, w: 6.2, h: 0.8, fontSize: 13.5, color: C.background1, lineSpacingMultiple: 1.3, objectName: '부제' });
  T(s, '㈜알앤디메이커스  ·  RhaRa Shoe 라라슈', { x: M, y: H - 0.85, w: 6, h: 0.3, fontSize: 11, bold: true, color: YEL });
  [['2023', '법인 창립\n창업진흥원 국가과제 수행'], ['전국', '다이소 전국 매장 입점\n2023.09~'], ['2회', '환경부 새활용 지원사업\n2024 · 2026 2차']].forEach(([big, d], i) => {
    const y = 1.35 + i * 1.75;
    rr(s, 7.55, y, 5.13, 1.5, C.accent5, '숫자 카드');
    T(s, big, { x: 7.9, y: y + 0.28, w: 1.9, h: 0.9, fontSize: 40, bold: true, color: YEL, valign: 'middle', objectName: '큰 숫자' });
    T(s, d, { x: 9.7, y: y + 0.28, w: 2.85, h: 0.9, fontSize: 13, lineSpacingMultiple: 1.25, color: C.background1, valign: 'middle', objectName: '설명' });
  });

  // 2 알앤디메이커스: 하는 일 + 연혁
  pres.addSection({ title: '알앤디메이커스' });
  s = pres.addSlide({ masterName: 'PAPER', sectionTitle: '알앤디메이커스' });
  eb(s, 'COMPANY', C.accent3); s.addText('소재부터 납품까지, 한 회사에서', { placeholder: 'title' });
  const steps = [['01  소재', '실크벽지 PVC · 폐타이어 고무 · CXP 목재 복합소재'], ['02  기획 · 설계', '제품 디자인 · 금형 · 상표/특허 출원 · 라이선싱'], ['03  생산 · 납품', '국내 제조 · 대형 매장 전국 납품 · B2B/OEM']];
  const sw = (CW - 0.4) / 3;
  steps.forEach(([t, d], i) => { const x = M + i * (sw + 0.2);
    rr(s, x, 1.85, sw, 1.35, C.accent4, '역량 카드');
    T(s, [{ text: t, options: { bold: true, fontSize: 16, color: C.text1, breakLine: true } }, { text: d, options: { fontSize: 11.5, color: C.text2 } }], { x: x + 0.3, y: 2.05, w: sw - 0.6, h: 1.0, lineSpacingMultiple: 1.25, objectName: '역량' }); });
  T(s, 'HISTORY', { x: M, y: 3.55, w: 3, h: 0.28, fontSize: 10, bold: true, charSpacing: 4, color: C.accent3 });
  s.addShape(pres.shapes.LINE, { x: M, y: 4.12, w: CW, h: 0, line: { color: 'D8D6EE', width: 2 }, objectName: '타임라인' });
  const HIS = [['2023', '창업진흥원 국가과제\n㈜알앤디메이커스 창립\n다이소 전국 매장 입점'], ['2024', '환경부 새활용지원사업\n오피스디포·오피스웨이 납품\n중국 첫 수출'],
    ['2025', '상표권·BM 특허 출원\n꿈돌이 캐릭터 라이선싱\n롯데패키징앤솔루션·서브원 납품'], ['2026', '환경부 새활용지원사업 2차\n라라슈(RhaRa Shoe) 런칭\n11.11 첫 라인업 오픈']];
  const hw = (CW - 0.6) / 4;
  HIS.forEach(([y, t], i) => { const x = M + i * (hw + 0.2), hot = y === '2026';
    circ(s, x, 3.97, 0.3, hot ? LIME : C.accent3, '연혁 점');
    T(s, y, { x, y: 4.45, w: hw, h: 0.5, fontSize: 24, bold: true, color: C.text1 });
    if (hot) rr(s, x - 0.12, 5.0, hw + 0.12, 1.55, 'F4FBD9', '2026 강조', 0.06);
    T(s, t, { x, y: 5.12, w: hw - 0.1, h: 1.4, fontSize: 11.5, color: hot ? C.text1 : C.text2, bold: hot, lineSpacingMultiple: 1.35, objectName: '연혁 ' + y }); });

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

  // 4 함께하기
  pres.addSection({ title: '함께하기' });
  s = pres.addSlide({ masterName: 'NAVY', sectionTitle: '함께하기' });
  eb(s, 'LAUNCH & PARTNERSHIP', YEL); s.addText('11월, 현장에서 만나요', { placeholder: 'title' });
  [['11.11', '라라슈 1차 라인업 오픈', '워킹화 · 인솔 온라인 출시'], ['11.12 – 15', '킨텍스 메가쇼', '실물 체험 · 단체 구매 상담'], ['11.26 – 29', '서울디자인페어 (코엑스)', '브랜드 · 소재 전시']].forEach(([d, t, sub], i) => {
    const y = 1.95 + i * 1.08;
    T(s, d, { x: M, y, w: 2.2, h: 0.5, fontSize: 22, bold: true, color: YEL });
    T(s, [{ text: t, options: { bold: true, fontSize: 15, color: C.background1, breakLine: true } }, { text: sub, options: { fontSize: 11.5, color: C.background2 } }], { x: M + 2.35, y: y + 0.02, w: 4.3, h: 0.8 }); });
  rr(s, 7.3, 1.95, 5.38, 3.75, YEL, '상담 박스', 0.1);
  T(s, [{ text: 'B2B · OEM/ODM · 납품 상담', options: { bold: true, fontSize: 18, color: NAVY, breakLine: true } }, { text: '단체 공급 · 자체 브랜드 OEM · 소재 ODM', options: { fontSize: 11.5, color: NAVY } }], { x: 7.65, y: 2.25, w: 4.7, h: 0.8 });
  T(s, [{ text: '㈜알앤디메이커스  신동규 대표', options: { bold: true, breakLine: true } }, { text: '대전시 유성구 국제과학7로 8', options: { breakLine: true } },
        { text: 'T  010-6880-2516', options: { breakLine: true } }, { text: 'E  rndceo@rndmakers.kr', options: { breakLine: true } }, { text: 'www.rndmakers.kr', options: {} }],
    { x: 7.65, y: 3.35, w: 3.0, h: 2.0, fontSize: 12, color: NAVY, lineSpacingMultiple: 1.3, objectName: '연락처' });
  s.addImage({ path: 'img/qr-deck.png', x: 10.85, y: 3.4, w: 1.5, h: 1.5, objectName: 'QR' });
  T(s, '라라슈 오픈 알림', { x: 10.6, y: 4.95, w: 2.0, h: 0.3, fontSize: 9.5, bold: true, color: NAVY, align: 'center' });

  await pres.writeFile({ fileName: 'rndmakers-rharashoe-intro-4p.pptx' });
  await applyTheme('rndmakers-rharashoe-intro-4p.pptx', THEME);
  console.log('ok');
})();
