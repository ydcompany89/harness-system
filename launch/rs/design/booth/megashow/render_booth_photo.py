"""메가쇼 부스 실사형 시안 v3 — 통로에서 본 1점 투시.
불투명 집기(의자·TV)는 KDRS 카탈로그 실사진, 유리 쇼케이스·진열대·선반은 카탈로그 규격대로 직접 모델링 → 메가쇼_부스_실사시안.png"""
import os
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
HERE = os.path.dirname(os.path.abspath(__file__)); KD = os.path.join(HERE, 'kd'); FP = os.path.join(HERE, '../../fair-print')
A = lambda f: os.path.join(FP, 'assets', f); O = lambda f: os.path.join(FP, 'out', f)
FONT = lambda w, s: ImageFont.truetype(os.path.join(FP, f'fonts/NotoSansKR-{w}.ttf'), s)
INK, LIME, CREAM, GR, YL = (13, 13, 13), (198, 244, 50), (245, 242, 236), (31, 71, 44), (251, 216, 39)
W, H = 2600, 1500
D, E = 5800, 1550
CX, CY = W / 2, 600
ZB = D + 3000; F = 1720 * ZB / 6000
def Z(y): return D + (3000 - y)
def P(X, y, z): z_ = Z(y); return (CX + F * X / z_, CY + F * (E - z) / z_)
def sc(y): return F / Z(y)
class Blend:
    """RGBA 캔버스에 반투명 색을 '덮어쓰기'가 아니라 '합성'으로 칠하는 ImageDraw 대용 (유리·그림자가 불투명해지던 v2 버그 수정)"""
    def __getattr__(self, name):
        def call(*a, **k):
            ink = k.get('fill')
            if isinstance(ink, tuple) and len(ink) == 4 and ink[3] < 255:
                layer = Image.new('RGBA', (W, H), (0, 0, 0, 0)); getattr(ImageDraw.Draw(layer), name)(*a, **k); img.alpha_composite(layer)
            else: getattr(ImageDraw.Draw(img), name)(*a, **k)
        return call
img = Image.new('RGBA', (W, H), (0, 0, 0, 255)); dr = Blend()
def poly(pts, fill, outline=None, w=1): dr.polygon([tuple(p) for p in pts], fill=fill, outline=outline, width=w)
def quad_paste(src, quad):
    """src(RGBA)를 화면상 사각형 quad(좌상,우상,우하,좌하)로 원근 매핑"""
    global img, dr
    w, h = src.size
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [w, 0], [w, h], [0, h]]), np.float32(quad))
    arr = cv2.warpPerspective(np.array(src.convert('RGBA')), M, (W, H), flags=cv2.INTER_LINEAR, borderValue=(0, 0, 0, 0))
    img.alpha_composite(Image.fromarray(arr))
def wall_quad(X, y0, y1, z0, z1):   # 측벽(x 고정) 위 사각형: 좌상,우상,우하,좌하 (화면 기준 안쪽→바깥)
    return [P(X, y0, z1), P(X, y1, z1), P(X, y1, z0), P(X, y0, z0)]

# ── 공간 ──
for i in range(H):
    t = i / H; c = int(62 + 110 * t) if i < CY else int(176 - 18 * (i - CY) / (H - CY))
    dr.line([(0, i), (W, i)], fill=(c, c - 2, c - 6, 255))
poly([P(-4600, 3000, 0), P(4600, 3000, 0), (W + 600, H), (-600, H)], (190, 188, 182))          # 통로
poly([P(-3000, 0, 0), P(3000, 0, 0), P(3000, 3000, 0), P(-3000, 3000, 0)], (86, 88, 92))       # 부스 카펫(그레이)
for X, col in ((-3000, (238, 238, 235)), (3000, (232, 233, 231))):
    poly(wall_quad(X, 0, 3000, 0, 2500), col)
    for yy in (1000, 2000): dr.line([P(X, yy, 0), P(X, yy, 2500)], fill=(176, 178, 182), width=3)
    dr.line([P(X, 0, 2500), P(X, 3000, 2500)], fill=(150, 152, 156), width=6)
    dr.line([P(X, 3000, 0), P(X, 3000, 2500)], fill=(150, 152, 156), width=6)
