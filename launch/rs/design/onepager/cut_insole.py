"""인솔 실물(05-insole-latest) 배경 제거 → insole-cut.png. 뒤꿈치 구멍은 실제 구조라 비워둠. AI 생성 없음."""
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd
im = Image.open('../../qc/photos-2026-09-30/05-insole-latest.png').convert('RGB')
a = np.asarray(im).astype(float); R, B = a[..., 0], a[..., 2]
ch = a.max(2) - a.min(2)
m = (ch < 30) & (a.max(2) > 40)
m = nd.binary_opening(m, iterations=3)
lab, n = nd.label(m); sz = nd.sum(m, lab, range(1, n + 1)); m = np.isin(lab, np.argsort(sz)[::-1][:2] + 1)
outer = nd.binary_fill_holes(nd.binary_closing(m, iterations=15))
wood = nd.binary_opening(outer & (R - B > 25) & (ch > 35), iterations=4)
lab, n = nd.label(wood); sz = nd.sum(wood, lab, range(1, n + 1))
holes = np.isin(lab, np.nonzero(sz > 30000)[0] + 1)          # 뒤꿈치 타원 구멍 2개만
holes = nd.binary_fill_holes(nd.binary_closing(holes, iterations=8))
m = outer & ~holes
m = nd.gaussian_filter(m.astype(float), 2) > 0.5
m = nd.binary_erosion(m, iterations=2)
al = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
im.putalpha(al); im = im.crop(al.getbbox()); im.save('insole-cut.png'); print(im.size)
