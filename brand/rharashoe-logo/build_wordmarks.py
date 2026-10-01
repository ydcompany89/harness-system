"""RhaRa Shoe (라라슈) wordmark concepts, round 2 — drawn to match the supplied RS symbol.

Symbol DNA carried into the letters:
  · monoline stroke, ~14–16 % of cap height
  · flat (butt) terminals, never rounded caps
  · big quarter-circle corners (the R's top-left)
  · signature gap: the R's middle bar stops just short of the stem

Run: python3 build_wordmarks.py  → wordmarks/*.svg
"""
import math
import os

from shapely import affinity
from shapely.geometry import MultiLineString
from shapely.ops import unary_union

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "wordmarks")
SYMBOL = os.path.join(HERE, "symbol", "rs-symbol.svg")
INK = "#111111"

W = 16      # stroke width; cap height (centre-line) is 100 → outer 116
GAP = 6     # the signature gap, edge to edge
XL = 36     # x-height line (centre-line) for lowercase


def arc(cx, cy, r, a0, a1, n=40):
    return [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
             cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]


def fillet(pts, r):
    """Round every interior corner of a polyline with a true circular arc of radius r."""
    out = [pts[0]]
    for i in range(1, len(pts) - 1):
        (x0, y0), (x1, y1), (x2, y2) = pts[i - 1], pts[i], pts[i + 1]
        ux, uy = x1 - x0, y1 - y0
        vx, vy = x2 - x1, y2 - y1
        lu, lv = math.hypot(ux, uy), math.hypot(vx, vy)
        ux, uy, vx, vy = ux / lu, uy / lu, vx / lv, vy / lv
        turn = math.acos(max(-1, min(1, ux * vx + uy * vy)))
        t = min(r * math.tan(turn / 2), lu / 2, lv / 2)
        rr = t / math.tan(turn / 2) if turn > 1e-6 else 0
        a, b = (x1 - ux * t, y1 - uy * t), (x1 + vx * t, y1 + vy * t)
        side = 1 if ux * vy - uy * vx > 0 else -1
        cx, cy = a[0] - uy * rr * side, a[1] + ux * rr * side
        a0 = math.degrees(math.atan2(a[1] - cy, a[0] - cx))
        a1 = math.degrees(math.atan2(b[1] - cy, b[0] - cx))
        if side > 0 and a1 < a0:
            a1 += 360
        if side < 0 and a1 > a0:
            a1 -= 360
        out += arc(cx, cy, rr, a0, a1, 16)
    return out + [pts[-1]]


def ink(lines, w=W):
    return MultiLineString(lines).buffer(w / 2, quad_segs=16, cap_style="flat", join_style="mitre")


# ── glyphs: (lines, advance) in centre-line units, origin at top-left of the cap height ──
def R_lines():
    """R: stem + rounded shoulder + bowl; the bar returns toward the stem and stops a GAP short."""
    bar_end = W / 2 + GAP          # where the bar's flat end sits (its left edge)
    shoulder = [(0, 100), (0, 30), *arc(30, 30, 30, 180, 270)[1:], (40, 0)]
    bowl = [(40, 0), *arc(40, 26, 26, 270, 450)[1:], (bar_end, 52)]
    leg = [(18, 52), *arc(18, 100, 48, 270, 360)[1:]]
    return [shoulder, bowl, leg], 66


def h():
    return [[(0, 0), (0, 100)], [(0, XL + 26), *arc(26, XL + 26, 26, 180, 360)[1:], (52, 100)]], 52


def a():
    cy = (XL + 100) / 2
    r = (100 - XL) / 2
    return [arc(r, cy, r, 0, 360, 80), [(2 * r, XL), (2 * r, 100)]], 2 * r


def A_cap():
    return [[(0, 100), (0, 32), *arc(32, 32, 32, 180, 360)[1:], (64, 100)], [(0, 64), (64, 64)]], 64


def H():
    return [[(0, 0), (0, 100)], [(60, 0), (60, 100)], [(0, 50), (60, 50)]], 60


def S():
    return [arc(26, 25, 25, 330, 90), arc(26, 75, 25, 270, 510)], 52


def O():
    return [arc(50, 50, 50, 0, 360, 96)], 100


def E():
    return [[(58, 0), (30, 0), *arc(30, 30, 30, 270, 180)[1:], (0, 30), (0, 70),
             *arc(30, 70, 30, 180, 90)[1:], (58, 100)], [(0, 50), (50, 50)]], 58


