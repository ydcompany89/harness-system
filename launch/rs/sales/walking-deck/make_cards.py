# 아치가득 인솔 상품소개서용 사진 카드 (둥근 모서리 + 그림자 + 기울기)
from PIL import Image, ImageDraw, ImageFilter
R = "/home/user/harness-system/launch/rs/"; OUT = R + "sales/walking-deck/cards/"
L = R + "landing/img/"; A = R + "design/fair-print/assets/"; PM = R + "content/insole-pressure-map/"
SCALE = 0.5
def card(src, name, w, h, rot=0, radius=60, crop_focus=0.5, box=None, shadow=110):
    im = Image.open(src).convert("RGB")
    if box: im = im.crop(box)
    tr = w / h; sr = im.width / im.height
    if sr > tr:
        nw = int(im.height * tr); x = int((im.width - nw) * crop_focus); im = im.crop((x, 0, x + nw, im.height))
    else:
        nh = int(im.width / tr); y = int((im.height - nh) * crop_focus); im = im.crop((0, y, im.width, y + nh))
    im = im.resize((w, h), Image.LANCZOS)
    mask = Image.new("L", (w, h), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), radius, fill=255)
    pad = 90; canvas = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    if shadow:
        sh = Image.new("RGBA", canvas.size, (0, 0, 0, 0)); sm = Image.new("L", (w, h), 0)
        ImageDraw.Draw(sm).rounded_rectangle((0, 0, w - 1, h - 1), radius, fill=shadow)
        sh.paste(Image.new("RGBA", (w, h), (0, 0, 0, 255)), (pad, pad + 24), sm)
        canvas = Image.alpha_composite(canvas, sh.filter(ImageFilter.GaussianBlur(36)))
    tile = im.convert("RGBA"); tile.putalpha(mask); canvas.paste(tile, (pad, pad), tile)
    if rot: canvas = canvas.rotate(rot, resample=Image.BICUBIC, expand=True)
    canvas = canvas.resize((int(canvas.width * SCALE), int(canvas.height * SCALE)), Image.LANCZOS)
    canvas.save(OUT + name + ".png", optimize=True); print(name, canvas.size)
REF = R + "design/ai-gen/ref/"; FP = R + "design/fair-print/assets/"; W = R + "sales/walking-deck/src/"
card(REF + "walking-hand-hold.jpg", "cover", 1000, 1150, rot=3, crop_focus=0.45)
card(REF + "walking-onfoot.jpg", "onfoot", 1200, 850)
card(FP + "walking-main.jpg", "main", 1000, 1150)
card(REF + "walking-sole-closeup.jpg", "sole", 1100, 1100)
card(W + "walking-colors.jpg", "colors", 2000, 900, crop_focus=0.5, box=(0, 330, 3000, 1450))
card(REF + "walking-pair-stand.jpg", "pair", 1000, 1150, rot=-3)
