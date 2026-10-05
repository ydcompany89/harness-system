"""(brand-film-flow 폴더에서 실행: python retouch/retouch_outsole.py)
실물 밑창 사진 리터칭 (배경 제거 → 스튜디오 합성). AI 생성 없음 — 원본 픽셀만 사용.
입력: qc/photos-2026-09-30/01-outsole.jpg  →  출력: edit/outsole-studio.png (1920x1080)"""
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
from scipy import ndimage as nd
from scipy.interpolate import CubicSpline
SRC = '../../../qc/photos-2026-09-30/01-outsole.jpg'
src = Image.open(SRC).convert('RGB'); W, H = src.size
# 1) 밑창 마스크: 어둡고 채도 낮은 최대 덩어리 + 바닥 반사 경계는 수동 곡선으로 자름
hsv = np.asarray(src.convert('HSV')).astype(float)
m = (hsv[..., 2] < 130) & (hsv[..., 1] < 75)
m = nd.binary_opening(m, iterations=3)
lab, n = nd.label(m); m = lab == (np.argmax(nd.sum(m, lab, range(1, n + 1))) + 1)
m = nd.binary_closing(m, iterations=20); m = nd.binary_fill_holes(m)
px = np.array([150, 300, 450, 600, 800, 1000, 1200, 1400, 1600, 1750, 1880, 1960, 2000]) * 1.28
py = np.array([560, 700, 770, 798, 808, 802, 772, 738, 692, 655, 612, 555, 500]) * 1.28
cs = CubicSpline(px, py)
yy = np.arange(H)[:, None]; xx = np.arange(W)[None, :]
m &= yy < cs(np.clip(xx, px[0], px[-1]))
m = nd.gaussian_filter(m.astype(float), 6) > 0.5
m = nd.binary_erosion(m, iterations=5)  # 가장자리 색번짐(배경) 제거
alpha = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5))
# 2) 톤: 클래리티(큰 반경 언샵) + 대비, 그레이는 중립, 패드 실제 색 유지
img = src.filter(ImageFilter.UnsharpMask(radius=40, percent=45, threshold=0))
img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=80, threshold=2))
img = ImageEnhance.Contrast(img).enhance(1.08)
img = ImageEnhance.Brightness(img).enhance(1.06)
a = np.asarray(img).astype(float)
gray = a.mean(2, keepdims=True); sat = (a.max(2) - a.min(2))[..., None]
a = np.where(sat < 25, gray * np.array([0.98, 0.99, 1.02]), a)  # 고무 회색 살짝 쿨 톤
img = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
# 3) 잘라서 크기 맞춤
bbox = alpha.getbbox(); cut = img.crop(bbox); ca = alpha.crop(bbox)
s = 1560 / cut.width; cut = cut.resize((1560, int(cut.height * s)), Image.LANCZOS); ca = ca.resize(cut.size, Image.LANCZOS)
cut = cut.rotate(2.5, resample=Image.BICUBIC, expand=True); ca = ca.rotate(2.5, resample=Image.BICUBIC, expand=True)
# 4) 배경: 오프블랙 + 위쪽 스포트라이트 + 광택 바닥
BW, BH = 1920, 1080
y, x = np.mgrid[0:BH, 0:BW].astype(float)
d = np.sqrt(((x - BW / 2) / 1000) ** 2 + ((y - 430) / 620) ** 2)
bg = 11 + 30 * np.clip(1 - d, 0, 1) ** 1.6
bgimg = np.stack([bg, bg, bg * 0.98], 2)
canvas = Image.fromarray(np.clip(bgimg, 0, 255).astype(np.uint8))
ox = (BW - cut.width) // 2; oy = 120
floor_y = oy + int(cut.height * 0.93)
# 접지 그림자
sh = Image.new('L', (BW, BH), 0); shm = np.zeros((BH, BW))
cx = BW / 2; shm = np.exp(-(((x - cx) / 720) ** 2 + ((y - floor_y) / 26) ** 2))
canvas = Image.composite(Image.new('RGB', (BW, BH), (0, 0, 0)), canvas, Image.fromarray((shm * 200).astype(np.uint8)))
# 반사 (뒤집어 위에서 아래로 페이드)
ref = cut.transpose(Image.FLIP_TOP_BOTTOM); ra = np.asarray(ca.transpose(Image.FLIP_TOP_BOTTOM)).astype(float)
fade = np.clip(1 - np.arange(ra.shape[0]) / (ra.shape[0] * 0.45), 0, 1)[:, None] * 0.22
ref = ref.filter(ImageFilter.GaussianBlur(3))
canvas.paste(ref, (ox, floor_y - 4), Image.fromarray((ra * fade).astype(np.uint8)))
canvas.paste(cut, (ox, oy), ca)
# 5) 비네팅 + 미세 그레인
c = np.asarray(canvas).astype(float)
vig = 1 - 0.35 * np.clip(np.sqrt(((x - BW / 2) / (BW * 0.62)) ** 2 + ((y - BH / 2) / (BH * 0.62)) ** 2) - 0.45, 0, 1)
c = c * vig[..., None] + np.random.default_rng(1).normal(0, 2.2, c.shape)
out = np.clip(c, 0, 255)
# 6) 그립 패드 컬러 = 양산 확정 컬러 라임 #C6F432 (2026-10-05 대표 결정; 샘플 민트 → 양산 라임)
R, G, B = out[..., 0], out[..., 1], out[..., 2]
pm = ((G > R + 18) & (G > B + 8) & (G > 70)) | ((y > floor_y + 10) & (G > R + 6) & (G > B + 3) & (G > 30))
pm = nd.binary_closing(pm, iterations=2)
w = nd.gaussian_filter(pm.astype(float), 1.0)[..., None]
L = (0.3 * R + 0.59 * G + 0.11 * B)[..., None] / 215.0
out = out * (1 - w) + np.clip(np.array([198, 244, 50]) * np.clip(L, 0, 1.15), 0, 255) * w
Image.fromarray(out.astype(np.uint8)).save('edit/outsole-studio.png')
print('ok', cut.size, floor_y)
