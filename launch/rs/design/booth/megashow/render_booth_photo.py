"""메가쇼 부스 실사형 시안 — 통로에서 본 1점 투시 + KDRS 카탈로그 실사진 합성 → 메가쇼_부스_실사시안.png"""
import os, math
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
HERE = os.path.dirname(os.path.abspath(__file__)); KD = os.path.join(HERE, 'kd'); FP = os.path.join(HERE, '../../fair-print')
FONT = lambda w, s: ImageFont.truetype(os.path.join(FP, f'fonts/NotoSansKR-{w}.ttf'), s)
INK, LIME, CREAM, GR, YL = (13, 13, 13), (198, 244, 50), (245, 242, 236), (31, 71, 44), (251, 216, 39)
W, H = 2600, 1500
D, E = 5800, 1550                    # 카메라: 부스 앞선에서 5.8m(통로 건너편), 눈높이 1.55m
CX, CY = W / 2, 600
ZB = D + 3000; F = 1720 * ZB / 6000  # 뒷벽 6m가 1720px
def Z(y): return D + (3000 - y)
def P(X, y, z): z_ = Z(y); return (CX + F * X / z_, CY + F * (E - z) / z_)
def sc(y): return F / Z(y)

img = Image.new('RGB', (W, H), (226, 222, 214)); dr = ImageDraw.Draw(img, 'RGBA')
# 홀 배경: 상부 어둡게 + 전시장 바닥
for i in range(H):
    t = i / H; c = int(70 + 120 * t) if i < CY else int(178 - 20 * (i - CY) / (H - CY))
    dr.line([(0, i), (W, i)], fill=(c, c - 2, c - 6))
# 바닥(부스 카펫)
fl = [P(-3000, 0, 0), P(3000, 0, 0), P(3000, 3000, 0), P(-3000, 3000, 0)]
dr.polygon(fl, fill=(92, 94, 96))
# 통로 바닥
dr.polygon([P(-4500, 3000, 0), P(4500, 3000, 0), (W + 500, H), (-500, H)], fill=(188, 186, 180))
# 측벽
for X, shade in ((-3000, (236, 236, 233)), (3000, (230, 231, 229))):
    dr.polygon([P(X, 0, 0), P(X, 3000, 0), P(X, 3000, 2500), P(X, 0, 2500)], fill=shade)
    for yy in (1000, 2000, 3000):
        dr.line([P(X, yy, 0), P(X, yy, 2500)], fill=(170, 172, 176), width=3)
    dr.line([P(X, 0, 2500), P(X, 3000, 2500)], fill=(160, 162, 166), width=5)
# 뒷벽 + 족자 6
dr.polygon([P(-3000, 0, 0), P(3000, 0, 0), P(3000, 0, 2500), P(-3000, 0, 2500)], fill=(240, 240, 238))
s0 = sc(0)
for i in range(6):
    ban = Image.open(os.path.join(FP, f'out/08_banner_950x2380_x6_preview-{i+1}.png')).convert('RGB')
    bw, bh = int(950 * s0), int(2380 * s0)
    x0, y0 = P(-3000 + i * 1000 + 25, 0, 2440)
    img.paste(ban.resize((bw, bh), Image.LANCZOS), (int(x0), int(y0)))
    dr.line([P(-3000 + i * 1000, 0, 0), P(-3000 + i * 1000, 0, 2500)], fill=(175, 177, 181), width=3)
    # 족자봉
    a, b = P(-3000 + i * 1000 + 15, 0, 2445); c2, _ = P(-3000 + i * 1000 + 985, 0, 2445)
    dr.rectangle([a, b - 3, c2, b + 1], fill=(40, 40, 40))
dr.line([P(-3000, 0, 2500), P(3000, 0, 2500)], fill=(150, 152, 156), width=6)
# 하이라이트 조명 (판넬 상단 암 스포트) + 빛
glow = Image.new('L', (W, H), 0); gd = ImageDraw.Draw(glow)
for i in range(6):
    lx, ly = P(-3000 + i * 1000 + 500, 0, 2500)
    gd.ellipse([lx - 120, ly + 10, lx + 120, ly + 330], fill=70)
glow = glow.filter(ImageFilter.GaussianBlur(60))
img = Image.composite(Image.new('RGB', (W, H), (255, 246, 214)), img, glow); dr = ImageDraw.Draw(img, 'RGBA')
for i in range(6):
    lx, ly = P(-3000 + i * 1000 + 500, 0, 2500)
    dr.line([(lx, ly), (lx, ly - 18), (lx + 26, ly - 30)], fill=(60, 60, 60), width=4)
    dr.ellipse([lx + 18, ly - 40, lx + 40, ly - 18], fill=(255, 238, 190))

