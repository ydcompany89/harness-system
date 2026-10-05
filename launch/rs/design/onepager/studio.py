"""누끼 PNG → 다크 스튜디오 타일(조명·접지 그림자). 제품 픽셀은 톤 보정만. AI 생성 없음."""
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
from scipy import ndimage as nd
BG = 22  # 카드 배경(#161616)과 동일
def tile(cut, out, W, H, fill=0.82, rot=0, ground=True):
    im = Image.open(cut).convert('RGBA')
    if rot: im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
    rgb, a = im.convert('RGB'), im.getchannel('A')
    rgb = rgb.filter(ImageFilter.UnsharpMask(radius=30, percent=40, threshold=0))
    rgb = ImageEnhance.Contrast(rgb).enhance(1.08); rgb = ImageEnhance.Brightness(rgb).enhance(1.08)
    s = min(W * fill / im.width, H * fill / im.height)
    sz = (int(im.width * s), int(im.height * s)); rgb = rgb.resize(sz, Image.LANCZOS); a = a.resize(sz, Image.LANCZOS)
    y, x = np.mgrid[0:H, 0:W].astype(float)
    d = np.sqrt(((x - W / 2) / (W * 0.5)) ** 2 + ((y - H / 2) / (H * 0.5)) ** 2)
    bg = BG + 26 * np.clip(1 - d, 0, 1) ** 1.5
    c = Image.fromarray(np.clip(np.stack([bg] * 3, 2), 0, 255).astype(np.uint8))
    ox, oy = (W - sz[0]) // 2, (H - sz[1]) // 2
    # 그림자: 알파를 아래로 밀어 흐림
    sh = Image.new('L', (W, H), 0); sh.paste(a, (ox + int(W * 0.01), oy + int(H * 0.03)))
    sh = sh.filter(ImageFilter.GaussianBlur(W * 0.02)).point(lambda v: int(v * 0.75))
    c = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), c, sh)
    c.paste(rgb, (ox, oy), a)
    arr = np.asarray(c).astype(float) + np.random.default_rng(2).normal(0, 1.6, (H, W, 3))
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(out); print(out)
if __name__ == '__main__':
    tile('shoes2-cut.png', 'tile-shoes.png', 1200, 1000, fill=0.95)
    tile('insole-cut.png', 'tile-insole.png', 1600, 1000, fill=0.86, rot=90)
    # 밑창(라임 패드) — 브랜드 필름 리터칭본에서 크롭
    o = Image.open('../film/brand-film-flow/edit/outsole-studio.png').crop((140, 150, 1780, 820))
    o = o.resize((1200, int(670 * 1200 / 1640)), Image.LANCZOS)
    # 가장자리를 카드 배경색으로 페이드 (사각 경계 안 보이게)
    w, h = o.size; yy, xx = np.mgrid[0:h, 0:w].astype(float); f = 70
    k = np.clip(np.minimum.reduce([xx, w - 1 - xx, yy, h - 1 - yy]) / f, 0, 1)
    Image.composite(o, Image.new('RGB', o.size, (BG, BG, BG)), Image.fromarray((k * 255).astype(np.uint8))).save('tile-outsole.png')
