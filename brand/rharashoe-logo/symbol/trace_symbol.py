"""Trace the supplied RS symbol (rs-symbol-source.png) into a clean single-path SVG."""
from PIL import Image
import numpy as np, potrace

im = Image.open('rs-symbol-source.png').convert('RGBA')
bg = Image.new('RGBA', im.size, 'white'); bg.alpha_composite(im)
g = np.array(bg.convert('L').resize((im.width * 4, im.height * 4), Image.LANCZOS))
mask = g < 128
ys, xs = np.where(mask)
x0, y0, x1, y1 = xs.min(), ys.min(), xs.max(), ys.max()
s = 256 * 0.86 / max(x1 - x0, y1 - y0)
ox = (256 - (x1 - x0) * s) / 2 - x0 * s
oy = (256 - (y1 - y0) * s) / 2 - y0 * s
P = lambda p: f"{p.x * s + ox:.1f} {p.y * s + oy:.1f}"
d = []
H, W = mask.shape
for c in potrace.Bitmap(mask).trace(turdsize=20, alphamax=1.0, opticurve=True, opttolerance=0.2):
    pts = [c.start_point] + [seg.end_point for seg in c]
    if min(p.x for p in pts) <= 0 and max(p.x for p in pts) >= W:
        continue  # potracer also emits the canvas frame; drop it so the letters fill
    d.append("M" + P(c.start_point))
    for seg in c:
        if seg.is_corner:
            d.append("L" + P(seg.c) + " L" + P(seg.end_point))
        else:
            d.append("C" + P(seg.c1) + " " + P(seg.c2) + " " + P(seg.end_point))
    d.append("Z")
open('rs-symbol.svg', 'w').write(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" '
    'aria-labelledby="title"><title id="title">RhaRa Shoe — RS symbol</title>'
    f'<path id="symbol" fill="#111111" fill-rule="evenodd" d="{" ".join(d)}"/></svg>\n')
print("ok")