poly([P(-3000, 0, 0), P(3000, 0, 0), P(3000, 0, 2500), P(-3000, 0, 2500)], (242, 242, 240))
s0 = sc(0)
for i in range(6):
    ban = Image.open(O(f'08_banner_950x2380_x6_preview-{i+1}.png')).convert('RGBA')
    x0, y0 = P(-3000 + i * 1000 + 25, 0, 2440)
    img.paste(ban.resize((int(950 * s0), int(2380 * s0)), Image.LANCZOS), (int(x0), int(y0)))
    dr.line([P(-3000 + i * 1000, 0, 0), P(-3000 + i * 1000, 0, 2500)], fill=(178, 180, 184), width=3)
    a, b = P(-3000 + i * 1000 + 15, 0, 2445); c2, _ = P(-3000 + i * 1000 + 985, 0, 2445)
    dr.rectangle([a, b - 3, c2, b + 1], fill=(35, 35, 35))
dr.line([P(-3000, 0, 2500), P(3000, 0, 2500)], fill=(150, 152, 156), width=6)
# 측벽 그래픽: 포맥스 사인 S1(RS 로고) / S2(re.feeel 씰) 와이어 걸이
s1 = Image.open(O('10a_foamex_RS_logo_preview-1.png')).convert('RGBA')
s1a = np.array(s1); bg = (np.abs(s1a[..., :3].astype(int) - np.array([119, 119, 119])).sum(2) < 30); s1a[bg, 3] = 0
quad_paste(Image.fromarray(s1a), wall_quad(-2995, 1150, 2250, 1500, 2400))
s2 = Image.open(O('10b_foamex_refeeel_seal_preview-1.png')).convert('RGBA')
s2a = np.array(s2); bg = (np.abs(s2a[..., :3].astype(int) - np.array([119, 119, 119])).sum(2) < 30); s2a[bg, 3] = 0
q = wall_quad(2995, 1250, 2200, 1500, 2400); quad_paste(Image.fromarray(s2a), [q[1], q[0], q[3], q[2]])
for X, y0, y1 in ((-2995, 1150, 2250), (2995, 1250, 2200)):
    for yy in (y0 + 120, y1 - 120): dr.line([P(X, yy, 2500), P(X, yy, 2400)], fill=(120, 120, 120), width=2)
# 하이라이트 조명
glow = Image.new('L', (W, H), 0); gd = ImageDraw.Draw(glow)
for i in range(6):
    lx, ly = P(-3000 + i * 1000 + 500, 0, 2500); gd.ellipse([lx - 125, ly + 10, lx + 125, ly + 340], fill=72)
glow = glow.filter(ImageFilter.GaussianBlur(60))
img = Image.composite(Image.new('RGBA', (W, H), (255, 246, 214, 255)), img, glow); dr = Blend()
for i in range(6):
    lx, ly = P(-3000 + i * 1000 + 500, 0, 2500)
    dr.line([(lx, ly), (lx, ly - 18), (lx + 26, ly - 30)], fill=(60, 60, 60), width=4); dr.ellipse([lx + 18, ly - 40, lx + 40, ly - 18], fill=(255, 238, 190))

# ── 모델링 유틸 ──
def box(x0, x1, yb, yf, z0, z1, front, top, side, outline=None):
    """직육면체: 앞면(정면) + 윗면 + 화면 중앙 쪽 옆면"""
    sx = x1 if (x0 + x1) / 2 < 0 else x0
    if z1 < E: poly([P(x0, yb, z1), P(x1, yb, z1), P(x1, yf, z1), P(x0, yf, z1)], top, outline)
    else: poly([P(x0, yb, z0), P(x1, yb, z0), P(x1, yf, z0), P(x0, yf, z0)], top, outline)
    poly([P(sx, yb, z0), P(sx, yf, z0), P(sx, yf, z1), P(sx, yb, z1)], side, outline)
    poly([P(x0, yf, z0), P(x1, yf, z0), P(x1, yf, z1), P(x0, yf, z1)], front, outline)
def shadow(x0, x1, yb, yf, pad=60):
    poly([P(x0 - pad, yf + pad, 0), P(x1 + pad, yf + pad, 0), P(x1 + pad / 2, yb, 0), P(x0 - pad / 2, yb, 0)], (0, 0, 0, 70))
