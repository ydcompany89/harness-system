"""워킹화 안창(깔창) 인쇄 원고 — RS 로고(라임) + RharaShoe(라임) + MADE IN KOREA · 사이즈(흰색)
대표 시안(10/20) 배치: 뒤꿈치 쪽 중앙. 1:1 mm 단위 SVG, 글자·로고 모두 윤곽선.
실행: launch/rs 에서 python3 design/brand/make_insole_print.py 270 [250 260 ...]
출력: design/brand/insole-print/RS_안창인쇄_{size}mm_원고.svg (인쇄용, 배경 없음)
      design/brand/insole-print/RS_안창인쇄_{size}mm_가이드.svg (깔창 외곽 + 치수, 확인용)"""
import sys, os, numpy as np, potrace
from PIL import Image, ImageFilter
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

A = 'design/fair-print/assets/'
LIME, WHITE = '#C6F432', '#FFFFFF'
OUT = 'design/brand/insole-print/'; os.makedirs(OUT, exist_ok=True)

# ── RS 로고 벡터 (PNG 트레이스) ──
a = Image.open(A + 'rs-logo-ink.png').convert('RGBA').split()[3]; a = a.crop(a.getbbox())
K = 8; a = a.resize((a.width * K, a.height * K), Image.LANCZOS).filter(ImageFilter.GaussianBlur(K * .6))
pad = Image.new('L', (a.width + 8, a.height + 8), 0); pad.paste(a, (4, 4)); a = pad
trace = potrace.Bitmap(np.array(a) <= 127).trace(turdsize=50, alphamax=1.0, opticurve=True, opttolerance=.2)
LOGO_W, LOGO_H = a.width, a.height
def logo_d(scale, ox, oy):
    d = ''
    for c in trace:
        p = c.start_point; d += f'M{ox+p.x*scale:.3f},{oy+p.y*scale:.3f}'
        for s in c.segments:
            if s.is_corner: d += f'L{ox+s.c.x*scale:.3f},{oy+s.c.y*scale:.3f}L{ox+s.end_point.x*scale:.3f},{oy+s.end_point.y*scale:.3f}'
            else: d += f'C{ox+s.c1.x*scale:.3f},{oy+s.c1.y*scale:.3f} {ox+s.c2.x*scale:.3f},{oy+s.c2.y*scale:.3f} {ox+s.end_point.x*scale:.3f},{oy+s.end_point.y*scale:.3f}'
        d += 'Z'
    return d

# ── 글자 윤곽선 ──
FONTS = {}
def text_path(fp, text, cap_mm, cx, base_y):
    """cap_mm = 대문자 높이(mm). cx 중앙 정렬, base_y 기준선."""
    f = FONTS.setdefault(fp, TTFont(fp)); gs = f.getGlyphSet(); cmap = f.getBestCmap(); hm = f['hmtx']
    cap = f['OS/2'].sCapHeight or f['head'].unitsPerEm * .7
    sc = cap_mm / cap; w = sum(hm[cmap[ord(ch)]][0] for ch in text) * sc
    x = cx - w / 2; d = ''
    for ch in text:
        g = cmap[ord(ch)]; pen = SVGPathPen(gs); gs[g].draw(TransformPen(pen, (sc, 0, 0, -sc, x, base_y))); d += pen.getCommands(); x += hm[g][0] * sc
    return d, w

EN = A + 'poppins-600.woff2'
# 배치 (mm) — 270mm 기준, 블록 하단이 뒤꿈치 끝에서 40mm
def art(size):
    k = size / 270                      # 사이즈 비례 (블록 크기는 고정, 위치만 비례)
    W = 34.0                            # 로고 폭 mm
    ls = W / LOGO_W; lh = LOGO_H * ls
    word_cap = 4.6; mik_cap = 2.6; num_cap = 3.4
    y0 = 0.0
    parts = []
    parts.append((LIME, logo_d(ls, -W / 2, y0)))
    y = y0 + lh + 2.2 + word_cap
    d, ww = text_path(EN, 'RharaShoe', word_cap, 0, y); parts.append((LIME, d))
    y += 4.2 + mik_cap
    d, mw = text_path(EN, 'MADE IN KOREA', mik_cap, 0, y); parts.append((WHITE, d))
    y += 3.0 + num_cap
    d, nw = text_path(EN, f'{size}mm', num_cap, 0, y); parts.append((WHITE, d))
    block_h = y - y0; block_w = max(W, ww, mw, nw)
    return parts, block_w, block_h, 40 * k

