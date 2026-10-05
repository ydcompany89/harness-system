// 라라슈 B2B 1장 상품설명서(라이트·인쇄용): NODE_PATH=./node_modules node build_b2b.js → rs-b2b-onepager.pptx
const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/5d3bce6c-bc48-4bd0-b0e5-3edd7d02f77d_b6ab80fe-3f67-4e27-b365-659a453d117a/pptx/scripts/apply_theme.js');
const THEME = { name: 'RS RhaRa Shoe Light', headFontFace: 'Malgun Gothic', bodyFontFace: 'Malgun Gothic',
  colors: { dk1: '0B0B0B', lt1: 'FFFFFF', dk2: '5E5E5A', lt2: 'F2F2EE', accent1: 'C6F432', accent2: '0B0B0B',
    accent3: 'E2E2DC', accent4: 'EDEDE8', accent5: '9A9A94', accent6: '161616', hlink: '0B0B0B', folHlink: '0B0B0B' } };
(async () => {
  const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = '라라슈 RhaRa Shoe B2B 상품설명서'; pres.author = '㈜알앤디메이커스';
  const C = pres.SchemeColor;
  pres.defineSlideMaster({ title: 'B2B_ONEPAGER', background: { color: 'FFFFFF' }, objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 1.1, w: 6.2, h: 0.75, fontSize: 36, bold: true, color: C.text1, margin: 0, valign: 'middle', align: 'left' }, text: '' } } ] });
  pres.addSection({ title: 'B2B 상품설명서' });
  const s = pres.addSlide({ masterName: 'B2B_ONEPAGER', sectionTitle: 'B2B 상품설명서' });
  s.addText('Made for Standing.', { placeholder: 'title' });
  // 헤더
  s.addImage({ path: 'rs-logo-dark.png', x: 0.6, y: 0.42, w: 0.66, h: 0.555, objectName: 'RS 로고' });
  s.addText([{ text: 'RhaRa Shoe  라라슈', options: { bold: true, fontSize: 15, color: C.text1, breakLine: true } },
             { text: 'B2B 상품설명서 · ㈜알앤디메이커스', options: { fontSize: 11, color: C.text2 } }],
    { x: 1.42, y: 0.42, w: 5, h: 0.58, margin: 0, valign: 'middle', isTextBox: true, objectName: '브랜드명' });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 10.73, y: 0.47, w: 2.0, h: 0.42, rectRadius: 0.21, fill: { color: C.accent1 }, line: { type: 'none' }, objectName: '오픈 배지' });
  s.addText('2026.11.11 OPEN', { x: 10.73, y: 0.47, w: 2.0, h: 0.42, align: 'center', valign: 'middle', bold: true, fontSize: 13, color: C.text1, margin: 0, isTextBox: true, objectName: '오픈 일자' });
  s.addText([{ text: '오래 서서 일하는 현장을 위한 업무용 워킹화와 인솔', options: { bold: true, color: C.text1, breakLine: true } },
             { text: '식당·주방, 카페·베이커리, 매장·서비스 현장에 단체 공급합니다', options: { color: C.text2 } }],
    { x: 6.9, y: 1.1, w: 5.83, h: 0.75, fontSize: 12, align: 'right', valign: 'middle', margin: 0, isTextBox: true, objectName: '포지셔닝' });
  // 제품 2열 + B2B 카드
  const CY = 2.05, W1 = 3.95, X = [0.6, 4.75], BX = 8.9, BW = 3.83, IMH = 2.3;
  for (const x of X) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: CY, w: W1, h: 4.4, rectRadius: 0.08, fill: { color: C.background2 }, line: { type: 'none' }, objectName: '제품 카드' });
  // 이미지: 흰 배경 사진을 흰 패널 위에
  for (const x of X) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.15, y: CY + 0.15, w: W1 - 0.3, h: IMH, rectRadius: 0.06, fill: { color: C.background1 }, line: { type: 'none' }, objectName: '사진 패널' });
  const shH = IMH - 0.1, shW = shH * 1230 / 1278;
  s.addImage({ path: 'tile-shoes-light.png', x: X[0] + (W1 - shW) / 2, y: CY + 0.2, w: shW, h: shH, objectName: '워킹화 탑뷰' });
  const inH = IMH - 0.1;
  s.addImage({ path: 'tile-insole-light.png', x: X[1] + (W1 - inH) / 2, y: CY + 0.2, w: inH, h: inH, objectName: '인솔' });
  const P = [
    { name: '쿼드그립 종일편한 워킹화', price: '소비자가 42,500원',
      rows: [['쿼드그립 4점 패드', '밑창 4곳 그립 패드'], ['일체형 안창', '깔창 없이 안창까지 한 몸'], ['도톰한 발목 테두리', '입구를 두껍게 마감']] },
    { name: '쿼드그립 아치가득 인솔', price: '소비자가 21,500원',
      rows: [['아치가득 구조', '아치 라인을 따라 채운 형태'], ['뒤꿈치 컵 구조', '뒤꿈치를 감싸는 컵 모양'], ['우드칩 배합 소재', '목공소 우드칩 새활용']] }];
  P.forEach((p, i) => {
    const x = X[i] + 0.25, w = W1 - 0.5, y0 = CY + IMH + 0.2;
    s.addText(p.name, { x, y: y0, w, h: 0.38, fontSize: 17, bold: true, color: C.text1, margin: 0, valign: 'middle', isTextBox: true, objectName: '제품명' });
    s.addText(p.price, { x, y: y0 + 0.38, w, h: 0.3, fontSize: 12, bold: true, color: C.text2, margin: 0, valign: 'middle', isTextBox: true, objectName: '가격' });
    p.rows.forEach(([t, d], j) => {
      const ry = y0 + 0.76 + j * 0.34;
      s.addShape(pres.shapes.OVAL, { x, y: ry + 0.04, w: 0.26, h: 0.26, fill: { color: C.accent1 }, line: { type: 'none' }, objectName: '번호' });
      s.addText(String(j + 1), { x, y: ry + 0.04, w: 0.26, h: 0.26, fontSize: 10, bold: true, color: C.text1, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: '번호 글자' });
      s.addText([{ text: t, options: { bold: true, color: C.text1 } }, { text: '  ' + d, options: { color: C.text2 } }],
        { x: x + 0.36, y: ry, w: w - 0.36, h: 0.34, fontSize: 11, margin: 0, valign: 'middle', isTextBox: true, objectName: '구조 ' + (j + 1) });
    });
  });
  // B2B 공급 카드 (다크)
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: BX, y: CY, w: BW, h: 4.4, rectRadius: 0.08, fill: { color: C.accent6 }, line: { type: 'none' }, objectName: 'B2B 카드' });
  const ow = BW - 0.3, oh = ow * 490 / 1200;
  s.addImage({ path: 'tile-outsole.png', x: BX + 0.15, y: CY + 0.15, w: ow, h: oh, objectName: '밑창 그립 패드' });
  s.addText('밑창 그립 패드 · 양산 컬러(라임) 적용 이미지', { x: BX + 0.25, y: CY + 0.2 + oh, w: BW - 0.5, h: 0.26, fontSize: 10, color: C.accent5, margin: 0, isTextBox: true, objectName: '패드 캡션' });
  s.addText('B2B 공급 안내', { x: BX + 0.25, y: CY + 0.55 + oh, w: BW - 0.5, h: 0.36, fontSize: 16, bold: true, color: C.background1, margin: 0, valign: 'middle', isTextBox: true, objectName: 'B2B 제목' });
  const R = [['공급 대상', '외식 프랜차이즈 · 급식 · 리테일 매장'], ['공급 방식', '단체 구매 · 직원 지급 · 유통 입점'], ['단가', '수량별 개별 견적 · 세금계산서 발행'], ['ESG 소재', '폐타이어 고무 · 폐벽지 PVC 새활용 패드']];
  R.forEach(([k, v], j) => {
    s.addText([{ text: k, options: { bold: true, color: C.accent1, breakLine: true } }, { text: v, options: { color: C.background1 } }],
      { x: BX + 0.25, y: CY + 0.98 + oh + j * 0.48, w: BW - 0.5, h: 0.46, fontSize: 11, margin: 0, valign: 'top', isTextBox: true, objectName: '공급 ' + (j + 1) });
  });
  // 푸터
  s.addText([{ text: '실물 상담', options: { bold: true, color: C.text1 } },
             { text: '   킨텍스 메가쇼 11.12–15  ·  서울디자인페어(코엑스) 11.26–29', options: { color: C.text2 } }],
    { x: 0.6, y: 6.62, w: 8.2, h: 0.4, fontSize: 11, margin: 0, valign: 'middle', isTextBox: true, objectName: '박람회' });
  s.addText([{ text: '단체 구매·입점 문의', options: { bold: true, color: C.text1, breakLine: true } },
             { text: 'rharashoe.netlify.app', options: { color: C.text2 } }],
    { x: 9.2, y: 6.55, w: 2.82, h: 0.55, fontSize: 11, align: 'right', margin: 0, valign: 'middle', isTextBox: true, objectName: '문의' });
  s.addImage({ path: 'qr-b2b.png', x: 12.15, y: 6.52, w: 0.6, h: 0.6, objectName: 'QR' });
  s.addNotes('워킹화 사진: 대표 제공 리터칭 이미지(2026-10-05). 인솔: 9/30 실물 리터칭. 밑창 패드: 양산 컬러(라임) 적용 이미지 — P18 확정 전 외부 배포 주의. 수량별 단가표는 원가 확정(F04) 후 추가.');
  await pres.writeFile({ fileName: 'rs-b2b-onepager.pptx' });
  await applyTheme('rs-b2b-onepager.pptx', THEME);
  console.log('ok');
})();
