"""라라슈 아치가득 인솔 키비주얼 (레스큐스텝 AI 시안 → 라라슈 버전) → rs-insole-hero.html → node render → PNG
카피 가드: 교정·통증·피로감소·균형 효능 표현 금지 / 의료기기 아님 / AI 연출 고지 / 실제 색상 그레이"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
LIME, INK = '#C6F432', '#0B0B0B'
ic = lambda body: f'<svg viewBox="0 0 64 64" width="58" height="58" fill="none" stroke="{LIME}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">{body}</svg>'
WOOD = ic('<path d="M14 40l14-22 10 6-14 22z"/><path d="M36 44l10-14 8 5-10 14z"/><path d="M24 50l6-6"/><circle cx="44" cy="20" r="3"/><circle cx="20" cy="18" r="2"/>')
RING = ic('<path d="M20 12c-6 8-8 20-4 30 3 8 9 12 16 12s13-4 16-12c4-10 2-22-4-30"/><ellipse cx="32" cy="40" rx="7" ry="9"/>')
KR = ic('<rect x="10" y="16" width="44" height="32" rx="4"/><circle cx="32" cy="32" r="7"/><path d="M15 21l4 3M15 43l4-3M49 21l-4 3M49 43l-4-3"/>')
ARCH = ic('<path d="M8 46h48"/><path d="M10 46c6-2 10-10 22-10s16 8 22 10"/><path d="M26 30v-8M32 28v-10M38 30v-8"/><path d="M23 25l3-3 3 3M29 21l3-3 3 3M35 25l3-3 3 3"/>')
STACK = ic('<path d="M12 40c4-6 14-8 22-8s14 2 18 6"/><path d="M12 46c4-6 14-8 22-8s14 2 18 6"/><path d="M40 20v10M35 25l5 5 5-5"/>')
SHOE = ic('<path d="M8 42c0-8 2-16 6-20l8 6c4 3 10 4 16 5l14 3c3 1 5 3 5 6v2H8z"/><path d="M8 46h49"/><path d="M14 38h36" stroke-dasharray="3 3"/>')
html = f'''<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>
@font-face{{font-family:N;font-weight:400;src:url(../fair-print/fonts/NotoSansKR-400.ttf)}}
@font-face{{font-family:N;font-weight:700;src:url(../fair-print/fonts/NotoSansKR-700.ttf)}}
@font-face{{font-family:N;font-weight:900;src:url(../fair-print/fonts/NotoSansKR-900.ttf)}}
@font-face{{font-family:P;font-weight:600;src:url(../fair-print/assets/poppins-600.woff2)}}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:941px;height:1672px;position:relative;overflow:hidden;background:{INK};font-family:N,sans-serif;color:#fff;letter-spacing:-.02em}}
.bg{{position:absolute;inset:0;background:url(base-recolor.png) 0 0/941px 1672px no-repeat}}
.veil-t{{position:absolute;left:0;top:0;width:640px;height:540px;background:radial-gradient(ellipse 120% 100% at 0% 0%,rgba(11,11,11,.85) 0%,rgba(11,11,11,.7) 55%,rgba(11,11,11,0) 100%)}}
.veil-b{{position:absolute;left:0;right:0;top:1090px;bottom:0;background:linear-gradient(rgba(11,11,11,0),{INK} 50px,{INK})}}
.abs{{position:absolute}}
.eyebrow{{font-size:22px;font-weight:700;color:{LIME}}}
h1{{font-size:56px;font-weight:900;line-height:1.16;letter-spacing:-.04em}}
h1 em{{font-style:normal;color:{LIME}}}
.sub{{font-size:24px;line-height:1.6;color:#d6d6d0}}
.row1{{left:60px;right:60px;top:1112px;display:grid;grid-template-columns:repeat(3,1fr)}}
.row1 div{{display:flex;flex-direction:column;align-items:center;gap:14px;font-size:21px;font-weight:700;text-align:center;line-height:1.3}}
.row1 div+div{{border-left:1px solid #333}}
.row1 i{{width:120px;height:120px;border-radius:50%;border:1.5px solid #3a3a3a;display:grid;place-items:center;background:radial-gradient(circle,#1d2410,#111)}}
.box{{left:44px;right:44px;top:1356px;height:190px;border:2px solid {LIME};border-radius:22px;box-shadow:0 0 22px rgba(198,244,50,.35),inset 0 0 22px rgba(198,244,50,.12);display:grid;grid-template-columns:repeat(3,1fr);align-items:center;background:rgba(20,24,12,.6)}}
.box div{{display:flex;flex-direction:column;align-items:center;gap:16px;font-size:22px;font-weight:700;text-align:center;line-height:1.3}}
.box div+div{{border-left:1px solid #333}}
.fine{{left:0;right:0;top:1574px;text-align:center;font-size:15px;color:#8c8c86;line-height:1.6}}
</style></head><body>
<div class="bg"></div><div class="veil-t"></div><div class="veil-b"></div>
<img class="abs" src="rs-lockup-lime.png" style="left:52px;top:44px;height:78px">
<div class="abs eyebrow" style="left:52px;top:150px">쿼드그립 아치가득 인솔</div>
<h1 class="abs" style="left:50px;top:190px">오후 4시,<br>발이 먼저<br><em>퇴근하고 싶을 때.</em></h1>
<div class="abs sub" style="left:52px;top:398px">식당·카페처럼 오래 서서 일하는 분들의<br>쓰던 신발에, 한 장 더.</div>
<div class="abs row1"><div><i>{WOOD}</i>목공소 우드칩<br>배합 소재</div><div><i>{RING}</i>뒤꿈치를 감싸는<br>링 컵 구조</div><div><i>{KR}</i>MADE IN KOREA<br><span style="font-weight:400;color:#9a9a94;font-size:17px">국내 제조</span></div></div>
<div class="abs box"><div>{ARCH}아치 라인을<br>따라 채운 형태</div><div>{STACK}쓰던 깔창 밑에<br>한 장 더</div><div>{SHOE}가지고 계신<br>신발에 쏙</div></div>
<div class="abs fine">이미지는 AI로 연출한 장면입니다 · 실제 제품 색상은 그레이 · 의료기기가 아닙니다<br><b style="color:{LIME};font-size:17px">RHARA SHOE 라라슈 · 2026.11.11 OPEN</b></div>
</body></html>'''
open(os.path.join(HERE, 'rs-insole-hero.html'), 'w').write(html); print('ok')