def cut(path):
    """카탈로그 사진 배경 제거 + 워터마크(KD RS) 지우기 + 여백 트림"""
    im = cv2.imread(path); h, w = im.shape[:2]
    im[: int(h * 0.1), : int(w * 0.24)] = 255          # 카탈로그 코드 라벨 제거
    hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
    wm = (((hsv[..., 0] < 12) | (hsv[..., 0] > 165)) & (hsv[..., 1] > 90)) | ((hsv[..., 0] > 35) & (hsv[..., 0] < 85) & (hsv[..., 1] > 80))
    wm = cv2.dilate(wm.astype(np.uint8) * 255, np.ones((5, 5), np.uint8))
    wm[: int(h * 0.55)] = 0                       # 워터마크는 하단에만
    im = cv2.inpaint(im, wm, 5, cv2.INPAINT_TELEA)
    mask = np.zeros((h + 2, w + 2), np.uint8)
    for sx, sy in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        cv2.floodFill(im.copy(), mask, (sx, sy), 0, (14, 14, 14), (14, 14, 14), cv2.FLOODFILL_MASK_ONLY | (255 << 8))
    alpha = 255 - mask[1:-1, 1:-1]
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
    rgba = cv2.cvtColor(im, cv2.COLOR_BGR2RGBA); rgba[..., 3] = alpha
    pil = Image.fromarray(rgba); bb = pil.getbbox(); return pil.crop(bb)
CACHE = {}
def photo(name, X, y, height_mm, flip=False, shadow=True):
    global img, dr
    if name not in CACHE: CACHE[name] = cut(os.path.join(KD, name + '.png'))
    im = CACHE[name].transpose(Image.FLIP_LEFT_RIGHT) if flip else CACHE[name]
    s = sc(y); hpx = int(height_mm * s); wpx = int(im.width * hpx / im.height)
    im = im.resize((wpx, hpx), Image.LANCZOS)
    bx, by = P(X, y, 0)
    if shadow:
        sh = Image.new('RGBA', (W, H)); sd = ImageDraw.Draw(sh)
        sd.ellipse([bx - wpx * .55, by - hpx * .04, bx + wpx * .55, by + hpx * .05], fill=(0, 0, 0, 90))
        img = Image.alpha_composite(img.convert('RGBA'), sh.filter(ImageFilter.GaussianBlur(10))).convert('RGB')
    img.paste(im, (int(bx - wpx / 2), int(by - hpx)), im); dr = ImageDraw.Draw(img, 'RGBA')
    return (int(bx - wpx / 2), int(by - hpx), wpx, hpx)
def put(path, box, alpha=True):
    im = Image.open(path).convert('RGBA'); x, y, w, h = box
    r = min(w / im.width, h / im.height); im = im.resize((max(1, int(im.width * r)), max(1, int(im.height * r))), Image.LANCZOS)
    img.paste(im, (int(x + (w - im.width) / 2), int(y + h - im.height)), im)
def counter(X, y, w, d, h, col, front_draw):
    """1단진열대 + 인쇄 스판 커버 (파란 상판 가림)"""
    x0, x1 = X - w / 2, X + w / 2; yf, yb = y, y - d
    top = [P(x0, yb, h), P(x1, yb, h), P(x1, yf, h), P(x0, yf, h)]
    side = [P(x1, yb, 0), P(x1, yf, 0), P(x1, yf, h), P(x1, yb, h)] if X < 0 else [P(x0, yb, 0), P(x0, yf, 0), P(x0, yf, h), P(x0, yb, h)]
    sc_ = tuple(max(0, c - 22) for c in col)
    dr.polygon([P(x0 - 60, yf + 30, 0), P(x1 + 60, yf + 30, 0), P(x1 + 30, yb, 0), P(x0 - 30, yb, 0)], fill=(0, 0, 0, 70))
    dr.polygon(side, fill=sc_); dr.polygon(top, fill=tuple(min(255, c + 30) for c in col))
    a, b = P(x0, yf, h); c2, d2 = P(x1, yf, 0)
    dr.rectangle([a, b, c2, d2], fill=col)
    front_draw((a, b, c2 - a, d2 - b))
    return top

# ── 집기 (뒤 → 앞) ──
# 뒷벽 쪽
tw = photo('tower', -2450, 450, 2000)                       # RS 타워
for k, f in enumerate(['walking-cut.png', 'insole-cut.png', 'walking-cut.png']):
    put(os.path.join(FP, 'assets', f), (tw[0] + tw[2] * .2, tw[1] + tw[3] * (.12 + k * .24), tw[2] * .55, tw[3] * .16))
