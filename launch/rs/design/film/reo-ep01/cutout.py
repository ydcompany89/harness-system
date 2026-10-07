"""턴어라운드 마스터 → 레오 컷아웃 3종 (초록 그리드 배경 제거). 실행: python cutout.py"""
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
src = Image.open('../../character/refs/reo-turnaround-master-2026-10-04.jpg').convert('RGB')
def cut(box, name):
    im = src.crop(box); a = np.asarray(im).astype(float); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    bg = (g > r * 1.25) & (g > b * 1.6) & (r < 122) & (g < 175) & (g > 70)   # 진초록 배경+그리드선 (검정 외곽선·라임 밴드 제외)
    lab, n = ndimage.label(bg)
    keep = ~np.isin(lab, [i for i, s in enumerate(ndimage.sum(bg, lab, range(1, n + 1)), 1) if s > 25])
    lab2, _ = ndimage.label(keep); s2 = ndimage.sum(keep, lab2, range(1, lab2.max() + 1)); keep = lab2 == (np.argmax(s2) + 1)
    keep = ndimage.binary_opening(keep, iterations=2)
    lab3, _ = ndimage.label(keep); s3 = ndimage.sum(keep, lab3, range(1, lab3.max() + 1)); keep = lab3 == (np.argmax(s3) + 1)
    spill = (g > np.maximum(r, b) * 1.12) & (r < 145)
    a[..., 1] = np.where(spill, np.maximum(r, b) * 1.02, g)
    m = Image.fromarray((keep * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6))
    out = Image.fromarray(a.astype(np.uint8)); out.putalpha(m); out = out.crop(out.getbbox())
    out.save(f'assets/{name}.png'); print(name, out.size)
cut((0, 0, 512, 1376), 'reo-front'); cut((512, 0, 1024, 1376), 'reo-34'); cut((1024, 0, 1536, 1376), 'reo-back')
