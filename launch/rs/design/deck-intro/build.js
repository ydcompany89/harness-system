// 알앤디메이커스 × 라라슈 소개서 (16:9, 10p): NODE_PATH=./node_modules node build.js → rndmakers-rharashoe-intro.pptx
const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/5d3bce6c-bc48-4bd0-b0e5-3edd7d02f77d_b6ab80fe-3f67-4e27-b365-659a453d117a/pptx/scripts/apply_theme.js');
const THEME = { name: 'R&amp;D MAKERS x RhaRa Shoe', headFontFace: 'Malgun Gothic', bodyFontFace: 'Malgun Gothic',
  colors: { dk1: '181478', lt1: 'FFFFFF', dk2: '4A4868', lt2: 'EEECE2', accent1: 'E0E828', accent2: 'FF6A48',
    accent3: '5650C4', accent4: 'F1F0FA', accent5: '2A2591', accent6: 'C6F432', hlink: '5650C4', folHlink: '5650C4' } };
const W = 13.333, H = 7.5, M = 0.65, CW = W - 2 * M, NAVY = '181478', INK = '0B0B0B', LIME = 'C6F432', YEL = 'E0E828';
(async () => {
  const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = '알앤디메이커스 × 라라슈 소개서'; pres.author = '㈜알앤디메이커스';
  const C = pres.SchemeColor;
  const titlePh = (color) => ({ placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.82, w: CW, h: 0.75, fontSize: 30, bold: true, color, margin: 0, valign: 'middle', align: 'left' }, text: '' } });
  const foot = (color) => [{ text: { text: 'R&D MAKERS  ×  RhaRa Shoe', options: { x: M, y: H - 0.5, w: 5, h: 0.25, fontSize: 8, charSpacing: 3, color, margin: 0 } } }];
  const sn = (color) => ({ x: W - M - 0.6, y: H - 0.5, w: 0.6, h: 0.25, fontSize: 8, color, align: 'right' });
  pres.defineSlideMaster({ title: 'NAVY', background: { color: NAVY }, objects: [titlePh(C.background1), ...foot(C.background2)], slideNumber: sn(C.background2) });
  pres.defineSlideMaster({ title: 'PAPER', background: { color: 'FFFFFF' }, objects: [titlePh(C.text1), ...foot(C.text2)], slideNumber: sn(C.text2) });
  pres.defineSlideMaster({ title: 'INK', background: { color: INK }, objects: [titlePh(C.background1), ...foot('8A8A85')], slideNumber: sn('8A8A85') });
  pres.defineSlideMaster({ title: 'BLANK_NAVY', background: { color: NAVY }, objects: [] });
  pres.defineSlideMaster({ title: 'BLANK_INK', background: { color: INK }, objects: [] });
  const T = (s, text, o) => s.addText(text, Object.assign({ margin: 0, isTextBox: true, valign: 'top' }, o));
  const eb = (s, text, color) => T(s, text, { x: M, y: 0.5, w: CW, h: 0.28, fontSize: 10, bold: true, charSpacing: 4, color, objectName: '아이브로' });
  const rr = (s, x, y, w, h, color, name, r = 0.08) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: r, fill: { color }, line: { type: 'none' }, objectName: name });
  const circ = (s, x, y, d, color, name) => s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { type: 'none' }, objectName: name });
  const num = (s, x, y, n, fill, txt) => { circ(s, x, y, 0.3, fill, '번호'); T(s, String(n), { x, y, w: 0.3, h: 0.3, fontSize: 10, bold: true, color: txt, align: 'center', valign: 'middle', objectName: '번호 글자' }); };
  const sec = (t) => pres.addSection({ title: t });

  // 1 표지
  sec('표지');
  let s = pres.addSlide({ masterName: 'BLANK_NAVY', sectionTitle: '표지' });
  T(s, 'R&D MAKERS', { x: M, y: 0.55, w: 4, h: 0.3, fontSize: 12, bold: true, charSpacing: 5, color: C.background1 });
  T(s, 'COMPANY & BRAND 2026', { x: W - M - 4, y: 0.55, w: 4, h: 0.3, fontSize: 10, charSpacing: 4, color: C.background2, align: 'right' });
  circ(s, 8.2, 1.6, 0.55, C.accent3, '보라 원'); circ(s, 9.3, 4.2, 1.0, C.accent2, '코랄 도넛'); circ(s, 9.62, 4.52, 0.36, NAVY, '도넛 속');
  circ(s, 10.0, 1.3, 2.4, YEL, '라임 타깃'); circ(s, 10.6, 1.9, 1.2, NAVY, '타깃 속'); circ(s, 10.93, 2.23, 0.54, YEL, '타깃 중심');
  T(s, '남은 것의\n다음 모양.', { x: M, y: 2.0, w: 7, h: 2.6, fontSize: 60, bold: true, color: C.background2, lineSpacingMultiple: 0.95, objectName: '헤드라인' });
  T(s, '버려지는 소재로 제품을 만드는 제조사, 알앤디메이커스\n그리고 서서 일하는 사람들을 위한 새 브랜드, 라라슈', { x: M, y: 4.85, w: 7.5, h: 0.8, fontSize: 15, color: C.background1, lineSpacingMultiple: 1.3, objectName: '부제' });
  T(s, '㈜알앤디메이커스  ·  RhaRa Shoe 라라슈', { x: M, y: H - 0.85, w: 6, h: 0.3, fontSize: 11, bold: true, color: YEL, objectName: '하단' });

  // 2 회사 한눈에
  sec('알앤디메이커스');
  s = pres.addSlide({ masterName: 'PAPER', sectionTitle: '알앤디메이커스' });
  eb(s, 'COMPANY', C.accent3); s.addText('버려지는 소재를 원료로, 원료를 제품으로', { placeholder: 'title' });
  T(s, '㈜알앤디메이커스는 실크벽지·폐타이어·임업부산물처럼 버려지는 자원을 새활용 원료로 바꾸고, 그 원료로 매일 쓰는 생활 제품을 만드는 대전의 제조 스타트업입니다.', { x: M, y: 1.75, w: 8.2, h: 0.75, fontSize: 14, color: C.text2, lineSpacingMultiple: 1.3, objectName: '회사 소개' });
  [['2023', '창립', '7월 법인 설립 · 같은 해 창업진흥원 국가과제 수행'], ['전국', '매장 입점', '업사이클링 욕실화 다이소 전국 매장 입점 (2023.09~)'], ['2회', '환경부 새활용 지원사업', '2024년 수행 · 2026년 2차 수행 중']].forEach(([big, lab, d], i) => {
    const x = M + i * 4.08;
    rr(s, x, 2.9, 3.85, 3.0, C.accent4, '숫자 카드');
    T(s, big, { x: x + 0.35, y: 3.15, w: 3.2, h: 1.0, fontSize: 48, bold: true, color: C.text1, objectName: '큰 숫자' });
    T(s, lab, { x: x + 0.35, y: 4.2, w: 3.2, h: 0.4, fontSize: 16, bold: true, color: C.accent3, objectName: '라벨' });
    T(s, d, { x: x + 0.35, y: 4.7, w: 3.2, h: 0.9, fontSize: 12, color: C.text2, lineSpacingMultiple: 1.25, objectName: '설명' });
  });
  s.addNotes('수치는 사실 기반(창립 연도·입점 시작·지원사업 횟수). 판매량 수치는 넣지 않음.');

  // 3 무엇을 하나
  s = pres.addSlide({ masterName: 'NAVY', sectionTitle: '알앤디메이커스' });
  eb(s, 'WHAT WE DO', YEL); s.addText('소재부터 납품까지, 한 회사에서', { placeholder: 'title' });
  const steps = [['01', '소재', '버려지는 자원을 원료로', ['실크벽지 → PVC 분리 원료', '폐타이어 → 재생 고무', '임업부산물 → CXP 목재 복합소재']],
    ['02', '기획 · 설계', '쓰는 사람의 현장에서', ['제품 디자인 · 금형 개발', '상표 · 디자인 · 특허 출원', '캐릭터 라이선싱 협업']],
    ['03', '생산 · 납품', '국내 제조, 대량 공급', ['국내 공장 생산', '대형 생활용품 매장 전국 납품', '기업 B2B · OEM/ODM 공급']]];
  steps.forEach(([n, t, sub, items], i) => {
    const x = M + i * 4.08;
    rr(s, x, 1.95, 3.85, 3.9, C.accent5, '역량 카드');
    T(s, n, { x: x + 0.35, y: 2.2, w: 1, h: 0.35, fontSize: 14, bold: true, color: YEL });
    T(s, t, { x: x + 0.35, y: 2.6, w: 3.2, h: 0.5, fontSize: 22, bold: true, color: C.background1, objectName: '역량 제목' });
    T(s, sub, { x: x + 0.35, y: 3.15, w: 3.2, h: 0.35, fontSize: 12, color: C.background2, objectName: '역량 부제' });
    T(s, items.map((it, j) => ({ text: it, options: { bullet: true, breakLine: j < items.length - 1 } })), { x: x + 0.35, y: 3.75, w: 3.2, h: 2.4, fontSize: 13, color: C.background1, paraSpaceAfter: 10, objectName: '역량 항목' });
  });

  // 4 연혁
  s = pres.addSlide({ masterName: 'PAPER', sectionTitle: '알앤디메이커스' });
  eb(s, 'HISTORY', C.accent3); s.addText('3년, 욕실에서 현장까지', { placeholder: 'title' });
  s.addShape(pres.shapes.LINE, { x: M, y: 2.55, w: CW, h: 0, line: { color: 'D8D6EE', width: 2 }, objectName: '타임라인' });
  const HIS = [['2023', ['창업진흥원 국가과제 수행', '07  ㈜알앤디메이커스 창립', '09  다이소 전국 매장 입점']],
    ['2024', ['환경부 새활용지원사업 수행', '오피스디포 · 오피스웨이 납품 계약', '대전 서구청 욕실화 기부', '중국 첫 수출']],
    ['2025', ['상표권 및 BM 특허 출원', '대전시 꿈돌이 캐릭터 라이선싱', '롯데패키징앤솔루션 · 서브원 납품 계약']],
    ['2026', ['환경부 새활용지원사업 2차 수행', '라라슈(RhaRa Shoe) 브랜드 런칭', '11.11 첫 라인업 오픈']]];
  const cw = (CW - 0.6) / 4;
  HIS.forEach(([y, items], i) => {
    const x = M + i * (cw + 0.2), hot = y === '2026';
    circ(s, x, 2.4, 0.3, hot ? LIME : C.accent3, '연혁 점');
    T(s, y, { x, y: 2.9, w: cw, h: 0.6, fontSize: 28, bold: true, color: C.text1, objectName: '연도' });
    if (hot) rr(s, x - 0.12, 3.6, cw + 0.12, 2.4, 'F4FBD9', '2026 강조', 0.06);
    T(s, items.map((t, j) => ({ text: t, options: { breakLine: j < items.length - 1, bold: hot } })), { x, y: 3.75, w: cw - 0.1, h: 2.2, fontSize: 12.5, color: hot ? C.text1 : C.text2, paraSpaceAfter: 8, lineSpacingMultiple: 1.1, objectName: '연혁 ' + y });
  });

  // 5 브랜드 포트폴리오
  s = pres.addSlide({ masterName: 'PAPER', sectionTitle: '알앤디메이커스' });
  eb(s, 'BRANDS', C.accent3); s.addText('두 개의 브랜드, 하나의 원칙', { placeholder: 'title' });
  T(s, '버려지는 것을 다시 쓰고, 쓰는 사람의 하루를 바꾼다', { x: M, y: 1.6, w: CW, h: 0.35, fontSize: 14, color: C.text2 });
  const bw = (CW - 0.3) / 2;
  rr(s, M, 2.2, bw, 4.3, C.accent4, '리사이클플레이 카드');
  s.addImage({ path: 'img/slipper-quilt.jpg', x: M + 0.3, y: 2.5, w: 2.8, h: 2.8 * 519 / 862, objectName: '욕실화' });
  s.addImage({ path: 'img/floss.jpg', x: M + 0.3, y: 2.5 + 2.8 * 519 / 862 + 0.15, w: 1.35, h: 0.88, sizing: { type: 'cover', w: 1.35, h: 0.88 }, objectName: '치실' });
  s.addImage({ path: 'img/cxp.jpg', x: M + 1.75, y: 2.5 + 2.8 * 519 / 862 + 0.15, w: 1.35, h: 0.88, sizing: { type: 'cover', w: 1.35, h: 0.88 }, objectName: 'CXP' });
  T(s, [{ text: 'Recycle Play', options: { bold: true, fontSize: 20, color: C.text1, breakLine: true } }, { text: '욕실에 즐거움을 쌓다', options: { fontSize: 12, color: C.accent3, bold: true, breakLine: true } },
        { text: '\n실크벽지·PVC 분리 원료로 만든 업사이클링 욕실화, 목재 복합소재(CXP) 구강케어. 전 제품 국내 제조.', options: { fontSize: 11.5, color: C.text2 } }],
    { x: M + 3.35, y: 2.55, w: bw - 3.6, h: 3.6, lineSpacingMultiple: 1.25, objectName: '리사이클플레이 설명' });
  const bx2 = M + bw + 0.3;
  rr(s, bx2, 2.2, bw, 4.3, INK, '라라슈 카드');
  s.addImage({ path: 'img/tile-shoes.png', x: bx2 + 0.3, y: 2.5, w: 2.8, h: 2.8 / 1.2, objectName: '워킹화' });
  s.addImage({ path: 'img/tile-outsole.png', x: bx2 + 0.3, y: 2.5 + 2.8 / 1.2 + 0.15, w: 2.8, h: 2.8 * 490 / 1200, objectName: '밑창' });
  s.addImage({ path: 'img/rs-logo.png', x: bx2 + 3.35, y: 2.55, w: 0.62, h: 0.52, objectName: 'RS 로고' });
  T(s, [{ text: 'RhaRa Shoe  라라슈', options: { bold: true, fontSize: 20, color: C.background1, breakLine: true } }, { text: 'Made for Standing.', options: { fontSize: 12, color: LIME, bold: true, breakLine: true } },
        { text: '\n서서 일하는 사람들을 위한 워킹화와 인솔. 밑창 그립 패드에 폐타이어 고무를 새활용. 2026.11.11 오픈.', options: { fontSize: 11.5, color: 'C9C9C4' } }],
    { x: bx2 + 3.35, y: 3.2, w: bw - 3.6, h: 3.0, lineSpacingMultiple: 1.25, objectName: '라라슈 설명' });

  // 6 라라슈 섹션
  sec('라라슈');
  s = pres.addSlide({ masterName: 'BLANK_INK', sectionTitle: '라라슈' });
  s.addImage({ path: 'img/rs-logo.png', x: M, y: 0.6, w: 1.0, h: 0.84, objectName: 'RS 로고' });
  T(s, 'RhaRa Shoe  ·  라라슈  ·  2026.11.11 OPEN', { x: M + 1.25, y: 0.85, w: 7, h: 0.35, fontSize: 11, bold: true, charSpacing: 3, color: '8A8A85' });
  T(s, 'Made for\nStanding.', { x: M, y: 2.1, w: 7, h: 2.6, fontSize: 66, bold: true, color: 'EDEDE8', lineSpacingMultiple: 0.95, objectName: '슬로건' });
  T(s, '발이 편해야, 일이 편하다.\n주방·매장·현장에서 오래 서 있는 사람들을 위한 워킹화와 인솔.', { x: M, y: 4.9, w: 6.6, h: 0.9, fontSize: 15, color: 'C9C9C4', lineSpacingMultiple: 1.35, objectName: '브랜드 정의' });
  s.addImage({ path: 'img/shoes2-cut.png', x: 8.3, y: 1.2, w: 4.2, h: 4.2 * 1199 / 989, objectName: '워킹화 누끼' });

  // 7 시작 이야기
  s = pres.addSlide({ masterName: 'INK', sectionTitle: '라라슈' });
  eb(s, 'WHY WE STARTED', LIME); s.addText('친구 셋의 가게에서 시작했습니다', { placeholder: 'title' });
  T(s, '국밥집, 김밥집, 칼국수집. 오랜 친구 셋이 차린 가게에서 매일 10~12시간 서서 일하는 모습을 봤습니다. 받아 본 발과 신발 사진에는 젖은 채 오래 일한 흔적이 그대로 남아 있었습니다.\n\n버려지는 소재로 제품을 만들어 온 우리가, 이 사람들의 하루를 바꿀 신발을 만들 수 있지 않을까 — 라라슈는 그 질문에서 출발했습니다.', { x: M, y: 1.85, w: 6.0, h: 3.6, fontSize: 14, color: 'D8D8D3', lineSpacingMultiple: 1.45, objectName: '서사' });
  const pairs = [['현장에서 들은 것', '깔창이 신발 안에서 자꾸 밀려 나온다', '그래서 만든 것', '깔창 없이 안창까지 한 몸으로 만든 일체형 안창'],
    ['현장에서 들은 것', '물이 발목 입구로 튀어 들어온다', '그래서 만든 것', '입구 테두리를 다른 부분보다 두껍게 두른 발목 테두리']];
  pairs.forEach(([a, b, c, d], i) => {
    const y = 1.9 + i * 2.15, x = 7.15;
    rr(s, x, y, 5.5, 1.95, '1A1A1A', '문제-해법 카드');
    T(s, [{ text: a, options: { fontSize: 10, color: '8A8A85', bold: true, breakLine: true } }, { text: b, options: { fontSize: 14, color: 'EDEDE8', bold: true } }], { x: x + 0.3, y: y + 0.22, w: 4.9, h: 0.7, objectName: '문제' });
    T(s, [{ text: c, options: { fontSize: 10, color: LIME, bold: true, breakLine: true } }, { text: d, options: { fontSize: 14, color: LIME, bold: true } }], { x: x + 0.3, y: y + 1.05, w: 4.9, h: 0.75, objectName: '해법' });
  });

  // 8 라인업
  s = pres.addSlide({ masterName: 'INK', sectionTitle: '라라슈' });
  eb(s, 'LINE-UP', LIME); s.addText('1차 라인업 2종', { placeholder: 'title' });
  const lw = (CW - 0.3) / 2;
  const P = [{ img: 'img/tile-shoes.png', r: 1.2, name: '쿼드그립 종일편한 워킹화', price: '42,500원', rows: [['쿼드그립 4점 패드', '밑창 4곳, 폐타이어 새활용 고무'], ['깔창 없는 일체형 안창', 'E-실리폴리렌으로 안창까지 한 몸'], ['도톰한 발목 테두리', '입구 테두리를 두껍게 마감']] },
    { img: 'img/tile-insole.png', r: 1.6, name: '쿼드그립 아치가득 인솔', price: '21,500원', rows: [['아치가득 구조', '발 아치 라인을 따라 가득 채운 형태'], ['뒤꿈치 컵 구조', '뒤꿈치를 감싸는 컵 모양'], ['우드칩 배합 소재', '목공소 자투리 우드칩을 섞은 E-실리폴리렌']] }];
  P.forEach((p, i) => {
    const x = M + i * (lw + 0.3);
    rr(s, x, 1.85, lw, 4.75, '161616', '제품 카드');
    const ih = 2.3, iw = ih * p.r;
    s.addImage({ path: p.img, x: x + (lw - iw) / 2, y: 1.95, w: iw, h: ih, objectName: p.name });
    T(s, p.name, { x: x + 0.35, y: 4.35, w: lw - 2.2, h: 0.42, fontSize: 18, bold: true, color: 'EDEDE8', valign: 'middle' });
    T(s, p.price, { x: x + lw - 1.85, y: 4.35, w: 1.5, h: 0.42, fontSize: 18, bold: true, color: LIME, align: 'right', valign: 'middle' });
    p.rows.forEach(([t, d], j) => { const ry = 4.95 + j * 0.5; num(s, x + 0.35, ry, j + 1, LIME, INK);
      T(s, [{ text: t, options: { bold: true, color: 'EDEDE8' } }, { text: '   ' + d, options: { color: 'A8A8A3' } }], { x: x + 0.8, y: ry, w: lw - 1.1, h: 0.3, fontSize: 12, valign: 'middle', objectName: '구조' }); });
  });
  s.addNotes('워킹화 사진: 대표 제공 리터칭(10/5). 인솔: 9/30 실물 리터칭. 밑창 라임은 양산 컬러 확정(P18) 전제.');

  // 9 소재
  s = pres.addSlide({ masterName: 'INK', sectionTitle: '라라슈' });
  eb(s, 'MATERIAL', LIME); s.addText('From Road to Floor.', { placeholder: 'title' });
  T(s, '도로를 달리던 고무가, 주방 바닥 위에서 다시 일합니다.', { x: M, y: 1.6, w: 6, h: 0.35, fontSize: 14, color: 'C9C9C4' });
  s.addImage({ path: 'img/brand-film-poster.jpg', x: M, y: 2.2, w: 6.1, h: 6.1 * 9 / 16, objectName: '브랜드 필름 장면' });
  T(s, '브랜드 필름 중 한 장면 · 일부 장면 AI 생성(Google Flow)', { x: M, y: 2.25 + 6.1 * 9 / 16, w: 6.1, h: 0.25, fontSize: 9, color: '8A8A85' });
  const MAT = [['그립 패드', '폐타이어 고무 + 실크벽지 폐PVC', '밑창 4곳의 쿼드그립 패드'], ['신발 본체', 'E-실리폴리렌', 'EVA·실리콘 배합 자체 소재, 안창까지 한 몸'], ['인솔', 'E-실리폴리렌 + 우드칩', '목공소에서 나온 자투리 우드칩 배합']];
  MAT.forEach(([k, v, d], i) => {
    const y = 2.2 + i * 1.18, x = 7.15;
    rr(s, x, y, 5.5, 1.02, '1A1A1A', '소재 카드');
    T(s, k, { x: x + 0.3, y: y + 0.15, w: 1.5, h: 0.35, fontSize: 11, bold: true, color: LIME });
    T(s, [{ text: v, options: { bold: true, color: 'EDEDE8', fontSize: 14, breakLine: true } }, { text: d, options: { color: 'A8A8A3', fontSize: 11 } }], { x: x + 1.8, y: y + 0.13, w: 3.5, h: 0.8, objectName: '소재 ' + k });
  });

  // 10 함께하기
  sec('함께하기');
  s = pres.addSlide({ masterName: 'NAVY', sectionTitle: '함께하기' });
  eb(s, 'LAUNCH & PARTNERSHIP', YEL); s.addText('11월, 현장에서 만나요', { placeholder: 'title' });
  const EV = [['11.11', '라라슈 1차 라인업 오픈', '워킹화 · 인솔 온라인 출시'], ['11.12 – 15', '킨텍스 메가쇼', '실물 체험 · 단체 구매 상담'], ['11.26 – 29', '서울디자인페어 (코엑스)', '브랜드 · 소재 전시']];
  EV.forEach(([d, t, sub], i) => {
    const y = 1.95 + i * 1.08;
    T(s, d, { x: M, y, w: 2.2, h: 0.5, fontSize: 22, bold: true, color: YEL });
    T(s, [{ text: t, options: { bold: true, fontSize: 15, color: C.background1, breakLine: true } }, { text: sub, options: { fontSize: 11.5, color: C.background2 } }], { x: M + 2.35, y: y + 0.02, w: 4.3, h: 0.8 });
  });
  rr(s, 7.3, 1.95, 5.38, 3.75, YEL, '상담 박스', 0.1);
  T(s, [{ text: 'B2B · OEM/ODM · 납품 상담', options: { bold: true, fontSize: 18, color: NAVY, breakLine: true } }, { text: '단체 공급 · 자체 브랜드 OEM · 소재 ODM', options: { fontSize: 11.5, color: NAVY } }], { x: 7.65, y: 2.25, w: 4.7, h: 0.8 });
  T(s, [{ text: '㈜알앤디메이커스  신동규 대표', options: { bold: true, breakLine: true } }, { text: '대전시 유성구 국제과학7로 8', options: { breakLine: true } },
        { text: 'T  010-6880-2516', options: { breakLine: true } }, { text: 'E  rndceo@rndmakers.kr', options: { breakLine: true } }, { text: 'www.rndmakers.kr', options: {} }],
    { x: 7.65, y: 3.35, w: 3.0, h: 2.0, fontSize: 12, color: NAVY, lineSpacingMultiple: 1.3, objectName: '연락처' });
  s.addImage({ path: 'img/qr-deck.png', x: 10.85, y: 3.4, w: 1.5, h: 1.5, objectName: 'QR' });
  T(s, '라라슈 오픈 알림', { x: 10.6, y: 4.95, w: 2.0, h: 0.3, fontSize: 9.5, bold: true, color: NAVY, align: 'center' });
  s.addNotes('QR = rharashoe.netlify.app/?src=deck (소개서 유입 집계).');

  await pres.writeFile({ fileName: 'rndmakers-rharashoe-intro.pptx' });
  await applyTheme('rndmakers-rharashoe-intro.pptx', THEME);
  console.log('ok');
})();
