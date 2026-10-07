// node build-sheet.mjs → reo-sheet.png (레오 사장 캐릭터 시트 v2, 이전 시안 검토 포함)
import fs from 'fs';
import { createRequire } from 'module';
const here = new URL('.', import.meta.url).pathname;
const F = '../hangtag/fonts', L = '#C6F432';
const keys = [
  ['헤어밴드', '라임 #C6F432 + 가운데 작은 검정 RS 로고', L],
  ['선글라스', '검정 렌즈 웨이파러 (놀랄 때만 콧등으로)', '#111'],
  ['조리복', '흰색, 소매 팔꿈치까지 걷음', '#F4F4EF'],
  ['앞치마', '차콜 캔버스 + 가슴 흰 패치 "REO"', '#2B2B2B'],
  ['바지', '검정 작업 바지', '#1a1a1a'],
  ['신발', '검정 클로그 실루엣만 (로고·밑창 X)', '#0b0b0b'],
  ['털', '진갈색 + 주둥이 베이지, 꼬리 항상 보이게', '#5a3b26'],
  ['체형', '직립·사람 비율, 단단한 체격', '#8a6a4f'],
];
const review = [
  ['old-turnaround.png', '턴어라운드', 'keep', '마스터 기준 (등판·패치 문구만 수정)'],
  ['old-kitchen.png', '주방 무릎 컷', 'keep', '릴스 톤 기준 · 앞치마 차콜로'],
  ['old-poster.png', '포스터', 'fix', '실사 톤 유지 · 브랜드명 RS로'],
  ['old-comic.jpg', '코믹 "그립달"', 'fix', '스티커·만화용 · 이름 레오, 렌즈 검정'],
  ['old-mascot-green.png', '그린 마스코트', 'drop', '구 브랜드·초록·효능 표기'],
  ['old-rescuestep.png', 'RESCUE STEP', 'drop', '다른 브랜드명·NO SLIP 단정'],
  ['old-brandboard.png', '브랜드 보드', 'drop', '가짜 시험 수치 COF 0.95 ⚠️'],
];
const tag = { keep: ['유지', L, '#111'], fix: ['수정', '#f0b429', '#111'], drop: ['폐기', '#ff5a5a', '#fff'] };
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:K;font-weight:400;src:url(${F}/NotoSansKR-400.ttf)}@font-face{font-family:K;font-weight:700;src:url(${F}/NotoSansKR-700.ttf)}@font-face{font-family:K;font-weight:900;src:url(${F}/NotoSansKR-900.ttf)}
*{box-sizing:border-box}body{margin:0;background:#0e0e0e;font-family:K;color:#eee}
.w{width:1800px;padding:64px 72px;background:repeating-linear-gradient(135deg,transparent 0 38px,#151515 38px 40px)}
h1{margin:0;font-size:68px;font-weight:900;color:${L};letter-spacing:1px}h1 span{color:#fff}
.sub{font-size:24px;color:#999;margin:8px 0 40px}
h2{font-size:26px;color:${L};letter-spacing:4px;margin:48px 0 18px;font-weight:900}
.row{display:flex;gap:28px}
.card{background:#171717;border:1px solid #2a2a2a;border-radius:18px;padding:26px}
.turn{flex:0 0 1100px;position:relative;padding:0;overflow:hidden}.turn img{width:100%;display:block}
.note{position:absolute;background:${L};color:#111;font-weight:900;font-size:19px;padding:8px 14px;border-radius:8px}
.prof{flex:1}.prof dl{margin:0;display:grid;grid-template-columns:110px 1fr;gap:14px 10px;font-size:22px;line-height:1.45}
.prof dt{color:#888;font-weight:700}.prof dd{margin:0}
.big{font-size:34px;font-weight:900;color:#fff;border-left:6px solid ${L};padding-left:16px;margin:22px 0 0}
.keys{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.k{display:flex;gap:14px;align-items:center;background:#171717;border:1px solid #2a2a2a;border-radius:14px;padding:16px}
.k i{flex:0 0 54px;height:54px;border-radius:12px;border:2px solid #444}.k b{display:block;font-size:22px}.k span{font-size:17px;color:#aaa;line-height:1.35}
.styles .card{flex:1;padding:0;overflow:hidden;position:relative}.styles img{width:100%;height:560px;object-fit:cover;object-position:center 30%;display:block}
.cap{position:absolute;left:0;right:0;bottom:0;padding:18px 24px;background:linear-gradient(transparent,#000d 40%);font-size:22px}.cap b{color:${L};font-size:28px;display:block}
.rev{display:grid;grid-template-columns:repeat(7,1fr);gap:14px}
.r{background:#171717;border:1px solid #2a2a2a;border-radius:14px;overflow:hidden}.r img{width:100%;height:190px;object-fit:cover;display:block}
.r div{padding:12px}.r b{font-size:18px;display:block;margin:6px 0 4px}.r span{font-size:15px;color:#aaa;line-height:1.35;display:block}
.t{display:inline-block;font-weight:900;font-size:15px;padding:3px 10px;border-radius:6px}
.dd{display:grid;grid-template-columns:1fr 1fr;gap:28px}.dd ul{margin:0;padding-left:24px;font-size:21px;line-height:1.75}
.dd .no b{color:#ff5a5a}.dd .ok b{color:${L}}
.pal{display:flex;gap:14px;margin-top:6px}.pal div{text-align:center;font-size:15px;color:#aaa}.pal i{display:block;width:92px;height:56px;border-radius:10px;border:1px solid #444;margin-bottom:6px}
</style><div class="w">
<h1>레오 사장 <span>· REO</span></h1>
<div class="sub">RS(RhaRa Shoe · 라라슈) 화자 캐릭터 시트 v2 · 2026-10-03 · 이전 시안 8장 통합</div>
<div class="row">
 <div class="card turn"><img src="refs/old-turnaround.png">
  <div class="note" style="left:640px;top:250px">수정 → 등판: RS 로고 + "레오네 주방"</div>
  <div class="note" style="left:40px;top:330px">수정 → 패치: "REO" 단독</div>
  <div class="note" style="left:40px;top:20px;background:#111;color:${L};border:2px solid ${L}">MASTER 기준</div></div>
 <div class="card prof"><dl>
  <dt>정체</dt><dd>동네 식당 <b>'레오네 주방'</b> 사장<br>주방 막내부터 11년, 가게 연 지 3년</dd>
  <dt>성격</dt><dd>무뚝뚝한데 속이 여림<br>직원 편, 사장님들 편</dd>
  <dt>말투</dt><dd>짧은 반말 혼잣말<br>"…또 켜놨네." "버틴다."</dd>
  <dt>세계관</dt><dd>레오네 주방 · 직원 2명(사람) · 단골</dd></dl>
  <div class="big">"…오늘도 영업 시작."</div>
  <div style="font-size:19px;color:#999;margin-top:10px">모든 영상 엔딩 · 앞치마 끈 묶으며</div></div>
</div>
<h2>DESIGN KEYS · 매번 지킬 8가지</h2>
<div class="keys">${keys.map(([a, b, c]) => `<div class="k"><i style="background:${c}"></i><div><b>${a}</b><span>${b}</span></div></div>`).join('')}</div>
<h2>STYLE · 메인 1 + 서브 1</h2>
<div class="row styles">
 <div class="card"><img src="refs/old-kitchen.png"><div class="cap"><b>메인 · 실사형</b>릴스·쇼츠·피드·박람회 등신대 (앞치마는 차콜로 통일)</div></div>
 <div class="card"><img src="refs/old-poster.png" style="object-position:center 25%"><div class="cap"><b>메인 · 실사형 (포스터)</b>팔짱 시그니처 · 젖은 주방 무드</div></div>
 <div class="card"><img src="refs/old-comic.jpg" style="object-position:center 20%"><div class="cap"><b>서브 · 펜선 코믹</b>스티커·4컷 만화 (이름 레오, 렌즈 검정)</div></div>
</div>
<h2>이전 시안 검토</h2>
<div class="rev">${review.map(([f, n, s, d]) => `<div class="r"><img src="refs/${f}"><div><span class="t" style="background:${tag[s][1]};color:${tag[s][2]}">${tag[s][0]}</span><b>${n}</b><span>${d}</span></div></div>`).join('')}</div>
<h2>DO / DON'T</h2>
<div class="dd">
 <div class="card ok"><ul><li><b>✔</b> 사장님 공감 상황을 연기한다 (에어컨·노쇼·마감)</li><li><b>✔</b> 제품 장면은 실물 촬영본으로 붙인다</li><li><b>✔</b> 계정에 "AI로 생성한 캐릭터" 표기 유지</li><li><b>✔</b> 생성 때마다 마스터 턴어라운드를 레퍼런스로</li></ul>
 <div class="pal">${[['#111111', 'Black'], [L, 'RS Lime'], ['#F4F4EF', 'White'], ['#2B2B2B', 'Charcoal'], ['#5A3B26', 'Fur']].map(([c, n]) => `<div><i style="background:${c}"></i>${n}<br>${c}</div>`).join('')}</div></div>
 <div class="card no"><ul><li><b>✖</b> 신발 성능을 말로 주장 ("안 미끄러져", "안 아파")</li><li><b>✖</b> 통증·질병 이야기, 가짜 시험 수치·인증 마크</li><li><b>✖</b> 모자·초록 팔레트·데님 앞치마·구 브랜드명·2024</li><li><b>✖</b> 신발에 큰 RS 로고·AI로 그린 밑창 디테일</li><li><b>✖</b> 실제 사람인 척 / 경쟁 브랜드 비하</li></ul></div>
</div></div>`;
fs.writeFileSync(here + 'reo-sheet.html', html);
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1800, height: 1000 } });
await p.goto(`file://${here}reo-sheet.html`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
await (await p.$('.w')).screenshot({ path: here + 'reo-sheet.png' }); await b.close(); console.log('ok');
