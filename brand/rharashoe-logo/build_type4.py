"""RhaRa Shoe — 4 more bilingual type logos (RHARA SHOE + 라라슈), round 4.

Each one takes a cue from the product deck (라라슈 상품소개서 2026.10):
  T1 · Standing  — "Made for Standing.": tall, condensed letters that stand upright
  T2 · Quad Grip — the 4 grip pads: the two A crossbars and two ㅏ branches become 4 lime dots
  T3 · Stencil   — the RS symbol's detached bar, extended to every joint (work-gear stencil)
  T4 · Ribbed    — the insole's ribs: every stroke split into two parallel lines

Run: python3 build_type4.py  → type4/*.svg + type4-board.png
"""
import io
import math
import os

import cairosvg
from PIL import Image, ImageDraw, ImageFont
from shapely import affinity
from shapely.geometry import MultiLineString, Point
from shapely.ops import unary_union

import build_korean as bk
import build_wordmarks as bw
from build_wordmarks import arc, fillet

OUT = os.path.join(bw.HERE, "type4")
LIME, BLACK, WHITE = "#C6F432", "#0B0B0B", "#FFFFFF"
GAP = 9


# ── glyphs: return (strokes in drawing order, advance, dots[(x, y)]) ──
def R():
    ls, adv = bw.R_lines()
    return ls, adv, []


def H():
    return [[(0, 0), (0, 100)], [(60, 0), (60, 100)], [(0, 50), (60, 50)]], 60, []


def A(dot=False):
    arch = [(0, 100), (0, 32), *arc(32, 32, 32, 180, 360)[1:], (64, 100)]
    return ([arch], 64, [(32, 66)]) if dot else ([arch, [(0, 64), (64, 64)]], 64, [])


def S():
    ls, adv = bw.S()
    return ls, adv, []


def O():
    ls, adv = bw.O()
    return ls, adv, []


def E():
    body = [(58, 0), (30, 0), *arc(30, 30, 30, 270, 180)[1:], (0, 30), (0, 70), *arc(30, 70, 30, 180, 90)[1:], (58, 100)]
    return [body, [(0, 50), (50, 50)]], 58, []


def RA(dot=False, branch=22):
    rieul = fillet([(0, 0), (40, 0), (40, 50), (0, 50), (0, 100), (40, 100)], 16)
    x = 40 + 22 + 14
    if dot:
        return [rieul, [(x, 0), (x, 100)]], x + 22, [(x + 20, 50)]
    return [rieul, [(x, 0), (x, 100)], [(x, 50), (x + branch, 50)]], x + branch, []


def SYU():
    ls, adv = bk.syu(14, 80)
    yu = ls[2:]
    return ls[:2] + yu, adv, []


def SPACE(n=34):
    return lambda: ([], n, [])


def set_line(seq, w, track, xscale=1.0, mode="plain", ko_scale=0.92, ko_xscale=None):
    """Lay glyphs out left to right; returns (ink geometry, dot geometry)."""
    inks, dots, cx = [], [], 0
    for fn, is_ko in seq:
        strokes, adv, dts = fn()
        k = ko_scale if is_ko else 1.0
        xs = (ko_xscale or xscale) if is_ko else xscale   # Hangul suffers more from condensing
        y0 = (1 - k) * 100           # Korean optically smaller, sitting on the same baseline
        tf = lambda p: (cx + p[0] * k * xs, y0 + p[1] * k)
        strokes = [[tf(p) for p in s] for s in strokes]
        if mode == "stencil":
            acc = None
            for s in strokes:
                g = bw.ink([s], w)
                if acc is not None:
                    g = g.difference(acc.buffer(GAP))
                acc = g if acc is None else unary_union([acc, g])
            if acc is not None:
                inks.append(acc)
        elif strokes:
            g = bw.ink(strokes, w)
            if mode == "inline":
                g = g.difference(MultiLineString(strokes).buffer(w * 0.16, cap_style="flat", join_style="mitre"))
            inks.append(g)
        dots += [Point(tf(d)).buffer(w * 0.78, quad_segs=24) for d in dts]
        cx += adv * k * xs + w + track + (10 if is_ko else 0)
    return unary_union(inks), unary_union(dots) if dots else None


def name_seq(dot=False, stencil=False):
    a = (lambda: A(True)) if dot else A
    # the stencil gap eats into ㅏ's branch, so it grows to keep reading as 라, not 리
    ra = (lambda: RA(True)) if dot else (lambda: RA(branch=36)) if stencil else RA
    return [(R, 0), (H, 0), (a, 0), (R, 0), (a, 0), (SPACE(40), 0), (S, 0), (H, 0), (O, 0), (E, 0),
            (SPACE(70), 0), (ra, 1), (ra, 1), (SYU, 1)]