def put(path, box_, anchor='bottom'):
    im = Image.open(path).convert('RGBA'); x, y, w, h = box_
    r = min(w / im.width, h / im.height); im = im.resize((max(1, int(im.width * r)), max(1, int(im.height * r))), Image.LANCZOS)
    img.alpha_composite(im, (int(x + (w - im.width) / 2), int(y + h - im.height)))
def on_floor(path, X, y, z, w_mm, h_mm):   # 3D 위치에 이미지 세우기 (바닥 중앙 기준)
    s = sc(y); bx, by = P(X, y, z); put(path, (bx - w_mm * s / 2, by - h_mm * s, w_mm * s, h_mm * s))
FRAME, GLASS, GLASS_E = (236, 238, 240), (205, 225, 235, 60), (160, 180, 190, 160)
def showcase(Xc, yf, w, d, h, base_h, shelves, items):
    """KDRS 쇼케이스: 흰 하부장 + 유리 상부 + 유리 선반 + 알루미늄 프레임 (items: [(shelf_z, draw_fn)])"""
    x0, x1, yb = Xc - w / 2, Xc + w / 2, yf - d
    shadow(x0, x1, yb, yf)
    box(x0, x1, yb, yf, 0, base_h, (244, 245, 246), (250, 250, 250), (222, 224, 226), (190, 192, 196))
    # 유리 뒤판·옆판 (뒤 먼저)
    poly([P(x0, yb, base_h), P(x1, yb, base_h), P(x1, yb, h), P(x0, yb, h)], (215, 228, 236, 70))
    for z in shelves:
        poly([P(x0, yb, z), P(x1, yb, z), P(x1, yf, z), P(x0, yf, z)], (200, 220, 230, 110), GLASS_E)
    for z, fn in items: fn(x0, x1, yb, yf, z)
    sx = x1 if Xc < 0 else x0
    poly([P(sx, yb, base_h), P(sx, yf, base_h), P(sx, yf, h), P(sx, yb, h)], GLASS)
    poly([P(x0, yf, base_h), P(x1, yf, base_h), P(x1, yf, h), P(x0, yf, h)], GLASS)
    # 유리 반사 하이라이트
    a, b = P(x0 + w * .12, yf, h - 80); c2, d2 = P(x0 + w * .22, yf, base_h + 120)
    dr.polygon([(a, b), (a + (c2 - a) * .6, b), (c2, d2), (c2 - (c2 - a) * .6, d2)], fill=(255, 255, 255, 55))
    box(x0, x1, yb, yf, h, h + 40, (240, 242, 244), (250, 250, 250), (220, 222, 224), (190, 192, 196))
    for px in (x0, x1):
        dr.line([P(px, yf, base_h), P(px, yf, h)], fill=FRAME, width=max(2, int(18 * sc(yf))))
    dr.line([P(sx, yb, base_h), P(sx, yb, h)], fill=FRAME, width=max(2, int(14 * sc(yb))))
def shoes_row(paths, n=3):
    def fn(x0, x1, yb, yf, z):
        ym = (yb + yf) / 2; step = (x1 - x0) / n
        for k in range(n):
            on_floor(paths[k % len(paths)], x0 + step * (k + .5), ym, z, step * .78, 170)
    return fn
def boxes_row(cols, hmm=140):
    def fn(x0, x1, yb, yf, z):
        ym = (yb + yf) / 2; step = (x1 - x0) / len(cols)
        for k, c in enumerate(cols):
            xa = x0 + step * (k + .2); xb = x0 + step * (k + .8)
            box(xa, xb, ym - 60, ym + 60, z, z + hmm, c, tuple(min(255, v + 25) for v in c[:3]), tuple(max(0, v - 25) for v in c[:3]))
    return fn
def counter(Xc, yf, w, d, h, col, front_fn):
    """1단진열대 + 인쇄 스판 커버"""
    x0, x1, yb = Xc - w / 2, Xc + w / 2, yf - d
    shadow(x0, x1, yb, yf)
    box(x0, x1, yb, yf, 0, h, col, tuple(min(255, c + 28) for c in col), tuple(max(0, c - 20) for c in col))
    a, b = P(x0, yf, h); c2, d2 = P(x1, yf, 0); front_fn((a, b, c2 - a, d2 - b))
