// 라라슈 상품소개서 (5장) — node build.js → 라라슈_상품소개서_2026.pptx
// 카피 가드: 교정·통증·피로감소·충격흡수·미끄럼방지 보장 ❌ / 인솔 '의료기기 아님' / 전문의 = 설계 자문 / AI 연출 고지
const pptxgen = require('pptxgenjs');
const path = require('path');
const { applyTheme } = require('/root/.claude/skills/synced/5d3bce6c-bc48-4bd0-b0e5-3edd7d02f77d_b6ab80fe-3f67-4e27-b365-659a453d117a/pptx/scripts/apply_theme.js');
const A = (f) => path.join(__dirname, '../fair-print/assets', f);
const L = (f) => path.join(__dirname, f);

const THEME = { name: 'RhaRa Shoe', headFontFace: 'Malgun Gothic', bodyFontFace: 'Malgun Gothic',
  colors: { dk1: '0D0D0D', lt1: 'FFFFFF', dk2: '1A1A1A', lt2: 'EDEDE8', accent1: 'C6F432', accent2: '3D4A12', accent3: '8C8C86',
            accent4: 'A47864', accent5: '2A2A2A', accent6: 'D8D8D2', hlink: 'C6F432', folHlink: '8C8C86' } };

(async () => {
  const pres = new pptxgen(); pres.layout = 'LAYOUT_16x9'; pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = '라라슈 상품소개서'; pres.author = '㈜알앤디메이커스'; pres.company = '㈜알앤디메이커스';
  const C = pres.SchemeColor;
  const foot = { text: 'RHARA SHOE 라라슈  ·  ㈜알앤디메이커스', options: { x: 0.5, y: 5.25, w: 6, h: 0.25, fontSize: 9, color: C.accent3, margin: 0 } };
  pres.defineSlideMaster({ title: 'COVER', background: { color: '0D0D0D' }, objects: [],
    slideNumber: undefined });
  pres.defineSlideMaster({ title: 'CONTENT', background: { color: '0D0D0D' },
    objects: [{ text: foot }, { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.35, w: 9, h: 0.7, fontSize: 28, bold: true, color: C.background1, margin: 0, valign: 'top', align: 'left' }, text: '' } }],
    slideNumber: { x: 9.1, y: 5.22, w: 0.4, h: 0.25, fontSize: 9, color: C.accent3, align: 'right' } });

  const dots = (s, x, y, d = 0.14, g = 0.09) => { for (let i = 0; i < 4; i++) s.addShape(pres.shapes.OVAL, { x: x + i * (d + g), y, w: d, h: d, fill: { color: C.accent1 }, line: { type: 'none' }, objectName: 'dot' + i }); };
  const tb = (s, text, o) => s.addText(text, Object.assign({ isTextBox: true, margin: 0, color: C.background1, fontSize: 14, valign: 'top' }, o));
  const num = (s, n, x, y) => { s.addShape(pres.shapes.OVAL, { x, y, w: 0.42, h: 0.42, fill: { color: C.accent1 }, line: { type: 'none' } });
    tb(s, n, { x, y, w: 0.42, h: 0.42, fontSize: 13, bold: true, color: C.text1, align: 'center', valign: 'middle' }); };
  const specTable = (s, rows, x, y, w) => s.addTable(rows.map(([k, v]) => [
      { text: k, options: { bold: true, color: C.accent1, fontSize: 11, fill: { color: '1A1A1A' } } },
      { text: v, options: { color: C.background1, fontSize: 11, fill: { color: '1A1A1A' } } }]),
    { x, y, w, colW: [1.1, w - 1.1], border: { type: 'solid', pt: 0.75, color: '2A2A2A' }, margin: [3, 6, 3, 6], rowH: 0.3 });

  // 1 — 표지
  pres.addSection({ title: '표지' });
  let s = pres.addSlide({ masterName: 'COVER', sectionTitle: '표지' });
  s.addImage({ path: A('rs-lockup-lime.png'), x: 0.6, y: 0.55, w: 1.2, h: 1.25, objectName: 'lockup' });
  tb(s, 'Made for Standing.', { x: 0.6, y: 2.05, w: 5, h: 0.4, fontSize: 16, bold: true, color: C.accent1 });
  tb(s, '라라슈 상품소개서', { x: 0.6, y: 2.45, w: 5.2, h: 0.8, fontSize: 40, bold: true });
  tb(s, '서서 일하는 하루를 위한 신발과 인솔', { x: 0.6, y: 3.3, w: 5, h: 0.4, fontSize: 16, color: C.accent6 });
  [['쿼드그립 아치가득 인솔', '11.11 OPEN'], ['쿼드그립 종일편한 워킹화', '11.20 OPEN']].forEach(([n, d], i) => {
    const x = 0.6 + i * 2.55;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 4.05, w: 2.4, h: 0.85, rectRadius: 0.08, fill: { color: '1A1A1A' }, line: { color: '3A3A3A', width: 0.75 }, objectName: 'launch' + i });
    tb(s, n, { x: x + 0.18, y: 4.15, w: 2.1, h: 0.3, fontSize: 11, color: C.accent6 });
    tb(s, d, { x: x + 0.18, y: 4.45, w: 2.1, h: 0.38, fontSize: 18, bold: true, color: C.accent1 });
  });
  s.addShape(pres.shapes.OVAL, { x: 5.9, y: 0.6, w: 3.9, h: 3.9, fill: { color: '1C2208' }, line: { type: 'none' }, objectName: 'halo' });
  s.addImage({ path: A('walking-cut.png'), x: 6.15, y: 0.7, w: 2.85, h: 3.46, objectName: 'walking' });
  s.addImage({ path: A('insole-cut.png'), x: 7.9, y: 3.0, w: 1.85, h: 1.58, objectName: 'insole' });
  dots(s, 6.25, 4.75);
  tb(s, '㈜알앤디메이커스 · 2026', { x: 6.25, y: 5.05, w: 3.2, h: 0.3, fontSize: 10, color: C.accent3 });

  // 2 — 브랜드
  pres.addSection({ title: '브랜드' });
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: '브랜드' });
  s.addText('퇴근하면 신발부터 벗게 되는 그 발을 위해', { placeholder: 'title' });
  tb(s, '하루 7시간, 주방과 매장과 계산대 앞에 서 있는 사람들을 위한 브랜드. 출근길에도, 근무 중에도, 퇴근길에도 같은 신발로 — 사람의 발과 지구의 내일을 함께 생각합니다.', { x: 0.5, y: 1.1, w: 8.6, h: 0.6, fontSize: 14, color: C.accent6 });
  [['01', '출퇴근 겸용 디자인', '작업화처럼 보이지 않게 — 출근길에 신고 나와 근무 중에도, 퇴근길에도 그대로 신을 수 있도록 디자인했습니다.'],
   ['02', '새활용 소재', '워킹화 그립 패드는 폐타이어 고무와 폐벽지 PVC를 배합한 리타이어렌(상표 출원). 인솔에는 목공소 우드칩을 배합했습니다.'],
   ['03', '전문의 설계 자문', '정형외과 전문의 이문홍 원장의 설계 자문으로, 발이 바닥에 닿는 순서를 기준으로 4점 패드 위치를 정했습니다.']]
  .forEach(([n, h, b], i) => {
    const x = 0.5 + i * 3.05;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.95, w: 2.85, h: 2.85, rectRadius: 0.1, fill: { color: '1A1A1A' }, line: { type: 'none' }, objectName: 'card' + n });
    num(s, n, x + 0.25, 2.2);
    tb(s, h, { x: x + 0.25, y: 2.8, w: 2.4, h: 0.4, fontSize: 18, bold: true });
    tb(s, b, { x: x + 0.25, y: 3.3, w: 2.4, h: 1.4, fontSize: 12, color: C.accent6, lineSpacingMultiple: 1.2 });
  });
  tb(s, '이문홍 원장은 제품 설계 자문에 참여하고 자문료를 받았습니다.', { x: 0.5, y: 4.95, w: 8.6, h: 0.25, fontSize: 9, color: C.accent3 });
  s.addNotes('카드 02의 리타이어렌은 상표 출원 단계. 카드 03: 전문의는 설계 자문이며 추천·보증 표현 금지. 논문은 설계 참고 자료이지 성능 보증이 아님.');

  // 3 — 워킹화
  pres.addSection({ title: '제품' });
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: '제품' });
  s.addText('쿼드그립 종일편한 워킹화', { placeholder: 'title' });
  s.addImage({ path: L('img-walking-hero.jpg'), x: 0.5, y: 1.15, w: 3.0, h: 3.75, sizing: { type: 'cover', w: 3.0, h: 3.75 }, objectName: 'walking-hero' });
  tb(s, '42,500원  ·  2026.11.20 OPEN', { x: 3.95, y: 1.15, w: 5.5, h: 0.35, fontSize: 15, bold: true, color: C.accent1 });
  [['01', '밑창 4점 쿼드그립 패드', '바닥에 닿는 길을 따라 그립 패드 4곳을 배치'],
   ['02', '깔창 없는 일체형 안창', '자체 소재 E-실리폴리렌 통째 성형'],
   ['03', '도톰한 발목 입구 테두리', '신고 벗기 쉬운 슬립온 클로그 형태']].forEach(([n, h, b], i) => {
    const y = 1.65 + i * 0.62; num(s, n, 3.95, y);
    tb(s, h, { x: 4.5, y: y - 0.02, w: 4.9, h: 0.3, fontSize: 14, bold: true });
    tb(s, b, { x: 4.5, y: y + 0.27, w: 4.9, h: 0.25, fontSize: 11, color: C.accent6 });
  });
  specTable(s, [['사이즈', '230 ~ 280mm (10mm 단위 6종)'], ['컬러', '차콜 · 그레이 · 민트화이트'], ['무게', '약 257g (270mm 한쪽 실측)'],
                ['소재', '본체 E-실리폴리렌 / 그립 패드 리타이어렌'], ['제조', '대한민국']], 3.95, 3.55, 5.55);
  tb(s, 'AI 연출 이미지 포함 · 실물과 다를 수 있음', { x: 0.5, y: 4.95, w: 3.0, h: 0.2, fontSize: 8, color: C.accent3 });
  s.addNotes('기능 문구는 구조 설명만. "미끄럼 방지 보장·충격흡수·피로 감소" 표현 금지(C02 성적서 전). 컬러명 확정(10/18): 차콜 · 그레이 · 민트화이트. 키비주얼 이미지 내 라벨(차콜 블랙·민트 그린)은 수정 필요.');

  // 4 — 인솔
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: '제품' });
  s.addText('쿼드그립 아치가득 인솔', { placeholder: 'title' });
  s.addImage({ path: L('img-insole-hero.jpg'), x: 6.5, y: 1.15, w: 3.0, h: 3.75, sizing: { type: 'cover', w: 3.0, h: 3.75 }, objectName: 'insole-hero' });
  tb(s, '21,500원  ·  2026.11.11 OPEN', { x: 0.5, y: 1.15, w: 5.6, h: 0.35, fontSize: 15, bold: true, color: C.accent1 });
  [['01', '아치 라인을 따라 채운 형태', '발 아치 곡선 아래 빈 곳을 채우는 구조'],
   ['02', '뒤꿈치를 감싸는 링 컵', '가운데를 비운 링 구조로 뒤꿈치를 감쌈'],
   ['03', '쓰던 깔창 밑에 한 장 더', '반굽 형태 — 가지고 계신 신발에 그대로']].forEach(([n, h, b], i) => {
    const y = 1.65 + i * 0.62; num(s, n, 0.5, y);
    tb(s, h, { x: 1.05, y: y - 0.02, w: 5, h: 0.3, fontSize: 14, bold: true });
    tb(s, b, { x: 1.05, y: y + 0.27, w: 5, h: 0.25, fontSize: 11, color: C.accent6 });
  });
  specTable(s, [['사이즈', 'M 150mm (신발 220~255) · L 170mm (260~280)'], ['컬러', '그레이 · 모카무스'], ['소재', 'E-실리폴리렌(EVA·실리콘 배합) + 목분(우드칩)'],
                ['형태', '반굽 인솔 (뒤꿈치~아치)'], ['제조', '대한민국 · 의료기기 아님']], 0.5, 3.55, 5.6);
  tb(s, 'AI 연출 이미지 · 실물과 다를 수 있음', { x: 6.5, y: 4.95, w: 3.0, h: 0.2, fontSize: 8, color: C.accent3 });
  s.addNotes('교정·평발·통증·족저근막염 등 효능 표현 금지. 의료기기 아님 명시. 반굽 ±5% 사출 편차.');

  // 5 — 런칭 일정
  pres.addSection({ title: '런칭' });
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: '런칭' });
  s.addText('11월, 두 번 엽니다', { placeholder: 'title' });
  const ev = [['11.11', '인솔 OPEN', '쿼드그립 아치가득 인솔', true], ['11.12–15', '메가쇼 킨텍스', '부스에서 직접 신어 보기', false],
              ['11.20', '워킹화 OPEN', '쿼드그립 종일편한 워킹화', true], ['11.26–29', '서울디자인페스티벌', '코엑스 · 부스 운영', false]];
  s.addShape(pres.shapes.LINE, { x: 0.8, y: 1.92, w: 8.4, h: 0, line: { color: '3A3A3A', width: 2 }, objectName: 'timeline' });
  ev.forEach(([d, h, b, key], i) => {
    const x = 0.5 + i * 2.25;
    s.addShape(pres.shapes.OVAL, { x: x + 0.22, y: 1.8, w: 0.24, h: 0.24, fill: { color: key ? C.accent1 : '8C8C86' }, line: { type: 'none' }, objectName: 'node' + i });
    tb(s, d, { x, y: 2.2, w: 2.1, h: 0.45, fontSize: key ? 24 : 20, bold: true, color: key ? C.accent1 : C.background1 });
    tb(s, h, { x, y: 2.7, w: 2.1, h: 0.3, fontSize: 14, bold: true });
    tb(s, b, { x, y: 3.0, w: 2.1, h: 0.3, fontSize: 11, color: C.accent6 });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 3.6, w: 9, h: 1.45, rectRadius: 0.1, fill: { color: '1A1A1A' }, line: { type: 'none' }, objectName: 'contact' });
  tb(s, '구매 · 오픈 알림 · 기업/단체 구매 문의', { x: 0.8, y: 3.78, w: 6.5, h: 0.35, fontSize: 16, bold: true });
  tb(s, [{ text: 'rharashoe.netlify.app', options: { bold: true, color: C.accent1, breakLine: true } },
         { text: 'Instagram @rharashoe  ·  고객센터 0507-1317-2516  ·  rndceo@rndmakers.kr', options: { breakLine: true } },
         { text: '㈜알앤디메이커스 · 대전광역시 유성구 국제과학7로 8', options: { color: C.accent3 } }],
     { x: 0.8, y: 4.18, w: 6.6, h: 0.8, fontSize: 12, color: C.accent6, paraSpaceAfter: 2 });
  s.addImage({ path: L('img-qr-deck.png'), x: 8.15, y: 3.75, w: 1.15, h: 1.15, objectName: 'qr' });

  const out = L('라라슈_상품소개서_2026.pptx');
  await pres.writeFile({ fileName: out }); await applyTheme(out, THEME); console.log('saved', out);
})();