# Korean — same stroke, rounded corners, and the gap on ㅏ's branch (echo of the R's bar)
def ra():
    rieul = fillet([(0, 0), (44, 0), (44, 50), (0, 50), (0, 100), (44, 100)], 14)
    a_v = [(66, 0), (66, 100)]
    a_h = [(66 + W / 2 + GAP, 50), (102, 50)]
    return [rieul, a_v, a_h], 102


def syu():
    siot = [(14, 40), (42, 12), (70, 40)]
    yu = [[(0, 62), (84, 62)], [(26, 62), (26, 100)], [(58, 62), (58, 100)]]
    return [siot, *yu], 84


def word(glyphs, track=22, scale=1.0, x=0, y=0):
    lines, cx = [], 0
    for g in glyphs:
        ls, adv = g()
        lines += [[(cx + px, py) for px, py in l] for l in ls]
        cx += adv + W + track
    shape = ink(lines)
    return affinity.translate(affinity.scale(shape, scale, scale, origin=(0, 0)), x, y)


def geom_to_d(g):
    polys = [g] if g.geom_type == "Polygon" else list(g.geoms)
    parts = []
    for p in polys:
        for ring in [p.exterior, *p.interiors]:
            parts.append("M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in list(ring.coords)[:-1]) + " Z")
    return " ".join(parts)


def write(name, title, g, extra_d="", h=256, pad=20):
    minx, miny, maxx, maxy = g.bounds
    w = int(maxx - minx + 2 * pad)
    g = affinity.translate(g, pad - minx, (h - (maxy - miny)) / 2 - miny)
    t = title.replace("&", "&amp;")
    open(os.path.join(OUT, name), "w").write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" '
        f'aria-labelledby="title"><title id="title">{t}</title>'
        f'<path id="wordmark" fill="{INK}" fill-rule="evenodd" d="{geom_to_d(g)}"/>{extra_d}</svg>\n')
    return w


def symbol_path():
    s = open(SYMBOL).read()
    return s[s.index(' d="') + 4:s.index('"/>', s.index(' d="'))]


def lockup(name, title, g, h=256):
    """RS symbol (from symbol/rs-symbol.svg, 256 box) at left, wordmark optically matched at right."""
    minx, miny, maxx, maxy = g.bounds
    k = 112 / (maxy - miny)
    g = affinity.scale(g, k, k, origin=(minx, miny))
    minx, miny, maxx, maxy = g.bounds
    g = affinity.translate(g, 296 - minx, (h - (maxy - miny)) / 2 - miny)
    w = int(g.bounds[2] + 24)
    t = title.replace("&", "&amp;")
    open(os.path.join(OUT, name), "w").write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" '
        f'aria-labelledby="title"><title id="title">{t}</title><g fill="{INK}" fill-rule="evenodd">'
        f'<path id="symbol" d="{symbol_path()}"/><path id="wordmark" d="{geom_to_d(g)}"/></g></svg>\n')


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)

    # A · RhaRa — mixed case, both R's carry the symbol's detached bar; SHOE as a small spaced tag
    main = word([R_lines, h, a, R_lines, a], track=20)
    tag = word([S, H, O, E], track=34, scale=0.34)
    mx = main.bounds[2]
    tag = affinity.translate(tag, mx + 22, 100 + W / 2 - tag.bounds[3])
    a_mark = unary_union([main, tag])

    # B · RHARA SHOE — all caps, arched A, wide tracking, for packaging and boxes
    top = word([R_lines, H, A_cap, R_lines, A_cap], track=26)
    shoe = word([S, H, O, E], track=26, scale=1.0)
    shoe = affinity.translate(shoe, top.bounds[2] + 60, 0)
    b_mark = unary_union([top, shoe])

    # C · 라라슈 — Korean wordmark, same stroke and corners; small RHARA SHOE underneath
    ko = word([ra, ra, syu], track=20)
    sub = word([R_lines, H, A_cap, R_lines, A_cap, lambda: ([], 30), S, H, O, E], track=30, scale=0.2)
    sub = affinity.translate(sub, (ko.bounds[2] - sub.bounds[2]) / 2, 100 + W / 2 + 22 - sub.bounds[1])
    c_mark = unary_union([ko, sub])

    for key, g, name in [("a", a_mark, "RhaRa"), ("b", b_mark, "RHARA SHOE"), ("c", c_mark, "라라슈")]:
        write(f"{key}-wordmark.svg", f"RhaRa Shoe — wordmark {name}", g)
        lockup(f"{key}-lockup.svg", f"RhaRa Shoe — lockup {name}", g)
    print("ok")
