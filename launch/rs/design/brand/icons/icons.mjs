// RS 기술 배지 아이콘 세트 (행택·브로셔·상세·박람회 공용)
// 48x48 그리드 라인 아이콘 + 육각 배지. 인쇄용은 svg/*.svg (벡터), 화면용은 icon-sheet.png
// ⚠️ status: 'ok' = 지금 사용 가능 / 'lock' = 시험성적서·등록번호 확보 전 사용 금지
export const LIME = '#C6F432';

export const glyph = {
  quadgrip: `<path d="M24 3.5C32 3.5 35.5 10 35 18C34.5 25 31.5 28.5 31.5 35.5C31.5 41.5 28.5 44.5 24 44.5S16.5 41.5 16.5 35.5C16.5 28.5 13.5 25 13 18C12.5 10 16 3.5 24 3.5Z"/><path d="M18 24.5H30" stroke-width="1.6" opacity=".6"/><circle cx="20" cy="12" r="2.2" fill="currentColor"/><circle cx="28" cy="12" r="2.2" fill="currentColor"/><circle cx="21" cy="37" r="2.2" fill="currentColor"/><circle cx="27" cy="37" r="2.2" fill="currentColor"/>`,
  onepiece: `<path d="M4 37H44V33C44 29 40 28 36 27L28 23L23 13H13L11 26C7 27 4 30 4 33Z"/><path d="M9 31.5H40" stroke-width="4"/><path d="M15 8L19 4M33 15l5-4M24 9l2-5" opacity=".0"/>`,
  collar: `<path d="M5 40H44V36C44 32 40 31 36 30L28 26L25 17L24 9H13L11 29C7.5 30 5 33 5 36Z"/><path d="M12 9.5C15 6.5 21.5 6.5 25 9.5" stroke-width="3.4"/><path d="M33 20V7M29 11L33 7L37 11"/>`,
  tire: `<circle cx="22" cy="24" r="17"/><circle cx="22" cy="24" r="8"/><path d="M22 7V12M22 36V41M5 24H10M34 24H39M10 12l3.5 3.5M30.5 32.5L34 36M10 36l3.5-3.5M30.5 15.5L34 12"/><path d="M38 38a8 8 0 0 0 6-7.5M44 30.5l-2.5 2.5M44 30.5l1.5 3" />`,
  wallpaper: `<rect x="7" y="9" width="22" height="31" rx="2"/><path d="M29 12C35 12 37 15 37 18S35 24 29 24"/><path d="M11 16L15 13L19 16L23 13M11 24L15 21L19 24L23 21M11 32L15 29L19 32L23 29"/><path d="M33 34a6 6 0 1 0 8-6M41 28l-.5 3.5M41 28l3.2 1.4"/>`,
  woodchip: `<path d="M6 30L14 18L26 21L22 34Z"/><path d="M27 15L36 7L43 14L35 23Z"/><path d="M26 32L36 27L42 37L31 42Z"/><path d="M12 25L21 27M31 12L38 15M31 34L38 35" stroke-width="1.8"/>`,
  arch: `<path d="M4 33C10 33 12 33 15 29C19 22 27 22 31 29C33.5 33 38 33 44 33V38H4Z"/><path d="M23 8V18M19 14L23 18L27 14" />`,
  herring: `<path d="M5 14L24 5L43 14M5 26L24 17L43 26M5 38L24 29L43 38"/>`,
  patent: `<path d="M11 4H29L37 12V44H11Z"/><path d="M29 4V12H37"/><path d="M16 20H32M16 26H28"/><circle cx="31" cy="35" r="6"/><path d="M28 40L27 46L31 44L35 46L34 40"/>`,
  design: `<path d="M24 5L42 24L24 43L6 24Z"/><path d="M24 14L33 24L24 34L15 24Z"/><circle cx="24" cy="24" r="2.4" fill="currentColor"/>`,
  slip: `<path d="M4 42L44 30"/><path d="M12 33H32V30C32 28 30 27.5 28 27L23 25L20 19H14L13 26C11 27 10 29 10 31Z" transform="rotate(-16 22 30)"/><path d="M38 42A10 10 0 0 0 36 34"/><text x="40" y="44" font-size="8" fill="currentColor" stroke="none" font-family="Noto Sans KR" font-weight="900">°</text>`,
  antibac: `<circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="12" opacity=".5"/><circle cx="19" cy="20" r="2.4"/><circle cx="28" cy="27" r="3"/><circle cx="22" cy="30" r="1.6"/><path d="M10 38L38 10" stroke-width="3"/>`,
  phthalate: `<path d="M18 5H30M20 5V18L8 40C7 42 8 44 10 44H38C40 44 41 42 40 40L28 18V5"/><path d="M13 31H35"/><path d="M19 37l3 3 7-7" stroke-width="3"/>`,
};

