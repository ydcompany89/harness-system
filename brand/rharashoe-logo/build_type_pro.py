"""RhaRa Shoe — professional type logos (round 5): real typefaces instead of hand-drawn rounded letters.

All faces are Google Fonts under the SIL Open Font License (free for commercial logo use; outlines may be
converted to paths and modified). Fonts are fetched to FONT_DIR on first run; the SVGs carry outlines only.

  P1 · Clinical     IBM Plex Sans SemiBold      + IBM Plex Sans KR SemiBold   (engineered, medical-grade)
  P2 · Performance  Inter Tight ExtraBold       + Noto Sans KR ExtraBold      (tight, athletic, premium)
  P3 · Workwear     Barlow Semi Condensed Bold  + Gothic A1 Bold              (uniform/equipment label)
  P4 · Spec         Archivo Expanded SemiBold   + Noto Sans KR Medium         (wide, technical data-sheet)

Run: python3 build_type_pro.py  → typepro/*.svg + typepro-board.png
"""
import io
import os
import subprocess
import urllib.parse

import cairosvg
import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "typepro")
FONT_DIR = os.environ.get("FONT_DIR", os.path.join(HERE, ".fonts"))
SYMBOL = os.path.join(HERE, "symbol", "rs-symbol.svg")
LIME, BLACK = "#C6F432", "#0B0B0B"
KO = "라라슈"

# (file, Google Fonts css2 family spec, subset text or None)
FONTS = {
    "plex": ("plex-600.ttf", "IBM+Plex+Sans:wght@600", None),
    "plexkr": ("plexkr-600.ttf", "IBM+Plex+Sans+KR:wght@600", KO),
    "intertight": ("intertight-800.ttf", "Inter+Tight:wght@800", None),
    "notokr800": ("notokr-800.ttf", "Noto+Sans+KR:wght@800", KO),
    "barlowsc": ("barlowsc-700.ttf", "Barlow+Semi+Condensed:wght@700", None),
    "gothica1": ("gothica1-700.ttf", "Gothic+A1:wght@700", KO),
    "archivowide": ("archivo-w125-600.ttf", "Archivo:wdth,wght@125,600", None),
    "notokr500": ("notokr-500.ttf", "Noto+Sans+KR:wght@500", KO),
}

CONCEPTS = [
    ("p1", "Clinical", "IBM Plex Sans + Plex Sans KR",
     "Engineered and exact, like medical equipment — backs the orthopaedic-advised, in-house-material story.",
     dict(en="plex", ko="plexkr", en_track=40, ko_track=60, rule=True)),
    ("p2", "Performance", "Inter Tight + Noto Sans KR",
     "Tight, heavy and confident — the look of premium athletic footwear.",
     dict(en="intertight", ko="notokr800", en_track=-10, ko_track=-20, rule=False)),
    ("p3", "Workwear", "Barlow Semi Condensed + Gothic A1",
     "Uniform and equipment-label lettering — built for people who work on their feet.",
     dict(en="barlowsc", ko="gothica1", en_track=50, ko_track=40, rule=False)),
    ("p4", "Spec", "Archivo Expanded + Noto Sans KR",
     "Wide and calm with generous spacing — a technical data-sheet, quietly premium.",
     dict(en="archivowide", ko="notokr500", en_track=90, ko_track=260, rule=True)),
]


def fetch_fonts():
    os.makedirs(FONT_DIR, exist_ok=True)
    for fname, spec, text in FONTS.values():
        path = os.path.join(FONT_DIR, fname)
        if os.path.exists(path):
            continue
        q = f"https://fonts.googleapis.com/css2?family={spec}" + (f"&text={urllib.parse.quote(text)}" if text else "")
        css = subprocess.run(["curl", "-sS", "-A", "Mozilla/4.0", q], capture_output=True, text=True, check=True).stdout
        url = css.split("url(")[1].split(")")[0]
        subprocess.run(["curl", "-sS", "-o", path, url], check=True)


def shape(key, text, size, track):
    """Return (svg path d, bounds) for text set at `size` px cap-free em, tracking in 1/1000 em, baseline y=0."""
    path = os.path.join(FONT_DIR, FONTS[key][0])
    blob = hb.Blob.from_file_path(path)
    face = hb.Face(blob)
    font = hb.Font(face)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, {"kern": True, "liga": False})
    tt = TTFont(path)
    gs, order, upm = tt.getGlyphSet(), tt.getGlyphOrder(), tt["head"].unitsPerEm
    s = size / upm
    pen, bpen, x = SVGPathPen(gs), BoundsPen(gs), 0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = order[info.codepoint]
        m = (s, 0, 0, -s, (x + pos.x_offset) * s, -pos.y_offset * s)
        gs[name].draw(TransformPen(pen, m))
        gs[name].draw(TransformPen(bpen, m))
        x += pos.x_advance + (track * upm / 1000 if text[-1:] else 0)
    return pen.getCommands(), bpen.bounds


def cap_height(key, size):
    _, b = shape(key, "H", size, 0)
    return -b[1]