def wall_shelf(X, yc, z, items):
    sgn = 1 if X < 0 else -1
    x_in = X + sgn * 300
    poly([P(X, yc - 500, z), P(X, yc + 500, z), P(x_in, yc + 500, z), P(x_in, yc - 500, z)], (250, 250, 250), (175, 175, 175))
    poly([P(x_in, yc - 500, z), P(x_in, yc + 500, z), P(x_in, yc + 500, z - 25), P(x_in, yc - 500, z - 25)], (215, 215, 215))
    for k, it in enumerate(items):
        yy = yc - 330 + k * 330; it(X + sgn * 150, yy, z)

# ── 카탈로그 실사진(불투명 집기만) ──
def cut(path):
    im = cv2.imread(path); h, w = im.shape[:2]
    im[: int(h * 0.1), : int(w * 0.24)] = 255
    hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
    wm = (((hsv[..., 0] < 12) | (hsv[..., 0] > 165)) & (hsv[..., 1] > 90)) | ((hsv[..., 0] > 35) & (hsv[..., 0] < 85) & (hsv[..., 1] > 80))
    wm = cv2.dilate(wm.astype(np.uint8) * 255, np.ones((5, 5), np.uint8)); wm[: int(h * 0.55)] = 0
    im = cv2.inpaint(im, wm, 5, cv2.INPAINT_TELEA)
    mask = np.zeros((h + 2, w + 2), np.uint8)
    for sx, sy in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        cv2.floodFill(im.copy(), mask, (sx, sy), 0, (14, 14, 14), (14, 14, 14), cv2.FLOODFILL_MASK_ONLY | (255 << 8))
    rgba = cv2.cvtColor(im, cv2.COLOR_BGR2RGBA); rgba[..., 3] = cv2.GaussianBlur(255 - mask[1:-1, 1:-1], (3, 3), 0)
    p = Image.fromarray(rgba); return p.crop(p.getbbox())
CACHE = {}
def photo(name, X, y, h_mm, flip=False):
    if name not in CACHE: CACHE[name] = cut(os.path.join(KD, name + '.png'))
    im = CACHE[name].transpose(Image.FLIP_LEFT_RIGHT) if flip else CACHE[name]
    s = sc(y); hp = int(h_mm * s); wp = int(im.width * hp / im.height); im = im.resize((wp, hp), Image.LANCZOS)
    bx, by = P(X, y, 0)
    dr.ellipse([bx - wp * .5, by - hp * .03, bx + wp * .5, by + hp * .04], fill=(0, 0, 0, 60))
    img.alpha_composite(im, (int(bx - wp / 2), int(by - hp))); return (int(bx - wp / 2), int(by - hp), wp, hp)

WALK, INS = A('walking-cut.png'), A('insole-cut.png')
SLP = [(60, 74, 90), (107, 90, 74), (125, 138, 125), (201, 193, 176)]
# ── 배치 (뒤 → 앞) ──
# 좌측벽: 신발 벽 선반 2
wall_shelf(-3000, 1700, 1300, [lambda X, y, z: on_floor(WALK, X, y, z, 280, 230)] * 3)
wall_shelf(-3000, 1700, 950, [lambda X, y, z: on_floor(INS, X, y, z, 280, 190)] * 3)
# 우측벽: 욕실화 선반 3
def slipper(X, y, z, c=0):
    s = sc(y); a, b = P(X, y, z + 5); dr.ellipse([a - 110 * s, b - 38 * s, a + 110 * s, b + 6 * s], fill=SLP[c % 4] + (255,))
for k, (yy, zz) in enumerate(((800, 1250), (1700, 1050), (2500, 1250))):
    wall_shelf(3000, yy, zz, [lambda X, y, z, k=k, j=j: slipper(X, y, z, k + j) for j in range(3)])