tv = photo('tv', -1150, 350, 1550)
fb = Image.open(os.path.join(FP, 'assets/../out/08_banner_950x2380_x6_preview-1.png')).convert('RGB')
put(os.path.join(HERE, '../../film/reo-ep01/assets/reo-front.png'), (tv[0] + tv[2] * .38, tv[1] + tv[3] * .03, tv[2] * .3, tv[3] * .3))
rt = photo('tower', 1050, 450, 2000)                       # re.feeel 타워
for k in range(3):
    bx, by, bw, bh = rt[0] + rt[2] * .22, rt[1] + rt[3] * (.14 + k * .23), rt[2] * .5, rt[3] * .12
    dr.rounded_rectangle([bx, by + bh * .45, bx + bw, by + bh], 6, fill=[(232, 224, 205), (31, 71, 44), (251, 216, 39)][k])
s3 = photo('showcase3', 2150, 500, 900)                    # 구강 쇼케이스
for k in range(4):
    bx = s3[0] + s3[2] * (.12 + k * .2); dr.rounded_rectangle([bx, s3[1] + s3[3] * .3, bx + s3[2] * .14, s3[1] + s3[3] * .42], 4, fill=[(232, 224, 205), (60, 120, 200), (31, 71, 44), (232, 224, 205)][k])
# 우측벽 선반 3 + 욕실화
for k, yy in enumerate((700, 1500, 2300)):
    zz = 1050 + (k % 2) * 250
    pts = [P(3000, yy - 400, zz), P(3000, yy + 400, zz), P(2700, yy + 400, zz), P(2700, yy - 400, zz)]
    dr.polygon(pts, fill=(250, 250, 250), outline=(180, 180, 180))
    for j in range(3):
        cxx, cyy = P(2850, yy - 250 + j * 250, zz + 40)
        sw = 70 * sc(yy); dr.ellipse([cxx - sw, cyy - sw * .35, cxx + sw, cyy + sw * .35], fill=[(60, 74, 90), (107, 90, 74), (125, 138, 125)][j])
# 시착 존 의자 3 + 거울
for k, xx in enumerate((-2550, -2050, -1550)):
    photo('chair', xx, 1750, 820)
photo('mirror', -2850, 2250, 1650, flip=True)
# 원장 코너: 1단 쇼케이스 + X배너 ③
s1 = photo('showcase1', -350, 1450, 900)
put(os.path.join(FP, 'assets/insole-cut.png'), (s1[0] + s1[2] * .15, s1[1] + s1[3] * .22, s1[2] * .32, s1[3] * .25))
put(os.path.join(FP, 'assets/walking-cut.png'), (s1[0] + s1[2] * .55, s1[1] + s1[3] * .2, s1[2] * .3, s1[3] * .27))
xb3 = Image.open(os.path.join(FP, 'out/07b_xbanner_doctor_600x1800_preview-1.png')).convert('RGB')
def xban(path, X, y):
    s = sc(y); w, h = int(600 * s), int(1800 * s); bx, by = P(X, y, 0)
    im = Image.open(path).convert('RGB').resize((w, h), Image.LANCZOS)
    dr.line([(bx - w * .45, by), (bx, by - h * .35)], fill=(90, 90, 90), width=3); dr.line([(bx + w * .45, by), (bx, by - h * .35)], fill=(90, 90, 90), width=3)
    img.paste(im, (int(bx - w / 2), int(by - h - 30 * s)))
xban(os.path.join(FP, 'out/07b_xbanner_doctor_600x1800_preview-1.png'), 450, 1500)
# 레오 등신대
st = Image.open(os.path.join(FP, 'out/09_reo_standee_preview-1.png')).convert('RGBA')
s = sc(1350); sw_, sh_ = int(830 * s), int(1780 * s); bx, by = P(2350, 1350, 0)
st = st.resize((sw_, sh_)); stm = Image.new('L', st.size, 0)
arr = np.array(st.convert('RGB')).astype(int); bgm = (abs(arr - np.array([230, 230, 230])).sum(2) > 25).astype(np.uint8) * 255
img.paste(st, (int(bx - sw_ / 2), int(by - sh_)), Image.fromarray(bgm)); dr = ImageDraw.Draw(img, 'RGBA')

# 앞선 카운터 3 (1단진열대 2 + 기본 데스크) — 스판 커버
def front_rs(b):
    x, y, w, h = b; put(os.path.join(FP, 'assets/rs-logo-lime.png'), (x + w * .08, y + h * .14, w * .2, h * .42))
    f = FONT(900, int(h * .2)); dr.text((x + w * .33, y + h * .2), 'QUAD GRIP', font=f, fill=LIME)
    dr.text((x + w * .33, y + h * .46), '종일편한 워킹화 · 아치가득 인솔', font=FONT(700, int(h * .1)), fill=(255, 255, 255))
    dr.text((x + w * .33, y + h * .66), '직접 신어 보세요  230~280', font=FONT(400, int(h * .085)), fill=(190, 190, 190))
