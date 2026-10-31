"""연필꽂이 겸 리플릿 칼선 도안 (2026-10-28) — 완성 55×55×120, 풀칠 없음.
실행: python3 design/pen-holder/make_dieline.py  → pen-holder-dieline.svg (단위 mm)
실선=칼선(CUT) · 점선=접는선(CREASE). 인쇄면 보기 기준 = 안쪽면(뒷면)."""
B, A, C, RIM, FLOOR, TONGUE, DUST = 55, 53, 120, 15, 54, 15, 22
X = [0, B, 2*B, 3*B, 4*B, 4*B + A]          # b1 b2 b3 b4 a 경계
W, ox, oy = X[-1], 30, 40                    # 도면 여백
fl0, fl1 = X[2] + .5, X[3] - .5              # 바닥판(b3 아래) 54 폭
cut = [(0, 0), (3, -RIM), (B - 3, -RIM), (B, 0), (W, 0), (W, C),
       (X[4], C), (X[4] - 5, C + DUST), (X[3] + 5, C + DUST), (X[3], C),
       (fl1, C), (fl1, C + FLOOR), (fl1 - 1.5, C + FLOOR)]
path = 'M' + ' L'.join(f'{x+ox:.2f},{y+oy:.2f}' for x, y in cut)
t0, t1, ty = fl0 + 1.5, fl1 - 1.5, C + FLOOR + TONGUE   # 혀(둥근 끝 R5)
path += (f' L{t1+ox:.2f},{ty-5+oy:.2f} Q{t1+ox:.2f},{ty+oy:.2f} {t1-5+ox:.2f},{ty+oy:.2f}'
         f' L{t0+5+ox:.2f},{ty+oy:.2f} Q{t0+ox:.2f},{ty+oy:.2f} {t0+ox:.2f},{ty-5+oy:.2f}'
         f' L{t0+ox:.2f},{C+FLOOR+oy:.2f}')
rest = [(fl0, C + FLOOR), (fl0, C), (X[2], C), (X[2] - 5, C + DUST), (X[1] + 5, C + DUST), (X[1], C), (0, C)]
path += ''.join(f' L{x+ox:.2f},{y+oy:.2f}' for x, y in rest) + ' Z'
folds = [(x, 0, x, C) for x in X[1:5]] + [(0, 0, B, 0), (X[1], C, X[4], C), (fl0, C + FLOOR, fl1, C + FLOOR)]
fold_svg = ''.join(f'<line x1="{x1+ox}" y1="{y1+oy}" x2="{x2+ox}" y2="{y2+oy}" class="f"/>' for x1, y1, x2, y2 in folds)
def lab(x, y, s, cls='l'): return f'<text x="{x+ox}" y="{y+oy}" class="{cls}">{s}</text>'
def dim(x1, y1, x2, y2, s, dx=0, dy=0):
    return (f'<line x1="{x1+ox}" y1="{y1+oy}" x2="{x2+ox}" y2="{y2+oy}" class="d" marker-start="url(#m)" marker-end="url(#m)"/>'
            f'<text x="{(x1+x2)/2+ox+dx}" y="{(y1+y2)/2+oy+dy}" class="dt">{s}</text>')
labels = ''.join(lab(X[i] + B/2, 62, n, 'p') for i, n in enumerate(['b1', 'b2', 'b3', 'b4'])) + lab(X[4] + A/2, 62, 'a', 'p')
labels += lab(B/2, -6, 'g', 'p2') + lab((fl0+fl1)/2, C + 30, 'd', 'p2') + lab(X[1] + B/2, C + 14, 'f', 'p2') + lab(X[3] + B/2, C + 14, 'f', 'p2')
labels += lab((fl0+fl1)/2, C + FLOOR + 10, '혀', 's')
dims = (''.join(dim(X[i], -22, X[i+1], -22, '55', dy=-1.5) for i in range(1, 4)) + dim(X[4], -22, W, -22, '53', dy=-1.5)
        + dim(0, -22, B, -22, '55', dy=-1.5) + dim(-12, 0, -12, C, '120', dx=-7) + dim(-12, -RIM, -12, 0, '15', dx=-6)
        + dim(fl0, C + FLOOR + TONGUE + 8, fl1, C + FLOOR + TONGUE + 8, '54', dy=4.5) + dim(fl1 - 7, C + 4, fl1 - 7, C + FLOOR - 4, '54', dx=-5)
        + dim(fl1 + 8, C + FLOOR, fl1 + 8, C + FLOOR + TONGUE, '15', dx=5) + dim(X[4] + 8, C, X[4] + 8, C + DUST, '22', dx=5)
        + dim(0, C + FLOOR + TONGUE + 8 + 10, W, C + FLOOR + TONGUE + 8 + 10, f'전체 가로 {W}', dy=4.5))
H = RIM + C + FLOOR + TONGUE
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W+2*ox+60} {H+oy+70}" width="{W+2*ox+60}mm" height="{H+oy+70}mm">
<title>RHARA SHOE 연필꽂이 리플릿 칼선 — 완성 55×55×120</title>
<defs><marker id="m" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="3" markerHeight="3" orient="auto-start-reverse"><path d="M0,0 L6,3 L0,6 Z" fill="#666"/></marker>
<style>.c{{fill:#F4F4F1;stroke:#0D0D0D;stroke-width:.45}} .f{{stroke:#E0004D;stroke-width:.45;stroke-dasharray:2.2 1.4}}
.d{{stroke:#666;stroke-width:.25}} .dt{{font:600 4px 'Noto Sans KR';fill:#333;text-anchor:middle}}
.p{{font:900 9px 'Noto Sans KR';fill:#9AA0A6;text-anchor:middle}} .p2{{font:900 6px 'Noto Sans KR';fill:#9AA0A6;text-anchor:middle}}
.s{{font:600 3.5px 'Noto Sans KR';fill:#9AA0A6;text-anchor:middle}} .l{{font:500 3.6px 'Noto Sans KR';fill:#333}}</style></defs>
<rect width="100%" height="100%" fill="#fff"/>
<path d="{path}" class="c"/>{fold_svg}{labels}{dims}
<g transform="translate({ox},{H+oy+44})" style="font:500 3.8px 'Noto Sans KR';fill:#333">
<line x1="0" y1="-1.3" x2="12" y2="-1.3" stroke="#0D0D0D" stroke-width=".45"/><text x="15" y="0">실선 = 칼선(재단)</text>
<line x1="60" y1="-1.3" x2="72" y2="-1.3" class="f"/><text x="75" y="0">점선 = 접는 선(누름선)</text>
<text x="0" y="8">접는 순서: ① 점선을 모두 한 번씩 꺾어 두기 → ② b1~b4를 네모 통으로 말고 a를 b1 안쪽에 겹치기 → ③ 윗날개 g를 안으로 접어 a 고정</text>
<text x="0" y="14">④ 바닥: 작은 날개 f 2개를 먼저 접고, 바닥판 d를 덮은 뒤 혀를 b1 안쪽(a 위)으로 밀어 넣기 → ⑤ (선택) 바닥 네 모서리에 4점 패드</text>
<text x="0" y="20">배포: 5면을 지그재그(아코디언)로 접어 55×120 한 면만 보이게. 표지 = a 바깥면</text>
</g></svg>'''
open(__file__.replace('make_dieline.py', 'pen-holder-dieline.svg'), 'w').write(svg)
print(W, H)
