// 라라슈 1장 상품소개서: node build.js → rs-product-onepager.pptx
const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/5d3bce6c-bc48-4bd0-b0e5-3edd7d02f77d_b6ab80fe-3f67-4e27-b365-659a453d117a/pptx/scripts/apply_theme.js');
const THEME = { name: 'RS RhaRa Shoe', headFontFace: 'Malgun Gothic', bodyFontFace: 'Malgun Gothic',
  colors: { dk1: '0B0B0B', lt1: 'EDEDE8', dk2: '161616', lt2: '9A9A94', accent1: 'C6F432', accent2: '2A2A2A',
    accent3: '6E6E68', accent4: 'C6F432', accent5: 'EDEDE8', accent6: '0B0B0B', hlink: 'C6F432', folHlink: 'C6F432' } };
(async () => {
  const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = '라라슈 RhaRa Shoe 1차 라인업 상품소개서'; pres.author = '㈜알앤디메이커스';
  const C = pres.SchemeColor;
  pres.defineSlideMaster({ title: 'ONEPAGER', background: { color: '0B0B0B' }, objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 1.1, w: 6.6, h: 0.75, fontSize: 36, bold: true, color: C.background1, margin: 0, valign: 'middle', align: 'left' }, text: '' } } ] });
  pres.addSection({ title: '상품소개서' });
  const s = pres.addSlide({ masterName: 'ONEPAGER', sectionTitle: '상품소개서' });
  s.addText('Made for Standing.', { placeholder: 'title' });
  // 헤더
  s.addImage({ path: 'rs-logo.png', x: 0.6, y: 0.42, w: 0.66, h: 0.555, objectName: 'RS 로고' });
  s.addText([{ text: 'RhaRa Shoe  라라슈', options: { bold: true, fontSize: 15, color: C.background1, breakLine: true } },
             { text: '㈜알앤디메이커스 · 1차 라인업', options: { fontSize: 11, color: C.background2 } }],
    { x: 1.42, y: 0.42, w: 4.5, h: 0.58, margin: 0, valign: 'middle', isTextBox: true, objectName: '브랜드명' });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 10.73, y: 0.47, w: 2.0, h: 0.42, rectRadius: 0.21, fill: { color: C.accent1 }, line: { type: 'none' }, objectName: '오픈 배지' });
  s.addText('2026.11.11 OPEN', { x: 10.73, y: 0.47, w: 2.0, h: 0.42, align: 'center', valign: 'middle', bold: true, fontSize: 13, color: C.text1, margin: 0, isTextBox: true, objectName: '오픈 일자' });
  s.addText([{ text: '서서 일하는 하루를 위해 설계한 워킹화와 인솔', options: { bold: true, color: C.background1, breakLine: true } },
             { text: '현장의 목소리에서 출발해, 버려지는 자원으로 완성한 1차 라인업', options: { color: C.background2 } }],
    { x: 7.3, y: 1.1, w: 5.43, h: 0.75, fontSize: 12, align: 'right', valign: 'middle', margin: 0, isTextBox: true, objectName: '시작 이야기' });
  // 카드
  const COLW = 5.92, X = [0.6, 6.82], CY = 2.05, CH = 4.4, IH = 2.2;
  for (const x of X) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: CY, w: COLW, h: CH, rectRadius: 0.08, fill: { color: C.text2 }, line: { type: 'none' }, objectName: '제품 카드' });
  // 워킹화 이미지: 탑뷰 + 밑창
  s.addImage({ path: 'tile-shoes.png', x: X[0] + 0.12, y: CY + 0.12, w: IH * 1.2 - 0.24, h: IH - 0.24 - 0.04, objectName: '워킹화 탑뷰' });
  const ow = COLW - (IH * 1.2) - 0.12, oh = ow * 490 / 1200;
  s.addImage({ path: 'tile-outsole.png', x: X[0] + IH * 1.2, y: CY + 0.3, w: ow, h: oh, objectName: '밑창 그립 패드' });
  s.addText('밑창 · 양산 컬러(라임) 적용 이미지', { x: X[0] + IH * 1.2, y: CY + 0.36 + oh, w: ow, h: 0.3, fontSize: 10, color: C.background2, margin: 0, isTextBox: true, objectName: '패드 캡션' });
  // 인솔 이미지
  s.addImage({ path: 'tile-insole.png', x: X[1] + (COLW - (IH - 0.24) * 1.6) / 2, y: CY + 0.12, w: (IH - 0.24) * 1.6, h: IH - 0.24, objectName: '인솔(실물 리터칭)' });
  const P = [
    { name: '쿼드그립 종일편한 워킹화', price: '42,500원', desc: '주방·매장·현장에서 오래 서는 분들을 위한 신발',
      rows: [['쿼드그립 4점 패드', '밑창 4곳, 폐타이어 새활용 고무'], ['깔창 없는 일체형 안창', 'E-실리폴리렌으로 안창까지 한 몸'], ['도톰한 발목 테두리', '입구 테두리를 다른 부분보다 두껍게']] },
    { name: '쿼드그립 아치가득 인솔', price: '21,500원', desc: '가지고 계신 신발에 넣어 쓰는 인솔',
      rows: [['아치가득 구조', '발 아치 라인을 따라 가득 채운 형태'], ['뒤꿈치 컵 구조', '뒤꿈치를 감싸는 컵 모양'], ['우드칩 배합 소재', '목공소 자투리 우드칩을 섞은 E-실리폴리렌']] }];
  P.forEach((p, i) => {
    const x = X[i] + 0.3, w = COLW - 0.6, y0 = CY + IH + 0.12;
    s.addText(p.name, { x, y: y0, w: w - 1.6, h: 0.42, fontSize: 19, bold: true, color: C.background1, margin: 0, valign: 'middle', isTextBox: true, objectName: '제품명' });
    s.addText(p.price, { x: x + w - 1.6, y: y0, w: 1.6, h: 0.42, fontSize: 19, bold: true, color: C.accent1, align: 'right', margin: 0, valign: 'middle', isTextBox: true, objectName: '가격' });
    s.addText(p.desc, { x, y: y0 + 0.44, w, h: 0.3, fontSize: 12, color: C.background2, margin: 0, valign: 'middle', isTextBox: true, objectName: '한줄 설명' });
    p.rows.forEach(([t, d], j) => {
      const ry = y0 + 0.82 + j * 0.37;
      s.addShape(pres.shapes.OVAL, { x, y: ry + 0.03, w: 0.28, h: 0.28, fill: { color: C.accent1 }, line: { type: 'none' }, objectName: '번호' });
      s.addText(String(j + 1), { x, y: ry + 0.03, w: 0.28, h: 0.28, fontSize: 11, bold: true, color: C.text1, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: '번호 글자' });
      s.addText([{ text: t, options: { bold: true, color: C.background1 } }, { text: '   ' + d, options: { color: C.background2 } }],
        { x: x + 0.42, y: ry, w: w - 0.42, h: 0.34, fontSize: 12, margin: 0, valign: 'middle', isTextBox: true, objectName: '구조 ' + (j + 1) });
    });
  });
  // 푸터
  s.addText([{ text: '새활용 소재', options: { bold: true, color: C.accent1, fontSize: 12 } },
             { text: '   그립 패드는 폐타이어 고무·폐벽지 PVC를, 인솔은 목공소 우드칩을 새활용해 만듭니다.', options: { color: C.background2, fontSize: 11 } }],
    { x: 0.6, y: 6.62, w: 8.5, h: 0.4, margin: 0, valign: 'middle', isTextBox: true, objectName: '소재 메시지' });
  s.addText([{ text: '오픈 알림·체험단·단체 문의', options: { color: C.background1, bold: true, breakLine: true } },
             { text: 'rharashoe.netlify.app', options: { color: C.background2 } }],
    { x: 9.2, y: 6.55, w: 2.82, h: 0.55, fontSize: 11, align: 'right', margin: 0, valign: 'middle', isTextBox: true, objectName: '문의' });
  s.addImage({ path: 'qr-onepager.png', x: 12.15, y: 6.52, w: 0.6, h: 0.6, objectName: 'QR' });
  s.addNotes('워킹화 사진은 대표 제공 리터칭 이미지(2026-10-05), 인솔은 9/30 실물 리터칭. 밑창 패드는 양산 컬러(라임) 적용 이미지 — 라파 양산 컬러 확정(P18) 전 외부 배포 시 주의. 10/28 촬영본으로 교체 예정.');
  await pres.writeFile({ fileName: 'rs-product-onepager.pptx' });
  await applyTheme('rs-product-onepager.pptx', THEME);
  console.log('ok');
})();
