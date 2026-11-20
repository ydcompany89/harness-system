"""메가쇼 부스 아이소메트릭 일러스트 (6m×3m 기본부스 2개) → booth-iso.html → booth-iso.png"""
import os, math
HERE = os.path.dirname(os.path.abspath(__file__))
FP = '../../fair-print/'
INK, LIME, CREAM, GR, YL = '#0D0D0D', '#C6F432', '#F5F2EC', '#1F472C', '#FBD827'
s, KX, KY = 0.26, 0.30, 0.45
OX, OY = 1300 * KX * s + 330, 2500 * s + 210
c = 1
def P(x, y, z=0):
    return (OX + x * s - y * s * KX, OY + y * s * KY - z * s)
def poly(pts, fill, stroke='none', op=1, sw=1):
    return f'<polygon points="{" ".join(f"{a:.1f},{b:.1f}" for a, b in pts)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" opacity="{op}"/>'
def plane_y(y0):   # 정면(y 고정) 평면: local u=x, v=아래로 z
    a, b = P(0, y0, 0); return f'matrix({s:.4f},0,0,{s:.4f},{a:.2f},{b:.2f})'
def plane_x(x0):   # 측면(x 고정): local u=y
    a, b = P(x0, 0, 0); return f'matrix({-s*KX:.4f},{s*KY:.4f},0,{s:.4f},{a:.2f},{b:.2f})'
def box(x, y, w, d, h, top, front, side, z0=0):
    T = [P(x, y, z0 + h), P(x + w, y, z0 + h), P(x + w, y + d, z0 + h), P(x, y + d, z0 + h)]
    Fr = [P(x, y + d, z0), P(x + w, y + d, z0), P(x + w, y + d, z0 + h), P(x, y + d, z0 + h)]
    L = [P(x + w, y, z0), P(x + w, y + d, z0), P(x + w, y + d, z0 + h), P(x + w, y, z0 + h)]
    return poly(L, side, '#000', 1, .6) + poly(Fr, front, '#000', 1, .6) + poly(T, top, '#000', 1, .6)

out = []
# 바닥
out.append(poly([P(0, 0), P(6000, 0), P(6000, 3000), P(0, 3000)], '#d9d6cf', '#999', 1, 1.5))
out.append(poly([P(0, 0), P(3000, 0), P(3000, 3000), P(0, 3000)], '#dfe3d3', 'none', .7))
out.append(poly([P(3000, 0), P(6000, 0), P(6000, 3000), P(3000, 3000)], '#d5e0d8', 'none', .7))
# 통로
out.append(poly([P(-300, 3000), P(6300, 3000), P(6300, 4200), P(-300, 4200)], '#ecebe7', 'none'))
out.append(f'<text x="{P(3000,3900)[0]:.0f}" y="{P(3000,3900)[1]:.0f}" font-size="30" fill="#888" text-anchor="middle" font-weight="700">통로 (관람객)</text>')
# 뒷벽 + 족자 6
out.append(f'<g transform="{plane_y(0)}"><rect x="0" y="-2500" width="6000" height="2500" fill="#f2f2f0" stroke="#999" stroke-width="6"/>')
for i in range(6):
    out.append(f'<image href="{FP}out/08_banner_950x2380_x6_preview-{i+1}.png" x="{i*1000+25}" y="{-2440}" width="950" height="2380" preserveAspectRatio="none"/>')
    out.append(f'<line x1="{i*1000}" y1="-2500" x2="{i*1000}" y2="0" stroke="#bbb" stroke-width="8"/>')
out.append('</g>')
# 우측벽 (판넬 3)
out.append(f'<g transform="{plane_x(6000)}"><rect x="0" y="-2500" width="3000" height="2500" fill="#e8ece9" stroke="#999" stroke-width="6"/>' +
           ''.join(f'<line x1="{k*1000}" y1="-2500" x2="{k*1000}" y2="0" stroke="#bbb" stroke-width="8"/>' for k in (1, 2)) + '</g>')
# 우측벽 선반 3 + 욕실화
for k in range(3):
    out.append(box(5700, 100 + k * 1000, 300, 800, 30, '#2a5a3a', GR, '#173a24', z0=1000 + (k % 2) * 300))
    for j in range(3):
        col = ['#3c4a5a', '#6b5a4a', '#7d8a7d'][j]
        out.append(box(5740, 160 + k * 1000 + j * 250, 220, 200, 70, col, col, '#222', z0=1030 + (k % 2) * 300))