CONCEPTS = [
    ("t1", "Standing", "Made for Standing: tall, condensed letters that stand upright like people on a long shift.",
     dict(w=13, track=14, xscale=0.58, ko_xscale=0.8)),
    ("t2", "Quad Grip", "The 4 grip pads: both A crossbars and both ㅏ branches become 4 lime dots.",
     dict(w=17, track=20, mode="dots")),
    ("t3", "Stencil", "The RS symbol's detached bar, extended to every joint: work-gear stencil.",
     dict(w=17, track=20, mode="stencil")),
    ("t4", "Ribbed", "The insole's ribs: every stroke split into two parallel lines.",
     dict(w=20, track=20, mode="inline")),
]


def to_svg(g, dots, ink, dot_color, bg=None, pad=24, h=None):
    allg = unary_union([g] + ([dots] if dots is not None else []))
    minx, miny, maxx, maxy = allg.bounds
    W, H = maxx - minx + 2 * pad, (h or maxy - miny + 2 * pad)
    dx, dy = pad - minx, (H - (maxy - miny)) / 2 - miny
    t = lambda x: affinity.translate(x, dx, dy)
    body = f'<path fill="{ink}" fill-rule="evenodd" d="{bw.geom_to_d(t(g))}"/>'
    if dots is not None:
        body += f'<path fill="{dot_color}" d="{bw.geom_to_d(t(dots))}"/>'
    rect = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H:.0f}" width="{W:.0f}" height="{H:.0f}">'
            f'{rect}{body}</svg>\n')


def symbol_geom_svg(color):
    s = open(bw.SYMBOL).read()
    return s.replace('fill="#111111"', f'fill="{color}"')


def png(svg_text, width):
    return Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg_text.encode(), output_width=width))).convert("RGBA")


def board(items, path):
    """Deck-style board: each concept as lime-on-black stacked lockup + black-on-white line."""
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 30)
    small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 21)
    kofont = ImageFont.truetype("/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc", 21)
    CW, CH = 1500, 560
    B = Image.new("RGB", (CW, 150 + CH * len(items)), "#F4F4F0")
    d = ImageDraw.Draw(B)
    d.text((60, 44), "RhaRa Shoe — type logo concepts (round 4)", font=ImageFont.truetype(
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 44), fill="#111")
    d.text((60, 104), "Cues from the product deck: Made for Standing · Quad Grip · RS symbol gap · insole ribs",
           font=small, fill="#555")
    for i, (key, name, note, g, dots) in enumerate(items):
        y = 150 + i * CH
        # dark card: stacked lockup (symbol over type), as on the deck cover
        d.rounded_rectangle((60, y, 760, y + CH - 40), 18, fill=BLACK)
        sym = png(symbol_geom_svg(LIME), 230)
        B.paste(sym, (410 - 115, y + 30), sym)
        t = png(to_svg(g, dots, WHITE if dots is not None else LIME, LIME), 600)
        B.paste(t, (410 - t.width // 2, y + 300 + (160 - t.height) // 2), t)
        # light card: one-line black version + note
        d.rounded_rectangle((790, y, 1440, y + CH - 40), 18, fill="#FFFFFF")
        t2 = png(to_svg(g, dots, "#111111", "#111111"), 590)
        B.paste(t2, (1115 - t2.width // 2, y + 60), t2)
        t3 = png(to_svg(g, dots, "#111111", "#111111"), 260)
        B.paste(t3, (820, y + 210), t3)
        d.text((820, y + 300), f"{chr(65 + i)} · {name}", font=font, fill="#111")
        lines, cur = [], ""
        for word in note.split():
            if len(cur) + len(word) > 44:
                lines.append(cur)
                cur = ""
            cur += word + " "
        lines.append(cur)
        for j, ln in enumerate(lines):
            d.text((820, y + 350 + j * 30), ln.strip(), font=kofont if any("가" <= c <= "힣" or "ㄱ" <= c <= "ㆎ" for c in ln) else small, fill="#444")
    B.save(path)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    items = []
    for key, name, note, cfg in CONCEPTS:
        g, dots = set_line(name_seq(dot=cfg.get("mode") == "dots", stencil=cfg.get("mode") == "stencil"), **cfg)
        open(os.path.join(OUT, f"{key}-type-black.svg"), "w").write(to_svg(g, dots, "#111111", "#111111"))
        open(os.path.join(OUT, f"{key}-type-onblack.svg"), "w").write(
            to_svg(g, dots, WHITE if dots is not None else LIME, LIME, bg=BLACK))
        items.append((key, name, note, g, dots))
    board(items, os.path.join(bw.HERE, "type4-board.png"))
    print("ok")
