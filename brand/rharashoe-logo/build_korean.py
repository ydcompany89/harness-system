"""RhaRa Shoe — Korean wordmark 라라슈, round 3 (round 2's C was too heavy and boxy).

Changes vs round 2: lighter strokes (Korean has more strokes than Latin), ㅏ's branch attached so it
reads as 라 not 리-, and a proper ㅅ (right stroke grows out of the left one) instead of a roof.

  K1 · Soft Geometric — rounded-corner ㄹ, balanced weight
  K2 · S-curve ㄹ    — ㄹ drawn with the symbol's S curves (two half-circles)
  K3 · Light Wide    — thin, airy, wider syllables; the premium/quiet option

Run: python3 build_korean.py  → korean/*.svg
"""
import os

from shapely import affinity
from shapely.ops import unary_union

import build_wordmarks as bw
from build_wordmarks import arc, fillet

bw.OUT = os.path.join(bw.HERE, "korean")


def ra_soft(w, cw=40, r=16, branch=22, gap=22):
    rieul = fillet([(0, 0), (cw, 0), (cw, 50), (0, 50), (0, 100), (cw, 100)], r)
    x = cw + gap + w
    return [rieul, [(x, 0), (x, 100)], [(x, 50), (x + branch, 50)]], x + branch


def ra_scurve(w, branch=22, gap=22):
    rieul = [(0, 0), (16, 0), *arc(16, 25, 25, 270, 450)[1:], (25, 50),
             *arc(25, 75, 25, 270, 90)[1:], (42, 100)]
    x = 42 + gap + w
    return [rieul, [(x, 0), (x, 100)], [(x, 50), (x + branch, 50)]], x + branch


def syu(w, width=80, bar_y=58):
    # ㅅ sits centred over ㅠ, ~60 % of its width: steep left stroke, right stroke branching 30 % down
    base = bar_y - w - 10
    apex, left_end, right_end = (width * 0.5, 0), (width * 0.16, base), (width * 0.86, base)
    t = 0.3
    branch = (apex[0] + (left_end[0] - apex[0]) * t, apex[1] + (left_end[1] - apex[1]) * t)
    siot = [[apex, left_end], [branch, right_end]]
    yu = [[(0, bar_y), (width, bar_y)], [(width * 0.3, bar_y), (width * 0.3, 100)],
          [(width * 0.7, bar_y), (width * 0.7, 100)]]
    return siot + yu, width


def build(ra, w, track, syu_w=80):
    lines, cx = [], 0
    for g in (lambda: ra(w), lambda: ra(w), lambda: syu(w, syu_w)):
        ls, adv = g()
        lines += [[(cx + px, py) for px, py in l] for l in ls]
        cx += adv + w + track
    return bw.ink(lines, w)


def with_sub(ko, w):
    """Small spaced RHARA SHOE under the Korean, set in the round-2 Latin letters."""
    sub = bw.word([bw.R_lines, bw.H, bw.A_cap, bw.R_lines, bw.A_cap, lambda: ([], 40), bw.S, bw.H, bw.O, bw.E],
                  track=44, scale=0.17)
    sub = affinity.translate(sub, (ko.bounds[0] + ko.bounds[2] - sub.bounds[2] - sub.bounds[0]) / 2,
                             100 + w / 2 + 26 - sub.bounds[1])
    return unary_union([ko, sub])


VARIANTS = [
    ("k1", "Soft Geometric", lambda: build(lambda w: ra_soft(w), 13, 24), 13),
    ("k2", "S-curve", lambda: build(lambda w: ra_scurve(w), 13, 24), 13),
    ("k3", "Light Wide", lambda: build(lambda w: ra_soft(w, cw=50, r=10, branch=26, gap=26), 9, 34, 90), 9),
]

if __name__ == "__main__":
    os.makedirs(bw.OUT, exist_ok=True)
    for key, name, make, w in VARIANTS:
        ko = make()
        bw.write(f"{key}-wordmark.svg", f"RhaRa Shoe — 라라슈 {name}", ko)
        bw.lockup(f"{key}-lockup.svg", f"RhaRa Shoe — 라라슈 {name} lockup", with_sub(ko, w))
    print("ok")