# 좌측벽 (반투명 윤곽)
out.append(poly([P(0, 0, 0), P(0, 3000, 0), P(0, 3000, 2500), P(0, 0, 2500)], '#ffffff', '#888', .12, 2))

items = []  # (깊이, svg)
def add(x, y, w, d, svg): items.append(((y + d / 2), -x, svg))
# 라라슈 존
add(250, 0, 1480, 900, box(250, 0, 1480, 900, 350, '#222', '#111', '#000') + box(250, 0, 1480, 600, 680, '#222', '#151515', '#000') + box(250, 0, 1480, 300, 1000, '#2a2a2a', '#181818', '#000')
    + ''.join(box(350 + k * 450, 40, 300, 180, 110, ['#333', '#888', '#cfe5dc'][k], ['#222', '#777', '#b9d3c9'][k], '#111', z0=1000) for k in range(3))
    + ''.join(box(350 + k * 450, 340, 300, 180, 90, LIME if k == 1 else '#444', '#333', '#111', z0=680) for k in range(3)))
add(0, 1050, 450, 900, box(0, 1050, 450, 900, 2000, '#cfe9ff', '#bcd8ef', '#9fbfd8') + box(30, 1100, 390, 800, 25, '#fff', '#eee', '#ccc', z0=1300)
    + ''.join(box(80, 1150 + k * 250, 280, 180, 100, ['#333', '#888', '#cfe5dc'][k], '#555', '#111', z0=1325) for k in range(3)))
add(1950, 80, 900, 450, box(2380, 250, 60, 60, 900, '#111', '#111', '#000') +
    f'<g transform="{plane_y(300)}"><rect x="1950" y="-1500" width="900" height="520" fill="#111"/><image href="../../film/reo-ep01/assets/reo-front.png" x="2240" y="-1470" width="190" height="460" preserveAspectRatio="xMidYMid meet"/><text x="2400" y="-1180" font-size="70" fill="{LIME}" font-weight="900" text-anchor="start">BRAND FILM</text></g>')
add(900, 1250, 1450, 400, box(900, 1250, 1450, 400, 420, '#555', '#444', '#333'))
add(0, 2150, 120, 600, box(0, 2150, 60, 600, 1700, '#cde', '#dfe9f2', '#a9b9c9'))
add(2300, 1250, 600, 400, box(2300, 1250, 600, 400, 1100, '#f4f8ff', '#e3ecf7', '#c9d6e6') + box(2380, 1330, 200, 120, 60, LIME, '#9fca22', '#6f8f12', z0=1100) + box(2620, 1330, 200, 120, 40, '#666', '#555', '#333', z0=1100))
for px, lab in [(700, 'walk'), (1700, 'insole')]:
    add(px, 2350, 500, 500, box(px, 2350, 500, 500, 1000, '#111', INK, '#000') +
        f'<g transform="{plane_y(2850)}"><image href="{FP}assets/rs-logo-lime.png" x="{px+110}" y="-720" width="280" height="235"/><text x="{px+250}" y="-380" font-size="58" fill="{LIME}" text-anchor="middle" font-weight="900">QUAD GRIP</text></g>' +
        box(px + 120, 2470, 260, 160, 110, '#333' if lab == 'walk' else '#777', '#222', '#111', z0=1000))
# 가운데 카운터
add(2450, 2250, 1100, 550, box(2450, 2250, 1100, 550, 750, '#222', INK, '#000') +
    f'<g transform="{plane_y(2800)}"><rect x="2450" y="-750" width="1100" height="750" fill="{INK}"/><text x="3000" y="-470" font-size="80" fill="{LIME}" text-anchor="middle" font-weight="900">@re.feeel</text><text x="3000" y="-340" font-size="58" fill="#fff" text-anchor="middle" font-weight="700">팔로우 → CXP 볼펜</text><text x="3000" y="-230" font-size="58" fill="{YL}" text-anchor="middle" font-weight="700">스토리 → 칫솔</text></g>' +
    box(2550, 2330, 300, 200, 90, '#c9a36b', '#b08b55', '#8a6a3e', z0=750) + box(2950, 2330, 300, 200, 90, '#e9e2d0', '#d8d0bb', '#b9b19d', z0=750))