# 뒷벽 쪽
showcase(-2450, 900, 900, 450, 2000, 380, [700, 1100, 1500], [(700, shoes_row([WALK], 2)), (1100, shoes_row([INS, INS], 2)), (1500, shoes_row([WALK], 2))])
# 50" TV 스탠드 (카탈로그 규격 직접 모델링 — 화면: 밑창 그립 영상 스틸)
def tv(Xc, y):
    s = sc(y); bx, by = P(Xc, y, 0)
    dr.ellipse([bx - 300 * s, by - 30 * s, bx + 300 * s, by + 30 * s], fill=(0, 0, 0, 70))
    dr.rectangle([bx - 260 * s, by - 18 * s, bx + 260 * s, by], fill=(40, 40, 42))
    dr.rectangle([bx - 30 * s, by - 1150 * s, bx + 30 * s, by - 18 * s], fill=(55, 55, 58))
    tl = P(Xc - 560, y, 1820); br = P(Xc + 560, y, 1180)
    dr.rectangle([tl[0], tl[1], br[0], br[1]], fill=(12, 12, 12))
    scr = Image.open(A('outsole-lime.jpg')).convert('RGBA'); iw, ih = int(br[0] - tl[0] - 14 * s * 2), int(br[1] - tl[1] - 14 * s * 2)
    r = max(iw / scr.width, ih / scr.height); scr = scr.resize((int(scr.width * r) + 1, int(scr.height * r) + 1), Image.LANCZOS)
    scr = scr.crop(((scr.width - iw) // 2, (scr.height - ih) // 2, (scr.width - iw) // 2 + iw, (scr.height - ih) // 2 + ih))
    img.alpha_composite(scr, (int(tl[0] + 14 * s), int(tl[1] + 14 * s)))
    dr.polygon([(tl[0] + 20 * s, tl[1] + 20 * s), (tl[0] + 260 * s, tl[1] + 20 * s), (tl[0] + 80 * s, br[1] - 20 * s), (tl[0] + 20 * s, br[1] - 20 * s)], fill=(255, 255, 255, 30))
tv(-1150, 420)
showcase(1050, 900, 900, 450, 2000, 380, [700, 1100, 1500], [(700, boxes_row([(232, 224, 205), GR + (255,), (232, 224, 205)])), (1100, boxes_row([YL + (255,), (232, 224, 205), GR + (255,)])), (1500, boxes_row([(232, 224, 205), (60, 120, 200), (232, 224, 205)], 180))])
showcase(2150, 950, 900, 450, 900, 380, [], [(380, boxes_row([(232, 224, 205), (60, 120, 200), GR + (255,), (232, 224, 205)], 120))])
# 원장 코너: 1단 쇼케이스 + X배너 ③
showcase(-350, 1650, 900, 450, 900, 520, [], [(520, shoes_row([INS, WALK], 2))])
def xban(path, X, y):
    s = sc(y); w, h = int(600 * s), int(1800 * s); bx, by = P(X, y, 0)
    dr.line([(bx - w * .45, by), (bx, by - h * .35)], fill=(90, 90, 90), width=3); dr.line([(bx + w * .45, by), (bx, by - h * .35)], fill=(90, 90, 90), width=3)
    img.paste(Image.open(path).convert('RGBA').resize((w, h), Image.LANCZOS), (int(bx - w / 2), int(by - h - 30 * s)))
xban(O('07b_xbanner_doctor_600x1800_preview-1.png'), 450, 1700)
# 시착: 땅콩의자 3 + 전신거울(좌측벽 앞쪽)
for xx in (-2450, -1950, -1450): photo('chair', xx, 1950, 820)
mq = wall_quad(-2990, 2350, 2800, 300, 1900)
poly(mq, (30, 30, 30)); m2 = wall_quad(-2985, 2380, 2770, 340, 1860); poly(m2, (205, 214, 220))
dr.polygon([m2[0], (m2[0][0] + (m2[1][0] - m2[0][0]) * .4, m2[0][1] + (m2[1][1] - m2[0][1]) * .4), (m2[3][0] + (m2[2][0] - m2[3][0]) * .2, m2[3][1] + (m2[2][1] - m2[3][1]) * .2), m2[3]], fill=(255, 255, 255, 70))
# 통로 쪽 X배너 2 (카운터 뒤)
xban(O('07_xbanner_600x1800_preview-1.png'), -2650, 2750)
xban(O('07_xbanner_600x1800_preview-2.png'), 2650, 2750)
# 앞선 카운터 3
def front_rs(b):
    x, y, w, h = b; put(A('rs-lockup-lime.png'), (x + w * .07, y + h * .12, w * .2, h * .58))
    dr.text((x + w * .33, y + h * .2), 'QUAD GRIP', font=FONT(900, int(h * .2)), fill=LIME)
    dr.text((x + w * .33, y + h * .46), '종일편한 워킹화 · 아치가득 인솔', font=FONT(700, int(h * .1)), fill=(255, 255, 255))
    dr.text((x + w * .33, y + h * .66), '직접 신어 보세요  230~280', font=FONT(400, int(h * .085)), fill=(190, 190, 190))
def front_ev(b):
    x, y, w, h = b
    dr.text((x + w * .5, y + h * .3), '@re.feeel', font=FONT(900, int(h * .2)), fill=LIME, anchor='mm')
    dr.text((x + w * .5, y + h * .55), '팔로우 → CXP 볼펜', font=FONT(700, int(h * .11)), fill=(255, 255, 255), anchor='mm')
    dr.text((x + w * .5, y + h * .72), '스토리 태그 → 칫솔', font=FONT(700, int(h * .11)), fill=YL, anchor='mm')
def front_rf(b):
    x, y, w, h = b; put(A('refeeel-seal.png'), (x + w * .06, y + h * .1, w * .22, h * .62))
    dr.text((x + w * .33, y + h * .2), '생활을 다시 채우다.', font=FONT(900, int(h * .14)), fill=CREAM)
    dr.text((x + w * .33, y + h * .44), 'ORAL CARE · BATH SLIPPER', font=FONT(700, int(h * .09)), fill=YL)
    dr.text((x + w * .33, y + h * .62), '나무에서 온 칫솔 · 벽지가 된 욕실화', font=FONT(400, int(h * .085)), fill=(220, 225, 215))
counter(-1850, 2900, 1480, 600, 750, INK, front_rs)
counter(0, 2900, 1100, 550, 750, INK, front_ev)
counter(1850, 2900, 1480, 600, 750, GR, front_rf)
# 카운터 위
for X in (-2350, -1950): on_floor(WALK, X, 2600, 750, 300, 240)
on_floor(INS, -1500, 2600, 750, 320, 200)
box(-300, -100, 2550, 2700, 750, 840, (201, 163, 107), (220, 185, 130), (170, 135, 85))   # 볼펜 바구니
box(80, 280, 2550, 2700, 750, 830, (233, 226, 208), (245, 240, 228), (205, 198, 182))     # 칫솔 바구니
qa, qb = P(330, 2600, 750); s = sc(2600)
dr.polygon([(qa, qb), (qa + 160 * s, qb), (qa + 140 * s, qb - 220 * s), (qa + 20 * s, qb - 220 * s)], fill=GR + (255,))
for k in range(4): slipper(1250 + k * 330, 2620, 750, k)
# 부스 간판 (기본부스 기둥형)
sx, sy = P(3000, 3000, 2900); s = sc(3000)
dr.rectangle([sx - 10, sy, sx + 260 * s, sy + 520 * s], fill=(28, 58, 140)); dr.rectangle([sx - 6, sy + 4, sx + 256 * s, sy + 120 * s], fill=(255, 255, 255))
dr.text((sx + 125 * s, sy + 62 * s), '[부스번호]', font=FONT(900, int(48 * s)), fill=(28, 58, 140), anchor='mm')
dr.text((sx + 125 * s, sy + 300 * s), '알앤디\n메이커스', font=FONT(900, int(56 * s)), fill=(255, 255, 255), anchor='mm', align='center')
dr.rectangle([0, 0, W, 92], fill=(255, 255, 255, 240))
dr.text((36, 18), '메가쇼 킨텍스 부스 실사 시안 v3 — 기본부스 2개 (6m × 3m)', font=FONT(900, 40), fill=INK)
dr.text((W - 36, 30), 'KDRS 쇼케이스·진열대·선반 + 인쇄 스판 커버 · 벽: 족자봉 PET 6 + 포맥스 사인', font=FONT(700, 24), fill=(80, 80, 80), anchor='ra')
img = img.crop((0, 0, W, int(P(0, 3000, 0)[1] + 140))).convert('RGB')
img.save(os.path.join(HERE, '메가쇼_부스_실사시안.png')); print('ok')
