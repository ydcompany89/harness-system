"""워킹화 키비주얼: 민트 그린 → 민트화이트(화이트 95% + 민트 5%), 라벨 '차콜 블랙/민트 그린' → '차콜/민트화이트' (대표 10/18)"""
import os, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
im = cv2.imread(os.path.join(HERE, 'src-walking-hero.webp')).astype(np.float32) / 255; h, w = im.shape[:2]
hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV); H, S, V = hsv[..., 0], hsv[..., 1], hsv[..., 2]
zone = np.zeros((h, w), np.float32); zone[int(h * .66):int(h * .955), int(w * .66):] = 1
ss = lambda x, a, b: np.clip((x - a) / (b - a), 0, 1)
cand = ((zone > 0) & (H > 85) & (H < 180) & (S > .07)).astype(np.uint8)
cand = cv2.morphologyEx(cand, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
n, lab, st, _ = cv2.connectedComponentsWithStats(cand, 8)
keep = np.zeros_like(cand)
for i in np.argsort(-st[1:, cv2.CC_STAT_AREA])[:2] + 1: keep[lab == i] = 1          # 신발 2짝
keep = cv2.morphologyEx(keep, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
cs, _ = cv2.findContours(keep, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
sil = np.zeros_like(keep); cv2.drawContours(sil, cs, -1, 1, -1)                       # 짝별 구멍 메움
sil = cv2.erode(sil, np.ones((2, 2), np.uint8))
green = cv2.GaussianBlur(sil.astype(np.float32), (5, 5), 0) * zone
MINT = np.array([176, 224, 152], np.float32) / 255            # BGR 민트
TARGET = 0.95 * np.ones(3, np.float32) + 0.05 * MINT          # 민트 5% 화이트
L = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
ref = float(np.percentile(L[green > .5], 85))
shade = np.clip(0.50 + 0.50 * (L / ref), 0, 1.04)[..., None]  # 원본 명암 유지, 전체 톤은 밝게
white = np.clip(TARGET * shade, 0, 1)
out = im * (1 - green[..., None]) + white * green[..., None]
o8 = (np.clip(out, 0, 1) * 255).astype(np.uint8)
# 라벨 교체: 하단 라벨 띠 다시 그리기
img = Image.fromarray(cv2.cvtColor(o8, cv2.COLOR_BGR2RGB)); d = ImageDraw.Draw(img)
F = ImageFont.truetype(os.path.join(HERE, '../fair-print/fonts/NotoSansKR-700.ttf'), 13)
y0 = int(h * .955)
arr = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR); g = cv2.cvtColor(arr, cv2.COLOR_BGR2GRAY)
tm = np.zeros((h, w), np.uint8); tm[y0:h, int(w * .38):] = 255
med = cv2.medianBlur(g, 21)
tm = (((g > 120) | (np.abs(g.astype(int) - med.astype(int)) > 22)) & (tm > 0)).astype(np.uint8) * 255; tm = cv2.dilate(tm, np.ones((5, 5), np.uint8))
arr = cv2.inpaint(arr, tm, 5, cv2.INPAINT_TELEA)
img = Image.fromarray(cv2.cvtColor(arr, cv2.COLOR_BGR2RGB)); d = ImageDraw.Draw(img)
cy = (y0 + h) // 2
for cx, col, name in ((int(w * .47), (55, 55, 55), '차콜'), (int(w * .76), (236, 246, 238), '민트화이트')):
    d.ellipse([cx - 7, cy - 7, cx + 7, cy + 7], fill=col, outline=(150, 150, 150))
    d.text((cx + 11, cy), name, font=F, fill=(235, 235, 235), anchor='lm')
img.save(os.path.join(HERE, '라라슈_워킹화_키비주얼_민트화이트.png')); print('ok', (green > .5).sum())
