"""촬영 소품 — 쿼드그립 아웃솔 패드 배치 도면 (A3 가로, 축척 1:1, 270mm)
10/22 원장 촬영 D2: 대표 + 원장이 도면 위에 펜으로 표시하는 컷용. 실제 금형 치수가 아닌 '배치 검토용' 도면.
실행: python3 build_drawing.py → drawing.html (인쇄는 render_pdf.mjs)"""
SOLE = 'M150,700 C92,700 66,648 70,572 C74,500 98,440 94,368 C90,296 68,244 74,178 C80,104 122,34 172,26 C228,18 254,70 250,142 C246,222 228,264 226,334 C224,404 240,474 236,566 C232,646 208,700 150,700 Z'
PTS = [(150, 600, '①', '뒤꿈치 중앙'), (205, 470, '②', '뒤꿈치 앞 바깥쪽'), (222, 262, '③', '발볼 바깥쪽'), (100, 215, '④', '엄지 발볼')]
L = 270.0; s = L / (700 - 26)            # 1 unit → mm
OX, OY = 40, 95                           # 평면도 원점(뒤꿈치 끝, 중심선)
tx = lambda y: OX + (700 - y) * s         # 길이 방향 (뒤꿈치 → 앞코)
ty = lambda x: OY + (x - 160) * s         # 폭 방향
BLUE, RED, INK = '#1f4e9c', '#d23b2b', '#1a1a1a'
def octa(cx, cy, r):
    a = r * 0.62
    pts = [(cx - a, cy - r), (cx + a, cy - r), (cx + r, cy - a), (cx + r, cy + a), (cx + a, cy + r), (cx - a, cy + r), (cx - r, cy + a), (cx - r, cy - a)]
    return 'M' + ' L'.join(f'{x:.2f},{y:.2f}' for x, y in pts) + ' Z'
g = []
# 모눈 (5mm / 25mm)
for x in range(0, 421, 5): g.append(f'<line x1="{x}" y1="0" x2="{x}" y2="297" stroke="#c9d8ee" stroke-width="{0.35 if x % 25 == 0 else 0.12}"/>')
for y in range(0, 298, 5): g.append(f'<line x1="0" y1="{y}" x2="420" y2="{y}" stroke="#c9d8ee" stroke-width="{0.35 if y % 25 == 0 else 0.12}"/>')
g.append(f'<rect x="10" y="10" width="400" height="277" fill="none" stroke="{INK}" stroke-width="0.8"/>')
# ── 평면도 (밑창 바닥면) ──
g.append(f'<text x="{OX}" y="24" font-size="5" font-weight="900" fill="{INK}">A. 아웃솔 바닥면 (오른발 기준) · 축척 1:1</text>')
g.append(f'<g transform="translate({OX + 700 * s:.3f},{OY - 160 * s:.3f}) scale({s:.5f}) matrix(0,1,-1,0,0,0)"><path d="{SOLE}" fill="#f4f6f9" stroke="{INK}" stroke-width="{0.6 / s:.2f}"/></g>')
g.append(f'<line x1="{OX - 6}" y1="{OY}" x2="{OX + L + 6}" y2="{OY}" stroke="{BLUE}" stroke-width="0.25" stroke-dasharray="6 1.5 1 1.5"/>')
path = ' L'.join(f'{tx(y):.2f},{ty(x):.2f}' for x, y, *_ in PTS)
g.append(f'<path d="M{path}" fill="none" stroke="{BLUE}" stroke-width="0.35" stroke-dasharray="2 1.5"/>')
for x, y, n, t in PTS:
    cx, cy = tx(y), ty(x)
    g.append(f'<path d="{octa(cx, cy, 6)}" fill="#C6F432" stroke="{INK}" stroke-width="0.4"/>')
    g.append(f'<text x="{cx:.2f}" y="{cy + 2.2:.2f}" font-size="6" font-weight="900" text-anchor="middle" fill="{INK}">{n}</text>')
    up = x < 160
    ly = OY - 52 if up else OY + 52
    g.append(f'<line x1="{cx:.2f}" y1="{cy + (-8 if up else 8):.2f}" x2="{cx:.2f}" y2="{ly + (4 if up else -4):.2f}" stroke="{INK}" stroke-width="0.2"/>')
    g.append(f'<text x="{cx:.2f}" y="{ly:.2f}" font-size="3.6" font-weight="700" text-anchor="middle" fill="{INK}">{n} {t}</text>')
    # 뒤꿈치 끝에서 거리 — 빈칸 (현장에서 펜으로)
    g.append(f'<text x="{cx:.2f}" y="{ly + (-5 if up else 5):.2f}" font-size="3.2" text-anchor="middle" fill="{RED}">뒤꿈치에서 ______ mm</text>')
# 전장 치수
dy = OY + 66
g.append(f'<line x1="{OX}" y1="{dy - 5}" x2="{OX}" y2="{dy + 2}" stroke="{INK}" stroke-width="0.25"/><line x1="{OX + L}" y1="{dy - 5}" x2="{OX + L}" y2="{dy + 2}" stroke="{INK}" stroke-width="0.25"/>')
g.append(f'<line x1="{OX}" y1="{dy}" x2="{OX + L}" y2="{dy}" stroke="{INK}" stroke-width="0.25" marker-start="url(#a)" marker-end="url(#a)"/>')
g.append(f'<text x="{OX + L / 2}" y="{dy - 1.5}" font-size="4" font-weight="700" text-anchor="middle" fill="{INK}">270 (사이즈 270)</text>')
# ── 측면도 ──
SY = 252
g.append(f'<text x="{OX}" y="{SY - 72}" font-size="5" font-weight="900" fill="{INK}">B. 측면 (바깥쪽) · 그립 패드 위치 투영</text>')
side = (f'M{OX},{SY} L{OX + L * .93},{SY} C{OX + L * .99},{SY} {OX + L},{SY - 6} {OX + L},{SY - 12} '
        f'C{OX + L},{SY - 30} {OX + L * .86},{SY - 40} {OX + L * .66},{SY - 42} L{OX + L * .40},{SY - 46} '
        f'C{OX + L * .30},{SY - 48} {OX + L * .22},{SY - 62} {OX + L * .12},{SY - 62} L{OX + 6},{SY - 60} '
        f'C{OX},{SY - 59} {OX - 2},{SY - 40} {OX},{SY - 22} Z')