for sx in (2600, 3100):
    add(sx, 1750, 420, 420, box(sx, 1750, 420, 420, 450, '#666', '#555', '#444'))
# re.feeel 존
add(3150, 0, 900, 450, box(3150, 0, 900, 450, 900, '#dff2e8', '#cfe6da', '#b3cfc0') + ''.join(box(3220 + k * 270, 80, 200, 200, 120, '#e9e0cc', '#d9cfb8', '#b9ae96', z0=300 + k * 0) for k in range(3)))
add(4250, 0, 1480, 600, box(4250, 0, 1480, 600, 750, GR, '#1a3d26', '#123020') + ''.join(box(4320 + k * 340, 120, 280, 300, 140, ['#3c4a5a', '#6b5a4a', '#7d8a7d', '#c9c1b0'][k], '#333', '#222', z0=750) for k in range(4)))
add(3850, 2450, 350, 350, box(3850, 2450, 350, 350, 1300, '#999', '#888', '#777'))
# X배너 3 + 등신대
def stand(x, y, w, h, img):
    return f'<g transform="{plane_y(y)}"><image href="{img}" x="{x}" y="{-h}" width="{w}" height="{h}" preserveAspectRatio="none"/></g>'
add(150, 2700, 600, 50, stand(150, 2750, 600, 1800, f'{FP}out/07_xbanner_600x1800_preview-1.png'))
add(5250, 2700, 600, 50, stand(5250, 2750, 600, 1800, f'{FP}out/07_xbanner_600x1800_preview-2.png'))
add(2950, 1550, 600, 50, stand(2950, 1600, 600, 1800, f'{FP}out/07b_xbanner_doctor_600x1800_preview-1.png'))
add(4650, 2350, 700, 50, stand(4650, 2400, 650, 1400, f'{FP}out/09_reo_standee_preview-1.png'))
items.sort(key=lambda t: (t[0], t[1]))
out += [t[2] for t in items]
# 동선
route = [(1000, 3950, 0), (1250, 3050, 0), (1620, 1450, 420), (2600, 1450, 1100), (3800, 3000, 0), (4500, 2300, 0), (4700, 1500, 0)]
pts = ' '.join(f'{P(x, y, z)[0]:.1f},{P(x, y, z)[1]:.1f}' for x, y, z in route)
out.append(f'<polyline points="{pts}" fill="none" stroke="#e8410a" stroke-width="7" stroke-dasharray="18 12" marker-end="url(#ar)"/>')
steps = [((1000, 3950, 0), '통로'), ((1250, 3050, 0), '포디움'), ((1620, 1450, 420), '시착'), ((2600, 1450, 1100), '원장 코너'), ((3800, 3000, 0), '카운터'), ((4600, 1900, 0), 're.feeel')]
for i, ((x, y, z), t) in enumerate(steps):
    a, b = P(x, y, z)
    out.append(f'<circle cx="{a:.1f}" cy="{b:.1f}" r="22" fill="#e8410a"/><text x="{a:.1f}" y="{b+9:.1f}" font-size="26" fill="#fff" text-anchor="middle" font-weight="900">{i+1}</text><text x="{a+28:.1f}" y="{b-14:.1f}" font-size="21" fill="#e8410a" font-weight="900" stroke="#fff" stroke-width="5" paint-order="stroke">{t}</text>')
# 라벨(콜아웃)
def call(x, y, z, lx, ly, title, sub, col=INK):
    a, b = P(x, y, z)
    return (f'<line x1="{a:.1f}" y1="{b:.1f}" x2="{lx + (284 if lx < 1000 else -6)}" y2="{ly}" stroke="{col}" stroke-width="2" opacity=".8"/><circle cx="{a:.1f}" cy="{b:.1f}" r="5" fill="{col}"/>'
            f'<rect x="{lx-6}" y="{ly-30}" width="290" height="{62 if sub else 40}" rx="8" fill="#fff" stroke="{col}" stroke-width="2"/>'
            f'<text x="{lx+6}" y="{ly}" font-size="24" font-weight="900" fill="{col}">{title}</text>' + (f'<text x="{lx+6}" y="{ly+24}" font-size="16" fill="#444">{sub}</text>' if sub else ''))
