"""RhaRa Shoe (라라슈) logo concepts — rounded rubber-stroke letters built with shapely.

Run: python3 build_concepts.py  → concepts/*.svg
"""
import math
import os

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from shapely import affinity
from shapely.geometry import LineString, MultiLineString, Point, box
from shapely.ops import unary_union

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "concepts")
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
INK = "#111111"


def arc(cx, cy, r, a0, a1, n=48):
    return [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
             cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]


def stroke(lines, w):
    return MultiLineString(lines).buffer(w / 2, quad_segs=16, join_style="round", cap_style="round")


def geom_to_d(g):
    polys = [g] if g.geom_type == "Polygon" else list(g.geoms)
    parts = []
    for p in polys:
        for ring in [p.exterior, *p.interiors]:
            parts.append("M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in list(ring.coords)[:-1]) + " Z")
    return " ".join(parts)


def fit(g, w=256, h=256, pad=24):
    minx, miny, maxx, maxy = g.bounds
    s = min((w - 2 * pad) / (maxx - minx), (h - 2 * pad) / (maxy - miny))
    g = affinity.scale(g, s, s, origin=(minx, miny))
    minx, miny, maxx, maxy = g.bounds
    return affinity.translate(g, (w - (maxx - minx)) / 2 - minx, (h - (maxy - miny)) / 2 - miny - 2)


def svg(d, title, w=256, h=256, extra=""):
    t = title.replace("&", "&amp;")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" '
            f'aria-labelledby="title"><title id="title">{t}</title><g fill="{INK}">'
            f'<path id="symbol" fill-rule="evenodd" d="{d}"/>{extra}</g></svg>\n')


# ── lowercase glyph skeletons: T = x-height line, B = baseline (centre-lines), R = bowl radius ──
def g_r(x, T, B, R):
    return [[(x, B), (x, T)], arc(x + R, T + R, R, 180, 300)], R + R * math.cos(math.radians(60))


def g_h(x, T, B, R, A):
    return [[(x, B), (x, A)], [*arc(x + R, T + R, R, 180, 360), (x + 2 * R, B)]], 2 * R


def g_a(x, T, B, R):
    cy = (T + B) / 2
    return [arc(x + R, cy, R, 0, 360, 96), [(x + 2 * R, T), (x + 2 * R, B)]], 2 * R


# ── A · Step rr: two r's side by side like a pair of shoes, the second one stepping forward ──
def concept_a():
    w, R = 34, 44
    l1, _ = g_r(64, 104, 208, R)
    l2, _ = g_r(172, 80, 184, R)
    return fit(stroke(l1 + l2, w))


# ── B · Grip wordmark: "rhara" standing on a sole bar with non-slip tread notches ──
def wordmark_rhara(w=28, R=38):
    T, B, A = 60, 136, 0
    x, lines, gap = 20, [], 22
    for kind in "rhara":
        if kind == "r":
            l, adv = g_r(x, T, B, R)
            x += adv + w / 2 + 16
        elif kind == "h":
            l, adv = g_h(x, T, B, R, A)
            x += adv + w + gap
        else:
            l, adv = g_a(x, T, B, R)
            x += adv + w + gap
        lines += l
    letters = stroke(lines, w)
    minx, _, maxx, _ = letters.bounds
    top = B + w / 2 + 12
    sole = box(minx, top, maxx, top + 30).buffer(-12, join_style="mitre").buffer(12, quad_segs=16)
    notches = unary_union([box(nx, top + 14, nx + 14, top + 40) for nx in range(int(minx) + 36, int(maxx) - 36, 40)])
    return unary_union([letters, sole.difference(notches)])


def concept_b():
    return fit(wordmark_rhara(), pad=16)


# ── C · Heel Stamp: a round rubber heel badge, tread blocks on the rim, an R cut out of the centre ──
def concept_c():
    disc = Point(128, 128).buffer(112, quad_segs=64)
    groove = Point(128, 128).buffer(90, quad_segs=64).difference(Point(128, 128).buffer(80, quad_segs=64))
    cuts = unary_union([affinity.rotate(box(124, 16, 132, 50), a, origin=(128, 128)) for a in range(0, 360, 30)])
    # centre: the Step rr pair (concept A) cut out — an R in a circle would read as ®
    l1, _ = g_r(0, 24, 108, 36)
    l2, _ = g_r(92, 4, 88, 36)
    rr = stroke(l1 + l2, 26)
    minx, miny, maxx, maxy = rr.bounds
    k = 104 / max(maxx - minx, maxy - miny)
    rr = affinity.scale(rr, k, k, origin=(minx, miny))
    minx, miny, maxx, maxy = rr.bounds
    r = affinity.translate(rr, 128 - (minx + maxx) / 2, 128 - (miny + maxy) / 2)
    return fit(disc.difference(groove).difference(cuts).difference(r))


def text_path(text, x, baseline, cap_h, tracking=0.04):
    font = TTFont(FONT)
    gs, cmap = font.getGlyphSet(), font.getBestCmap()
    bp = BoundsPen(gs)
    gs["H"].draw(bp)
    s = cap_h / bp.bounds[3]
    pen, cx = SVGPathPen(gs), 0
    for ch in text:
        name = cmap[ord(ch)]
        gs[name].draw(TransformPen(pen, (s, 0, 0, -s, x + cx * s, baseline)))
        cx += gs[name].width + tracking * font["head"].unitsPerEm
    return pen.getCommands(), (cx - tracking * font["head"].unitsPerEm) * s


def lockup_with_wordmark(sym, title, fname):
    """Symbol + the constructed 'rhara' wordmark (the same rubber stroke)."""
    s = affinity.translate(affinity.scale(sym, 0.75, 0.75, origin=(0, 0)), 16, 32)
    wm = wordmark_rhara()
    minx, miny, maxx, maxy = wm.bounds
    k = 150 / (maxy - miny)
    wm = affinity.translate(affinity.scale(wm, k, k, origin=(minx, miny)), 232 - minx, 56 - miny)
    W = int(wm.bounds[2] + 24)
    open(os.path.join(OUT, fname), "w").write(svg(geom_to_d(unary_union([s, wm])), title, W, 256))


def lockup_b(title, fname):
    wm = wordmark_rhara()
    minx, miny, maxx, maxy = wm.bounds
    k = 150 / (maxy - miny)
    wm = affinity.translate(affinity.scale(wm, k, k, origin=(minx, miny)), 24 - minx, 40 - miny)
    d, tw = text_path("SHOE", wm.bounds[2] + 20, wm.bounds[3] - 26, 34, 0.12)
    W = int(wm.bounds[2] + 20 + tw + 24)
    open(os.path.join(OUT, fname), "w").write(svg(geom_to_d(wm), title, W, 256, f'<path id="descriptor" d="{d}"/>'))


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for key, fn, name in [("a", concept_a, "Step rr"), ("b", concept_b, "Grip wordmark"), ("c", concept_c, "Heel Stamp")]:
        open(os.path.join(OUT, f"{key}-symbol.svg"), "w").write(svg(geom_to_d(fn()), f"RhaRa Shoe — {name}"))
    lockup_with_wordmark(concept_a(), "RhaRa Shoe — Step rr lockup", "a-lockup.svg")
    lockup_b("RhaRa Shoe — Grip wordmark lockup", "b-lockup.svg")
    lockup_with_wordmark(concept_c(), "RhaRa Shoe — Heel Stamp lockup", "c-lockup.svg")
    print("ok")
