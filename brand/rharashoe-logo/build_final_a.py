"""RhaRa Shoe — final logo files, direction A (Clinical: IBM Plex Sans + IBM Plex Sans KR).

Outputs to final-A/:
  rharashoe-symbol-*.svg      RS symbol
  rharashoe-wordmark-*.svg    RHARA SHOE | 라라슈
  rharashoe-horizontal-*.svg  symbol + wordmark, one row
  rharashoe-stacked-*.svg     symbol over wordmark (deck-cover layout)
Colourways: black, white, lime, and duo (lime symbol + white type, for dark backgrounds).
Plus final-A/preview.png.

Run: FONT_DIR=<dir with the OFL fonts> python3 build_final_a.py
"""
import os

import build_type_pro as tp

OUT = os.path.join(tp.HERE, "final-A")
CFG = dict(tp.CONCEPTS[0][4])          # P1 · Clinical
LIME, BLACK, WHITE = tp.LIME, "#111111", "#FFFFFF"
COLOURS = {"black": (BLACK, BLACK), "white": (WHITE, WHITE), "lime": (LIME, LIME), "duo": (LIME, WHITE)}

# RS symbol path and its ink bounds inside symbol/rs-symbol.svg (traced at 86 % of a 256 box)
_s = open(tp.SYMBOL).read()
SYM_D = _s[_s.index(' d="') + 4:_s.index('"/>', _s.index(' d="'))]
SYM_B = (17.9, 36.3, 238.1, 219.8)


def symbol(fill, x, y, h):
    """Place the symbol so its ink box starts at (x, y) and is h tall; returns (svg, width)."""
    k = h / (SYM_B[3] - SYM_B[1])
    tx, ty = x - SYM_B[0] * k, y - SYM_B[1] * k
    return (f'<path id="symbol" fill="{fill}" fill-rule="evenodd" transform="translate({tx:.2f} {ty:.2f}) '
            f'scale({k:.5f})" d="{SYM_D}"/>', (SYM_B[2] - SYM_B[0]) * k)


def wordmark(fill, x, y_base, cap):
    """Wordmark with its baseline at y_base and Latin cap height = cap; returns (svg, width)."""
    inner, b = tp.lockup_line(CFG, size=100, fill=fill)
    k = cap / -b[1] * 1.06
    tx = x - b[0] * k
    return f'<g id="wordmark" transform="translate({tx:.2f} {y_base:.2f}) scale({k:.5f})">{inner}</g>', (b[2] - b[0]) * k


def doc(inner, w, h, title, pad):
    W, H = w + 2 * pad, h + 2 * pad
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.1f} {H:.1f}" width="{W:.0f}" height="{H:.0f}" '
            f'role="img" aria-labelledby="title"><title id="title">{title}</title>{inner}</svg>\n')


def build(kind, sym_fill, type_fill):
    if kind == "symbol":
        s, w = symbol(sym_fill, 16, 16, 200)
        return doc(s, w, 200, "RhaRa Shoe symbol", 16)
    if kind == "wordmark":
        cap = 60
        t, w = wordmark(type_fill, 16, 16 + cap * 1.06, cap)
        return doc(t, w, cap * 1.06, "RhaRa Shoe 라라슈 wordmark", 16)
    if kind == "horizontal":
        sh = 200
        s, sw = symbol(sym_fill, 24, 24, sh)
        cap = sh * 0.30
        gap = sh * 0.32
        t, tw = wordmark(type_fill, 24 + sw + gap, 24 + sh / 2 + cap / 2, cap)
        return doc(s + t, sw + gap + tw, sh, "RhaRa Shoe 라라슈 horizontal logo", 24)
    if kind == "stacked":
        sh = 200
        sw = (SYM_B[2] - SYM_B[0]) * sh / (SYM_B[3] - SYM_B[1])
        _, tw1 = wordmark(type_fill, 0, 0, 100)
        tw = sw * 1.55
        cap = 100 * tw / tw1
        W = max(sw, tw)
        s, _ = symbol(sym_fill, 24 + (W - sw) / 2, 24, sh)
        gap = sh * 0.26
        t, _ = wordmark(type_fill, 24 + (W - tw) / 2, 24 + sh + gap + cap * 1.06, cap)
        return doc(s + t, W, sh + gap + cap * 1.06, "RhaRa Shoe 라라슈 stacked logo", 24)


def preview(files, path):
    import io

    import cairosvg
    from PIL import Image, ImageDraw, ImageFont
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
    rows = [("black", "#FFFFFF"), ("lime", "#0B0B0B"), ("duo", "#0B0B0B"), ("white", "#3A3A3A")]
    kinds = ["symbol", "horizontal", "stacked", "wordmark"]
    widths = {"symbol": 160, "horizontal": 520, "stacked": 300, "wordmark": 440}
    CW = sum(widths.values()) + 60 * 5
    B = Image.new("RGB", (CW, 60 + 300 * len(rows)), "#F4F4F0")
    d = ImageDraw.Draw(B)
    d.text((40, 20), "RhaRa Shoe — final logo files (A · Clinical)", font=font, fill="#111")
    for r, (col, bg) in enumerate(rows):
        y = 60 + r * 300
        d.rectangle((0, y, CW, y + 290), fill=bg)
        d.text((14, y + 8), col, font=font, fill="#888")
        x = 60
        for k in kinds:
            svg = open(files[(k, col)]).read()
            im = Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg.encode(), output_width=widths[k]))).convert("RGBA")
            if im.height > 250:
                im = im.resize((int(im.width * 250 / im.height), 250))
            B.paste(im, (x, y + (290 - im.height) // 2), im)
            x += widths[k] + 60
    B.save(path)


if __name__ == "__main__":
    tp.fetch_fonts()
    os.makedirs(OUT, exist_ok=True)
    files = {}
    for kind in ["symbol", "wordmark", "horizontal", "stacked"]:
        for col, (sf, tf) in COLOURS.items():
            if kind == "symbol" and col == "duo":
                continue
            if kind == "wordmark" and col == "duo":
                continue
            p = os.path.join(OUT, f"rharashoe-{kind}-{col}.svg")
            open(p, "w").write(build(kind, sf, tf))
            files[(kind, col)] = p
    files[("symbol", "duo")] = files[("symbol", "lime")]
    files[("wordmark", "duo")] = files[("wordmark", "white")]
    preview(files, os.path.join(OUT, "preview.png"))
    print(len(set(files.values())), "svg files")