def insole_outline(L):
    """확인용 깔창 외곽 (실제 금형 외곽 아님) — 좌우 대칭 슬리퍼형 풋베드. 뒤꿈치 끝 y=0, 앞코 y=-L"""
    hw, fw = .14 * L, .185 * L            # 뒤꿈치 반폭, 앞부분 반폭
    return (f'M0,0 C{hw*.75:.1f},0 {hw:.1f},{-L*.04:.1f} {hw:.1f},{-L*.13:.1f} '
            f'C{hw:.1f},{-L*.35:.1f} {fw:.1f},{-L*.52:.1f} {fw:.1f},{-L*.78:.1f} '
            f'C{fw:.1f},{-L*.93:.1f} {fw*.62:.1f},{-L:.1f} 0,{-L:.1f} '
            f'C{-fw*.62:.1f},{-L:.1f} {-fw:.1f},{-L*.93:.1f} {-fw:.1f},{-L*.78:.1f} '
            f'C{-fw:.1f},{-L*.52:.1f} {-hw:.1f},{-L*.35:.1f} {-hw:.1f},{-L*.13:.1f} '
            f'C{-hw:.1f},{-L*.04:.1f} {-hw*.75:.1f},0 0,0 Z')

for size in [int(s) for s in (sys.argv[1:] or ['270'])]:
    parts, bw, bh, off = art(size)
    g = ''.join(f'<path fill="{c}" fill-rule="evenodd" d="{d}"/>' for c, d in parts)
    m = 2
    # ① 인쇄 원고 (블록만, 1:1 mm)
    open(OUT + f'RS_안창인쇄_{size}mm_원고.svg', 'w').write(
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{bw+2*m:.2f}mm" height="{bh+2*m:.2f}mm" viewBox="{-bw/2-m:.2f} {-m:.2f} {bw+2*m:.2f} {bh+2*m:.2f}">'
        f'<title>RS 안창 인쇄 {size}mm — 라임 #C6F432 / 흰색</title>{g}</svg>')
    # ② 가이드 (외곽 + 치수)
    L = size; top = -off - bh            # 블록 상단 y (뒤꿈치 끝 = 0)
    dim = 'stroke="#E03030" stroke-width=".35" fill="none"'
    t = lambda x, y, s, anc='middle', sz=3.2: f'<text x="{x}" y="{y}" font-size="{sz}" fill="#E03030" text-anchor="{anc}" font-family="Noto Sans KR,sans-serif">{s}</text>'
    W0 = .37 * L
    guide = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W0+90:.0f}mm" height="{L+40:.0f}mm" viewBox="{-W0/2-20:.1f} {-L-15:.1f} {W0+90:.1f} {L+40:.1f}">'
             f'<rect x="{-W0/2-20:.1f}" y="{-L-15:.1f}" width="{W0+90:.1f}" height="{L+40:.1f}" fill="#fff"/>'
             f'<path d="{insole_outline(L)}" fill="#6B4A3A" stroke="#3a2a20" stroke-width=".5"/>'
             f'<g transform="translate(0,{top:.2f})">{g}</g>'
             f'<line x1="0" y1="{-L}" x2="0" y2="0" stroke="#E03030" stroke-width=".25" stroke-dasharray="2 1.5"/>'
             f'<line x1="{W0/2+12}" y1="0" x2="{W0/2+12}" y2="{-off:.1f}" {dim}/>' + t(W0/2+14, -off/2, f'{off:.0f}mm', 'start') +
             f'<line x1="{W0/2+12}" y1="{-off:.1f}" x2="{W0/2+12}" y2="{top:.1f}" {dim}/>' + t(W0/2+14, (-off+top)/2, f'인쇄 {bh:.0f}mm', 'start') +
             f'<line x1="{-bw/2:.1f}" y1="{top-4:.1f}" x2="{bw/2:.1f}" y2="{top-4:.1f}" {dim}/>' + t(0, top-6, f'폭 {bw:.0f}mm') +
             t(0, 10, f'뒤꿈치 끝 기준 · 좌우 중앙 · 깔창 외곽은 참고용(실제 금형 기준으로 맞춤)', sz=3) +
             t(0, 16, f'라임 #C6F432 (실물 컬러칩 대조) · 흰색 · 사이즈 {size}mm', sz=3) +
             f'<line x1="{-W0/2-10}" y1="0" x2="{W0/2+16}" y2="0" {dim}/></svg>')
    open(OUT + f'RS_안창인쇄_{size}mm_가이드.svg', 'w').write(guide)
    print(size, f'block {bw:.1f}×{bh:.1f}mm, offset {off:.1f}mm')