g.append(f'<path d="{side}" fill="#f4f6f9" stroke="{INK}" stroke-width="0.6"/>')
g.append(f'<path d="M{OX + 1},{SY - 14} L{OX + L * .95},{SY - 14} C{OX + L * .99},{SY - 14} {OX + L},{SY - 12} {OX + L},{SY - 12}" fill="none" stroke="{INK}" stroke-width="0.3"/>')
g.append(f'<text x="{OX + L * .5}" y="{SY - 18}" font-size="3" text-anchor="middle" fill="#666">일체형 풋베드 · 깔창 없음</text>')
for x, y, n, t in PTS:
    px = tx(y)
    g.append(f'<rect x="{px - 6:.2f}" y="{SY - 2}" width="12" height="2.6" fill="#C6F432" stroke="{INK}" stroke-width="0.3"/>')
    g.append(f'<line x1="{px:.2f}" y1="{SY + 1}" x2="{px:.2f}" y2="{SY + 9}" stroke="{BLUE}" stroke-width="0.2" stroke-dasharray="1.5 1"/><text x="{px:.2f}" y="{SY + 13}" font-size="3.6" font-weight="900" text-anchor="middle" fill="{INK}">{n}</text>')
g.append(f'<text x="{OX - 4}" y="{SY - 30}" font-size="3.2" text-anchor="end" fill="{RED}">굽 높이</text><text x="{OX - 4}" y="{SY - 25}" font-size="3.2" text-anchor="end" fill="{RED}">______ mm</text>')
# ── 오른쪽: 범례 · 검토 메모 · 표제란 ──
RX = 330
g.append(f'<text x="{RX}" y="40" font-size="5" font-weight="900" fill="{INK}">QUAD GRIP 패드 4점</text>')
for k, (x, y, n, t) in enumerate(PTS):
    yy = 50 + k * 9
    g.append(f'<path d="{octa(RX + 4, yy - 1.3, 3.2)}" fill="#C6F432" stroke="{INK}" stroke-width="0.3"/><text x="{RX + 4}" y="{yy}" font-size="3" font-weight="900" text-anchor="middle">{n}</text><text x="{RX + 10}" y="{yy}" font-size="3.6" fill="{INK}">{t}</text>')
g.append(f'<text x="{RX}" y="91" font-size="3.2" fill="#555">걸을 때 바닥에 닿는 순서대로 배치</text>')
g.append(f'<text x="{RX}" y="106" font-size="4.2" font-weight="900" fill="{INK}">설계 검토 메모</text>')
for k in range(9): g.append(f'<line x1="{RX}" y1="{116 + k * 8}" x2="400" y2="{116 + k * 8}" stroke="#9aa7bb" stroke-width="0.25"/>')
TB = 235
g.append(f'<rect x="{RX - 2}" y="{TB}" width="{410 - RX + 2}" height="52" fill="#fff" stroke="{INK}" stroke-width="0.6"/>')
rows = [('도면명', 'QUAD GRIP 아웃솔 패드 배치'), ('품명', '쿼드그립 종일편한 워킹화'), ('사이즈 · 축척', '270 · 1:1'), ('도면번호', 'RS-QG-270-01'), ('제작', '㈜알앤디메이커스 · RhaRa Shoe')]
for k, (a, b) in enumerate(rows):
    yy = TB + 7 + k * 6.2
    g.append(f'<text x="{RX + 1}" y="{yy}" font-size="3" fill="#555">{a}</text><text x="{RX + 22}" y="{yy}" font-size="3.6" font-weight="700" fill="{INK}">{b}</text>')
    g.append(f'<line x1="{RX - 2}" y1="{yy + 2}" x2="410" y2="{yy + 2}" stroke="#bbb" stroke-width="0.2"/>')
yy = TB + 39
for k, lab in enumerate(['설계', '자문 검토']):
    bx = RX - 2 + k * 41
    g.append(f'<rect x="{bx}" y="{yy}" width="41" height="13" fill="none" stroke="{INK}" stroke-width="0.3"/><text x="{bx + 2}" y="{yy + 4}" font-size="2.8" fill="#555">{lab}</text>')
g.append(f'<text x="15" y="283" font-size="2.6" fill="#7a8599">배치 검토용 도면 · 금형 치수와 다를 수 있음</text>')
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 297" width="420mm" height="297mm" font-family="Noto Sans KR, sans-serif">'
       f'<defs><marker id="a" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0,2 L8,5 L0,8 z" fill="{INK}"/></marker></defs>'
       f'<rect width="420" height="297" fill="#fdfdfb"/>' + ''.join(g) + '</svg>')
open('drawing.html', 'w').write('<!doctype html><html><head><meta charset="utf-8"><style>@page{size:420mm 297mm;margin:0}html,body{margin:0;overflow:hidden;height:297mm}svg{display:block}</style>'
    '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap" rel="stylesheet"></head><body>' + svg + '</body></html>')
print('ok')