def lockup_line(cfg, size=100, fill="#111111", ko_fill=None):
    """One line: RHARA SHOE  |  라라슈 — Korean sized optically to the Latin cap height, baseline shared."""
    en_d, en_b = shape(cfg["en"], "RHARA SHOE", size, cfg["en_track"])
    cap = -en_b[1]
    _, kb = shape(cfg["ko"], KO, size, cfg["ko_track"])
    k = size * (cap * 1.06) / (kb[3] - kb[1])           # Hangul a touch taller than caps reads as equal
    ko_d, ko_b = shape(cfg["ko"], KO, k, cfg["ko_track"])
    gap = cap * (1.1 if cfg["rule"] else 0.75)
    kx = en_b[2] + gap - ko_b[0]
    ky = -(ko_b[3])                                     # sit the Korean's bottom on the baseline
    parts = [f'<path fill="{fill}" d="{en_d}"/>',
             f'<path fill="{ko_fill or fill}" transform="translate({kx:.1f} {ky:.1f})" d="{ko_d}"/>']
    if cfg["rule"]:
        rx, rw = en_b[2] + gap / 2, max(2.0, cap * 0.045)
        parts.append(f'<rect fill="{fill}" x="{rx - rw / 2:.1f}" y="{-cap * 1.05:.1f}" width="{rw:.1f}" '
                     f'height="{cap * 1.1:.1f}"/>')
    width = kx + ko_b[2]
    return "".join(parts), (en_b[0], -cap * 1.06, width, max(en_b[3], 0))


def svg_doc(inner, bounds, bg=None, pad=24):
    x0, y0, x1, y1 = bounds
    W, H = x1 - x0 + 2 * pad, y1 - y0 + 2 * pad
    rect = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0 - pad:.1f} {y0 - pad:.1f} {W:.1f} {H:.1f}" '
            f'width="{W:.0f}" height="{H:.0f}">{rect}{inner}</svg>\n')


def symbol_svg(color):
    return open(SYMBOL).read().replace('fill="#111111"', f'fill="{color}"')


def png(svg_text, width):
    return Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg_text.encode(), output_width=width))).convert("RGBA")


def board(rendered, path):
    bold = lambda n: ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", n)
    reg = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 21)
    CW, CH = 1500, 560
    B = Image.new("RGB", (CW, 150 + CH * len(rendered)), "#F4F4F0")
    d = ImageDraw.Draw(B)
    d.text((60, 44), "RhaRa Shoe — professional type logos (round 5)", font=bold(44), fill="#111")
    d.text((60, 104), "Real typefaces (Google Fonts, SIL OFL — free for commercial logo use), set with kerning",
           font=reg, fill="#555")
    for i, (key, name, faces, note, cfg) in enumerate(rendered):
        y = 150 + i * CH
        d.rounded_rectangle((60, y, 760, y + CH - 40), 18, fill=BLACK)
        sym = png(symbol_svg(LIME), 220)
        B.paste(sym, (410 - 110, y + 34), sym)
        inner, b = lockup_line(cfg, fill="#FFFFFF", ko_fill="#FFFFFF")
        t = png(svg_doc(inner, b), 600)
        B.paste(t, (410 - t.width // 2, y + 300 + (170 - t.height) // 2), t)
        d.rounded_rectangle((790, y, 1440, y + CH - 40), 18, fill="#FFFFFF")
        inner, b = lockup_line(cfg)
        t2 = png(svg_doc(inner, b), 590)
        B.paste(t2, (1115 - t2.width // 2, y + 50), t2)
        # horizontal lockup, small: symbol + line
        lk = png(svg_doc(inner, b), 230)
        sm = png(symbol_svg("#111111"), 64)
        B.paste(sm, (820, y + 200), sm)
        B.paste(lk, (892, y + 200 + (64 - lk.height) // 2), lk)
        d.text((820, y + 300), f"{chr(65 + i)} · {name}", font=bold(30), fill="#111")
        d.text((820, y + 345), faces, font=reg, fill="#111")
        words, line, yy = note.split(), "", y + 385
        for w in words:
            if len(line) + len(w) > 46:
                d.text((820, yy), line.strip(), font=reg, fill="#555")
                line, yy = "", yy + 29
            line += w + " "
        d.text((820, yy), line.strip(), font=reg, fill="#555")
    B.save(path)


if __name__ == "__main__":
    fetch_fonts()
    os.makedirs(OUT, exist_ok=True)
    for key, name, faces, note, cfg in CONCEPTS:
        inner, b = lockup_line(cfg)
        open(os.path.join(OUT, f"{key}-{name.lower()}-black.svg"), "w").write(svg_doc(inner, b))
        inner, b = lockup_line(cfg, fill=LIME)
        open(os.path.join(OUT, f"{key}-{name.lower()}-onblack.svg"), "w").write(svg_doc(inner, b, bg=BLACK))
    board(CONCEPTS, os.path.join(HERE, "typepro-board.png"))
    print("ok")
