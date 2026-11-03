// 라라슈 쿼드그립 종일편한 워킹화 단독 상품소개서: node build.js → rs-walking-deck.pptx
// 이미지는 build 시 ../ 경로에서 직접 읽음 (폴더에 복사본 두지 않음)
const path = require('path');
const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/5d3bce6c-bc48-4bd0-b0e5-3edd7d02f77d_b6ab80fe-3f67-4e27-b365-659a453d117a/pptx/scripts/apply_theme.js');
const A = (f) => path.join(__dirname, '../fair-print/assets', f);
const O = (f) => path.join(__dirname, '../onepager', f);
const THEME = { name: 'RHARA SHOE Walking Deck', headFontFace: 'Malgun Gothic', bodyFontFace: 'Malgun Gothic',
  colors: { dk1: '0D0D0D', lt1: 'FFFFFF', dk2: '1C1C1C', lt2: 'F2F2EE', accent1: 'C6F432', accent2: '2A2A2A',
    accent3: 'A8A8A2', accent4: '5F5F5A', accent5: 'DADAD4', accent6: '0D0D0D', hlink: 'C6F432', folHlink: 'C6F432' } };
const NOTICE = '이미지 색상은 실제와 다를 수 있으며, 출시 전 샘플 기준으로 사양이 바뀔 수 있습니다.';
(async () => {
  const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = '라라슈 RHARA SHOE 쿼드그립 종일편한 워킹화 상품소개서'; pres.author = '알앤디메이커스 주식회사';
  const C = pres.SchemeColor;
  const T = { name: 'title', type: 'title', x: 0.7, y: 0.5, w: 11.9, h: 0.9, fontSize: 36, bold: true, margin: 0, valign: 'middle', align: 'left' };
  pres.defineSlideMaster({ title: 'DARK', background: { color: '0D0D0D' }, objects: [
    { image: { path: O('rs-logo.png'), x: 12.05, y: 6.78, w: 0.45, h: 0.38 } },
    { placeholder: { options: { ...T, color: C.background1 }, text: '' } } ] });
  pres.defineSlideMaster({ title: 'LIGHT', background: { color: 'FFFFFF' }, objects: [
    { image: { path: O('rs-logo-dark.png'), x: 12.05, y: 6.78, w: 0.45, h: 0.38 } },
    { placeholder: { options: { ...T, color: C.text1 }, text: '' } } ] });
  pres.defineSlideMaster({ title: 'COVER', background: { color: '0D0D0D' }, objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.9, y: 3.0, w: 6.6, h: 1.5, fontSize: 40, bold: true, color: C.background1, margin: 0, valign: 'top', align: 'left' }, text: '' } } ] });
  const note = (s, dark, x = 0.7, w = 10.9) => s.addText(NOTICE, { x, y: 6.8, w, h: 0.35, fontSize: 10, color: dark ? C.accent3 : C.accent4, margin: 0, valign: 'middle', isTextBox: true, objectName: '이미지 고지' });
  const num = (s, n, x, y, dark) => { s.addShape(pres.shapes.OVAL, { x, y, w: 0.6, h: 0.6, fill: { color: C.accent1 }, line: { type: 'none' }, objectName: '번호 ' + n });
    s.addText(String(n), { x, y, w: 0.6, h: 0.6, fontSize: 20, bold: true, color: C.text1, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: '번호 글자 ' + n }); };

  // 1 표지
  pres.addSection({ title: '상품소개서' });
  let s = pres.addSlide({ masterName: 'COVER', sectionTitle: '상품소개서' });
  s.addImage({ path: O('rs-logo.png'), x: 0.9, y: 0.7, w: 0.9, h: 0.757, objectName: 'RS 로고' });
  s.addText([{ text: 'RHARA SHOE  라라슈', options: { bold: true, color: C.background1, breakLine: true } }, { text: '상품소개서', options: { color: C.accent3 } }],
    { x: 2.05, y: 0.7, w: 5, h: 0.76, fontSize: 18, margin: 0, valign: 'middle', isTextBox: true, objectName: '브랜드명' });
  s.addText('쿼드그립\n종일편한 워킹화', { placeholder: 'title' });
  s.addText('Made for Standing.', { x: 0.9, y: 4.75, w: 6.6, h: 0.6, fontSize: 28, bold: true, color: C.accent1, margin: 0, valign: 'middle', isTextBox: true, objectName: '슬로건' });
  s.addText('발이 편해야, 일이 편하다.', { x: 0.9, y: 5.4, w: 6.6, h: 0.45, fontSize: 16, color: C.accent3, margin: 0, valign: 'middle', isTextBox: true, objectName: '보조 슬로건' });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.9, y: 0.7, w: 4.7, h: 5.8, rectRadius: 0.1, fill: { color: C.accent2 }, line: { type: 'none' }, objectName: '이미지 패널' });
  s.addImage({ path: A('walking-cut.png'), x: 8.1 + (4.3 - 5.4 * 742 / 900) / 2 + 0.0, y: 0.8, w: 5.4 * 742 / 900 > 4.3 ? 4.3 : 5.4 * 742 / 900, h: (5.4 * 742 / 900 > 4.3 ? 4.3 : 5.4 * 742 / 900) * 900 / 742, objectName: '워킹화 윗면' });
  note(s, true, 0.9, 6.8);
  s.addNotes('표지. 이미지는 실물 누끼 사진(walking-cut.png).');

  // 2 누구를 위한 신발
  s = pres.addSlide({ masterName: 'LIGHT', sectionTitle: '상품소개서' });
  s.addText('서서 일하는 사람의 신발', { placeholder: 'title' });
  s.addText('주방·매장·현장에서 오래 서는 분들을 위한 신발', { x: 0.7, y: 1.6, w: 6.4, h: 1.0, fontSize: 22, bold: true, color: C.text1, margin: 0, valign: 'top', isTextBox: true, objectName: '대상' });
  s.addText([
    { text: '하루 대부분을 주방과 매장과 계산대 앞에 서 있는 사람들이 있습니다.', options: { breakLine: true, paraSpaceAfter: 10 } },
    { text: '퇴근하면 신발부터 벗게 되는 그 발을 위해 라라슈를 시작했습니다.', options: { breakLine: true, paraSpaceAfter: 10 } },
    { text: '작업화처럼 보이지 않게. 출근길에 신고 나와 근무 중에도, 퇴근길에도 그대로 신을 수 있도록 디자인했습니다.' } ],
    { x: 0.7, y: 2.7, w: 6.4, h: 2.7, fontSize: 16, color: C.accent4, margin: 0, valign: 'top', isTextBox: true, objectName: '브랜드 소개' });
  const pill = (x, t) => { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.75, w: 1.9, h: 0.5, rectRadius: 0.25, fill: { color: C.accent1 }, line: { type: 'none' }, objectName: '태그' });
    s.addText(t, { x, y: 5.75, w: 1.9, h: 0.5, fontSize: 14, bold: true, color: C.text1, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: '태그 글자' }); };
  pill(0.7, '주방'); pill(2.8, '매장'); pill(4.9, '현장');
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.7, y: 1.6, w: 4.9, h: 4.85, rectRadius: 0.1, fill: { color: C.background2 }, line: { type: 'none' }, objectName: '이미지 패널' });
  const ph = 4.55, pw = ph * 1161 / 1354;
  s.addImage({ path: A('walking-main.jpg'), x: 7.7 + (4.9 - pw) / 2, y: 1.75, w: pw, h: ph, objectName: '워킹화 윗면과 밑창' });
  note(s, false);

  // 3 핵심 구조
  s = pres.addSlide({ masterName: 'DARK', sectionTitle: '상품소개서' });
  s.addText('핵심 구조 3가지', { placeholder: 'title' });
  const P3 = [['쿼드그립 4점 패드', '밑창 4곳에 그립 패드를 배치했습니다. 패드에는 폐타이어 재생고무와 실크벽지 재생 PVC를 썼습니다.'],
    ['깔창 없는 일체형 안창', 'E-실리폴리렌으로 안창까지 한 몸. 따로 빠지는 깔창이 없습니다.'],
    ['도톰한 발목 테두리', '발이 들어가는 입구 테두리를 다른 부분보다 두껍게 둘렀습니다.']];
  P3.forEach(([t, d], i) => { const x = 0.7 + i * 4.05, w = 3.8;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.9, w, h: 4.2, rectRadius: 0.1, fill: { color: C.accent2 }, line: { type: 'none' }, objectName: '구조 카드 ' + (i + 1) });
    num(s, i + 1, x + 0.35, 2.25, true);
    s.addText(t, { x: x + 0.35, y: 3.15, w: w - 0.7, h: 1.0, fontSize: 24, bold: true, color: C.background1, margin: 0, valign: 'top', isTextBox: true, objectName: '구조 제목 ' + (i + 1) });
    s.addText(d, { x: x + 0.35, y: 4.2, w: w - 0.7, h: 1.7, fontSize: 16, color: C.accent5, margin: 0, valign: 'top', isTextBox: true, objectName: '구조 설명 ' + (i + 1) }); });

  // 4 밑창·소재
  s = pres.addSlide({ masterName: 'DARK', sectionTitle: '상품소개서' });
  s.addText('밑창 4점 그립 패드와 소재', { placeholder: 'title' });
  const iw = 6.6, ih = iw * 1080 / 1920;
  s.addImage({ path: A('outsole-studio.jpg'), x: 0.7, y: 1.9, w: iw, h: ih, objectName: '밑창 4점 그립 패드', altText: '워킹화 밑창과 그립 패드 4곳' });
  s.addText('라라슈는 발이 바닥에 닿는 순서를 기준으로 4점 그립 패드의 위치를 정했습니다.', { x: 0.7, y: 1.9 + ih + 0.15, w: iw, h: 0.6, valign: 'top', fontSize: 12, color: C.accent3, margin: 0, isTextBox: true, objectName: '이미지 캡션' });
  const R = [['본체 · 밑창', '합성수지 E-실리폴리렌 (EVA·실리콘 배합)'], ['그립 패드', '재생고무(폐타이어) · 재생 PVC(실크벽지)']];
  R.forEach(([t, d], i) => { const y = 1.9 + i * 2.2;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.7, y, w: 4.9, h: 1.95, rectRadius: 0.1, fill: { color: C.accent2 }, line: { type: 'none' }, objectName: '소재 카드 ' + (i + 1) });
    s.addText(t, { x: 8.05, y: y + 0.25, w: 4.2, h: 0.4, fontSize: 16, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: '소재 부위 ' + (i + 1) });
    s.addText(d, { x: 8.05, y: y + 0.75, w: 4.2, h: 1.0, fontSize: 18, color: C.background1, margin: 0, valign: 'top', isTextBox: true, objectName: '소재 설명 ' + (i + 1) }); });
  s.addText('버려지던 타이어와 벽지가, 밑창 그립 패드가 되었습니다.', { x: 7.7, y: 6.2, w: 4.9, h: 0.4, fontSize: 14, color: C.accent5, margin: 0, isTextBox: true, objectName: '소재 메시지' });
  note(s, true);

  // 5 사양표
  s = pres.addSlide({ masterName: 'LIGHT', sectionTitle: '상품소개서' });
  s.addText('제품 사양', { placeholder: 'title' });
  const rows = [['제품명', '쿼드그립 종일편한 워킹화'], ['권장 소비자가', '42,500원 (공급 조건은 별도 협의)'], ['사이즈', '230~280mm'], ['컬러', '차콜 · 그레이 · 민트화이트'],
    ['무게', '한쪽 257g (270mm 샘플 실측)'], ['소재', '본체·밑창 E-실리폴리렌 / 그립 패드 재생고무·재생 PVC'], ['오픈', '11.25 라라슈 자사몰 오픈 예정 (발송 일정은 판매 페이지에서 안내)'], ['제조', '라파']];
  const cell = (t, o) => ({ text: t, options: { fontSize: 16, valign: 'middle', margin: [0, 0.15, 0, 0.15], ...o } });
  s.addTable(rows.map(([k, v], i) => [cell(k, { bold: true, color: C.text1, fill: { color: C.background2 } }), cell(v, { color: C.text1, fill: { color: C.background1 } })]),
    { x: 0.7, y: 1.7, w: 7.4, colW: [1.7, 5.7], rowH: 0.58, border: { type: 'solid', pt: 0.75, color: C.accent5 }, objectName: '제품 사양표' });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.6, y: 1.7, w: 4.0, h: 4.64, rectRadius: 0.1, fill: { color: C.background2 }, line: { type: 'none' }, objectName: '이미지 패널' });
  const ph5 = 4.3, pw5 = ph5 * 1161 / 1354;
  s.addImage({ path: A('walking-main.jpg'), x: 8.6 + (4.0 - pw5) / 2, y: 1.87, w: pw5, h: ph5, objectName: '워킹화 윗면과 밑창' });
  note(s, false);

  // 6 설계 자문
  s = pres.addSlide({ masterName: 'DARK', sectionTitle: '상품소개서' });
  s.addText('설계 자문', { placeholder: 'title' });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.9, w: 11.9, h: 3.4, rectRadius: 0.1, fill: { color: C.accent2 }, line: { type: 'none' }, objectName: '자문 카드' });
  s.addText('정형외과 전문의', { x: 1.2, y: 2.25, w: 6, h: 0.45, fontSize: 18, color: C.accent3, margin: 0, isTextBox: true, objectName: '직함' });
  s.addText([{ text: '이문홍 원장', options: { bold: true, color: C.background1 } }, { text: '  설계 자문', options: { bold: true, color: C.accent1 } }],
    { x: 1.2, y: 2.75, w: 10.9, h: 0.9, fontSize: 36, margin: 0, valign: 'middle', isTextBox: true, objectName: '자문 이름' });
  s.addText('자문 기간 2026.10~', { x: 1.2, y: 3.85, w: 10.9, h: 0.9, fontSize: 20, color: C.accent5, margin: 0, valign: 'top', isTextBox: true, objectName: '자문 내용' });
  s.addText('이문홍 원장은 ㈜알앤디메이커스의 제품 설계 자문에 참여하고 자문료를 받았습니다.', { x: 0.7, y: 5.75, w: 11.9, h: 0.5, fontSize: 16, color: C.background1, margin: 0, valign: 'middle', isTextBox: true, objectName: '자문 고지문' });

  // 7 회사·연락처
  s = pres.addSlide({ masterName: 'DARK', sectionTitle: '상품소개서' });
  s.addText('회사 · 문의', { placeholder: 'title' });
  s.addImage({ path: O('rs-logo.png'), x: 0.7, y: 1.9, w: 1.4, h: 1.4 * 402 / 478, objectName: 'RS 로고' });
  s.addText([{ text: 'RHARA SHOE  라라슈', options: { bold: true, fontSize: 28, color: C.background1, breakLine: true } },
    { text: 'Made for Standing.', options: { fontSize: 20, color: C.accent1 } }],
    { x: 2.4, y: 1.9, w: 5, h: 1.2, margin: 0, valign: 'middle', isTextBox: true, objectName: '브랜드명' });
  const info = [['상호', '알앤디메이커스 주식회사 (대표 신동규)'], ['사업자등록번호', '709-81-02967'], ['고객센터', '0507-1317-2516'], ['인스타그램', '@rharashoe'], ['웹사이트', 'go.rharashoe.com']];
  info.forEach(([k, v], i) => { const y = 3.6 + i * 0.6;
    s.addText(k, { x: 0.7, y, w: 2.6, h: 0.5, fontSize: 16, color: C.accent3, margin: 0, valign: 'middle', isTextBox: true, objectName: '연락 항목 ' + (i + 1) });
    s.addText(v, { x: 3.4, y, w: 8, h: 0.5, fontSize: 20, bold: true, color: C.background1, margin: 0, valign: 'middle', isTextBox: true, objectName: '연락 값 ' + (i + 1) }); });

  const out = path.join(__dirname, 'rs-walking-deck.pptx');
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  console.log('ok');
})();
