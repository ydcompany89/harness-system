"""대표 제공 워킹화 탑뷰(흰 배경, 2026-10-05) → 누끼 shoes2-cut.png (테두리와 이어진 밝은 영역 = 배경)"""
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd
im = Image.open('../../qc/photos-2026-10-05/walking-top-retouched.png').convert('RGB')
a = np.asarray(im).astype(float); V = a.max(2)
bright = V > 135
lab, n = nd.label(bright)
edge = set(np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])) - {0}
bg = nd.binary_dilation(np.isin(lab, list(edge)), iterations=2)
m = ~bg
m = nd.binary_opening(m, iterations=3)
lab, n = nd.label(m); sz = nd.sum(m, lab, range(1, n + 1)); m = np.isin(lab, np.argsort(sz)[::-1][:2] + 1)
m = nd.binary_fill_holes(m)
m = nd.gaussian_filter(m.astype(float), 1.5) > 0.5
al = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))
c = im.copy(); c.putalpha(al); c = c.crop(al.getbbox()); c.save('shoes2-cut.png'); print('cut', c.size)
