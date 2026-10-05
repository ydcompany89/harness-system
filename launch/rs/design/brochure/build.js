// ㈜알앤디메이커스 박람회 브로셔 (A4 세로 4p): NODE_PATH=./node_modules node build.js → rndmakers-brochure-2026.pptx
const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/5d3bce6c-bc48-4bd0-b0e5-3edd7d02f77d_b6ab80fe-3f67-4e27-b365-659a453d117a/pptx/scripts/apply_theme.js');
const THEME = { name: 'R&amp;D MAKERS 2026', headFontFace: 'Malgun Gothic', bodyFontFace: 'Malgun Gothic',
  colors: { dk1: '181478', lt1: 'FFFFFF', dk2: '4A4868', lt2: 'EEECE2', accent1: 'E0E828', accent2: 'FF6A48',
    accent3: '5650C4', accent4: 'F1F0FA', accent5: '2A2591', accent6: 'C6F432', hlink: '5650C4', folHlink: '5650C4' } };
const W = 8.27, H = 11.69, M = 0.6, CW = W - 2 * M;
(async () => {
  const pres = new pptxgen();
  pres.defineLayout({ name: 'A4P', width: W, height: H }); pres.layout = 'A4P';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = '알앤디메이커스 브로셔 2026'; pres.author = '㈜알앤디메이커스';
  const C = pres.SchemeColor;
  const ph = (color, size, y = 0.95, h = 0.6) => ({ placeholder: { options: { name: 'title', type: 'title', x: M, y, w: CW, h, fontSize: size, bold: true, color, margin: 0, valign: 'middle', align: 'left' }, text: '' } });
  pres.defineSlideMaster({ title: 'NAVY', background: { color: '181478' }, objects: [ph(C.background2, 30)] });
  pres.defineSlideMaster({ title: 'PAPER', background: { color: 'FFFFFF' }, objects: [ph(C.text1, 26)] });
  pres.defineSlideMaster({ title: 'COVER', background: { color: '181478' }, objects: [] });
  const T = (s, text, o) => s.addText(text, Object.assign({ margin: 0, isTextBox: true, valign: 'top' }, o));
  const eyebrow = (s, text, color) => T(s, text, { x: M, y: 0.55, w: CW, h: 0.3, fontSize: 9.5, bold: true, charSpacing: 4, color, objectName: '아이브로' });
  const footer = (s, n, color) => T(s, `R&D MAKERS    0${n} / 04`, { x: M, y: H - 0.55, w: 4, h: 0.25, fontSize: 8, charSpacing: 3, color, objectName: '쪽번호' });
  const rr = (s, x, y, w, h, color, name, r = 0.08) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: r, fill: { color }, line: { type: 'none' }, objectName: name });
  const circ = (s, x, y, d, color, name) => s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { type: 'none' }, objectName: name });
  const nums = (s, x, y, rows, step, w, dark) => rows.forEach(([t, d], j) => {
    const ry = y + j * step;
    circ(s, x, ry + 0.03, 0.24, C.accent6, '번호');
    T(s, String(j + 1), { x, y: ry + 0.03, w: 0.24, h: 0.24, fontSize: 9, bold: true, color: '181478', align: 'center', valign: 'middle', objectName: '번호 글자' });
    T(s, [{ text: t, options: { bold: true, color: dark ? C.background1 : C.text1, breakLine: true } }, { text: d, options: { color: dark ? C.background2 : C.text2 } }],
      { x: x + 0.36, y: ry, w: w - 0.36, h: step - 0.02, fontSize: 10, objectName: '구조 ' + (j + 1) });
  });

  // ── 1. 표지 ─────────────────────────────
  pres.addSection({ title: '표지' });
  let s = pres.addSlide({ masterName: 'COVER', sectionTitle: '표지' });
  T(s, 'R&D MAKERS', { x: M, y: 0.6, w: 3, h: 0.3, fontSize: 11, bold: true, charSpacing: 5, color: C.background1 });
  T(s, 'BROCHURE 2026', { x: W - M - 3, y: 0.6, w: 3, h: 0.3, fontSize: 9, charSpacing: 4, color: C.background2, align: 'right' });
  circ(s, 0.95, 1.95, 0.6, C.accent3, '보라 원');
  circ(s, 2.95, 3.25, 0.95, C.accent2, '코랄 도넛'); circ(s, 3.25, 3.55, 0.35, '181478', '코랄 도넛 속');
  circ(s, 4.95, 1.4, 2.0, C.accent1, '라임 타깃'); circ(s, 5.45, 1.9, 1.0, '181478', '라임 타깃 속'); circ(s, 5.72, 2.17, 0.46, C.accent1, '라임 타깃 중심');
  T(s, '남은 것의\n다음 모양.', { x: M, y: 4.75, w: CW, h: 2.1, fontSize: 52, bold: true, color: C.background2, lineSpacingMultiple: 0.95, objectName: '표지 헤드라인' });
  T(s, '버려지는 소재로 제품을 만드는 제조 파트너', { x: M, y: 6.95, w: CW, h: 0.35, fontSize: 15, color: C.background1, objectName: '표지 서브' });
  T(s, [{ text: 'Recycle Play', options: { bold: true, color: C.accent1 } }, { text: '    욕실에 즐거움을 쌓다', options: { color: C.background2, breakLine: true } },
        { text: 'RhaRa Shoe', options: { bold: true, color: C.accent1 } }, { text: '      오래 서서 일하는 사람들을 위한 워킹화·인솔', options: { color: C.background2 } }],
    { x: M, y: 7.55, w: CW, h: 0.7, fontSize: 12, lineSpacingMultiple: 1.35, objectName: '브랜드 라인' });
  rr(s, M, 8.75, CW, 1.75, C.accent1, '상담 유도 박스', 0.1);
  T(s, 'OEM · ODM · 납품 상담', { x: M + 0.35, y: 8.98, w: CW - 0.7, h: 0.45, fontSize: 21, bold: true, color: '181478', objectName: '상담 제목' });
  T(s, '소재 개발부터 국내 생산, 유통 납품까지. 부스에서 바로 상담하세요.', { x: M + 0.35, y: 9.45, w: CW - 0.7, h: 0.3, fontSize: 11.5, color: '181478', objectName: '상담 설명' });
  ['자체 브랜드 OEM', '소재·제품 ODM', '단체 공급·입점'].forEach((t, i) => {
    const cx = M + 0.35 + i * 2.05;
    rr(s, cx, 9.9, 1.9, 0.38, '181478', '상담 칩', 0.19);
    T(s, t, { x: cx, y: 9.9, w: 1.9, h: 0.38, fontSize: 10.5, bold: true, color: C.accent1, align: 'center', valign: 'middle', objectName: '상담 칩 글자' });
  });
  T(s, '㈜알앤디메이커스', { x: W - M - 3, y: H - 0.75, w: 3, h: 0.35, fontSize: 13, bold: true, color: C.background2, align: 'right', objectName: '회사명' });
  s.addNotes('표지: 원·도넛 도형 = 순환·타이어 모티프. 하단 라임 박스가 B2B 상담 유도.');

  // ── 2. Recycle Play ────────────────────
  pres.addSection({ title: 'Recycle Play' });
  s = pres.addSlide({ masterName: 'PAPER', sectionTitle: 'Recycle Play' });
  eyebrow(s, 'RECYCLE PLAY  ·  BATHROOM & ORAL CARE', C.accent3);
  s.addText('욕실에 즐거움을 쌓다', { placeholder: 'title' });
  const pw = (CW - 0.27) / 2, phh = pw * 519 / 862;
  s.addImage({ path: 'img/slipper-quilt.jpg', x: M, y: 1.8, w: pw, h: phh, rounding: false, objectName: '퀼트패턴 스마일 욕실화' });
  s.addImage({ path: 'img/slipper-low.jpg', x: M + pw + 0.27, y: 1.8, w: pw, h: phh, objectName: '발등낮은 스마일 욕실화' });
  const ny = 1.8 + phh + 0.15;
  T(s, [{ text: '퀼트패턴 스마일 욕실화', options: { bold: true, color: C.text1, fontSize: 13, breakLine: true } }, { text: '275mm · 차콜/네이비 · 한국산', options: { color: C.text2, fontSize: 9.5, breakLine: true } }, { text: '권장가 3,900원 · 박스 18개', options: { color: C.text2, fontSize: 9.5 } }],
    { x: M, y: ny, w: pw, h: 0.75, objectName: '욕실화1 정보' });
  T(s, [{ text: '발등낮은 스마일 욕실화', options: { bold: true, color: C.text1, fontSize: 13, breakLine: true } }, { text: '한국산 · 규격·컬러·단가는 상담 시 안내', options: { color: C.text2, fontSize: 9.5 } }],
    { x: M + pw + 0.27, y: ny, w: pw, h: 0.6, objectName: '욕실화2 정보' });
  rr(s, M, ny + 0.88, CW, 0.72, C.accent4, '소재 띠');
  T(s, [{ text: '실크벽지와 PVC를 분리해 업사이클링한 원료', options: { bold: true, color: C.text1, fontSize: 12.5, breakLine: true } }, { text: '전 제품 한국 제조  ·  다이소 전국 매장 입점 (2023.09~)', options: { color: C.text2, fontSize: 10 } }],
    { x: M + 0.3, y: ny + 0.96, w: CW - 0.6, h: 0.58, align: 'center', valign: 'middle', objectName: '소재 설명' });
  const oy = ny + 1.9;
  T(s, 'ORAL CARE  ·  refeeel', { x: M, y: oy, w: CW, h: 0.25, fontSize: 9.5, bold: true, charSpacing: 4, color: C.accent3, objectName: '구강케어 아이브로' });
  T(s, '나무에서 온 구강케어', { x: M, y: oy + 0.27, w: CW, h: 0.42, fontSize: 18, bold: true, color: C.text1, objectName: '구강케어 제목' });
  const tw = (CW - 0.4) / 3, th = tw * 0.8, ty = oy + 0.85;
  [['img/floss.jpg', 473 / 310], ['img/toothbrush.jpg', 841 / 551], ['img/cxp.jpg', 385 / 285]].forEach(([p, r], i) => {
    const x = M + i * (tw + 0.2);
    s.addImage({ path: p, x, y: ty, w: tw, h: th, sizing: { type: 'cover', w: tw, h: th }, objectName: p.replace('img/', '') });
  });
  const cy = ty + th + 0.15;
  const cards = [
    ['어금니까지 쏙쏙 칫솔형 치실', 'ㄱ자형 헤드 · 칫솔처럼 쥐는 핸들\n리필 20개입 교체형\n세트(핸들+리필 20개입) 4,900원'],
    ["나이스샷 '왕모' 칫솔", '블랙 이중미세모 5,255모\n블루 스파이럴모 4,416모'],
    ['CXP 소재', '임업부산물(목재)을 활용한 복합소재\n칫솔·치실 핸들에 사용']];
  cards.forEach(([n, d], i) => T(s, [{ text: n, options: { bold: true, color: C.text1, fontSize: 11.5, breakLine: true } }, { text: d, options: { color: C.text2, fontSize: 9.5 } }],
    { x: M + i * (tw + 0.2), y: cy, w: tw, h: 0.95, lineSpacingMultiple: 1.1, objectName: '구강케어 ' + (i + 1) }));
  rr(s, M, H - 1.6, CW, 0.82, '181478', 'OEM 띠');
  T(s, [{ text: 'OEM · ODM 상담', options: { bold: true, color: C.accent1, fontSize: 13, breakLine: true } }, { text: '욕실화·구강케어 제품을 귀사 브랜드와 패키지로 — 컬러·패키지·수량 맞춤 상담', options: { color: C.background1, fontSize: 10 } }],
    { x: M + 0.3, y: H - 1.52, w: CW - 0.6, h: 0.66, valign: 'middle', objectName: 'OEM 안내' });
  footer(s, 2, C.text2);
  s.addNotes('가격·입수는 회사 소개서(2601ver) 권장가 기준 — 최신가 확인. 발등낮은 스마일 규격·가격 미확정이라 "상담 시 안내". PEFC 인증 문구는 근거 확인 전이라 제외. 칫솔 모 수는 제품 이미지 표기 기준.');

  // ── 3. RhaRa Shoe ──────────────────────
  pres.addSection({ title: 'RhaRa Shoe' });
  s = pres.addSlide({ masterName: 'PAPER', sectionTitle: 'RhaRa Shoe' });
  eyebrow(s, 'RHARA SHOE  ·  라라슈  ·  2026.11.11 OPEN', C.accent3);
  s.addText('오래 서서 일하는 사람들을 위한', { placeholder: 'title' });
  T(s, 'Made for Standing.', { x: M, y: 1.55, w: CW, h: 0.32, fontSize: 13, italic: true, bold: true, color: C.accent3, objectName: '슬로건' });
  const shH = 3.45, shW = shH * 1230 / 1278;
  s.addImage({ path: 'img/shoes.jpg', x: M, y: 2.05, w: shW, h: shH, objectName: '워킹화' });
  const rx = M + shW + 0.3, rw = W - M - rx, oh = rw * 490 / 1200;
  s.addImage({ path: 'img/outsole.jpg', x: rx, y: 2.05, w: rw, h: oh, objectName: '밑창 그립 패드' });
  T(s, '밑창 그립 패드 · 양산 컬러(라임) 적용 이미지', { x: rx, y: 2.1 + oh, w: rw, h: 0.22, fontSize: 8.5, color: C.text2, objectName: '패드 캡션' });
  T(s, [{ text: '쿼드그립 종일편한 워킹화', options: { bold: true, fontSize: 15, color: C.text1, breakLine: true } }, { text: '소비자가 42,500원', options: { bold: true, fontSize: 10.5, color: C.accent3 } }],
    { x: rx, y: 2.38 + oh, w: rw, h: 0.6, objectName: '워킹화 이름' });
  nums(s, rx, 3.02 + oh, [['쿼드그립 4점 패드', '밑창 4곳, 폐타이어 새활용 고무'], ['깔창 없는 일체형 안창', 'E-실리폴리렌으로 안창까지 한 몸'], ['도톰한 발목 테두리', '입구 테두리를 두껍게 마감']], 0.44, rw, false);
  const iy = 6.0, isz = 2.95;
  s.addImage({ path: 'img/insole.jpg', x: W - M - isz, y: iy, w: isz, h: isz, objectName: '인솔' });
  const lw = CW - isz - 0.3;
  T(s, [{ text: '쿼드그립 아치가득 인솔', options: { bold: true, fontSize: 15, color: C.text1, breakLine: true } }, { text: '소비자가 21,500원', options: { bold: true, fontSize: 10.5, color: C.accent3, breakLine: true } }, { text: '가지고 계신 업무화에 넣어 쓰는 아치 인솔', options: { fontSize: 10, color: C.text2 } }],
    { x: M, y: iy + 0.35, w: lw, h: 0.9, objectName: '인솔 이름' });
  nums(s, M, iy + 1.2, [['아치가득 구조', '발 아치 라인을 따라 가득 채운 형태'], ['뒤꿈치 컵 구조', '뒤꿈치를 감싸는 컵 모양'], ['우드칩 배합 소재', '목공소 자투리 우드칩을 섞은 E-실리폴리렌']], 0.5, lw, false);
  rr(s, M, H - 2.55, CW, 0.75, C.accent4, '소재 띠');
  T(s, [{ text: '새활용 소재', options: { bold: true, color: C.text1, fontSize: 11.5, breakLine: true } }, { text: '그립 패드: 폐타이어 고무 + 폐벽지 PVC  ·  본체: E-실리폴리렌  ·  인솔: 우드칩 배합', options: { color: C.text2, fontSize: 9.5 } }],
    { x: M + 0.3, y: H - 2.48, w: CW - 0.6, h: 0.62, valign: 'middle', objectName: '소재 설명' });
  rr(s, M, H - 1.6, CW, 0.82, '181478', '단체 공급 띠');
  T(s, [{ text: '단체 공급 · 납품 상담', options: { bold: true, color: C.accent1, fontSize: 13, breakLine: true } }, { text: '외식 프랜차이즈 · 급식 · 리테일 매장 직원용  ·  수량별 견적  ·  세금계산서 발행', options: { color: C.background1, fontSize: 10 } }],
    { x: M + 0.3, y: H - 1.52, w: CW - 0.6, h: 0.66, valign: 'middle', objectName: '단체 공급 안내' });
  footer(s, 3, C.text2);
  s.addNotes('질병명(평발·O자 다리·족저근막염) 문구는 표시광고법·의료기기 오인 리스크로 삭제. 워킹화 사진은 대표 제공 리터칭 이미지, 인솔은 9/30 실물 리터칭. 패드 라임은 양산 컬러 확정(P18) 전제.');

  // ── 4. Company ─────────────────────────
  pres.addSection({ title: 'Company' });
  s = pres.addSlide({ masterName: 'NAVY', sectionTitle: 'Company' });
  eyebrow(s, 'COMPANY  ·  OEM / ODM  ·  CONTACT', C.accent1);
  s.addText('알앤디메이커스', { placeholder: 'title' });
  T(s, '버려지는 실크벽지·폐타이어·임업부산물을 원료로 바꾸고, 그 원료로 생활 제품을 만듭니다.', { x: M, y: 1.6, w: CW, h: 0.5, fontSize: 11.5, color: C.background2, objectName: '회사 소개' });
  const kw = (CW - 0.4) / 3;
  [['01', '소재', '폐벽지 PVC · 폐타이어 고무 · CXP 목재 복합소재 새활용 원료'], ['02', '기획 · 설계', '제품 디자인 · 상표·특허 출원 · 캐릭터 라이선싱 협업'], ['03', '생산 · 납품', '국내 제조 · 다이소 전국 매장 · 기업 대량 납품']].forEach(([n, t, d], i) => {
    const x = M + i * (kw + 0.2);
    rr(s, x, 2.3, kw, 1.65, C.accent5, '역량 카드');
    T(s, n, { x: x + 0.22, y: 2.45, w: 1, h: 0.3, fontSize: 11, bold: true, color: C.accent1, objectName: '역량 번호' });
    T(s, [{ text: t, options: { bold: true, fontSize: 13, color: C.background1, breakLine: true } }, { text: d, options: { fontSize: 9.5, color: C.background2 } }],
      { x: x + 0.22, y: 2.8, w: kw - 0.44, h: 1.05, lineSpacingMultiple: 1.1, objectName: '역량 ' + n });
  });
  const steps = ['상담', '샘플', '양산', '납품'], sw = (CW - 0.6) / 4;
  steps.forEach((t, i) => {
    const x = M + i * (sw + 0.2);
    rr(s, x, 4.2, sw, 0.42, i === 0 ? C.accent1 : '181478', 'OEM 단계', 0.21);
    if (i) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 4.2, w: sw, h: 0.42, rectRadius: 0.21, fill: { type: 'none' }, line: { color: C.accent1, width: 1 }, objectName: 'OEM 단계 테두리' });
    T(s, `${i + 1}  ${t}`, { x, y: 4.2, w: sw, h: 0.42, fontSize: 11, bold: true, color: i === 0 ? '181478' : C.accent1, align: 'center', valign: 'middle', objectName: 'OEM 단계 글자' });
  });
  T(s, 'HISTORY', { x: M, y: 5.05, w: 3, h: 0.25, fontSize: 9.5, bold: true, charSpacing: 4, color: C.accent1, objectName: '연혁 제목' });
  const H4 = [['2023', ['창업진흥원 국가과제 진행', '07  ㈜알앤디메이커스 창립', '09  다이소 전국 매장 입점']],
    ['2024', ['환경부 새활용지원사업 진행', '오피스디포 · 오피스웨이 납품 계약', '대전 서구청 욕실화 기부', '중국 첫 수출']],
    ['2025', ['상표권 및 BM 특허 출원', '대전시 꿈돌이 캐릭터 라이선싱', '롯데패키징앤솔루션 · 서브원 납품 계약']],
    ['2026', ['환경부 새활용지원사업\n2차 진행', '라라슈(RhaRa Shoe) 브랜드 런칭']]];
  const hw = (CW - 0.45) / 4;
  H4.forEach(([y, items], i) => {
    const x = M + i * (hw + 0.15), hot = y === '2026';
    T(s, y, { x, y: 5.4, w: hw, h: 0.42, fontSize: 20, bold: true, color: hot ? C.accent1 : C.background1, objectName: '연도 ' + y });
    T(s, items.map((t, j) => ({ text: t, options: { breakLine: j < items.length - 1, bullet: false, color: hot ? C.accent1 : C.background2, bold: hot } })),
      { x, y: 5.9, w: hw, h: 1.9, fontSize: 9.5, paraSpaceAfter: 5, lineSpacingMultiple: 1.05, objectName: '연혁 ' + y });
  });
  rr(s, M, 8.25, CW, 2.45, C.accent1, '연락처 박스', 0.1);
  T(s, [{ text: 'OEM · ODM · 납품 상담', options: { bold: true, fontSize: 18, color: '181478', breakLine: true } }, { text: '샘플·견적 요청은 아래 연락처로 편하게 주세요.', options: { fontSize: 10.5, color: '181478' } }],
    { x: M + 0.35, y: 8.45, w: CW - 2.3, h: 0.75, objectName: '연락처 제목' });
  T(s, [{ text: '㈜알앤디메이커스  신동규 대표', options: { bold: true, breakLine: true } }, { text: '대전시 유성구 국제과학7로 8', options: { breakLine: true } },
        { text: 'T  010-6880-2516     E  rndceo@rndmakers.kr', options: { breakLine: true } }, { text: 'www.rndmakers.kr     Instagram @re.feeel', options: {} }],
    { x: M + 0.35, y: 9.3, w: CW - 2.3, h: 1.25, fontSize: 10.5, color: '181478', lineSpacingMultiple: 1.2, objectName: '연락처' });
  s.addImage({ path: 'img/qr-brochure.png', x: W - M - 1.75, y: 8.55, w: 1.4, h: 1.4, objectName: 'QR' });
  T(s, '라라슈 알림·단체 문의', { x: W - M - 1.95, y: 10.0, w: 1.8, h: 0.25, fontSize: 8.5, bold: true, color: '181478', align: 'center', objectName: 'QR 설명' });
  footer(s, 4, C.background2);
  s.addNotes('연혁: 2023 창업진흥원 국가과제 / 2026 새활용 2차·라라슈 런칭은 대표 지시(10/5). 납품처 실명 노출은 대표 확인 필요. QR = rharashoe.netlify.app/?src=brochure');

  await pres.writeFile({ fileName: 'rndmakers-brochure-2026.pptx' });
  await applyTheme('rndmakers-brochure-2026.pptx', THEME);
  console.log('ok');
})();
