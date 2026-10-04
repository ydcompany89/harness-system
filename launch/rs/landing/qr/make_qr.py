"""채널별 QR 생성: python3 make_qr.py  (pip install "qrcode[pil]")
주소를 바꾸면 BASE만 수정. QR은 영구 인쇄용이라 문구는 시기와 무관하게 고정."""
import qrcode, qrcode.image.svg
from PIL import Image, ImageDraw, ImageFont
BASE = 'https://rharashoe.netlify.app/'
F = '../../design/hangtag/fonts/NotoSansKR-%d.ttf'
CH = [('hangtag', '행택'), ('kintex', '킨텍스 부스'), ('coex', '코엑스 서디페 부스'), ('flyer', '리플렛·명함'), ('box', '제품 박스')]
for src, label in CH:
    url = f'{BASE}?src={src}'
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=24, border=4); q.add_data(url); q.make(fit=True)
    im = q.make_image(fill_color='#0B0B0B', back_color='white').convert('RGB')
    W = im.width; c = Image.new('RGB', (W, W + 170), 'white'); c.paste(im, (0, 0)); d = ImageDraw.Draw(c)
    f = ImageFont.truetype(F % 900, 44); f2 = ImageFont.truetype(F % 400, 30)
    t = 'RhaRa Shoe · Made for Standing.'; d.text(((W - d.textlength(t, font=f)) / 2, W - 20), t, font=f, fill='#0B0B0B')
    t2 = f'{label} · {url.replace("https://", "")}'; d.text(((W - d.textlength(t2, font=f2)) / 2, W + 60), t2, font=f2, fill='#8C8C86')
    c.save(f'qr-{src}.png')
    qrcode.make(url, image_factory=qrcode.image.svg.SvgPathImage).save(f'qr-{src}.svg')
    print(src, url)
