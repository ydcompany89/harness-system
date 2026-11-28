# 아치가득 인솔 상품소개서용 사진 카드 (둥근 모서리 + 그림자 + 기울기)
from PIL import Image, ImageDraw, ImageFilter
R = "/home/user/harness-system/launch/rs/"; OUT = R + "sales/insole-deck/cards/"
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
card(L + "insole-model-hold.jpg", "cover", 1000, 1150, rot=3, crop_focus=0.42)
card(L + "insole-main.jpg", "main", 1000, 1150)
card(A + "insole-cut.png", "cut", 1200, 1000)
card(L + "insole-before.jpg", "step_before", 1200, 800)
card(L + "insole-layer-after.jpg", "step_after", 1200, 800)
card(L + "insole-pack-full.jpg", "pack", 1200, 900, rot=-3)
card(L + "insole-sneaker-model.jpg", "sneaker", 1200, 800)
card(PM + "before.png", "pm_before", 1404, 507, radius=36, shadow=0)
card(PM + "after.png", "pm_after", 1404, 507, radius=36, shadow=0)
