"""RS 로고 + 패키지 워드마크(RHARA SHOE 라라슈) 세로 락업 → assets/rs-lockup-{lime,ink,white}.png (+ 워드마크 단독 rs-wordmark-*.png)
패키지 시안(package-draft-2026-10)과 동일: 로고 아래, 로고 폭에 맞춘 한 줄 워드마크 (영문 Poppins SemiBold + 국문 Noto Sans KR Bold)"""
import os
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); A = lambda f: os.path.join(HERE, 'assets', f)
EN = ImageFont.truetype(A('poppins-600.woff2'), 400)
KO = ImageFont.truetype(os.path.join(HERE, 'fonts/NotoSansKR-700.ttf'), 380)

def wordmark(rgb):
    en, ko, gap = 'RHARA SHOE', '라라슈', 110
    we = int(EN.getlength(en)); wk = int(KO.getlength(ko))
    im = Image.new('RGBA', (we + gap + wk + 40, 640), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.text((20, 320), en, font=EN, fill=rgb, anchor='lm')
    d.text((20 + we + gap, 320), ko, font=KO, fill=rgb, anchor='lm')
    return im.crop(im.getbbox())

for name, rgb in (('lime', (198, 244, 50)), ('ink', (13, 13, 13)), ('white', (255, 255, 255))):
    lg = Image.open(A(f'rs-logo-{name}.png')).convert('RGBA'); lg = lg.crop(lg.getbbox()); lg = lg.resize((lg.width * 4, lg.height * 4), Image.LANCZOS)   # 인쇄용 4배
    wm = wordmark(rgb); wm = wm.resize((lg.width, round(wm.height * lg.width / wm.width)), Image.LANCZOS)
    gap = round(lg.height * .13)
    out = Image.new('RGBA', (lg.width, lg.height + gap + wm.height), (0, 0, 0, 0))
    out.alpha_composite(lg, (0, 0)); out.alpha_composite(wm, (0, lg.height + gap))
    out.save(A(f'rs-lockup-{name}.png')); wm.save(A(f'rs-wordmark-{name}.png')); print(name, out.size, wm.size)
