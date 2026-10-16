"""레스큐스텝 AI 키비주얼(src-rescuestep-ai.webp) → 라라슈 톤 base.png
블루 글로우→라임(부드러운 가중치, 밝기 보존), 남색 배경→잉크 블랙, 베이지 인솔→실제 제품 그레이"""
import os, numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__))
im = cv2.imread(os.path.join(HERE, 'src-rescuestep-ai.webp')).astype(np.float32) / 255; h, w = im.shape[:2]
hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)                  # H 0~360, S/V 0~1
H, S, V = hsv[..., 0], hsv[..., 1], hsv[..., 2]
ss = lambda x, a, b: np.clip((x - a) / (b - a), 0, 1) ** 2 * (3 - 2 * np.clip((x - a) / (b - a), 0, 1))
blueness = ss(H, 175, 195) * (1 - ss(H, 255, 275)) * ss(S, .12, .45)
lime = np.array([50, 244, 198], np.float32) / 255           # BGR
t = ss(V, .30, .75)                                          # 밝은 곳만 라임, 어두운 남색은 무채색
L = V[..., None]
neutral = np.repeat(L * .55, 3, 2)
tinted = lime * np.minimum(1, L * 1.15) + ss(V, .85, 1)[..., None] * (1 - lime) * .6
target = neutral * (1 - t[..., None]) + tinted * t[..., None]
out = im * (1 - blueness[..., None]) + target * blueness[..., None]
# 베이지 인솔 → 그레이 (인솔 영역 안, 피부 제외)
zone = np.zeros((h, w), np.float32); zone[530:975, 15:575] = 1; zone[325:560, 578:705] = 1
beige = zone * ss(H, 30, 40) * (1 - ss(H, 62, 72)) * ss(S, .06, .16) * ss(V, .25, .4)
beige = cv2.GaussianBlur(beige, (5, 5), 0)
gray = np.repeat((cv2.cvtColor(im, cv2.COLOR_BGR2GRAY) * .62 + .05)[..., None], 3, 2)
out = out * (1 - beige[..., None]) + gray * beige[..., None]
o8 = np.clip(out * 255, 0, 255).astype(np.uint8)
m = np.zeros((h, w), np.uint8); m[795:885, 235:315] = 255                      # 인솔 측면 핑크 각인(원 브랜드) 제거
# 원본 문구(레스큐스텝 로고·헤드라인·본문) 지우기: 좌상단 영역의 흰 글자 + 하늘색 글자
src = cv2.cvtColor((im * 255).astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
txt = ((src[..., 2] > 150) & (src[..., 1] < 90)) | ((src[..., 0] > 95) & (src[..., 0] < 115) & (src[..., 1] > 110) & (src[..., 2] > 170))
region = np.zeros((h, w), bool); region[40:505, 40:585] = True
m[cv2.dilate((txt & region).astype(np.uint8), np.ones((7, 7), np.uint8)) > 0] = 255
pink = (src[..., 0] > 140) & (src[..., 0] < 175) & (src[..., 1] > 60) & (src[..., 2] > 80); pk = np.zeros((h, w), bool); pk[760:900, 200:340] = True
m[cv2.dilate((pink & pk).astype(np.uint8), np.ones((9, 9), np.uint8)) > 0] = 255
o8 = cv2.inpaint(o8, m, 9, cv2.INPAINT_TELEA)
cv2.imwrite(os.path.join(HERE, 'base-recolor.png'), o8); print('ok')
