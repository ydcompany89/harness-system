"""워킹화 탑뷰(03-pair-top) 배경 제거 → shoes-cut.png. 신발 2짝을 각각 볼록껍질로 마스크. AI 생성 없음."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as nd
from scipy.spatial import ConvexHull
im = Image.open('../../qc/photos-2026-09-30/03-pair-top.jpg').convert('RGB')
a = np.asarray(im).astype(float); R, B = a[..., 0], a[..., 2]
ch = a.max(2) - a.min(2); V = a.max(2)
m = (B - R > -4) & (ch < 40) & (V > 15) & (V < 215)
m = nd.binary_opening(m, iterations=6)
lab, n = nd.label(m); sz = nd.sum(m, lab, range(1, n + 1)); o = np.argsort(sz)[::-1][:2]
m = np.isin(lab, o + 1)
H, W = m.shape; yy = np.arange(H)[:, None]; xx = np.arange(W)[None, :]
split = 1190 + (xx - 700) * 0.02          # 두 짝 사이 경계선
full = Image.new('L', im.size, 0); d = ImageDraw.Draw(full)
for half in (m & (yy < split), m & (yy >= split)):
    ys, xs = np.nonzero(half); pts = np.c_[xs, ys][::5]
    h = ConvexHull(pts); d.polygon([tuple(map(int, pts[i])) for i in h.vertices], fill=255)
hull = np.asarray(full) > 0
brown = (R - B > 14) & (ch > 22)                      # 테이블(갈색) 픽셀
brown = nd.binary_dilation(nd.binary_opening(brown, iterations=2), iterations=4)
white = nd.binary_dilation((V > 205) & (ch < 30), iterations=4)          # 책상 위 종이
G = a[..., 1]
mint = nd.binary_dilation((G > R + 10) & (G > B + 4), iterations=6)   # 책상 위 패드 샘플 제거
mm = hull & ~brown & ~mint & ~white
mm = nd.binary_opening(mm, iterations=3)
lab2, n2 = nd.label(mm); s2 = nd.sum(mm, lab2, range(1, n2 + 1)); mm = np.isin(lab2, np.argsort(s2)[::-1][:2] + 1)
mm = nd.binary_fill_holes(nd.binary_closing(mm, iterations=6))
mm = nd.binary_opening(mm, iterations=12)
mm = nd.binary_erosion(mm, iterations=5)
warm = nd.binary_dilation((R - B > 6) & (V > 60), iterations=3)          # 신발 사이로 보이는 바닥
mm = mm & ~warm
mm = nd.binary_opening(mm, iterations=3)
al = Image.fromarray((mm * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5))
im.putalpha(al); im = im.crop(al.getbbox()).rotate(90, expand=True)
im.save('shoes-cut.png'); print(im.size)