L = [
 (0, 1500, 2000, 40, 760, '타워쇼케이스', '워킹화 3색 + 밑창 1족 뒤집기'),
 (900, 450, 1000, 330, 300, '3단 진열대', '워킹화 사이즈·컬러 · S1 RS 로고 사인'),
 (2400, 300, 1500, 760, 150, 'TV 50"', '브랜드 필름 루프'),
 (950, 2600, 1100, 40, 1300, '허니콤 포디움 ①', '워킹화'),
 (1950, 2600, 1100, 360, 1420, '허니콤 포디움 ②', '인솔 겹침 시연'),
 (1600, 1450, 420, 40, 1080, '시착 벤치 + 거울', ''),
 (2600, 1450, 1100, 1080, 600, '원장 코너', '아크릴단상 + X배너 ③'),
 (3000, 2500, 800, 1020, 1540, '카운터 (기본 데스크)', '계산 + @re.feeel 볼펜·칫솔'),
 (3600, 200, 900, 1420, 260, '유리 쇼케이스', '칫솔·치실·양치컵 · S2 씰 사인', GR),
 (5000, 300, 750, 1900, 420, '욕실화 매대', '', GR),
 (5850, 1500, 1400, 2150, 760, '우측벽 선반 3단', '욕실화 컬러', GR),
 (5000, 2400, 1000, 2000, 1220, '레오 등신대', '', GR),
]
anch = [(P(a[0], a[1], a[2]), a) for a in L]
left = sorted([t for t in anch if t[0][0] < P(3000, 1500)[0]], key=lambda t: t[0][1])
right = sorted([t for t in anch if t[0][0] >= P(3000, 1500)[0]], key=lambda t: t[0][1])
for grp, lx in ((left, 30), (right, 2080)):
    ys = []
    for (ax, ay), a in grp:
        y = min(max(ay, 230), 1380)
        if ys and y < ys[-1] + 80: y = ys[-1] + 80
        ys.append(y)
    over = ys[-1] - 1390 if ys else 0
    if over > 0: ys = [y - over for y in ys]
    for y, ((ax, ay), a) in zip(ys, grp):
        out.append(call(a[0], a[1], a[2], lx, int(y), a[5], a[6], a[7] if len(a) > 7 else INK))
out.append('<defs><marker id="ar" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#e8410a"/></marker></defs>')
W, H = 2400, 1450
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" style="font-family:N">{"".join(out)}</svg>'
html = f'''<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>메가쇼 부스 일러스트</title><style>
@font-face{{font-family:N;font-weight:400;src:url({FP}fonts/NotoSansKR-400.ttf)}}@font-face{{font-family:N;font-weight:700;src:url({FP}fonts/NotoSansKR-700.ttf)}}@font-face{{font-family:N;font-weight:900;src:url({FP}fonts/NotoSansKR-900.ttf)}}
body{{margin:0;background:#fff;font-family:N}}.hd{{position:absolute;left:40px;top:28px}}.hd h1{{margin:0;font-size:40px}}.hd p{{margin:4px 0 0;color:#555;font-size:20px}}
.lg{{position:absolute;right:40px;top:30px;font-size:18px;line-height:1.7;text-align:right}}.lg b{{display:inline-block;width:14px;height:14px;border-radius:3px;margin-left:8px;vertical-align:-2px}}</style></head><body>
<div style="position:relative;width:{W}px;height:{H}px">{svg}
<div class="hd"><h1>메가쇼 킨텍스 부스 — 기본부스 2개 (6m × 3m)</h1><p>2026.11.12~15 · 뒷벽 족자 PET 6장 · 왼쪽 RS 라라슈 / 오른쪽 re.feeel · 집기 KDRS 렌탈 + 재사용 제작물</p></div>
<div class="lg">RS 라라슈 존 (블랙·라임)<b style="background:{LIME}"></b><br>re.feeel 존 (그린·옐로)<b style="background:{GR}"></b><br>관람객 동선 ①~⑥<b style="background:#e8410a"></b></div>
</div></body></html>'''
open(os.path.join(HERE, 'booth-iso.html'), 'w').write(html)
print('ok')
