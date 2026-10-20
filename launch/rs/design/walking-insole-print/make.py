"""워킹화 갈색 안창(깔창) 위 RS 로고 + MADE IN KOREA + 사이즈 인쇄 시안 (대표 요청 10/20)"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import sys
K = 4
here = 'launch/rs/design/walking-insole-print/'
base = Image.open(here + 'src-brown-insole.png').convert('RGB').resize((260 * K, 266 * K), Image.LANCZOS)
logo = Image.open('launch/rs/design/fair-print/assets/rs-logo-white.png').convert('RGBA')
F = lambda s, w=700: ImageFont.truetype(f'/root/.fonts/NotoSansKR-{w}.ttf', s)
size = sys.argv[1] if len(sys.argv) > 1 else '270'

def stamp(cx, cy, ang):
    W, H = 100 * K, 120 * K
    L = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    lw = 38 * K
    lg = logo.resize((lw, int(logo.height * lw / logo.width)), Image.LANCZOS)
    L.paste(lg, ((W - lw) // 2, 0), lg)
    d = ImageDraw.Draw(L)
    y = lg.height + 6 * K
    for t, f in (('MADE IN KOREA', F(6 * K, 700)), (f'{size}mm', F(9 * K, 900))):
        tw = d.textlength(t, font=f)
        d.text(((W - tw) / 2, y), t, font=f, fill=(255, 255, 255, 255))
        y += f.size + 3 * K
    L.putalpha(L.split()[3].point(lambda v: int(v * 0.8)))   # 인쇄 느낌: 살짝 투명
    L = L.rotate(ang, resample=Image.BICUBIC, expand=True).filter(ImageFilter.GaussianBlur(0.6))
    base.paste(L, (int(cx * K - L.width / 2), int(cy * K - L.height / 2)), L)

stamp(63, 200, 1.5)    # 왼쪽 — 뒤꿈치 쪽
stamp(193, 203, -3)    # 오른쪽
base.save(here + f'안창인쇄_시안_{size}mm.png')
