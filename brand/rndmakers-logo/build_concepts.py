"""R&D Makers logo concepts — geometry built with shapely, text outlined with fontTools.

Run: python3 build_concepts.py  → concepts/*.svg
"""
import math
import os

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from shapely import affinity
from shapely.geometry import LineString, MultiLineString, Point, Polygon, box
from shapely.ops import unary_union

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "concepts")
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
INK = "#111111"


def arc(cx, cy, r, a0, a1, n=48):
    """Points along a circle, angles in degrees (0 = right, 90 = down in SVG space)."""
    return [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
             cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]


def geom_to_d(g):
    polys = [g] if g.geom_type == "Polygon" else list(g.geoms)
    parts = []
    for p in polys:
        for ring in [p.exterior, *p.interiors]:
            c = list(ring.coords)[:-1]
            parts.append("M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in c) + " Z")
    return " ".join(parts)


def center(g, size=256, pad=24):
    minx, miny, maxx, maxy = g.bounds
    s = (size - 2 * pad) / max(maxx - minx, maxy - miny)
    g = affinity.scale(g, s, s, origin=(minx, miny))
    minx, miny, maxx, maxy = g.bounds
    # optical centre: a touch above geometric centre
    return affinity.translate(g, (size - (maxx - minx)) / 2 - minx, (size - (maxy - miny)) / 2 - miny - 2)


def svg(d, title, w=256, h=256, extra=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" '
            f'role="img" aria-labelledby="title"><title id="title">{title.replace("&", "&amp;")}</title>'
            f'<path id="symbol" fill="{INK}" fill-rule="evenodd" d="{d}"/>{extra}</svg>\n')


# ── A · Loop R: one rubber strip that draws the R and returns to where it started ──
def concept_a():
    w = 36
    bowl = [(76, 216), (76, 44), (132, 44), *arc(132, 92, 48, -90, 90)[1:], (76, 140)]
    dx = 76  # exact 45° leg kicks past the bowl so it reads as R, not B
    leg = [(132, 140), (132 + dx, 216), (76, 216)]
    g = MultiLineString([bowl, leg]).buffer(w / 2, quad_segs=16, join_style="round", cap_style="round")
    return center(g)


# ── B · Chip Cycle: four rubber blocks turn around a new granule ──
def concept_b():
    r, gap = 18, 5
    rects = [box(32, 32, 160, 96), box(160, 32, 224, 160), box(96, 160, 224, 224), box(32, 96, 96, 224)]
    chips = [b.buffer(-gap - r, join_style="mitre").buffer(r, quad_segs=16) for b in rects]
    seed = Point(128, 128).buffer(18, quad_segs=32)
    return center(unary_union(chips + [seed]))


# ── C · Tread R: a heavy R cut into tread layers — tyre becomes new material ──
def concept_c():
    stem = box(56, 32, 108, 224)
    bowl = unary_union([box(56, 32, 136, 152), Point(136, 92).buffer(60, quad_segs=32)])
    counter = unary_union([box(108, 72, 136, 112), Point(136, 92).buffer(20, quad_segs=32)])
    dx = 72 / math.tan(math.radians(60))
    leg = Polygon([(108, 152), (160, 152), (160 + dx, 224), (108 + dx, 224)])
    r = unary_union([stem, bowl.difference(counter), leg])
    grooves = unary_union([box(0, y, 256, y + 8) for y in (64, 104, 144, 184)])
    return center(r.difference(grooves))


# ── wordmark outlined from DejaVu Sans Bold (exploration face; final gets custom letters) ──
def text_path(text, x, baseline, cap_h, tracking=0.06):
    font = TTFont(FONT)
    gs, cmap = font.getGlyphSet(), font.getBestCmap()
    upm = font["head"].unitsPerEm
    from fontTools.pens.boundsPen import BoundsPen
    bp = BoundsPen(gs); gs["H"].draw(bp)
    s = cap_h / bp.bounds[3]
    pen = SVGPathPen(gs)
    cx = 0
    for ch in text:
        name = cmap[ord(ch)]
        tp = TransformPen(pen, (s, 0, 0, -s, x + cx * s, baseline))
        gs[name].draw(tp)
        cx += gs[name].width + tracking * upm
    return pen.getCommands(), (cx - tracking * upm) * s


def lockup(sym, title, fname):
    sym_d = geom_to_d(affinity.translate(affinity.scale(sym, 0.75, 0.75, origin=(0, 0)), 16, 32))
    d1, w1 = text_path("R&D MAKERS", 232, 150, 60)
    w = int(232 + w1 + 24)
    body = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} 256" width="{w}" height="256" role="img" '
            f'aria-labelledby="title"><title id="title">{title.replace("&", "&amp;")}</title><g fill="{INK}">'
            f'<path id="symbol" fill-rule="evenodd" d="{sym_d}"/><path id="wordmark" d="{d1}"/></g></svg>\n')
    open(os.path.join(OUT, fname), "w").write(body)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for key, fn, name in [("a", concept_a, "Loop R"), ("b", concept_b, "Chip Cycle"), ("c", concept_c, "Tread R")]:
        g = fn()
        open(os.path.join(OUT, f"{key}-symbol.svg"), "w").write(svg(geom_to_d(g), f"R&D Makers — {name}"))
        lockup(g, f"R&D Makers — {name} lockup", f"{key}-lockup.svg")
    print("ok")
