# 자사몰 스타일 사진 카드: 둥근 모서리 + 부드러운 그림자 + (선택) 기울기 → 투명 PNG
from PIL import Image, ImageDraw, ImageFilter
R = "/home/user/harness-system/launch/rs/"
OUT = R + "sales/deck-v3/cards/"
def card(src, name, w, h, rot=0, radius=60, shadow=(0, 0, 0, 110), crop_focus=0.5):
    im = Image.open(src).convert("RGB")
    # cover crop to w:h
    tr = w / h; sr = im.width / im.height
    if sr > tr:
        nw = int(im.height * tr); x = int((im.width - nw) * crop_focus); im = im.crop((x, 0, x + nw, im.height))
    else:
        nh = int(im.width / tr); y = int((im.height - nh) * crop_focus); im = im.crop((0, y, im.width, y + nh))
    im = im.resize((w, h), Image.LANCZOS)
    mask = Image.new("L", (w, h), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), radius, fill=255)
    pad = 90
    canvas = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    sh = Image.new("RGBA", canvas.size, (0, 0, 0, 0)); sm = Image.new("L", (w, h), 0)
    ImageDraw.Draw(sm).rounded_rectangle((0, 0, w - 1, h - 1), radius, fill=shadow[3])
    sh.paste(Image.new("RGBA", (w, h), shadow[:3] + (255,)), (pad, pad + 24), sm)
    sh = sh.filter(ImageFilter.GaussianBlur(36))
    canvas = Image.alpha_composite(canvas, sh)
    tile = im.convert("RGBA"); tile.putalpha(mask); canvas.paste(tile, (pad, pad), tile)
    if rot: canvas = canvas.rotate(rot, resample=Image.BICUBIC, expand=True)
    canvas.save(OUT + name + ".png"); print(name, canvas.size)
A = R + "sales/assets/"; REF = R + "design/ai-gen/ref/"
card(REF + "walking-hand-hold.jpg", "cover_rs", 900, 1100, rot=4, crop_focus=0.45)
card(A + "refeeel-brush-cup.jpg", "cover_rf", 900, 1100, rot=-4)
card(REF + "walking-sole-closeup.jpg", "rs_sole", 1100, 1100, rot=0)
card(REF + "walking-onfoot.jpg", "rs_onfoot", 1000, 1200, rot=3)
card(A + "kintex-booth.jpg", "booth", 1200, 900, rot=-3)
card(A + "cup-tilt-hi.jpg", "rf_cup_big", 1000, 1100, rot=-3)

def top(src, name, w, h, radius=48, crop_focus=0.5, bg=None):
    im = Image.open(src).convert("RGB")
    tr = w / h; sr = im.width / im.height
    if sr > tr:
        nw = int(im.height * tr); x = int((im.width - nw) * crop_focus); im = im.crop((x, 0, x + nw, im.height))
    else:
        nh = int(im.width / tr); y = int((im.height - nh) * crop_focus); im = im.crop((0, y, im.width, y + nh))
    im = im.resize((w, h), Image.LANCZOS).convert("RGBA")
    mask = Image.new("L", (w, h), 0); d = ImageDraw.Draw(mask)
    d.rounded_rectangle((0, 0, w - 1, h - 1 + radius * 2), radius, fill=255)
    im.putalpha(mask); im.save(OUT + name + ".png"); print(name, im.size)
top(R + "landing/img/insole-pack-full.jpg", "p_insole", 1000, 700)
top(REF + "walking-pair-stand.jpg", "p_walk", 1000, 700, crop_focus=0.75)
top(A + "d2n-pair.jpg", "p_brush", 1000, 700, crop_focus=0.35)
top(A + "cup-tilt-hi.jpg", "p_cup", 1000, 700)
top(A + "slipper-trio.jpg", "p_slipper", 1000, 700)