// key, 한글, 영문, 상태, 근거/조건
export const badges = [
  ['quadgrip','쿼드그립 4점 패드','QUAD GRIP 4-POINT','ok','디자인·구조 설명. 미끄럼 성능 수치는 시험 후'],
  ['onepiece','깔창 없는 일체형 안창','ONE-PIECE FOOTBED','ok','구조 설명(10/02 확정)'],
  ['collar','높게 감싼 발목 라인','RAISED COLLAR','ok','P15 최종 디자인 확정 후 실물 대조'],
  ['herring','헤링본 트레드','HERRINGBONE TREAD','ok','밑창 무늬 설명'],
  ['tire','폐타이어 새활용 고무','UPCYCLED TIRE RUBBER','ok','배합 사실. 함량 %는 배합표 근거 후'],
  ['wallpaper','실크벽지 재생 PVC','RECOVERED WALLPAPER PVC','ok','배합 사실. 프탈레이트 시험(C03) 통과 전 홍보 자제 권장'],
  ['woodchip','우드칩 배합 소재','WOOD-CHIP BLEND','ok','인솔 전용'],
  ['arch','아치 라인 설계','ARCH CONTOUR','ok','인솔 전용. "교정·통증" 표현 금지'],
  ['patent','특허출원','PATENT PENDING','lock','출원번호 기재 시에만 사용 (예: 특허출원 제10-2026-XXXXXXX호)'],
  ['design','디자인등록','DESIGN REGISTERED','lock','등록번호 기재 시에만 사용'],
  ['slip','미끄럼 시험 완료','SLIP RESISTANCE TESTED','lock','시험성적서(기관·규격·결과) 수령 후'],
  ['antibac','항균 시험 완료','ANTI-BACTERIAL TESTED','lock','항균 시험성적서 수령 후. 미시험 시 사용 불가'],
  ['phthalate','유해물질 시험 완료','PHTHALATE TESTED','lock','C03 프탈레이트 시험 통과 후'],
];

const HEX = '50,3 91,26.5 91,73.5 50,97 9,73.5 9,26.5';
const HEXIN = '50,10 85,30 85,70 50,90 15,70 15,30';
// 육각 배지 SVG (단독 파일·인라인 공용). lock=true면 회색 처리
export function badgeSVG(key, { lock = false, glow = false, id = key, custom = null } = {}) {
  const c = lock ? '#8a8a8a' : LIME;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="badge">
<defs><linearGradient id="g${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#232323"/><stop offset="1" stop-color="#0d0d0d"/></linearGradient>${glow && !lock ? `<filter id="f${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` : ''}</defs>
<polygon points="${HEX}" fill="url(#g${id})" stroke="${c}" stroke-width="3" stroke-linejoin="round"${glow && !lock ? ` filter="url(#f${id})"` : ''}/>
<polygon points="${HEXIN}" fill="none" stroke="${lock ? '#3a3a3a' : '#3d4a12'}" stroke-width="1" stroke-linejoin="round"/>
<g transform="translate(24 24) scale(1.0833)" fill="none" stroke="${c}" color="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${custom ?? glyph[key]}</g>
${lock ? `<g transform="translate(66 64)"><rect x="0" y="7" width="16" height="12" rx="2" fill="#8a8a8a"/><path d="M3.5 7V4.5a4.5 4.5 0 0 1 9 0V7" fill="none" stroke="#8a8a8a" stroke-width="2.4"/></g>` : ''}
</svg>`;
}
