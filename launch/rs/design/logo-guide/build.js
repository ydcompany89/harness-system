// RHARA SHOE 로고 가이드 PPT (16:9, 10p): NODE_PATH=../deck-product/node_modules node build.js
// 이미지: node render_assets.mjs (brand/*.svg → img/*.png) 먼저 실행
const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/5d3bce6c-bc48-4bd0-b0e5-3edd7d02f77d_b6ab80fe-3f67-4e27-b365-659a453d117a/pptx/scripts/apply_theme.js');

const THEME = {
  name: 'RHARA SHOE', headFontFace: 'Malgun Gothic', bodyFontFace: 'Malgun Gothic',
  colors: { dk1: '0D0D0D', lt1: 'FFFFFF', dk2: '2B2B2B', lt2: 'F2F2EF', accent1: 'C6F432', accent2: '4A7400', accent3: '8A8A85', accent4: 'D2401F', accent5: 'C9C9C4', accent6: '5A5A55', hlink: '4A7400', folHlink: '8A8A85' },
};
const W = 13.333, H = 7.5, M = 0.6;
const LIME = 'C6F432', INK = '0D0D0D', PAPER = 'F2F2EF', GREY = '8A8A85', RED = 'D2401F';
const IMG = (n) => 'img/' + n + '.png';
const AR = { caps: 1600 / 1723, horiz: 1600 / 268, sym: 1600 / 1347 };

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = 'RHARA SHOE 로고 가이드'; pres.author = '알앤디메이커스 주식회사';
  const C = pres.SchemeColor;

  const foot = (dark) => [
    { image: { path: IMG(dark ? 'rs-symbol-lime' : 'rs-symbol-ink'), x: M, y: H - 0.5, w: 0.3 * AR.sym, h: 0.3 } },
    { text: { text: 'RHARA SHOE  LOGO GUIDELINE', options: { x: M + 0.5, y: H - 0.52, w: 5, h: 0.34, fontSize: 9, charSpacing: 2, color: dark ? GREY : '6A6A65', margin: 0 } } },
  ];
  pres.defineSlideMaster({ title: 'COVER', background: { color: INK }, objects: [] });
  pres.defineSlideMaster({
    title: 'CONTENT', background: { color: 'FFFFFF' }, objects: foot(false),
    slideNumber: { x: W - M - 0.6, y: H - 0.52, w: 0.6, h: 0.34, fontSize: 9, color: '6A6A65', align: 'right' },
  });
  pres.defineSlideMaster({
    title: 'CONTENT_DARK', background: { color: INK }, objects: foot(true),
    slideNumber: { x: W - M - 0.6, y: H - 0.52, w: 0.6, h: 0.34, fontSize: 9, color: GREY, align: 'right' },
  });
  const T = (s, text, o) => s.addText(text, { isTextBox: true, margin: 0, ...o });
  const head = (s, eb, title, dark) => {
    T(s, eb, { x: M, y: 0.45, w: 8, h: 0.3, fontSize: 11, bold: true, charSpacing: 3, color: dark ? LIME : '4A7400', objectName: '머리말' });
    T(s, title, { x: M, y: 0.8, w: 12, h: 0.75, fontSize: 30, bold: true, color: dark ? 'FFFFFF' : INK, objectName: '제목' });
  };

  // 1 표지
  pres.addSection({ title: '표지' });
  let s = pres.addSlide({ masterName: 'COVER', sectionTitle: '표지' });
  s.addImage({ path: IMG('rs-logo-rharashoe-caps-lime'), x: 1.2, y: 1.35, w: 4.4, h: 4.4 / AR.caps, objectName: '로고' });
  T(s, 'LOGO GUIDELINE', { x: 7.0, y: 2.6, w: 5.6, h: 0.9, fontSize: 40, bold: true, color: 'FFFFFF', charSpacing: 2 });
  T(s, 'RHARA SHOE 라라슈 로고 사용 기준', { x: 7.0, y: 3.5, w: 5.6, h: 0.5, fontSize: 18, color: 'C9C9C4' });
  T(s, 'Version 1.0  ·  알앤디메이커스 주식회사', { x: 7.0, y: 4.25, w: 5.6, h: 0.35, fontSize: 12, color: LIME, bold: true });

  // 2 표기 원칙
  pres.addSection({ title: '기본' });
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: '기본' });
  head(s, '01  NAMING', '브랜드 표기는 하나로 씁니다');
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.85, w: 6.0, h: 4.6, rectRadius: 0.12, fill: { color: INK }, line: { type: 'none' }, objectName: '바른 표기 카드' });
  T(s, '이렇게 씁니다', { x: M + 0.45, y: 2.15, w: 5, h: 0.35, fontSize: 13, bold: true, color: LIME });
  T(s, 'RHARA SHOE', { x: M + 0.45, y: 2.65, w: 5.3, h: 0.9, fontSize: 44, bold: true, color: 'FFFFFF', charSpacing: 2 });
  T(s, '라라슈', { x: M + 0.45, y: 3.55, w: 5.3, h: 0.7, fontSize: 32, bold: true, color: 'FFFFFF' });
  T(s, [
    { text: '영문은 항상 대문자, 두 단어 사이 한 칸 띄움', options: { bullet: true, breakLine: true } },
    { text: '한글은 "라라슈" 세 글자 붙여 씀', options: { bullet: true, breakLine: true } },
    { text: '문장 안에서도 같은 표기 (예: RHARA SHOE 쿼드그립 워킹화)', options: { bullet: true } },
  ], { x: M + 0.45, y: 4.45, w: 5.3, h: 1.7, fontSize: 14, color: 'D8D8D3', paraSpaceAfter: 6 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 1.85, w: W - 7.0 - M, h: 4.6, rectRadius: 0.12, fill: { color: PAPER }, line: { type: 'none' }, objectName: '잘못된 표기 카드' });
  T(s, '이렇게 쓰지 않습니다', { x: 7.45, y: 2.15, w: 5, h: 0.35, fontSize: 13, bold: true, color: RED });
  ['RhaRa Shoe', 'Rhara Shoe', 'Rha Ra Shoe', 'RHARASHOE', '라라 슈'].forEach((t, i) => {
    T(s, '✕', { x: 7.45, y: 2.7 + i * 0.6, w: 0.4, h: 0.45, fontSize: 18, bold: true, color: RED });
    T(s, t, { x: 7.95, y: 2.7 + i * 0.6, w: 4.4, h: 0.45, fontSize: 20, color: '5A5A55', objectName: '금지 표기' });
  });
  T(s, '예외: 주소·계정처럼 시스템이 소문자를 쓰는 곳 (예: @rharashoe)', { x: 7.45, y: 5.85, w: 5.3, h: 0.4, fontSize: 11, color: '6A6A65' });
  s.addNotes('2026-10-26 대표 확정: 영문 표기를 RHARA SHOE(대문자)로 통일. 이전 표기 RhaRa Shoe는 사용 중단.');

  // 3 로고 구성
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: '기본' });
  head(s, '02  LOGO SET', '로고는 세 가지 형태로 씁니다');
  const cards = [
    ['기본형 (세로)', '모든 매체의 기본. 행택·박스·족자·명함', 'rs-logo-rharashoe-caps-ink', 'caps'],
    ['가로형', '세로 공간이 좁을 때. 자사몰 상단·배너·영상 하단', 'rs-logo-horizontal-ink', 'horiz'],
    ['심볼 단독', '이미 브랜드가 보이는 곳. SNS 프로필·신발 뒤꿈치·도장', 'rs-symbol-ink', 'sym'],
  ];
  const cw = (W - 2 * M - 0.8) / 3;
  cards.forEach(([t, d, img, ar], i) => {
    const x = M + i * (cw + 0.4);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.85, w: cw, h: 4.6, rectRadius: 0.12, fill: { color: PAPER }, line: { type: 'none' }, objectName: '로고 카드' });
    const bw = cw - 0.9, bh = 2.4; let iw = bw, ih = iw / AR[ar]; if (ih > bh) { ih = bh; iw = ih * AR[ar]; }
    s.addImage({ path: IMG(img), x: x + (cw - iw) / 2, y: 2.15 + (bh - ih) / 2, w: iw, h: ih, objectName: t });
    T(s, t, { x: x + 0.4, y: 4.85, w: cw - 0.8, h: 0.45, fontSize: 18, bold: true, color: INK });
    T(s, d, { x: x + 0.4, y: 5.35, w: cw - 0.8, h: 0.8, fontSize: 13, color: '5A5A55' });
  });

  // 4 컬러
  pres.addSection({ title: '컬러' });
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: '컬러' });
  head(s, '03  COLOR', '로고 컬러는 세 가지뿐입니다');
  const sw = [['라임 LIME', LIME, '#C6F432', '198 · 244 · 50', 'C19 M0 Y80 K4', INK, '브랜드 대표색'],
    ['잉크 INK', INK, '#0D0D0D', '13 · 13 · 13', 'C0 M0 Y0 K95', 'FFFFFF', '기본 배경·글자'],
    ['화이트 WHITE', 'FFFFFF', '#FFFFFF', '255 · 255 · 255', 'C0 M0 Y0 K0', INK, '사진 위·어두운 배경']];
  sw.forEach(([n, c, hex, rgb, cmyk, fg, use], i) => {
    const x = M + i * (cw + 0.4);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.85, w: cw, h: 2.6, rectRadius: 0.12, fill: { color: c }, line: { color: 'C9C9C4', width: c === 'FFFFFF' ? 1 : 0 }, objectName: n });
    T(s, n, { x: x + 0.4, y: 2.1, w: cw - 0.8, h: 0.45, fontSize: 18, bold: true, color: fg });
    T(s, use, { x: x + 0.4, y: 3.75, w: cw - 0.8, h: 0.4, fontSize: 13, color: fg });
    T(s, [{ text: 'HEX  ' + hex, options: { breakLine: true } }, { text: 'RGB  ' + rgb, options: { breakLine: true } }, { text: 'CMYK  ' + cmyk + ' (참고값)' }],
      { x: x + 0.1, y: 4.65, w: cw - 0.2, h: 1.1, fontSize: 13, color: INK, paraSpaceAfter: 4 });
  });
  T(s, 'CMYK는 화면 색을 단순 변환한 참고값입니다. 라임은 일반 인쇄에서 탁해지기 쉬우니, 인쇄소 컬러칩(별색·형광 별색)으로 교정 후 확정하세요.',
    { x: M, y: 5.95, w: W - 2 * M, h: 0.5, fontSize: 12, color: '6A6A65' });

  // 5 배경별 조합
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: '컬러' });
  head(s, '04  BACKGROUND', '배경에 따라 로고 색을 고릅니다');
  const bg = [['잉크 배경', INK, 'rs-logo-rharashoe-caps-lime', '기본 조합 — 라임 로고'], ['흰 배경', 'FFFFFF', 'rs-logo-rharashoe-caps-ink', '잉크 로고'],
    ['라임 배경', LIME, 'rs-logo-rharashoe-caps-ink', '잉크 로고 (흰 로고 ✕)'], ['사진·어두운 배경', '3A3A38', 'rs-logo-rharashoe-caps-white', '흰 로고 — 단순한 부분에']];
  const bw4 = (W - 2 * M - 0.9) / 4;
  bg.forEach(([n, c, img, d], i) => {
    const x = M + i * (bw4 + 0.3);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.85, w: bw4, h: 3.3, rectRadius: 0.12, fill: { color: c }, line: { color: 'C9C9C4', width: c === 'FFFFFF' ? 1 : 0 }, objectName: n });
    const iw = 1.9; s.addImage({ path: IMG(img), x: x + (bw4 - iw) / 2, y: 1.85 + (3.3 - iw / AR.caps) / 2, w: iw, h: iw / AR.caps, objectName: n + ' 로고' });
    T(s, n, { x, y: 5.35, w: bw4, h: 0.4, fontSize: 16, bold: true, color: INK });
    T(s, d, { x, y: 5.8, w: bw4, h: 0.4, fontSize: 13, color: '5A5A55' });
  });

  // 6 여백·최소 크기
  pres.addSection({ title: '사용 규칙' });
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: '사용 규칙' });
  head(s, '05  CLEAR SPACE · MIN SIZE', '로고 주변은 비우고, 너무 작게 쓰지 않습니다');
  const lw = 2.6, lh = lw / AR.caps, lx = M + 1.0, ly = 2.35, X = lh * 0.78 / 4;   // X = 심볼 높이의 1/4 (심볼 ≈ 로고 높이 78%)
  s.addShape(pres.shapes.RECTANGLE, { x: lx - X, y: ly - X, w: lw + 2 * X, h: lh + 2 * X, fill: { color: 'EEF9C9' }, line: { color: '4A7400', width: 1, dashType: 'dash' }, objectName: '여백 영역' });
  s.addImage({ path: IMG('rs-logo-rharashoe-caps-ink'), x: lx, y: ly, w: lw, h: lh, objectName: '여백 예시 로고' });
  T(s, 'X', { x: lx + lw / 2 - X / 2, y: ly - X + (X - 0.3) / 2, w: X, h: 0.3, fontSize: 12, bold: true, color: '4A7400', align: 'center' });
  T(s, 'X', { x: lx + lw, y: ly + lh / 2 - 0.15, w: X, h: 0.3, fontSize: 12, bold: true, color: '4A7400', align: 'center' });
  T(s, [{ text: '여백', options: { fontSize: 18, bold: true, color: INK, breakLine: true } },
    { text: '로고 사방으로 X 만큼은 글자·사진·선을 두지 않습니다. X = 심볼(RS) 높이의 1/4', options: { fontSize: 14, color: '5A5A55' } }],
  { x: 6.6, y: 1.9, w: 6.1, h: 1.2 });
  s.addTable([
    [{ text: '형태', options: { bold: true, fill: { color: PAPER } } }, { text: '인쇄 최소', options: { bold: true, fill: { color: PAPER } } }, { text: '화면 최소', options: { bold: true, fill: { color: PAPER } } }],
    ['기본형 (세로)', '가로 20mm', '가로 120px'], ['가로형', '가로 35mm', '가로 180px'], ['심볼 단독', '가로 8mm', '가로 32px'],
  ], { x: 6.6, y: 3.35, w: 6.1, colW: [2.3, 1.9, 1.9], rowH: 0.5, fontSize: 14, color: INK, border: { type: 'solid', color: 'D9DDDC', pt: 1 }, objectName: '최소 크기 표' });
  T(s, '최소 크기보다 작으면 "라라슈" 글자가 뭉개집니다. 그보다 작은 곳은 심볼 단독을 쓰세요.', { x: 6.6, y: 5.55, w: 6.1, h: 0.6, fontSize: 12, color: '6A6A65' });

  // 7 서체
  s = pres.addSlide({ masterName: 'CONTENT_DARK', sectionTitle: '사용 규칙' });
  head(s, '06  TYPEFACE', '워드마크 서체와 함께 쓰는 서체', true);
  const ty = [['Poppins SemiBold', 'RHARA SHOE', '워드마크 영문 · 영문 제목', 'Poppins'], ['Noto Sans KR Bold', '라라슈', '워드마크 한글 · 한글 제목', 'Noto Sans KR'], ['Noto Sans KR Regular', '서서 일하는 하루를 위한 신발', '본문 · 설명문', 'Noto Sans KR']];
  ty.forEach(([n, smp, use, face], i) => {
    const x = M + i * (cw + 0.4);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.85, w: cw, h: 4.4, rectRadius: 0.12, fill: { color: '1A1A1A' }, line: { type: 'none' }, objectName: '서체 카드' });
    T(s, smp, { x: x + 0.4, y: 2.3, w: cw - 0.8, h: 1.4, fontSize: i === 2 ? 20 : 30, bold: i < 2, color: LIME, fontFace: face, valign: 'middle' });
    T(s, n, { x: x + 0.4, y: 4.1, w: cw - 0.8, h: 0.45, fontSize: 16, bold: true, color: 'FFFFFF' });
    T(s, use, { x: x + 0.4, y: 4.6, w: cw - 0.8, h: 0.4, fontSize: 13, color: 'C9C9C4' });
  });
  T(s, '로고의 글자는 서체로 다시 타이핑하지 말고, 항상 제공된 로고 파일을 씁니다. 두 서체 모두 무료(구글 폰트)입니다.', { x: M, y: 6.4, w: W - 2 * M, h: 0.4, fontSize: 12, color: 'C9C9C4' });

  // 8 금지 사례
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: '사용 규칙' });
  head(s, '07  DON\'T', '이렇게 쓰지 않습니다');
  const bad = [['stretch', '늘리거나 찌그러뜨리기'], ['rotate', '기울이거나 돌리기'], ['color', '정해지지 않은 색 쓰기'],
    ['effect', '그림자·빛 효과 넣기'], ['busy', '복잡한 사진 위에 올리기'], ['retype', '다른 서체로 다시 쓰기']];
  const tw = (W - 2 * M - 0.8) / 3, th = tw / 1.5 * 0.62;
  bad.forEach(([k, t], i) => {
    const x = M + (i % 3) * (tw + 0.4), y = 1.75 + Math.floor(i / 3) * (th + 0.75);
    s.addImage({ path: IMG('bad-' + k), x, y, w: tw, h: th, sizing: { type: 'cover', w: tw, h: th }, objectName: '금지 ' + t });
    s.addShape(pres.shapes.OVAL, { x: x + tw - 0.55, y: y + 0.15, w: 0.4, h: 0.4, fill: { color: RED }, line: { type: 'none' }, objectName: '금지 표시' });
    T(s, '✕', { x: x + tw - 0.55, y: y + 0.15, w: 0.4, h: 0.4, fontSize: 14, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    T(s, t, { x, y: y + th + 0.1, w: tw, h: 0.4, fontSize: 14, bold: true, color: INK });
  });

  // 9 적용 기준
  pres.addSection({ title: '적용' });
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: '적용' });
  head(s, '08  APPLICATION', '매체별로 이 버전을 씁니다');
  const hdr = (t) => ({ text: t, options: { bold: true, color: 'FFFFFF', fill: { color: INK } } });
  s.addTable([
    [hdr('매체'), hdr('로고 형태'), hdr('색'), hdr('비고')],
    ['행택 · 신발 박스', '기본형', '라임 / 잉크 배경', '표시사항 면은 잉크 1도'],
    ['쇼핑백 (크라프트)', '기본형', '먹 1도 (실크)', '라임 인쇄 ✕ — 크라프트 위에서 탁해짐'],
    ['명함', '기본형', '라임 / 잉크 배경', '뒷면은 잉크 로고'],
    ['족자 · X배너', '기본형', '라임 또는 잉크', '바닥에서 1.1~1.9m 높이에 배치'],
    ['자사몰 상단 · 배너', '가로형', '잉크 (흰 바탕) / 라임 (어두운 바탕)', '모바일 상단은 심볼 단독'],
    ['SNS 프로필', '심볼 단독', '라임 / 잉크 배경', '원형으로 잘려도 여백 확보'],
    ['신발 뒤꿈치 · 깔창 각인', '심볼 단독', '단색 (소재색)', '금형 각인은 최소 8mm'],
  ], { x: M, y: 1.8, w: W - 2 * M, colW: [2.9, 1.8, 3.4, 4.03], rowH: 0.52, fontSize: 13, color: INK, border: { type: 'solid', color: 'D9DDDC', pt: 1 }, objectName: '매체별 적용 표' });

  // 10 파일
  s = pres.addSlide({ masterName: 'CONTENT_DARK', sectionTitle: '적용' });
  head(s, '09  FILES', '로고 파일은 이것만 씁니다', true);
  s.addTable([
    [hdr('파일 이름'), hdr('형태'), hdr('색')].map(c => ({ ...c, options: { ...c.options, fill: { color: LIME }, color: INK } })),
    ['rs-logo-rharashoe-caps-{ink · lime · white}.svg', '기본형 (세로)', '잉크 · 라임 · 화이트'],
    ['rs-logo-horizontal-{ink · lime · white}.svg', '가로형', '잉크 · 라임 · 화이트'],
    ['rs-symbol-{ink · lime · white}.svg', '심볼 단독', '잉크 · 라임 · 화이트'],
  ], { x: M, y: 1.85, w: W - 2 * M, colW: [6.4, 2.8, 2.93], rowH: 0.55, fontSize: 13, color: 'FFFFFF', border: { type: 'solid', color: '3A3A38', pt: 1 }, objectName: '파일 목록 표' });
  T(s, [{ text: 'SVG = 벡터 원본 (인쇄소·디자이너 전달용, 크기를 키워도 깨지지 않음)', options: { bullet: true, breakLine: true } },
    { text: '이전 파일 rs-logo-rharashoe-{색}.svg (RhaRa Shoe 표기)는 더 이상 쓰지 않습니다', options: { bullet: true, breakLine: true } },
    { text: '파일이 필요하면 알앤디메이커스에 요청하세요 — 화면 캡처 로고는 쓰지 않습니다', options: { bullet: true } }],
  { x: M, y: 4.45, w: W - 2 * M, h: 1.5, fontSize: 14, color: 'D8D8D3', paraSpaceAfter: 6 });
  s.addImage({ path: IMG('rs-logo-horizontal-lime'), x: W - M - 3.2, y: 6.05, w: 3.2, h: 3.2 / AR.horiz, objectName: '가로형 로고' });

  await pres.writeFile({ fileName: 'RHARA_SHOE_로고가이드.pptx' });
  await applyTheme('RHARA_SHOE_로고가이드.pptx', THEME);
  console.log('saved');
})();