def front_ev(b):
    x, y, w, h = b
    dr.text((x + w * .5, y + h * .3), '@re.feeel', font=FONT(900, int(h * .2)), fill=LIME, anchor='mm')
    dr.text((x + w * .5, y + h * .55), '팔로우 → CXP 볼펜', font=FONT(700, int(h * .11)), fill=(255, 255, 255), anchor='mm')
    dr.text((x + w * .5, y + h * .72), '스토리 태그 → 칫솔', font=FONT(700, int(h * .11)), fill=YL, anchor='mm')
def front_rf(b):
    x, y, w, h = b; put(os.path.join(FP, 'assets/refeeel-seal.png'), (x + w * .06, y + h * .1, w * .22, h * .62))
    dr.text((x + w * .33, y + h * .2), '생활을 다시 채우다.', font=FONT(900, int(h * .14)), fill=CREAM)
    dr.text((x + w * .33, y + h * .44), 'ORAL CARE · BATH SLIPPER', font=FONT(700, int(h * .09)), fill=YL)
    dr.text((x + w * .33, y + h * .62), '나무에서 온 칫솔 · 벽지가 된 욕실화', font=FONT(400, int(h * .085)), fill=(220, 225, 215))
xban(os.path.join(FP, 'out/07_xbanner_600x1800_preview-1.png'), -2650, 2750)
xban(os.path.join(FP, 'out/07_xbanner_600x1800_preview-2.png'), 2650, 2750)
counter(-1850, 2900, 1480, 600, 750, INK, front_rs)
counter(0, 2900, 1100, 550, 750, INK, front_ev)
counter(1850, 2900, 1480, 600, 750, GR, front_rf)
# 카운터 위 제품
put(os.path.join(FP, 'assets/walking-cut.png'), (*P(-2350, 2650, 1000)[:1], P(-2350, 2650, 1000)[1], 230 * sc(2650), 250 * sc(2650)))
put(os.path.join(FP, 'assets/walking-cut.png'), (P(-1950, 2650, 1000)[0], P(-1950, 2650, 1000)[1], 230 * sc(2650), 250 * sc(2650)))
put(os.path.join(FP, 'assets/insole-cut.png'), (P(-1500, 2650, 950)[0], P(-1500, 2650, 950)[1], 300 * sc(2650), 200 * sc(2650)))
for k in range(2):
    a, b = P(-250 + k * 300, 2650, 760); s = sc(2650)
    dr.rounded_rectangle([a, b - 90 * s, a + 220 * s, b], 6, fill=[(201, 163, 107), (233, 226, 208)][k])
qa, qb = P(250, 2600, 760); s = sc(2600)
dr.polygon([(qa, qb), (qa + 160 * s, qb), (qa + 140 * s, qb - 220 * s), (qa + 20 * s, qb - 220 * s)], fill=(31, 71, 44))
for k, colr in enumerate([(60, 74, 90), (107, 90, 74), (125, 138, 125), (201, 193, 176)]):
    a, b = P(1300 + k * 300, 2650, 760); s = sc(2650); dr.ellipse([a, b - 70 * s, a + 240 * s, b], fill=colr)
# 통로 쪽 X배너 2 + POP
# 부스 간판 (기본부스 기둥형)
sx, sy = P(3000, 3000, 2900); s = sc(3000)
dr.rectangle([sx - 10, sy, sx + 260 * s, sy + 520 * s], fill=(28, 58, 140)); dr.rectangle([sx - 6, sy + 4, sx + 256 * s, sy + 120 * s], fill=(255, 255, 255))
dr.text((sx + 125 * s, sy + 62 * s), '[부스번호]', font=FONT(900, int(48 * s)), fill=(28, 58, 140), anchor='mm')
dr.text((sx + 125 * s, sy + 300 * s), '알앤디\n메이커스', font=FONT(900, int(56 * s)), fill=(255, 255, 255), anchor='mm', align='center')
# 타이틀
dr.rectangle([0, 0, W, 92], fill=(255, 255, 255, 235))
dr.text((36, 18), '메가쇼 킨텍스 부스 실사 시안 — 기본부스 2개 (6m × 3m)', font=FONT(900, 40), fill=INK)
dr.text((W - 36, 30), '집기: KDRS 쇼케이스 계열 + 1단진열대(브랜드 커버) · 벽: 족자봉 PET 6', font=FONT(700, 24), fill=(80, 80, 80), anchor='ra')
img = img.crop((0, 0, W, int(P(0, 3000, 0)[1] + 140)))
img.save(os.path.join(HERE, '메가쇼_부스_실사시안.png')); print('ok')
