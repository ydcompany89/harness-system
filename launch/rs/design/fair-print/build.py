"""박람회 인쇄물 일괄 생성 (메가쇼 11/12~15 · 서디페 11/26~29 공용)
python3 build.py  →  *.html (칼선 포함/제외 2벌)  →  node render.mjs  →  out/*.pdf, out/*.png
치수 단위 mm. 인쇄면 = 재단 + 도련(bleed). 칼선본(_dieline)은 마젠타=칼선, 시안 점선=접는선, 초록 점선=안전선.
"""
import json, os, cv2, numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
A = 'assets/'
INK, CHAR, LIME, OLIVE, CREAM, MUTE, WHITE = '#0D0D0D', '#232323', '#C6F432', '#3D4A12', '#F5F2EC', '#8A8A86', '#FFFFFF'

CO = dict(
    name='신동규', title='대표이사', co='㈜알앤디메이커스', brand='RS · RhaRa Shoe · 라라슈',
    tel='010-6880-2516', cs='0507-1317-2516', mail='rndceo@rndmakers.kr', web='www.rndmakers.kr',
    ig='@rharashoe', land='rharashoe.netlify.app', addr='대전광역시 유성구 국제과학7로 8')

CSS = f"""
@font-face{{font-family:N;font-weight:400;src:url(fonts/NotoSansKR-400.ttf)}}
@font-face{{font-family:N;font-weight:700;src:url(fonts/NotoSansKR-700.ttf)}}
@font-face{{font-family:N;font-weight:900;src:url(fonts/NotoSansKR-900.ttf)}}
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{background:#777}}
body{{font-family:N,sans-serif;color:{INK};-webkit-print-color-adjust:exact;print-color-adjust:exact;line-height:1.3;letter-spacing:-.01em}}
.page{{position:relative;overflow:hidden;background:{WHITE};break-after:page;margin:0 auto 10mm}}
@media print{{html,body{{background:#fff}}.page{{margin:0}}}}
.abs{{position:absolute}}
.lines{{position:absolute;left:0;top:0;z-index:99;pointer-events:none}}
.cut{{fill:none;stroke:#FF00FF;stroke-width:.3}}
.fold{{fill:none;stroke:#00B7EB;stroke-width:.3;stroke-dasharray:2 1.4}}
.guide{{fill:none;stroke:#00A651;stroke-width:.25;stroke-dasharray:1 1}}
.lbl{{font:2.6px N;fill:#00A0D0}}
.lime{{color:{LIME}}}.olive{{color:{OLIVE}}}.mute{{color:{MUTE}}}.w{{color:#fff}}
.dots{{display:flex;gap:var(--g)}}.dots i{{display:block;width:var(--d);height:var(--d);border-radius:50%;background:{LIME}}}
img{{display:block}}
"""

def dots(d, g, n=4, col=LIME):
    return f'<div class="dots" style="--d:{d}mm;--g:{g}mm">' + ''.join(f'<i style="background:{col}"></i>' for _ in range(n)) + '</div>'

def logo(h, col='lime'):
    return f'<img src="{A}rs-logo-{col}.png" style="height:{h}mm">'

WM_R = (lambda im: im.height / im.width)(Image.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets/rs-wordmark-lime.png')))   # 워드마크 높이/폭

def lockup(h, col='lime'):
    """RS 로고 + 패키지 워드마크(RHARA SHOE 라라슈) 세로 락업 — h = 로고 높이 (make_lockup.py 로 생성)"""
    return f'<img src="{A}rs-lockup-{col}.png" style="height:{h * 1.25:.1f}mm">'

def qr(name, s):
    return f'<img src="{A}qr-{name}.svg" style="width:{s}mm;height:{s}mm;background:#fff;padding:{s*0.04}mm">'

def page(w, h, body, bg=WHITE, lines=''):
    svg = f'<svg class="lines" width="{w}mm" height="{h}mm" viewBox="0 0 {w} {h}">{lines}</svg>' if lines else ''
    return f'<div class="page" style="width:{w}mm;height:{h}mm;background:{bg}">{body}{svg}</div>'

def trim_rect(w, h, b, r=0):
    """칼선(재단선) + 안전선 3mm"""
    s = f'<rect class="cut" x="{b}" y="{b}" width="{w-2*b}" height="{h-2*b}" rx="{r}"/>'
    s += f'<rect class="guide" x="{b+3}" y="{b+3}" width="{w-2*b-6}" height="{h-2*b-6}"/>'
    return s

def write(name, size, pages, title):
    """pages: list of (html_body, bg, lines_svg)"""
    w, h = size
    for variant in ('dieline', 'art'):
        body = ''.join(page(w, h, b, bg, l if variant == 'dieline' else '') for b, bg, l in pages)
        html = f'<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>{title}</title>{FONT_LINKS if name.startswith('06_') else ''}<style>@page{{size:{w}mm {h}mm;margin:0}}{CSS}</style></head><body>{body}</body></html>'
        open(os.path.join(HERE, f'{name}_{variant}.html'), 'w').write(html)
    MANIFEST.append(dict(name=name, w=w, h=h, pages=len(pages), title=title))

MANIFEST = []

# ───────────────────────── 1. 명함 2종 (90×50, 도련 2) ─────────────────────────
def cards():
    B, W, H = 2, 94, 54
    tr = trim_rect(W, H, B, 0)
    front_dark = f'''
      <div class="abs" style="left:9mm;top:9mm">{logo(14)}</div>
      <div class="abs w" style="left:9mm;top:27mm;font-size:8pt;font-weight:900">RhaRa Shoe · 라라슈</div>
      <div class="abs" style="left:9mm;top:41mm;font-size:6.5pt;font-weight:700;color:{LIME}">Made for Standing.</div>
      <div class="abs" style="right:9mm;top:10mm">{dots(3.2,2.2)}</div>'''
    # A: 대표 명함
    back_a = f'''
      <div class="abs" style="left:9mm;top:9mm;font-size:13pt;font-weight:900">{CO["name"]}</div>
      <div class="abs" style="left:9mm;top:16.5mm;font-size:6.5pt;font-weight:700" class="olive">{CO["title"]}  ·  {CO["co"]}</div>
      <div class="abs mute" style="left:9mm;top:21mm;font-size:5.6pt;font-weight:700">RS 라라슈 · 리사이클플레이</div>
      <div class="abs" style="left:9mm;top:29mm;font-size:6.2pt;line-height:1.55">
        <b>T</b>  {CO["tel"]}<br><b>E</b>  {CO["mail"]}<br><b>A</b>  {CO["addr"]}<br><b>W</b>  {CO["web"]}  ·  IG {CO["ig"]}</div>
      <div class="abs" style="right:8mm;top:9mm">{dots(2.2,1.4)}</div>
      <div class="abs" style="right:8mm;bottom:8mm">{qr("flyer",13)}</div>'''
    write('01_namecard_A_ceo', (W, H), [(front_dark, INK, tr), (back_a, WHITE, tr)], '명함 A 대표 (90x50)')
    # B: 브랜드 공용(고객·바이어 배포용)
    front_b = f'''
      <div class="abs" style="left:9mm;top:9mm">{logo(10,'ink')}</div>
      <div class="abs" style="left:9mm;top:23mm;font-size:12.5pt;font-weight:900;line-height:1.25">발이 편해야,<br>일이 편하다.</div>
      <div class="abs" style="left:9mm;top:41mm;font-size:6pt;font-weight:700">쿼드그립 종일편한 워킹화 · 아치가득 인솔</div>'''
    back_b = f'''
      <div class="abs w" style="left:9mm;top:9mm;font-size:9pt;font-weight:900">오픈 알림 · 단체 구매 문의</div>
      <div class="abs" style="left:9mm;top:15.5mm;font-size:6pt;color:#cfcfcf">QR로 신청하시면 오픈 혜택을 먼저 알려드립니다.</div>
      <div class="abs w" style="left:9mm;top:27mm;font-size:6.2pt;line-height:1.6">
        <b class="lime">고객센터</b>  {CO["cs"]}<br><b class="lime">Instagram</b>  {CO["ig"]}<br><b class="lime">Web</b>  {CO["land"]}</div>
      <div class="abs" style="right:8mm;top:9mm">{qr("flyer",22)}</div>
      <div class="abs" style="right:8mm;bottom:7mm">{dots(1.8,1.2)}</div>'''
    write('02_namecard_B_brand', (W, H), [(front_b, LIME, tr), (back_b, INK, tr)], '명함 B 브랜드 공용 (90x50)')

# ───────────────────────── 2. 테이블 사인 (A4 텐트형) ─────────────────────────
def table_sign():
    B, W, H = 3, 216, 303
    y1, y2, y3 = B + 120, B + 240, B + 290   # 면1 | 면2 | 바닥 50 | 풀칠 7
    lines = trim_rect(W, H, B) + ''.join(f'<line class="fold" x1="{B}" y1="{y}" x2="{W-B}" y2="{y}"/>' for y in (y1, y2, y3))
    lines += f'<text class="lbl" x="{B+2}" y="{y2+25}">바닥면 (무인쇄 가능)</text><text class="lbl" x="{B+2}" y="{y3+4.5}">풀칠 날개 7mm</text>'
    face = lambda rot: f'''<div class="abs" style="left:{B}mm;top:{B + (0 if rot else 120)}mm;width:210mm;height:120mm;background:{INK};transform:rotate({180 if rot else 0}deg)">
        <div class="abs" style="left:14mm;top:13mm">{logo(11)}</div>
        <div class="abs" style="right:14mm;top:15mm">{dots(4,3)}</div>
        <div class="abs w" style="left:14mm;top:38mm;font-size:30pt;font-weight:900;line-height:1.15">직접 신어보세요</div>
        <div class="abs" style="left:14mm;top:62mm;font-size:13pt;font-weight:700;color:{LIME}">사이즈 230 ~ 280 · 시착 가능</div>
        <div class="abs w" style="left:14mm;top:84mm;font-size:10pt;line-height:1.5">쿼드그립 종일편한 워킹화<br><span style="color:#bbb">발이 편해야, 일이 편하다.</span></div>
        <div class="abs" style="right:14mm;bottom:12mm;text-align:center">{qr("kintex",28)}<div style="font-size:7pt;color:#ddd;margin-top:1.5mm">오픈 알림 신청</div></div></div>'''
    body = face(True) + face(False) + f'<div class="abs" style="left:0;top:{y2}mm;width:{W}mm;height:{H-y2}mm;background:{CHAR}"></div>'
    write('03_table_sign_tent', (W, H), [(body, INK, lines)], '테이블 사인 텐트형 (A4, 접어서 삼각)')

# ───────────────────────── 3. 제품 라벨·가격표 (A4) ─────────────────────────
def price_labels():
    B, W, H = 3, 216, 303
    tr = trim_rect(W, H, B)
    def lab(img, name, eng, head, pts, opt, price):
        li = ''.join(f'<li style="margin-bottom:3mm"><b style="color:{OLIVE}">●</b> {p}</li>' for p in pts)
        return f'''
        <div class="abs" style="left:0;top:0;width:{W}mm;height:118mm;background:{CREAM}"></div>
        <div class="abs" style="left:18mm;top:16mm">{logo(9,'ink')}</div>
        <div class="abs" style="right:18mm;top:18mm">{dots(3.5,2.5)}</div>
        <img class="abs" src="{A}{img}" style="left:50%;top:30mm;transform:translateX(-50%);height:82mm;object-fit:contain">
        <div class="abs" style="left:18mm;top:128mm;font-size:9pt;font-weight:700;letter-spacing:.15em" class="mute">{eng}</div>
        <div class="abs" style="left:18mm;top:135mm;font-size:27pt;font-weight:900;line-height:1.15">{name}</div>
        <div class="abs" style="left:18mm;top:153mm;font-size:13pt;font-weight:700;color:{OLIVE}">{head}</div>
        <ul class="abs" style="left:18mm;top:168mm;width:180mm;list-style:none;font-size:11.5pt">{li}</ul>
        <div class="abs mute" style="left:18mm;top:206mm;font-size:10pt">{opt}</div>
        <div class="abs" style="left:18mm;top:222mm;width:180mm;height:.4mm;background:{INK}"></div>
        <div class="abs" style="left:18mm;top:230mm;font-size:11pt;font-weight:700">정가</div>
        <div class="abs" style="left:18mm;top:237mm;font-size:40pt;font-weight:900;line-height:1">{price}<span style="font-size:18pt">원</span></div>
        <div class="abs" style="right:18mm;top:228mm;width:84mm;height:44mm;border:.8mm solid {INK};border-radius:3mm;background:{LIME};padding:4mm 5mm">
          <div style="font-size:12pt;font-weight:900">박람회 현장가</div>
          <div style="position:absolute;right:5mm;bottom:5mm;font-size:20pt;font-weight:900">원</div></div>
        <div class="abs mute" style="left:18mm;bottom:12mm;font-size:8pt">RS · RhaRa Shoe  ·  {CO["co"]}  ·  국내 제조</div>'''
    w = lab('walking-cut.png', '쿼드그립 종일편한 워킹화', 'QUAD GRIP WORKING SHOE', '서서 일하는 사람의 신발은, 바닥부터 달라야 한다.',
            ['밑창 4곳 쿼드그립 패드 (폐타이어 재생고무)', '깔창 없는 일체형 안창 · E-실리폴리렌', '도톰한 발목 테두리'],
            '사이즈 230 ~ 280 (10mm 단위)  ·  차콜 / 그레이 / 민트화이트', '42,500')
    i = lab('insole-cut.png', '쿼드그립 아치가득 인솔', 'QUAD GRIP ARCH INSOLE', '신던 신발은 그대로, 바닥만 새로.',
            ['아치 라인을 따라 가득 채운 형태', '뒤꿈치를 감싸는 컵 구조', '우드칩 배합 E-실리폴리렌'],
            '사이즈 M / L  ·  가지고 계신 운동화·구두에 넣어 쓰세요', '21,500')
    write('04_price_label_A4', (W, H), [(w, WHITE, tr), (i, WHITE, tr)], '제품 라벨·가격표 A4 (워킹화 / 인솔)')

# ───────────────────────── 4. 웰컴 쇼핑백 (W250 × H330 × D100) ─────────────────────────
def shopping_bag():
    M, Wp, Dp, Hp, TOP, BOT, GL = 15, 250, 100, 330, 40, 65, 20
    W = 2 * M + 2 * Wp + 2 * Dp + GL
    H = 2 * M + TOP + Hp + BOT
    x = [M, M + Wp, M + Wp + Dp, M + 2 * Wp + Dp, M + 2 * Wp + 2 * Dp, M + 2 * Wp + 2 * Dp + GL]  # 앞|옆|뒤|옆|풀칠
    yT, yB, yE = M + TOP, M + TOP + Hp, M + TOP + Hp + BOT
    cut = f'<path class="cut" d="M{x[0]},{M} H{x[4]} L{x[5]},{M+8} V{yE-8} L{x[4]},{yE} H{x[0]} Z"/>'
    cut += ''.join(f'<line class="cut" x1="{xx}" y1="{yB}" x2="{xx}" y2="{yE}"/>' for xx in x[1:5])
    fold = ''.join(f'<line class="fold" x1="{xx}" y1="{M}" x2="{xx}" y2="{yB}"/>' for xx in x[1:5])
    fold += f'<line class="fold" x1="{x[0]}" y1="{yT}" x2="{x[4]}" y2="{yT}"/><line class="fold" x1="{x[0]}" y1="{yB}" x2="{x[4]}" y2="{yB}"/>'
    for gc in (x[1] + Dp / 2, x[3] + Dp / 2):  # 옆판 가운데 접힘 + 바닥 사선
        fold += f'<line class="fold" x1="{gc}" y1="{yT}" x2="{gc}" y2="{yB-Dp/2}"/>'
        fold += f'<line class="fold" x1="{gc-Dp/2}" y1="{yB}" x2="{gc}" y2="{yB-Dp/2}"/><line class="fold" x1="{gc+Dp/2}" y1="{yB}" x2="{gc}" y2="{yB-Dp/2}"/>'
    holes = ''.join(f'<circle class="cut" cx="{cx}" cy="{cy}" r="2.5"/>' for cx in (x[0] + 85, x[0] + 165, x[2] + 85, x[2] + 165) for cy in (yT + 25, yT - 25))
    lbl = f'<text class="lbl" x="{x[0]+3}" y="{M+8}">윗면 접어넣기 40mm (안쪽)</text><text class="lbl" x="{x[0]+3}" y="{yB+10}">바닥 날개 {BOT}mm</text><text class="lbl" x="{x[4]+2}" y="{yT+20}">풀칠</text>'
    lines = cut + fold + holes + lbl + f'<rect class="guide" x="{x[0]+5}" y="{yT+5}" width="{Wp-10}" height="{Hp-10}"/>'
    b = 3
    body = f'<div class="abs" style="left:{x[0]-b}mm;top:{M-b}mm;width:{x[5]-x[0]+2*b}mm;height:{yE-M+2*b}mm;background:{INK}"></div>'
    for sx in (x[1], x[3]):
        body += f'<div class="abs" style="left:{sx}mm;top:{M-b}mm;width:{Dp}mm;height:{yB-M+b}mm;background:{LIME}"></div>'
        body += f'<div class="abs" style="left:{sx+Dp/2}mm;top:{yT+Hp/2}mm;transform:translate(-50%,-50%) rotate(-90deg);font-size:20pt;font-weight:900;white-space:nowrap">Made for Standing.</div>'
    # 앞판
    body += f'''<div class="abs" style="left:{x[0]+28}mm;top:{yT+40}mm">{logo(40)}</div>
      <div class="abs w" style="left:{x[0]+28}mm;top:{yT+95}mm;font-size:16pt;font-weight:900">RhaRa Shoe · 라라슈</div>
      <div class="abs" style="left:{x[0]+28}mm;top:{yT+255}mm">{dots(16,10)}</div>
      <div class="abs" style="left:{x[0]+28}mm;top:{yT+285}mm;font-size:12pt;font-weight:700;color:{LIME}">Made for Standing.</div>'''
    # 뒤판
    body += f'''<div class="abs w" style="left:{x[2]+28}mm;top:{yT+60}mm;font-size:30pt;font-weight:900;line-height:1.2">발이 편해야,<br>일이 편하다.</div>
      <div class="abs" style="left:{x[2]+28}mm;top:{yT+150}mm;font-size:11pt;color:#cfcfcf;line-height:1.6">서서 일하는 사람을 위한 신발<br>쿼드그립 종일편한 워킹화 · 아치가득 인솔</div>
      <div class="abs" style="left:{x[2]+28}mm;top:{yT+235}mm">{qr("flyer",36)}</div>
      <div class="abs w" style="left:{x[2]+72}mm;top:{yT+245}mm;font-size:10pt;line-height:1.6">{CO["ig"]}<br>{CO["land"]}</div>
      <div class="abs" style="left:{x[2]+28}mm;top:{yT+290}mm;font-size:9pt;color:#9a9a9a">{CO["co"]}  ·  이 쇼핑백은 다시 쓰라고 튼튼하게 만들었습니다.</div>'''
    write('05_welcome_bag', (W, H), [(body, WHITE, lines)], '웰컴 쇼핑백 W250×H330×D100 전개도')
    return W, H

# ───────────────────────── 5. 리플렛 A4 3단 (C접지) ─────────────────────────
def leaflet():
    B, W, H = 3, 303, 216
    P = [97, 100, 100]   # 바깥면: 안접힘날개 | 뒷면 | 표지
    Q = [100, 100, 97]   # 안쪽면
    def lines(widths):
        xs, s = [], B
        for wd in widths[:-1]:
            s += wd; xs.append(s)
        return trim_rect(W, H, B) + ''.join(f'<line class="fold" x1="{xx}" y1="{B}" x2="{xx}" y2="{H-B}"/>' for xx in xs) + \
            ''.join(f'<rect class="guide" x="{xx-4}" y="{B+3}" width="8" height="{H-2*B-6}"/>' for xx in xs)
    o0, o1, o2 = B, B + 97, B + 197
    out = f'''
      <div class="abs" style="left:0;top:0;width:{o1}mm;height:{H}mm;background:{CREAM}"></div>
      <div class="abs" style="left:{o0+10}mm;top:18mm;font-size:8pt;font-weight:700;letter-spacing:.15em" class="olive">FOR TEAMS</div>
      <div class="abs" style="left:{o0+10}mm;top:25mm;font-size:17pt;font-weight:900;line-height:1.25">유니폼은 맞췄는데,<br>신발은요?</div>
      <div class="abs" style="left:{o0+10}mm;top:52mm;width:76mm;font-size:8.5pt;line-height:1.65">급식실 · 주방 · 매장 · 병원 미화팀처럼<br>하루를 서서 보내는 팀을 위해<br>단체 구매를 따로 안내합니다.</div>
      <ul class="abs" style="left:{o0+10}mm;top:88mm;width:76mm;list-style:none;font-size:8.5pt;line-height:1.9">
        <li>✓ 수량별 개별 견적</li><li>✓ 사이즈 혼합 주문</li><li>✓ 팀 로고 각인 상담</li><li>✓ 세금계산서 발행</li></ul>
      <div class="abs" style="left:{o0+10}mm;top:150mm">{qr("flyer",30)}</div>
      <div class="abs" style="left:{o0+44}mm;top:155mm;font-size:8pt;line-height:1.6"><b>단체 구매 문의</b><br>{CO["cs"]}<br>{CO["mail"]}</div>

      <div class="abs" style="left:{o1}mm;top:0;width:100mm;height:{H}mm;background:{WHITE}"></div>
      <div class="abs" style="left:{o1+10}mm;top:18mm;font-size:8pt;font-weight:700;letter-spacing:.15em" class="olive">MAKER</div>
      <div class="abs" style="left:{o1+10}mm;top:25mm;font-size:15pt;font-weight:900">{CO["co"]}</div>
      <div class="abs" style="left:{o1+10}mm;top:36mm;width:80mm;font-size:8.3pt;line-height:1.7">폐타이어 고무와 실크벽지 PVC를<br>다시 신발로 만드는 새활용 제조사입니다.<br>대형 생활용품 매장에 욕실화를 납품해 왔고,<br>서서 일하는 사람을 위한 신발 RS를 만듭니다.</div>
      <div class="abs" style="left:{o1+10}mm;top:76mm;width:80mm;font-size:7.8pt;line-height:1.75">
        <b>2023</b>  창업진흥원 국가과제 · 다이소 전국 매장 입점<br><b>2024</b>  환경부 새활용 지원사업 · 오피스디포 납품<br><b>2025</b>  롯데패키징앤솔루션 · 서브원 납품<br><b>2026</b>  환경부 새활용 지원사업 2차 · RS 라라슈 런칭</div>
      <div class="abs" style="left:{o1+10}mm;top:122mm;width:80mm;height:.3mm;background:{INK}"></div>
      <div class="abs" style="left:{o1+10}mm;top:128mm;font-size:8pt;line-height:1.75">T  {CO["cs"]}<br>E  {CO["mail"]}<br>A  {CO["addr"]}<br>W  {CO["web"]}<br>IG  {CO["ig"]}</div>
      <div class="abs mute" style="left:{o1+10}mm;top:190mm;font-size:6.5pt">환경부 새활용 산업 육성 지원사업 수행 기업 (인증 아님)</div>

      <div class="abs" style="left:{o2}mm;top:0;width:{W-o2}mm;height:{H}mm;background:{INK}"></div>
      <div class="abs" style="left:{o2+12}mm;top:20mm">{logo(18)}</div>
      <div class="abs w" style="left:{o2+12}mm;top:44mm;font-size:9pt;font-weight:700">RhaRa Shoe · 라라슈</div>
      <img class="abs" src="{A}walking-cut.png" style="left:{o2+18}mm;top:58mm;width:64mm">
      <div class="abs w" style="left:{o2+12}mm;top:150mm;font-size:18pt;font-weight:900;line-height:1.25">발이 편해야,<br>일이 편하다.</div>
      <div class="abs" style="left:{o2+12}mm;top:176mm;font-size:8.5pt;color:{LIME};font-weight:700">쿼드그립 종일편한 워킹화 · 아치가득 인솔</div>
      <div class="abs" style="left:{o2+12}mm;top:192mm">{dots(3.2,2.2)}</div>'''
    i0, i1, i2 = B, B + 100, B + 200
    inside = f'''
      <div class="abs" style="left:0;top:0;width:{i1}mm;height:{H}mm;background:{WHITE}"></div>
      <div class="abs" style="left:{i0+10}mm;top:16mm;font-size:8pt;font-weight:700;letter-spacing:.15em" class="olive">01 · WORKING SHOE</div>
      <div class="abs" style="left:{i0+10}mm;top:23mm;font-size:16pt;font-weight:900;line-height:1.25">쿼드그립<br>종일편한 워킹화</div>
      <div class="abs" style="left:{i0+10}mm;top:43mm;width:80mm;font-size:8.5pt;font-weight:700;color:{OLIVE}">서서 일하는 사람의 신발은, 바닥부터 달라야 한다.</div>
      <img class="abs" src="{A}walking-cut.png" style="left:{i0+18}mm;top:52mm;width:64mm">
      <div class="abs" style="left:{i0+10}mm;top:132mm;width:82mm;font-size:8.3pt;line-height:1.7">
        <b>쿼드그립 4점 패드</b> — 밑창 4곳에 그립 패드를 끼워 넣었습니다.<br>
        <b>깔창 없는 일체형</b> — E-실리폴리렌으로 안창까지 한 몸. 따로 빠지는 깔창이 없습니다.<br>
        <b>도톰한 발목 테두리</b> — 입구 테두리를 더 두껍게 둘렀습니다.</div>
      <div class="abs mute" style="left:{i0+10}mm;top:194mm;font-size:7.5pt">230~280 · 차콜 / 그레이 / 민트화이트 · 국내 제조</div>

      <div class="abs" style="left:{i1}mm;top:0;width:100mm;height:{H}mm;background:{INK}"></div>
      <div class="abs" style="left:{i1+10}mm;top:16mm;font-size:8pt;font-weight:700;letter-spacing:.15em;color:{LIME}">02 · QUAD GRIP</div>
      <div class="abs w" style="left:{i1+10}mm;top:23mm;font-size:16pt;font-weight:900;line-height:1.25">From Road<br>to Floor.</div>
      <div class="abs" style="left:{i1+10}mm;top:44mm;font-size:8.5pt;color:#cfcfcf">도로를 달리던 고무, 주방 바닥으로.</div>
      <img class="abs" src="{A}outsole.jpg" style="left:{i1+6}mm;top:56mm;width:88mm">
      <div class="abs w" style="left:{i1+10}mm;top:96mm;width:82mm;font-size:8.3pt;line-height:1.75">
        그립 패드 4개는 폐타이어에서 나온 재생고무에<br>실크벽지에서 분리한 재생 PVC를 배합해 만듭니다.<br><br>
        발이 바닥에 닿는 순서(뒤꿈치 → 발 중간 → 발볼 → 앞꿈치)를 따라 네 곳에 배치했습니다.</div>
      <div class="abs" style="left:{i1+10}mm;top:150mm;display:flex;gap:4mm">
        <img src="{A}rs-badge-tire.svg" style="width:20mm"><img src="{A}rs-badge-wallpaper.svg" style="width:20mm"><img src="{A}rs-badge-quadgrip.svg" style="width:20mm"></div>
      <div class="abs" style="left:{i1+10}mm;top:182mm;font-size:7pt;color:#9a9a9a">환경부 새활용 산업 육성 지원사업 수행 기업이 만들었습니다.</div>

      <div class="abs" style="left:{i2}mm;top:0;width:{W-i2}mm;height:{H}mm;background:{CREAM}"></div>
      <div class="abs" style="left:{i2+10}mm;top:16mm;font-size:8pt;font-weight:700;letter-spacing:.15em" class="olive">03 · ARCH INSOLE</div>
      <div class="abs" style="left:{i2+10}mm;top:23mm;font-size:16pt;font-weight:900;line-height:1.25">쿼드그립<br>아치가득 인솔</div>
      <div class="abs" style="left:{i2+10}mm;top:43mm;font-size:8.5pt;font-weight:700;color:{OLIVE}">신던 신발은 그대로, 바닥만 새로.</div>
      <img class="abs" src="{A}insole-cut.png" style="left:{i2+14}mm;top:56mm;width:68mm">
      <div class="abs" style="left:{i2+10}mm;top:122mm;width:78mm;font-size:8.3pt;line-height:1.7">
        <b>아치가득 구조</b> — 발 아치 라인을 따라 채운 형태<br><b>뒤꿈치 컵</b> — 뒤꿈치를 감싸는 컵 모양<br><b>우드칩 배합</b> — 목공소 자투리 우드칩을 E-실리폴리렌에</div>
      <div class="abs" style="left:{i2+10}mm;top:166mm;font-size:7.8pt;line-height:1.6">가지고 계신 운동화·구두에 넣어 쓰세요.<br><span class="mute">워킹화에는 깔창이 필요 없습니다.</span></div>
      <div class="abs mute" style="left:{i2+10}mm;top:194mm;font-size:7.5pt">사이즈 M / L · 현장가는 부스에서 안내</div>'''
    write('06_leaflet_A4_3fold', (W, H), [(out, WHITE, lines(P)), (inside, WHITE, lines(Q))], '리플렛 A4 3단 C접지 (1p 바깥 · 2p 안쪽)')

# ───────────────────────── 6. X배너 600×1800 ×2 ─────────────────────────
def col(inner, top, bottom, pad, w):
    return f'<div class="abs" style="left:{pad}mm;top:{top}mm;width:{w-2*pad}mm;height:{bottom-top}mm;display:flex;flex-direction:column;justify-content:space-between">{inner}</div>'

def xbanners():
    W, H = 600, 1800
    gl = trim_rect(W, H, 0) + ''.join(f'<circle class="cut" cx="{cx}" cy="{cy}" r="6"/>' for cx in (25, W - 25) for cy in (25, H - 25)) + \
        f'<rect class="guide" x="40" y="60" width="{W-80}" height="{H-120}"/><text class="lbl" x="45" y="56" style="font-size:12px">아일렛(타공) 4곳 · 안전영역 40mm</text>'
    a = col(f'''<div>{logo(80)}<div class="w" style="font-size:60pt;font-weight:900;margin-top:12mm">RhaRa Shoe · 라라슈</div></div>
      <div class="w" style="font-size:190pt;font-weight:900;line-height:1.1">서서 일하는<br>사람의<br>신발은,<br><span style="color:{LIME}">바닥부터</span><br>달라야 한다.</div>
      <div style="height:330mm"></div>
      <div><div style="font-size:110pt;font-weight:900;color:{LIME}">QUAD GRIP</div>
      <div class="w" style="font-size:66pt;font-weight:700;line-height:1.45;margin-top:6mm">밑창 4곳 쿼드그립 패드<br>깔창 없는 일체형 안창<br>국내에서 만듭니다</div></div>
      <div class="w" style="font-size:62pt;font-weight:900">쿼드그립 종일편한 워킹화</div>''', 90, 1720, 55, W)
    a = f'<img class="abs" src="{A}outsole-studio.jpg" style="left:0;top:905mm;width:600mm;height:360mm;object-fit:cover">' + a
    b = col(f'''<div>{logo(80,'ink')}</div>
      <div style="font-size:190pt;font-weight:900;line-height:1.1">신던<br>신발은<br>그대로,<br><span style="color:{OLIVE}">바닥만<br>새로.</span></div>
      <img src="{A}insole-cut.png" style="width:440mm;align-self:center">
      <div><div style="font-size:100pt;font-weight:900;color:{OLIVE}">ARCH INSOLE</div>
      <div style="font-size:64pt;font-weight:700;line-height:1.45;margin-top:6mm">아치 라인을 따라 가득<br>뒤꿈치를 감싸는 컵 구조</div></div>
      <div style="display:flex;align-items:center;gap:16mm">{qr("kintex",120)}<div style="font-size:56pt;line-height:1.4"><b>쿼드그립<br>아치가득 인솔</b><br>{CO["ig"]}</div></div>''', 90, 1720, 55, W)
    write('07_xbanner_600x1800', (W, H), [(a, INK, gl), (b, LIME, gl)], 'X배너 600×1800 (1 워킹화 / 2 인솔)')

# ───────────────────────── 7. 족자 900×2200 ×8 (판넬 1장=족자 1장) ─────────────────────────
def banners():
    W, H, POCKET = 900, 2200, 50
    gl = trim_rect(W, H, 0) + f'<line class="fold" x1="0" y1="{POCKET}" x2="{W}" y2="{POCKET}"/><line class="fold" x1="0" y1="{H-POCKET}" x2="{W}" y2="{H-POCKET}"/>' + \
        f'<rect class="guide" x="50" y="{POCKET+50}" width="{W-100}" height="{H-2*POCKET-100}"/>' + \
        f'<rect class="guide" x="0" y="1000" width="{W}" height="900" style="stroke:#F0A000"/><text class="lbl" x="55" y="{POCKET-12}" style="font-size:16px">봉 포켓 50mm (상·하)</text>' + \
        f'<text class="lbl" x="55" y="995" style="font-size:16px;fill:#C08000">핵심 시선 띠 1,000~1,900</text>'
    HL, SUB, BODY, SM = 'font-size:300pt;font-weight:900;line-height:1.08', 'font-size:120pt;font-weight:900;line-height:1.15', 'font-size:84pt;font-weight:700;line-height:1.4', 'font-size:60pt;line-height:1.45'
    def p(n, bg, inner, under=''):
        num = f'<div class="abs" style="right:70mm;top:110mm;font-size:40pt;font-weight:900;color:{MUTE}">{n:02d}/08</div>'
        return (under + num + col(inner, 170, 2080, 80, W), bg, gl)
    pages = [
        p(1, INK, f'''<div>{logo(300)}<div class="w" style="{SUB};margin-top:30mm">RhaRa Shoe<br>라라슈</div></div>
            <div style="{HL};font-size:240pt;color:{LIME}">Made<br>for<br>Standing.</div>
            {dots(110,60)}'''),
        p(2, INK, f'''<div class="w" style="{HL}">발이<br>편해야,<br><span style="color:{LIME}">일이<br>편하다.</span></div>
            <img src="{A}walking-cut.png" style="width:620mm;align-self:center">
            <div class="w" style="{BODY}">쿼드그립<br>종일편한 워킹화</div>'''),
        p(3, INK, f'''<div><div style="{SUB};color:{LIME}">POINT 01</div><div class="w" style="{HL}">QUAD<br>GRIP</div></div>
            <div class="w" style="{BODY}">밑창 4곳에<br>그립 패드를<br>끼워 넣었습니다.</div>
            <div style="height:640mm"></div>
            <div style="{SM};color:#bbb">딛는 순서대로<br>뒤꿈치 → 발볼 → 앞꿈치</div>''',
            f'<img class="abs" src="{A}outsole-studio.jpg" style="left:0;top:1180mm;width:900mm;height:640mm;object-fit:cover">'),
        p(4, CREAM, f'''<div><div style="{SUB};color:{OLIVE}">POINT 02</div><div style="{HL};font-size:230pt">깔창이<br>없습니다</div></div>
            <div style="{BODY}">E-실리폴리렌으로<br>안창까지 한 몸.</div>
            <div style="display:flex;gap:40mm"><img src="{A}rs-badge-onepiece.svg" style="width:320mm"><img src="{A}rs-badge-rebound.svg" style="width:320mm"></div>
            <div style="{SUB}">눌렀다,<br><span style="color:{OLIVE}">다시 돌아옵니다.</span></div>'''),
        p(5, LIME, f'''<div><div style="{SUB}">POINT 03</div><div style="{HL};font-size:270pt">MADE<br>IN<br>KOREA</div></div>
            <div style="{SUB}">국내에서<br>만듭니다</div>
            <div style="{BODY}">사출부터<br>패드 끼움,<br>검수까지</div>
            <div style="{SM}">대형 생활용품 매장에<br>욕실화를 납품해 온 제조사<br><b>{CO["co"]}</b></div>'''),
        p(6, INK, f'''<div class="w" style="{HL};font-size:250pt">From<br>Road<br>to <span style="color:{LIME}">Floor.</span></div>
            <div style="{SM};color:#cfcfcf">도로를 달리던 고무,<br>주방 바닥으로.</div>
            <div style="display:flex;flex-direction:column;gap:30mm">
              <div style="display:flex;align-items:center;gap:40mm"><img src="{A}rs-badge-tire.svg" style="width:230mm"><div class="w" style="{BODY};font-weight:900">폐타이어</div></div>
              <div style="display:flex;align-items:center;gap:40mm"><img src="{A}rs-badge-wallpaper.svg" style="width:230mm"><div class="w" style="{BODY};font-weight:900">실크벽지<br>PVC</div></div>
              <div style="display:flex;align-items:center;gap:40mm"><img src="{A}rs-badge-quadgrip.svg" style="width:230mm"><div style="{BODY};font-weight:900;color:{LIME}">그립 패드<br>4개</div></div></div>
            <div style="font-size:44pt;color:#9a9a9a;line-height:1.4">환경부 새활용 산업 육성 지원사업<br>수행 기업이 만들었습니다.</div>'''),
        p(7, CREAM, f'''<div><div style="{SUB};color:{OLIVE}">ARCH INSOLE</div><div style="{HL};font-size:250pt">신던<br>신발은<br>그대로,</div></div>
            <div style="{HL};font-size:250pt;color:{OLIVE}">바닥만<br>새로.</div>
            <img src="{A}insole-cut.png" style="width:640mm;align-self:center">
            <div style="{SM}"><b>쿼드그립 아치가득 인솔</b><br><span class="mute">가지고 계신 운동화·구두에</span></div>'''),
        p(8, INK, f'''<div><div style="{SUB};color:{LIME}">FOR TEAMS</div><div class="w" style="{HL};font-size:230pt">유니폼은<br>맞췄는데,<br><span style="color:{LIME}">신발은요?</span></div></div>
            <div class="w" style="{BODY}">급식실 · 주방 · 매장<br>단체 구매 · 수량별 견적</div>
            <div style="display:flex;align-items:flex-end;gap:30mm">{qr("kintex",380)}<div class="w" style="{SM}"><b>QR 문의</b><br>오픈 알림</div></div>
            <div class="w" style="{SM}">{CO["cs"]}  ·  {CO["ig"]}</div>'''),
    ]
    write('08_banner_900x2200_x8', (W, H), pages, '백월 족자 900×2200 ×8')

# ───────────────────────── 8. 레오 등신대 (높이 1,800) ─────────────────────────
def standee():
    LEO_H, OFF, BASE_H = 1600, 15, 230
    src = Image.open(os.path.join(HERE, '../film/reo-ep01/assets/reo-front.png')).convert('RGBA')
    lw = round(LEO_H * src.width / src.height)
    W = max(lw, 760) + 2 * OFF + 40
    H = LEO_H + 140 + 40
    up = src.resize((src.width * 4, src.height * 4), Image.LANCZOS)   # 4배 확대(임시) — 고해상도 원본 필요
    up.save(os.path.join(HERE, A, 'reo-front-4x.png'))
    lx, ly = (W - lw) / 2, 20
    bx, by, bw = (W - 760) / 2, ly + LEO_H - 90, 760
    # 마스크 1px = 1mm
    m = np.zeros((int(H), int(W)), np.uint8)
    al = np.array(src.resize((lw, LEO_H)).split()[3])
    m[int(ly):int(ly) + LEO_H, int(lx):int(lx) + lw] = (al > 40).astype(np.uint8) * 255
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * OFF + 1, 2 * OFF + 1))
    m = cv2.dilate(m, k)
    cv2.rectangle(m, (int(bx), int(by)), (int(bx + bw), int(by + BASE_H)), 255, -1)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (31, 31)))
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=cv2.contourArea)
    c = cv2.approxPolyDP(c, 0.8, True)[:, 0, :]
    path = 'M' + ' L'.join(f'{x},{y}' for x, y in c) + ' Z'
    lines = f'<path class="cut" d="{path}"/>'
    lines += f'<text class="lbl" x="20" y="{H-10}" style="font-size:14px">칼선 = 캐릭터 외곽 +15mm 흰 테두리 · 하단 받침(이젤 스탠드) 부착 · 폼보드 5T 권장</text>'
    body = f'''<svg class="abs" style="left:0;top:0" width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}"><path d="{path}" fill="#fff"/></svg>
      <img class="abs" src="{A}reo-front-4x.png" style="left:{lx}mm;top:{ly}mm;width:{lw}mm;height:{LEO_H}mm">
      <div class="abs" style="left:{bx}mm;top:{by}mm;width:{bw}mm;height:{BASE_H}mm;background:{INK};border-radius:30mm;padding:32mm 40mm 0">
        <div class="w" style="font-size:118pt;font-weight:900;line-height:1.15">발이 편해야, <span style="color:{LIME}">일이 편하다.</span></div>
        <div style="font-size:60pt;color:#cfcfcf;margin-top:12mm">레오랑 한 컷 찍고  {CO["ig"]}  태그해 주세요</div></div>'''
    write('09_reo_standee', (W, H), [(body, '#E6E6E6', lines)], f'레오 등신대 {W}×{H}mm (캐릭터 높이 {LEO_H})')

# ───────────────────────── 7-2. 족자 900×2200 ×6 (v2 10/15: 라라슈 3 + re.feeel 3) ─────────────────────────
RF_GR, RF_MID, RF_IV, RF_YL = '#1F472C', '#3F7A52', '#F2EDE1', '#FBD827'

def banners6():
    """v2.1 (10/15): 6면 공통 = 크림 바탕 + 잉크 글자, 브랜드 포인트 1색만 (RS 올리브 / re.feeel 그린)"""
    W, H, POCKET = 950, 2380, 50
    gl = trim_rect(W, H, 0) + f'<line class="fold" x1="0" y1="{POCKET}" x2="{W}" y2="{POCKET}"/><line class="fold" x1="0" y1="{H-POCKET}" x2="{W}" y2="{H-POCKET}"/>' + \
        f'<rect class="guide" x="50" y="{POCKET+50}" width="{W-100}" height="{H-2*POCKET-100}"/>' + \
        f'<rect class="guide" x="0" y="1050" width="{W}" height="900" style="stroke:#F0A000"/><text class="lbl" x="55" y="{POCKET-12}" style="font-size:16px">봉 포켓 50mm (상·하)</text>' + \
        f'<text class="lbl" x="55" y="1045" style="font-size:16px;fill:#C08000">핵심 시선 띠 1,050~1,950</text>'
    HL, SUB, BODY, SM = 'font-size:250pt;font-weight:900;line-height:1.08', 'font-size:100pt;font-weight:900;line-height:1.15', 'font-size:76pt;font-weight:700;line-height:1.4', 'font-size:56pt;line-height:1.45'
    BG = CREAM
    def p(tag, n, acc, inner, under=''):
        top = f'<div class="abs" style="left:0;top:{POCKET}mm;width:{W}mm;height:36mm;background:{acc}"></div>'
        num = f'<div class="abs" style="right:80mm;top:120mm;font-size:40pt;font-weight:900;color:{acc}">{tag} {n}/3</div>'
        return (top + under + num + col(inner, 180, 2080, 80, W), BG, gl)
    def photo(src, w, h, r=24):
        return f'<img src="{A}{src}" style="width:{w}mm;height:{h}mm;object-fit:cover;border-radius:{r}mm">'
    def pt(n, t, acc):
        return f'<div style="display:flex;gap:30mm;align-items:baseline"><div style="font-size:70pt;font-weight:900;color:{acc}">{n}</div><div style="{BODY}">{t}</div></div>'
    rs = [
        p('RS', 1, OLIVE, f"""<div>{logo(240,'ink')}<div style="{SUB};margin-top:24mm">RhaRa Shoe<br>라라슈</div></div>
            <div style="{HL};font-size:230pt">Made<br>for<br><span style="color:{OLIVE}">Standing.</span></div>
            <img src="{A}walking-cut.png" style="width:640mm;align-self:center">
            <div><div style="{BODY}">쿼드그립 종일편한 워킹화</div><div class="mute" style="{SM}">2026.11.11 OPEN</div></div>"""),
        p('RS', 2, OLIVE, f"""<div><div style="{SUB};color:{OLIVE}">QUAD GRIP</div><div style="{HL};font-size:230pt">바닥에<br>닿는 길을<br>따라 4곳.</div></div>
            {photo("outsole-studio.jpg",740,520)}
            <div style="display:flex;flex-direction:column;gap:22mm">{pt("01","밑창 4곳 그립 패드",OLIVE)}{pt("02","깔창 없는 일체형 안창",OLIVE)}{pt("03","눌렀다, 다시 돌아옵니다",OLIVE)}</div>
            <div style="{SUB};color:{OLIVE}">MADE IN KOREA</div>"""),
        p('RS', 3, OLIVE, f"""<div><div style="{SUB};color:{OLIVE}">ARCH INSOLE</div><div style="{HL};font-size:210pt">오후 4시,<br>발이 먼저<br>퇴근하고<br>싶을 때.</div>
              <div style="{SM};margin-top:16mm">신던 신발 속 바닥만 바꿔 보세요.</div></div>
            <img src="{A}insole-cut.png" style="width:560mm;align-self:center">
            <div style="display:flex;flex-direction:column;gap:22mm">{pt("01","아치 아래 빈 공간, 가득",OLIVE)}{pt("02","쓰던 깔창 밑에 한 장 더",OLIVE)}{pt("03","반굽 M 15cm · L 17cm",OLIVE)}</div>
            <div><div style="{BODY}">쿼드그립 아치가득 인솔</div><div class="mute" style="font-size:34pt;line-height:1.5">신발 형태·재질에 따라 착용감이 다를 수 있습니다. 본 제품은 의료기기가 아닙니다.</div></div>"""),
    ]
    rf = [
        p('re.feeel', 1, RF_GR, f"""<div style="display:flex;justify-content:center"><img src="{A}refeeel-seal.png" style="width:480mm"></div>
            <div><div style="{HL};font-size:230pt">남은 것의<br><span style="color:{RF_GR}">다음 모양.</span></div>
            <div style="{SUB};color:{RF_GR};margin-top:20mm">생활을 다시 채우다.</div></div>
            <div style="display:flex;gap:18mm">{photo("cup-life.jpg",360,360)}{photo("slipper-quilt.jpg",360,360)}</div>
            <div style="{SM}">숲에서 솎아낸 나무, 벽에서 떼어 낸 벽지로<br>매일 쓰는 구강용품과 욕실화를 만듭니다.<br><b>㈜알앤디메이커스 · 국내 제조</b></div>"""),
        p('re.feeel', 2, RF_GR, f"""<div><div style="{SUB};color:{RF_GR}">ORAL CARE</div><div style="{HL}">나무에서<br>온<br><span style="color:{RF_GR}">구강케어.</span></div></div>
            {photo("cup-life.jpg",740,560)}
            <div style="display:flex;gap:20mm">{photo("toothbrush.jpg",360,240,16)}{photo("floss.jpg",360,240,16)}</div>
            <div style="{SM}"><b style="color:{RF_GR}">칫솔 · 칫솔형 치실 · 양치컵</b><br>간벌재(임업부산물) 기반 CXP 소재<br>양치컵은 40° 기울여 세워 말리는 구조</div>"""),
        p('re.feeel', 3, RF_GR, f"""<div><div style="{SUB};color:{RF_GR}">BATH SLIPPER</div><div style="{HL}">벽지가<br>욕실화가<br><span style="color:{RF_GR}">됐습니다.</span></div></div>
            <div style="display:flex;flex-direction:column;gap:20mm">{photo("slipper-quilt.jpg",740,380)}{photo("slipper-low.jpg",740,380)}</div>
            <div style="{BODY}">실크벽지에서 분리한<br>PVC를 다시 원료로.</div>
            <div style="background:{RF_GR};border-radius:30mm;padding:36mm 40mm;display:flex;align-items:center;gap:34mm">
              <div style="flex:none;width:280mm;height:280mm;background:#fff;border-radius:10mm;display:flex;align-items:center;justify-content:center;text-align:center;font-size:36pt;color:{RF_GR}">인스타<br>QR 자리</div>
              <div><div style="font-size:44pt;font-weight:900;color:{CREAM};letter-spacing:.06em">INSTAGRAM EVENT</div>
                <div style="font-size:84pt;font-weight:900;color:#fff;line-height:1.25;margin-top:6mm">팔로우하면<br>CXP 볼펜 선물</div>
                <div style="font-size:36pt;color:{CREAM};margin-top:8mm">@[계정] · 팔로우 화면 보여 주세요 · 소진 시 종료</div></div></div>"""),
    ]
    write('08_banner_950x2380_x6', (W, H), rs + rf, '백월 족자 950×2380 ×6 (라라슈 3 + re.feeel 3) · 족자봉+PET')

# ───────────────────────── 6-2. X배너 600×1800 — 정형외과 전문의 설계 자문 ─────────────────────────
def xbanner_doctor():
    W, H = 600, 1800
    gl = trim_rect(W, H, 0) + ''.join(f'<circle class="cut" cx="{cx}" cy="{cy}" r="6"/>' for cx in (25, W - 25) for cy in (25, H - 25)) + \
        f'<rect class="guide" x="40" y="60" width="{W-80}" height="{H-120}"/><text class="lbl" x="45" y="56" style="font-size:12px">아일렛(타공) 4곳 · 안전영역 40mm</text>'
    ph = f"""<div style="width:490mm;height:560mm;align-self:center;background:linear-gradient(180deg,#d9d9d4,#bdbdb8);border-radius:20mm;position:relative;overflow:hidden">
        <svg viewBox="0 0 490 560" style="position:absolute;left:0;top:0;width:490mm;height:560mm"><circle cx="245" cy="215" r="95" fill="#a8a8a3"/><path d="M60 560 C70 400 160 340 245 340 C330 340 420 400 430 560 Z" fill="#f4f4f1"/><path d="M200 345 L245 430 L290 345" fill="#a8a8a3"/></svg>
        <div style="position:absolute;left:0;right:0;bottom:22mm;text-align:center;font-size:30pt;color:{MUTE}">[사진] 원장님 상반신 · 가운 · 회색 배경 (10/28 촬영 D4)</div></div>"""
    body = col(f"""<div style="display:flex;justify-content:space-between;align-items:center">{logo(70,'ink')}<div style="font-size:34pt;font-weight:900;color:{OLIVE};letter-spacing:.08em">DESIGN ADVISORY</div></div>
      <div style="font-size:120pt;font-weight:900;line-height:1.15">서서 일하는 발,<br><span style="color:{OLIVE}">정형외과 전문의와</span><br>함께 살폈습니다.</div>
      {ph}
      <div><div style="font-size:96pt;font-weight:900">이문홍 원장</div>
        <div style="font-size:46pt;font-weight:700;color:{OLIVE};margin-top:4mm">정형외과 전문의 · 이문홍정형외과</div></div>
      <div style="border-left:6mm solid {LIME};padding-left:18mm;font-size:52pt;line-height:1.5">“[원장님 확정 인용 문구]<br><span style="color:{MUTE};font-size:38pt">예) 발이 바닥에 닿는 순서를 기준으로 패드 위치를 함께 검토했습니다.</span>”</div>
      <div style="background:{OLIVE};border-radius:20mm;padding:24mm 28mm">
        <div style="font-size:40pt;font-weight:900;color:{CREAM}">자문 범위 — 형태와 착용 방식</div>
        <div class="w" style="font-size:44pt;line-height:1.55;margin-top:8mm">① 쿼드그립 4점 패드 배치<br>② 아치가득 인솔 형태 · 뒤꿈치 컵<br>③ 기존 깔창 밑에 겹쳐 쓰는 방식</div></div>
      <div style="font-size:28pt;color:{MUTE};line-height:1.5">이문홍 원장은 ㈜알앤디메이커스 제품 설계 자문에 참여하고 자문료를 받았습니다.<br>본 제품은 의료기기가 아닙니다. 부스에서는 발 상담·진단을 하지 않습니다.</div>""", 80, 1730, 50, W)
    write('07b_xbanner_doctor_600x1800', (W, H), [(body, CREAM, gl)], 'X배너 600×1800 — 정형외과 전문의 설계 자문')

# ───────────────────────── v3 (10/15) 스터닝 견적 기준 ─────────────────────────
# 공통 톤: 크림 바탕 + 잉크 글자 + 포인트 1색 (라라슈 OLIVE / re.feeel RF_GR)
EVENT_ACC = '@re.feeel'
def ev_box(w_qr, big, small, acc):
    return f"""<div style="background:{acc};border-radius:20mm;padding:24mm 26mm;display:flex;align-items:center;gap:22mm">
      <div style="flex:none;width:{w_qr}mm;height:{w_qr}mm;background:#fff;border-radius:6mm;display:flex;align-items:center;justify-content:center;text-align:center;font-size:{small}pt;color:{acc}">인스타<br>QR 자리</div>
      <div><div style="font-size:{small}pt;font-weight:900;color:{CREAM};letter-spacing:.06em">INSTAGRAM EVENT</div>
        <div style="font-size:{big}pt;font-weight:900;color:#fff;line-height:1.25;margin-top:4mm">팔로우하면<br>CXP 볼펜 선물</div>
        <div style="font-size:{small*0.85:.0f}pt;color:{CREAM};margin-top:6mm">{EVENT_ACC} · 팔로우 화면 보여 주세요 · 소진 시 종료</div></div></div>"""

def xbanners3():
    """X배너 3건 = ① 라라슈 ② re.feeel ③ 정형외과(07b 별도 함수)"""
    W, H = 600, 1800
    gl = trim_rect(W, H, 0) + ''.join(f'<circle class="cut" cx="{cx}" cy="{cy}" r="6"/>' for cx in (25, W - 25) for cy in (25, H - 25)) + \
        f'<rect class="guide" x="40" y="60" width="{W-80}" height="{H-120}"/><text class="lbl" x="45" y="56" style="font-size:12px">아일렛(타공) 4곳 · 안전영역 40mm</text>'
    band = lambda acc: f'<div class="abs" style="left:0;top:0;width:{W}mm;height:30mm;background:{acc}"></div>'
    def prod(img, name, price, acc, iw):
        return f"""<div style="display:flex;align-items:center;gap:16mm"><img src="{A}{img}" style="width:{iw}mm;flex:none">
          <div><div style="font-size:76pt;font-weight:900;line-height:1.2">{name}</div>
          <div style="font-size:48pt;color:{MUTE};margin-top:4mm">정상가 {price}</div>
          <div style="font-size:54pt;font-weight:900;color:{acc};margin-top:2mm">박람회 현장가 ______원</div></div></div>"""
    a = band(OLIVE) + col(f"""<div style="display:flex;justify-content:space-between;align-items:center">{logo(80,'ink')}<div style="font-size:34pt;font-weight:900;color:{OLIVE};letter-spacing:.08em">RS 1/3</div></div>
      <div style="font-size:150pt;font-weight:900;line-height:1.08">Made<br>for<br><span style="color:{OLIVE}">Standing.</span></div>
      <div style="font-size:72pt;line-height:1.4">서서 일하는 사람을 위한<br>워킹화와 인솔, 라라슈</div>
      {prod("walking-cut.png","쿼드그립<br>종일편한 워킹화","42,500원",OLIVE,230)}
      {prod("insole-cut.png","쿼드그립<br>아치가득 인솔","21,500원",OLIVE,230)}
      {ev_box(150,64,30,OLIVE)}""", 70, 1730, 50, W)
    b = band(RF_GR) + col(f"""<div style="display:flex;justify-content:space-between;align-items:flex-start"><img src="{A}refeeel-seal.png" style="width:220mm"><div style="font-size:34pt;font-weight:900;color:{RF_GR};letter-spacing:.08em">re.feeel</div></div>
      <div style="font-size:130pt;font-weight:900;line-height:1.1">생활을<br><span style="color:{RF_GR}">다시 채우다.</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12mm">
        <img src="{A}cup-life.jpg" style="width:100%;height:250mm;object-fit:cover;border-radius:14mm">
        <img src="{A}slipper-quilt.jpg" style="width:100%;height:250mm;object-fit:cover;border-radius:14mm">
        <div style="font-size:60pt;font-weight:900">ORAL CARE<br><span style="font-weight:400;font-size:50pt">칫솔 · 치실 · 양치컵<br>나무에서 온 CXP 소재</span></div>
        <div style="font-size:60pt;font-weight:900">BATH SLIPPER<br><span style="font-weight:400;font-size:50pt">실크벽지 PVC를<br>다시 원료로</span></div></div>
      <div style="font-size:60pt;line-height:1.45">숲에서 솎아낸 나무, 벽에서 떼어 낸 벽지로<br>매일 쓰는 물건을 만듭니다. <b>국내 제조</b></div>
      {ev_box(150,64,30,RF_GR)}""", 70, 1730, 50, W)
    write('07_xbanner_600x1800', (W, H), [(a, CREAM, gl), (b, CREAM, gl)], 'X배너 600×1800 ①라라슈 ②re.feeel (③정형외과 = 07b)')

# ───────────────────────── 리플렛 + 다국어 카탈로그 (A4 3단 C접지 · 스노우지 200g · 1,000부) ─────────────────────────
FONT_LINKS = ''.join(f'<link rel="stylesheet" href="fonts/{p}/{w}.css">' for p in ('sc', 'jp') for w in (400, 700))
def leaflet_ml():
    B, W, H = 3, 303, 216
    P, Q = [97, 100, 100], [100, 100, 97]
    def lines(widths):
        xs, s = [], B
        for wd in widths[:-1]:
            s += wd; xs.append(s)
        return trim_rect(W, H, B) + ''.join(f'<line class="fold" x1="{xx}" y1="{B}" x2="{xx}" y2="{H-B}"/>' for xx in xs) + \
            ''.join(f'<rect class="guide" x="{xx-4}" y="{B+3}" width="8" height="{H-2*B-6}"/>' for xx in xs)
    EN = 'font-size:7pt;line-height:1.5;color:#555'
    def panel(x, w, acc, eyebrow, title, en_title, img, img_w, body, en, foot='', img_top=52):
        return f"""<div class="abs" style="left:{x}mm;top:0;width:{w}mm;height:{H}mm">
          <div class="abs" style="left:0;top:0;width:{w}mm;height:6mm;background:{acc}"></div>
          <div class="abs" style="left:10mm;top:15mm;font-size:7.5pt;font-weight:700;letter-spacing:.15em;color:{acc}">{eyebrow}</div>
          <div class="abs" style="left:10mm;top:21mm;width:{w-20}mm;font-size:15pt;font-weight:900;line-height:1.22">{title}</div>
          <div class="abs" style="left:10mm;top:41mm;width:{w-20}mm;font-size:8pt;font-weight:700;color:{acc}">{en_title}</div>
          <img class="abs" src="{A}{img}" style="left:{(w-img_w)/2}mm;top:{img_top}mm;width:{img_w}mm;max-height:62mm;object-fit:contain">
          <div class="abs" style="left:10mm;top:120mm;width:{w-20}mm;font-size:8pt;line-height:1.65">{body}</div>
          <div class="abs" style="left:10mm;top:158mm;width:{w-20}mm;{EN}">{en}</div>
          <div class="abs mute" style="left:10mm;top:197mm;width:{w-20}mm;font-size:6.3pt;line-height:1.4">{foot}</div></div>"""
    o0, o1, o2 = B, B + 97, B + 197
    i0, i1, i2 = B, B + 100, B + 200
    # 바깥면: 날개(re.feeel 욕실화) | 뒷면(회사·다국어) | 표지
    flap = panel(0, o1, RF_GR, 're.feeel · BATH SLIPPER', '벽지가<br>욕실화가 됐습니다.', 'Wallpaper became bath slippers.', 'slipper-quilt.jpg', 78,
        '실크벽지에서 분리한 PVC를 다시 원료로 만든 욕실화.<br>물빠짐 구멍 · 바닥 패턴<br>전국 생활용품 매장 납품 중 · 국내 제조',
        'Bath slippers made with PVC separated from silk wallpaper. Drain holes and a patterned sole. Supplied to retail stores nationwide. Made in Korea.')
    back = f"""<div class="abs" style="left:{o1}mm;top:0;width:100mm;height:{H}mm">
      <div class="abs" style="left:0;top:0;width:100mm;height:6mm;background:{INK}"></div>
      <div class="abs" style="left:10mm;top:15mm;font-size:7.5pt;font-weight:700;letter-spacing:.15em">MAKER · 제조사</div>
      <div class="abs" style="left:10mm;top:21mm;font-size:13pt;font-weight:900">{CO["co"]}</div>
      <div class="abs" style="left:10mm;top:29mm;font-size:8pt;font-weight:700;color:{MUTE}">R&amp;D Makers Co., Ltd.</div>
      <div class="abs" style="left:10mm;top:37mm;width:80mm;font-size:7.4pt;line-height:1.6">버려지는 소재로 생활용품을 만드는 국내 제조사입니다.<br><span style="color:#555">A Korean maker turning discarded materials into everyday goods.</span></div>
      <div class="abs" style="left:10mm;top:58mm;width:80mm;font-size:6.9pt;line-height:1.55;font-family:'Noto Sans SC',N">
        <b>中文</b>　我们是利用回收材料制造生活用品的韩国制造商。RhaRa Shoe 为站立工作的人设计工作鞋与鞋垫，鞋底防滑垫采用回收轮胎橡胶与回收壁纸 PVC。re.feeel 推出以林业副产物 CXP 材料制成的口腔护理用品及回收 PVC 浴室拖鞋。全部韩国制造，欢迎批发及 OEM/ODM 洽谈。</div>
      <div class="abs" style="left:10mm;top:94mm;width:80mm;font-size:6.9pt;line-height:1.55;font-family:'Noto Sans JP',N">
        <b>日本語</b>　リサイクル素材で生活用品をつくる韓国のメーカーです。RhaRa Shoe は立ち仕事をする人のためのワーキングシューズとインソール。靴底のグリップパッドには廃タイヤゴムと壁紙由来の再生 PVC を使用。re.feeel は林業副産物を活用した CXP 素材のオーラルケア用品と再生 PVC のバススリッパ。すべて韓国製造。卸売・OEM/ODM のご相談を承ります。</div>
      <div class="abs" style="left:10mm;top:134mm;width:80mm;height:.3mm;background:{INK}"></div>
      <div class="abs" style="left:10mm;top:139mm;font-size:7.6pt;line-height:1.7">T  {CO["cs"]}<br>E  {CO["mail"]}<br>A  {CO["addr"]}<br>W  {CO["web"]}<br>IG  {CO["ig"]}</div>
      <div class="abs" style="left:66mm;top:141mm">{qr("flyer",24)}</div>
      <div class="abs" style="left:10mm;top:181mm;width:80mm;font-size:7.4pt;font-weight:700;line-height:1.5">단체 구매 · 도매 · OEM/ODM 상담<br><span style="font-weight:400;color:#555">Wholesale &amp; OEM/ODM inquiries welcome</span></div></div>"""
    cover = f"""<div class="abs" style="left:{o2}mm;top:0;width:{W-o2}mm;height:{H}mm;background:{CREAM}">
      <div class="abs" style="left:12mm;top:18mm;font-size:7.5pt;font-weight:700;letter-spacing:.2em;color:{MUTE}">KR · EN · 中文 · 日本語</div>
      <div class="abs" style="left:12mm;top:30mm;font-size:24pt;font-weight:900;line-height:1.15">남은 것의<br>다음 모양.</div>
      <div class="abs" style="left:12mm;top:58mm;font-size:9pt;font-weight:700;color:#555">The next shape of what's left.</div>
      <div class="abs" style="left:12mm;top:80mm;display:flex;align-items:center;gap:8mm">{logo(26,'ink')}<img src="{A}refeeel-seal.png" style="height:34mm"></div>
      <div class="abs" style="left:12mm;top:122mm;width:80mm;font-size:8pt;line-height:1.7"><b style="color:{OLIVE}">RhaRa Shoe 라라슈</b> — 서서 일하는 사람의 워킹화·인솔<br><b style="color:{RF_GR}">re.feeel</b> — 구강용품 · 욕실화</div>
      <div class="abs" style="left:12mm;top:150mm;width:80mm;font-size:7pt;line-height:1.5;color:#555">RhaRa Shoe — walking shoes &amp; insoles for people who work on their feet<br>re.feeel — oral care &amp; bath slippers</div>
      <div class="abs" style="left:12mm;top:190mm;font-size:9pt;font-weight:900">{CO["co"]}</div>
      <div class="abs" style="left:12mm;top:197mm;font-size:7pt;color:{MUTE}">MADE IN KOREA</div></div>"""
    out = f'<div class="abs" style="left:0;top:0;width:{W}mm;height:{H}mm;background:{WHITE}"></div>' + flap.replace(f'left:0mm;top:0;width:{o1}mm', f'left:0mm;top:0;width:{o1}mm;background:{WHITE}') + back + cover
    inside = f'<div class="abs" style="left:0;top:0;width:{W}mm;height:{H}mm;background:{WHITE}"></div>'
    inside += panel(0, i1, OLIVE, 'RhaRa Shoe · 01 WALKING SHOE', '쿼드그립<br>종일편한 워킹화', 'QUAD GRIP All-Day Walking Shoes', 'walking-cut.png', 64,
        '<b>쿼드그립 4점</b> — 바닥에 닿는 길을 따라 밑창 4곳에 그립 패드<br><b>깔창 없는 일체형</b> — 안창까지 한 몸<br><b>그립 패드 소재</b> — 폐타이어 재생고무 + 실크벽지 재생 PVC',
        'Grip pads at four points along the path your foot meets the floor. One-piece footbed with no loose insole. Pads made with recycled tire rubber and recycled wallpaper PVC.',
        '230~280mm · 차콜 / 그레이 / 민트화이트 · 42,500원 · 국내 제조')
    inside += panel(i1, 100, OLIVE, 'RhaRa Shoe · 02 ARCH INSOLE', '오후 4시, 발이 먼저<br>퇴근하고 싶을 때.', 'QUAD GRIP Arch Insole', 'insole-cut.png', 64,
        '<b>아치가득</b> — 아치 아래 빈 공간을 채운 형태<br><b>반굽</b> — 쓰던 깔창 밑에 한 장 더<br><b>우드칩 배합</b> — 목공소 우드칩을 섞은 소재',
        'Fills the space under your arch. Half-length: slip it under the insole you already use. Made with wood chips from carpentry shops.',
        'M 15cm · L 17cm (±5%) · 21,500원 · 신발 형태·재질에 따라 착용감이 다를 수 있습니다. 본 제품은 의료기기가 아닙니다. / Not a medical device.')
    inside += panel(i2, W - i2, RF_GR, 're.feeel · ORAL CARE', '나무에서 온<br>구강케어.', 'Oral care from wood.', 'cup-life.jpg', 74,
        '<b>칫솔</b> · <b>칫솔형 치실</b>(리필 20개입) · <b>양치컵</b><br>숲을 가꾸며 솎아낸 간벌재(임업부산물)로 만든 CXP 소재<br>양치컵은 40° 기울여 세워 말리는 구조',
        'Toothbrush, toothbrush-style floss and rinse cup made with CXP, a material using thinned wood from forest care. The cup dries standing tilted at 40°.',
        '국내 제조 · 가격은 부스에서 안내')
    write('06_leaflet_A4_3fold', (W, H), [(out, WHITE, lines(P)), (inside, WHITE, lines(Q))], '리플렛+다국어 카탈로그 A4 3단 C접지 (1p 바깥 · 2p 안쪽)')

# ───────────────────────── POP 3종 (A4 세로 · 아크릴 거치대) ─────────────────────────
def pops():
    B, W, H = 3, 216, 303
    tr = trim_rect(W, H, B)
    band = lambda acc: f'<div class="abs" style="left:0;top:0;width:{W}mm;height:{B+12}mm;background:{acc}"></div>'
    def price_pop(tag, img, iw, name, en, pts, price, foot):
        return band(OLIVE) + col(f"""<div style="display:flex;justify-content:space-between;align-items:center">{logo(16,'ink')}<div style="font-size:11pt;font-weight:900;color:{OLIVE};letter-spacing:.1em">{tag}</div></div>
          <div><div style="font-size:30pt;font-weight:900;line-height:1.15">{name}</div><div style="font-size:11pt;font-weight:700;color:{OLIVE};margin-top:2mm">{en}</div></div>
          <img src="{A}{img}" style="width:{iw}mm;align-self:center;max-height:88mm;object-fit:contain">
          <div style="font-size:13pt;font-weight:700;line-height:1.6">{pts}</div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end;border-top:.6mm solid {INK};padding-top:5mm">
            <div><div style="font-size:11pt;color:{MUTE}">정상가</div><div style="font-size:20pt;font-weight:900;color:{MUTE};text-decoration:line-through">{price}</div></div>
            <div style="text-align:right"><div style="font-size:12pt;font-weight:900;color:{OLIVE}">박람회 현장가</div>
              <div style="width:96mm;height:24mm;border:.8mm dashed {OLIVE};border-radius:4mm;margin-top:2mm;display:flex;align-items:center;justify-content:flex-end;padding-right:5mm;font-size:22pt;font-weight:900">원</div></div></div>
          <div style="font-size:8pt;color:{MUTE};line-height:1.5">{foot}</div>""", B + 22, H - B - 12, B + 14, W)
    p1 = price_pop('RS · WALKING', 'walking-cut.png', 110, '쿼드그립<br>종일편한 워킹화', 'QUAD GRIP All-Day Walking Shoes',
        '01  바닥에 닿는 길을 따라 그립 패드 4곳<br>02  깔창 없는 일체형 안창<br>03  눌렀다, 다시 돌아옵니다', '42,500원', '230~280mm · 차콜 / 그레이 / 민트화이트 · 국내 제조')
    p2 = price_pop('RS · INSOLE', 'insole-cut.png', 110, '쿼드그립<br>아치가득 인솔', '오후 4시, 발이 먼저 퇴근하고 싶을 때.',
        '01  아치 아래 빈 공간, 가득<br>02  쓰던 깔창 밑에 한 장 더 (반굽)<br>03  M 15cm · L 17cm', '21,500원', '신발 형태·재질에 따라 착용감이 다를 수 있습니다. 본 제품은 의료기기가 아닙니다.')
    p3 = band(RF_GR) + col(f"""<div style="display:flex;justify-content:space-between;align-items:flex-start"><img src="{A}refeeel-seal.png" style="width:52mm"><div style="font-size:11pt;font-weight:900;color:{RF_GR};letter-spacing:.1em">INSTAGRAM EVENT</div></div>
          <div style="font-size:40pt;font-weight:900;line-height:1.15">팔로우하면<br><span style="color:{RF_GR}">CXP 볼펜</span><br>선물!</div>
          <div style="display:flex;align-items:center;gap:10mm">
            <div style="flex:none;width:70mm;height:70mm;background:#fff;border:.8mm dashed {RF_GR};border-radius:4mm;display:flex;align-items:center;justify-content:center;text-align:center;font-size:12pt;color:{RF_GR}">인스타<br>QR 자리</div>
            <div style="font-size:13pt;line-height:1.7"><b>① QR로 {EVENT_ACC} 팔로우</b><br><b>② 팔로우 화면 보여 주기</b><br><b>③ 볼펜 받아 가기</b></div></div>
          <div style="background:{CREAM};border-radius:6mm;padding:7mm 8mm;font-size:10.5pt;line-height:1.6"><b style="color:{RF_GR}">CXP 볼펜이란?</b><br>숲을 가꾸며 솎아낸 나무(간벌재)로 만든 CXP 소재 볼펜.<br>re.feeel 칫솔·치실·양치컵과 같은 소재예요.</div>
          <div style="font-size:8pt;color:{MUTE}">1인 1회 · 일일 수량 소진 시 종료 · ㈜알앤디메이커스 RhaRa Shoe · re.feeel</div>""", B + 22, H - B - 12, B + 14, W)
    write('04_pop_A4_x3', (W, H), [(p1, WHITE, tr), (p2, WHITE, tr), (p3, WHITE, tr)], 'POP A4 세로 ×3 (워킹화 / 인솔 / 인스타 이벤트)')

# ═════════════════════════ v4 (10/15 PM) 임팩트 리디자인 ═════════════════════════
# 라라슈 = 블랙 #0D0D0D + 라임 #C6F432 / re.feeel = 딥그린 #1F472C + 크림 + 옐로 #FBD827
# 사진 자리 = 스튜디오 촬영 레퍼런스 박스(현재 사진은 '구도 참고용'으로 흐리게 깔고, 촬영 지시를 박스에 인쇄)
RF_DK = '#163522'
SHOTS = []
def shot(sid, w, h, ref, title, direction, acc=LIME, r=16, fs=1.0, dark=True):
    SHOTS.append((sid, title, direction, ref))
    bg = '#1b1b1b' if dark else '#e9e5dc'
    img = f'<img src="{A}{ref}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55;filter:grayscale(.15)">' if ref else ''
    return f"""<div style="position:relative;flex:none;width:{w}mm;height:{h}mm;border-radius:{r}mm;overflow:hidden;background:{bg};outline:{1.6*fs:.1f}mm dashed {acc};outline-offset:-{3*fs:.1f}mm">{img}
      <div style="position:absolute;left:{6*fs:.1f}mm;top:{6*fs:.1f}mm;background:{acc};color:{LIME if acc==INK else INK};font-size:{26*fs:.1f}pt;font-weight:900;padding:{1.5*fs:.1f}mm {4*fs:.1f}mm;border-radius:{3*fs:.1f}mm">◉ STUDIO {sid}</div>
      <div style="position:absolute;left:{6*fs:.1f}mm;right:{6*fs:.1f}mm;bottom:{6*fs:.1f}mm;background:rgba(13,13,13,.78);color:#fff;padding:{4*fs:.1f}mm {5*fs:.1f}mm;border-radius:{3*fs:.1f}mm;font-size:{22*fs:.1f}pt;line-height:1.45"><b style="color:{LIME if acc==INK else acc}">{title}</b><br>{direction}</div></div>"""

def foot_map(wmm, acc=LIME, ink='#fff', labels=True, fs=1.0):
    """쿼드그립 4점 배치도 (특허 청구항 순서: ①뒤꿈치 중앙 ②후족부 전방 외측 ③전족부 외측 ④전족부 내측)"""
    pts = [(150, 600, '①', '뒤꿈치 중앙'), (205, 470, '②', '뒤꿈치 앞 바깥쪽'), (222, 262, '③', '발볼 바깥쪽'), (100, 215, '④', '엄지 발볼')]
    sole = 'M150,700 C92,700 66,648 70,572 C74,500 98,440 94,368 C90,296 68,244 74,178 C80,104 122,34 172,26 C228,18 254,70 250,142 C246,222 228,264 226,334 C224,404 240,474 236,566 C232,646 208,700 150,700 Z'
    path = ' L'.join(f'{x},{y}' for x, y, *_ in pts)
    dots = ''.join(f'<circle cx="{x}" cy="{y}" r="27" fill="{acc}"/><text x="{x}" y="{y+10}" text-anchor="middle" font-size="28" font-weight="900" fill="{INK}">{n}</text>' for x, y, n, _ in pts)
    lab = ''
    if labels:
        for x, y, n, t in pts:
            lx = 290 if x > 150 else -150
            anc = 'start' if x > 150 else 'start'
            lab += f'<line x1="{x+(28 if x>150 else -28)}" y1="{y}" x2="{lx-8 if x>150 else lx+130}" y2="{y}" stroke="{acc}" stroke-width="2"/><text x="{lx}" y="{y+8}" font-size="30" font-weight="700" fill="{ink}" text-anchor="{anc}">{t}</text>'
    vb = '-160 0 710 730' if labels else '40 0 240 730'
    hmm = wmm * 730 / (710 if labels else 240)
    return f"""<svg viewBox="{vb}" style="width:{wmm}mm;height:{hmm}mm;flex:none;font-family:N"><path d="{sole}" fill="none" stroke="{ink}" stroke-width="5" opacity=".9"/>
      <path d="M{path}" fill="none" stroke="{acc}" stroke-width="4" stroke-dasharray="10 9" opacity=".9"/>{dots}{lab}</svg>"""

def paper_cards(fs, acc, txt='#fff', sub='#bdbdbd', bg='#1b1b1b'):
    card = lambda tag, t, d: f"""<div style="background:{bg};border-left:{3*fs:.1f}mm solid {acc};border-radius:{3*fs:.1f}mm;padding:{5*fs:.1f}mm {6*fs:.1f}mm">
        <div style="font-size:{20*fs:.1f}pt;font-weight:900;color:{acc}">{tag}</div><div style="font-size:{24*fs:.1f}pt;font-weight:900;color:{txt};line-height:1.35;margin-top:{1.5*fs:.1f}mm">{t}</div>
        <div style="font-size:{18*fs:.1f}pt;color:{sub};line-height:1.45;margin-top:{1.5*fs:.1f}mm">{d}</div></div>"""
    return card('연구 ① 성균관대학교 대학원 · 김성용 (2023)', '「운동화 바닥면의 패턴 정도에 따른 마찰력측정을 통한 최적의 SLIP RESISTANCE 패턴 제안」',
                '무늬 5종·45개 시편 · 마른 바닥/물/글리세린 비교 → 촘촘한 사각 블록 무늬가 세 조건 모두 마찰 최고, 배수 홈이 좁을수록 마찰 ↑') + \
           card('연구 ② 숭실대학교 대학원 · 한정희 (2015)', '「습한 환경에 대한 Non-slip 신발 Outsole의 최적 조각 패턴 설계」',
                '바닥 무늬 종류와 바닥 상태(마름·젖음·글리세린)에 따라 마찰이 유의하게 달라진다고 보고')

PAPER_NOTE = '위 내용은 시험용 시편으로 측정한 일반 연구 결과이며, 라라슈 제품의 미끄럼 방지 성능을 보증하는 것이 아닙니다.'
CAV_NOTE = 'Cavanagh 외, 1987 · Foot & Ankle 7(5) · 107족, 맨발로 서 있을 때 기준'

def ev_box4(fs, acc, fg, sub, qr_bg='#fff'):
    return f"""<div style="background:{acc};border-radius:{8*fs:.1f}mm;padding:{8*fs:.1f}mm {9*fs:.1f}mm;display:flex;align-items:center;gap:{8*fs:.1f}mm">
      <div style="flex:none;width:{48*fs:.1f}mm;height:{48*fs:.1f}mm;background:{qr_bg};border-radius:{3*fs:.1f}mm;display:flex;align-items:center;justify-content:center;text-align:center;font-size:{14*fs:.1f}pt;color:#666">인스타<br>QR</div>
      <div><div style="font-size:{15*fs:.1f}pt;font-weight:900;letter-spacing:.08em;color:{sub}">INSTAGRAM EVENT</div>
        <div style="font-size:{24*fs:.1f}pt;font-weight:900;line-height:1.2;color:{fg}">{EVENT_ACC} 팔로우<br>→ CXP 볼펜<br>+ 스토리 태그 → 칫솔</div>
        <div style="font-size:{13*fs:.1f}pt;color:{sub};margin-top:{2*fs:.1f}mm">화면 보여 주세요 · 1인 1회 · 소진 시 종료 · 스토리엔 #이벤트참여</div></div></div>"""

# ───────── 족자 950×2380 ×6 ─────────
def banners_v4():
    W, H, PK = 950, 2380, 50
    gl = trim_rect(W, H, 0) + f'<line class="fold" x1="0" y1="{PK}" x2="{W}" y2="{PK}"/><line class="fold" x1="0" y1="{H-PK}" x2="{W}" y2="{H-PK}"/>' + \
        f'<rect class="guide" x="50" y="{PK+50}" width="{W-100}" height="{H-2*PK-100}"/>' + \
        f'<rect class="guide" x="0" y="1050" width="{W}" height="900" style="stroke:#F0A000"/><text class="lbl" x="55" y="{PK-12}" style="font-size:16px">봉 결합부 50mm (상·하) — 스터닝 확인</text>' + \
        f'<text class="lbl" x="{W-55}" y="1045" text-anchor="end" style="font-size:16px;fill:#C08000">핵심 시선 띠 1,050~1,950</text>'
    F = 3.4   # 배율
    def pg(bg, inner, tag, acc, fg='#fff'):
        num = f'<div class="abs" style="right:80mm;top:{PK+60}mm;font-size:40pt;font-weight:900;color:{acc}">{tag}</div>'
        return (num + col(inner, PK + 60, H - PK - 60, 80, W), bg, gl)
    rs1 = pg(INK, f"""<div>{lockup(230)}</div>
        <div><div style="font-size:300pt;font-weight:900;line-height:1.02;color:{LIME}">Made<br>for<br>Standing.</div>
          <div style="font-size:120pt;font-weight:900;color:#fff;line-height:1.2;margin-top:30mm">서서 일하는 하루를<br>위한 워킹화와 아치 인솔</div></div>
        {shot('RS-01', 790, 1000, 'walking-side-ref.jpg', '스튜디오 촬영분 — 모델 착용 · 신발 측면', '모델이 워킹화를 신고 선 모습 · 신발 측면(발목~밑창 라인)이 잘 보이게 · 블랙 바지 · 주방/매장 바닥 톤 (물기 연출 ✗)', fs=F)}
        <div style="display:flex;justify-content:space-between;align-items:flex-end"><div style="font-size:70pt;font-weight:900;color:#fff">쿼드그립<br>워킹화 · 아치가득 인솔</div></div>""", 'RS 1/3', LIME)
    rs2 = pg(INK, f"""<div><div style="font-size:90pt;font-weight:900;color:{LIME};letter-spacing:.04em">QUAD GRIP</div>
          <div style="font-size:200pt;font-weight:900;line-height:1.05;color:#fff">바닥에 닿는<br>포인트를 따라<br><span style="color:{LIME}">쿼드 그립</span></div></div>
        <div style="display:flex;align-items:center;gap:22mm">{foot_map(540, fs=F)}
          <div style="flex:1"><div style="font-size:330pt;font-weight:900;line-height:.9;color:{LIME}">60<span style="font-size:150pt">%</span></div>
          <div style="font-size:56pt;font-weight:700;color:#fff;line-height:1.35;margin-top:8mm">서 있을 때<br>체중의 약 60%가<br>뒤꿈치에 실린다는<br>연구가 있습니다.</div>
          <div style="font-size:28pt;color:#9a9a9a;margin-top:8mm;line-height:1.4">{CAV_NOTE}</div></div></div>
        <div style="display:flex;flex-direction:column;gap:16mm"><div style="display:flex;align-items:center;gap:22mm"><div style="width:76mm;height:76mm;border-radius:50%;background:{LIME};display:grid;place-items:center;font-size:64pt;font-weight:900;color:{INK};flex:none">✔</div><div style="font-size:84pt;font-weight:900;color:#fff">디자인 등록 완료</div></div><div style="display:flex;align-items:center;gap:22mm"><div style="width:76mm;height:76mm;border-radius:50%;background:{LIME};display:grid;place-items:center;font-size:64pt;font-weight:900;color:{INK};flex:none">✔</div><div style="font-size:84pt;font-weight:900;color:#fff">특허 2건 출원 완료</div></div><div style="display:flex;align-items:center;gap:22mm"><div style="width:76mm;height:76mm;border-radius:50%;background:{LIME};display:grid;place-items:center;font-size:64pt;font-weight:900;color:{INK};flex:none">✔</div><div style="font-size:84pt;font-weight:900;color:#fff">미끄럼 저항 테스트 완료</div></div><div style="display:flex;align-items:center;gap:22mm"><div style="width:76mm;height:76mm;border-radius:50%;background:{LIME};display:grid;place-items:center;font-size:64pt;font-weight:900;color:{INK};flex:none">✔</div><div style="font-size:84pt;font-weight:900;color:#fff">족저압력 테스트 완료</div></div></div>
        {shot('RS-02', 790, 340, 'outsole-lime.jpg', '스튜디오 촬영분 — 신발 바닥(밑창)', '밑창 전체가 보이게 · 라임 그립 패드 4점 선명하게 · 블랙 배경 · 측광 (물 연출 ✗)', fs=F)}""", 'RS 2/3', LIME)
    rs3 = pg(INK, f"""<div><div style="font-size:90pt;font-weight:900;color:{LIME};letter-spacing:.04em">ARCH INSOLE</div>
          <div style="font-size:230pt;font-weight:900;line-height:1.05;color:#fff">오후 4시,<br>발이 먼저<br><span style="color:{LIME}">퇴근하고<br>싶을 때.</span></div>
          <div style="font-size:70pt;font-weight:700;color:#d6d6d0;margin-top:16mm">신던 신발 속 바닥만 바꿔 보세요.</div></div>
        {shot('RS-03', 790, 760, 'insole-side-ref.jpg', '스튜디오 촬영분 — 모델 착용 · 인솔 측면', '모델이 인솔을 신은(밟은) 모습 · 인솔 측면(뒤꿈치 컵·아치 라인)이 보이게 · 맨발 또는 양말 · 그레이/모카무스 (물기 연출 ✗)', fs=F)}
        <div style="background:#1b1b1b;border-radius:30mm;padding:44mm 50mm;display:flex;flex-direction:column;gap:22mm">
          {''.join(f'<div style="display:flex;gap:30mm;align-items:baseline"><div style="font-size:80pt;font-weight:900;color:{LIME}">{n}</div><div style="font-size:74pt;font-weight:900;color:#fff">{t}</div></div>' for n, t in [('01','아치 아래 빈 공간, 가득'),('02','쓰던 깔창 밑에 한 장 더'),('03','반굽 M 15cm · L 17cm')])}</div>
        <div><div style="font-size:70pt;font-weight:900;color:#fff">쿼드그립 아치가득 인솔</div><div style="font-size:30pt;color:#9a9a9a;line-height:1.45">신발 형태·재질에 따라 착용감이 다를 수 있습니다. 본 제품은 의료기기가 아닙니다.</div></div>""", 'RS 3/3', LIME)
    flow = lambda steps, acc, fg: '<div style="display:flex;align-items:center;justify-content:space-between">' + \
        f'<div style="font-size:90pt;font-weight:900;color:{acc}">→</div>'.join(f'<div style="text-align:center;width:230mm"><div style="width:180mm;height:180mm;margin:0 auto;border-radius:50%;background:{acc};color:{CREAM if acc==RF_GR else RF_GR};display:flex;align-items:center;justify-content:center;font-size:100pt;font-weight:900">{i+1}</div><div style="font-size:72pt;font-weight:900;color:{fg};margin-top:10mm;line-height:1.2">{s}</div></div>' for i, s in enumerate(steps)) + '</div>'
    rf1 = pg(RF_GR, f"""<div style="display:flex;justify-content:space-between;align-items:flex-start"><img src="{A}refeeel-seal.png" style="width:330mm;background:{CREAM};border-radius:50%;padding:10mm"><div style="font-size:60pt;font-weight:900;color:{RF_YL};text-align:right">REFILL<br>YOUR DAY</div></div>
        <div><div style="font-size:270pt;font-weight:900;line-height:1.05;color:{CREAM}">남은 것의<br><span style="color:{RF_YL}">다음 모양.</span></div>
          <div style="font-size:90pt;font-weight:900;color:{CREAM};margin-top:20mm">생활을 다시 채우다.</div></div>
        {shot('RF-01', 790, 900, 'cup-life.jpg', '라이프 — 욕실 선반 한 컷에 브랜드 전체', '화이트 타일 욕실 선반 · 양치컵(40° 기울여 세움) + 칫솔 + 치실 + 바닥에 스마일 욕실화 · 아침 햇빛', acc=RF_YL, fs=F)}
        <div style="font-size:52pt;color:{CREAM};line-height:1.5">숲에서 솎아낸 나무, 벽에서 떼어 낸 벽지로<br>매일 쓰는 구강용품과 욕실화를 만듭니다.<br><b style="color:{RF_YL}">㈜알앤디메이커스 · 국내 제조</b></div>""", 're.feeel 1/3', RF_YL)
    rf2 = pg(CREAM, f"""<div><div style="font-size:90pt;font-weight:900;color:{RF_GR};letter-spacing:.04em">ORAL CARE</div>
          <div style="font-size:250pt;font-weight:900;line-height:1.05;color:{INK}">나무에서 온<br><span style="color:{RF_GR}">구강케어.</span></div></div>
        {flow(['숲 가꾸기<br>간벌재', 'CXP<br>소재', '칫솔·치실<br>양치컵'], RF_GR, INK)}
        {shot('RF-02', 790, 700, 'cup-tilt.jpg', '양치컵 40° — 기울여 세워 말리는 장면', '흰 배경 · 양치컵이 40°로 기대 서 있는 측면 · 컵 안 물방울이 흘러내리는 순간 · 칫솔 2개 꽂은 버전 1컷 추가', acc=RF_GR, fs=F, dark=False)}
        <div style="display:flex;gap:20mm">{shot('RF-03', 385, 300, 'toothbrush.jpg', '칫솔 헤드 매크로', '이중미세모/스파이럴모 2종 나란히', acc=RF_GR, fs=F*0.8, dark=False)}{shot('RF-04', 385, 300, 'floss.jpg', '칫솔형 치실', 'ㄱ자 헤드 + 리필 20개입', acc=RF_GR, fs=F*0.8, dark=False)}</div>""", 're.feeel 2/3', RF_GR)
    rf3 = pg(RF_GR, f"""<div><div style="font-size:90pt;font-weight:900;color:{RF_YL};letter-spacing:.04em">BATH SLIPPER</div>
          <div style="font-size:240pt;font-weight:900;line-height:1.05;color:{CREAM}">벽지가<br>욕실화가<br><span style="color:{RF_YL}">됐습니다.</span></div></div>
        {flow(['실크벽지', 'PVC<br>분리', '욕실화'], RF_YL, CREAM)}
        {shot('RF-05', 790, 760, 'slipper-quilt.jpg', '욕실화 — 젖은 타일 위 컬러 4종', '물기 있는 회색 타일 · 퀼트/발등낮은 스마일 욕실화 컬러별 대각선 배치 · 탑뷰', acc=RF_YL, fs=F)}
        {ev_box4(F, RF_YL, INK, RF_DK)}""", 're.feeel 3/3', RF_YL)
    write('08_banner_950x2380_x6', (W, H), [rs1, rs2, rs3, rf1, rf2, rf3], '백월 족자 950×2380 ×6 v4 (라라슈 3 + re.feeel 3)')

# ───────── X배너 600×1800 ×3 ─────────
def xbanners_v4():
    W, H = 600, 1800
    gl = trim_rect(W, H, 0) + ''.join(f'<circle class="cut" cx="{cx}" cy="{cy}" r="6"/>' for cx in (25, W - 25) for cy in (25, H - 25)) + \
        f'<rect class="guide" x="40" y="60" width="{W-80}" height="{H-120}"/><text class="lbl" x="45" y="56" style="font-size:12px">아일렛(타공) 4곳 · 안전영역 40mm</text>'
    F = 2.3
    def prod(sid, ref, name, price, acc, fg, t, d):
        return f"""<div style="display:flex;gap:12mm;align-items:center">{shot(sid, 220, 200, ref, t, d, acc=acc, fs=1.4)}
          <div><div style="font-size:60pt;font-weight:900;line-height:1.2;color:{fg}">{name}</div>
          <div style="font-size:34pt;color:#9a9a9a;margin-top:3mm">정상가 {price}</div>
          <div style="font-size:42pt;font-weight:900;color:{acc};margin-top:2mm">현장가 ______원</div></div></div>"""
    x1 = col(f"""<div style="display:flex;justify-content:space-between;align-items:center">{lockup(90)}{dots(22, 14)}</div>
      <div style="font-size:190pt;font-weight:900;line-height:1.02;color:{LIME}">Made<br>for<br>Standing.</div>
      <div style="display:flex;align-items:center;gap:14mm">{foot_map(150, labels=False)}<div style="font-size:58pt;font-weight:900;color:#fff;line-height:1.3">바닥에 닿는<br>길을 따라<br><span style="color:{LIME}">그립 패드 4곳</span></div></div>
      {prod('X1-A', 'walking-cut.png', '쿼드그립<br>종일편한 워킹화', '42,500원', LIME, '#fff', '워킹화 3/4 측면', '차콜 1족 · 밑창 살짝 보이게')}
      {prod('X1-B', 'insole-cut.png', '쿼드그립<br>아치가득 인솔', '21,500원', LIME, '#fff', '인솔 M·L', '그레이·모카무스 탑뷰')}
      {ev_box4(F, LIME, INK, '#3d4a12')}""", 70, 1730, 50, W)
    x2 = col(f"""<div style="display:flex;justify-content:space-between;align-items:center"><img src="{A}refeeel-seal.png" style="width:170mm;background:{CREAM};border-radius:50%;padding:5mm"><div style="font-size:30pt;font-weight:900;color:{RF_YL};text-align:right">REFILL<br>YOUR DAY</div></div>
      <div style="font-size:150pt;font-weight:900;line-height:1.08;color:{CREAM}">생활을<br><span style="color:{RF_YL}">다시<br>채우다.</span></div>
      {shot('X2-A', 500, 470, 'cup-life.jpg', '욕실 선반 라이프컷', '양치컵(40°) + 칫솔 + 치실 + 스마일 욕실화 한 프레임', acc=RF_YL, fs=1.6)}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10mm;font-size:46pt;font-weight:900;color:{CREAM}">
        <div><span style="color:{RF_YL}">ORAL CARE</span><br><span style="font-size:36pt;font-weight:400">나무(간벌재)에서 온<br>CXP 칫솔·치실·양치컵</span></div>
        <div><span style="color:{RF_YL}">BATH SLIPPER</span><br><span style="font-size:36pt;font-weight:400">실크벽지 PVC를<br>다시 원료로</span></div></div>
      {ev_box4(F, RF_YL, INK, RF_DK)}""", 70, 1730, 50, W)
    write('07_xbanner_600x1800', (W, H), [(x1, INK, gl), (x2, RF_GR, gl)], 'X배너 600×1800 v4 ①라라슈 ②re.feeel (③정형외과 = 07b)')
    x3 = col(f"""<div style="display:flex;justify-content:space-between;align-items:center">{logo(70)}<div style="font-size:30pt;font-weight:900;color:{LIME};letter-spacing:.08em">DESIGN ADVISORY</div></div>
      <div style="font-size:112pt;font-weight:900;line-height:1.15;color:#fff">서서 일하는 발,<br><span style="color:{LIME}">정형외과 전문의와</span><br>함께 살폈습니다.</div>
      {shot('X3-A', 500, 560, '', '원장님 상반신 (10/28 촬영 D4)', '흰 가운 · 회색 배경 · 손에 워킹화 밑창을 들고 라임 4점을 가리키는 포즈 · 정면 미소', fs=1.6)}
      <div><div style="font-size:90pt;font-weight:900;color:#fff">이문홍 원장</div><div style="font-size:42pt;font-weight:700;color:{LIME};margin-top:3mm">정형외과 전문의 · 이문홍정형외과</div></div>
      <div style="border-left:5mm solid {LIME};padding-left:14mm;font-size:46pt;line-height:1.5;color:#fff">“[원장님 확정 인용 문구]”<br><span style="color:#8a8a8a;font-size:32pt">예) 발이 바닥에 닿는 순서를 기준으로 패드 위치를 함께 검토했습니다.</span></div>
      <div style="display:flex;gap:16mm;align-items:center;background:#1b1b1b;border-radius:14mm;padding:18mm 20mm">{foot_map(110, labels=False)}
        <div style="font-size:40pt;line-height:1.6;color:#fff"><b style="color:{LIME}">자문 범위 — 형태와 착용 방식</b><br>① 쿼드그립 4점 패드 배치<br>② 아치가득 인솔 형태 · 뒤꿈치 컵<br>③ 기존 깔창 밑에 겹쳐 쓰는 방식</div></div>
      <div style="font-size:26pt;color:#8a8a8a;line-height:1.5">이문홍 원장은 ㈜알앤디메이커스 제품 설계 자문에 참여하고 자문료를 받았습니다.<br>본 제품은 의료기기가 아닙니다. 부스에서는 발 상담·진단을 하지 않습니다.</div>""", 70, 1730, 50, W)
    write('07b_xbanner_doctor_600x1800', (W, H), [(x3, INK, gl)], 'X배너 600×1800 v4 — 정형외과 전문의 설계 자문')

# ───────── POP A4 ×3 ─────────
def pops_v4():
    B, W, H = 3, 216, 303
    tr = trim_rect(W, H, B)
    def price(p, acc, fg):
        return f"""<div style="display:flex;justify-content:space-between;align-items:flex-end;border-top:.6mm solid {acc};padding-top:4mm">
          <div><div style="font-size:10pt;color:#9a9a9a">정상가</div><div style="font-size:20pt;font-weight:900;color:#9a9a9a;text-decoration:line-through">{p}</div></div>
          <div style="text-align:right"><div style="font-size:12pt;font-weight:900;color:{acc}">박람회 현장가</div>
          <div style="width:100mm;height:24mm;border:.8mm dashed {acc};border-radius:4mm;margin-top:2mm;display:flex;align-items:center;justify-content:flex-end;padding-right:5mm;font-size:22pt;font-weight:900;color:{fg}">원</div></div></div>"""
    p1 = col(f"""<div style="display:flex;justify-content:space-between;align-items:center">{logo(14)}<div style="font-size:10pt;font-weight:900;color:{LIME}">RS · WALKING</div></div>
      <div style="font-size:34pt;font-weight:900;line-height:1.1;color:#fff">쿼드그립<br><span style="color:{LIME}">종일편한 워킹화</span></div>
      <div style="display:flex;gap:6mm;align-items:center">{shot('P1', 120, 95, 'walking-cut.png', '페어 탑뷰 + 밑창 1짝', '차콜 · 한 짝은 뒤집어 라임 4점', fs=0.5)}{foot_map(52, labels=False)}</div>
      <div style="font-size:12.5pt;font-weight:700;line-height:1.75;color:#fff"><span style="color:{LIME}">01</span> 바닥에 닿는 길을 따라 그립 패드 4곳<br><span style="color:{LIME}">02</span> 패드 무늬는 국내 연구 2편을 보고 설계<br><span style="color:{LIME}">03</span> 깔창 없는 일체형 안창 · 국내 제조</div>
      {price('42,500원', LIME, '#fff')}
      <div style="font-size:7.5pt;color:#8a8a8a">230~280mm · 차콜 / 그레이 / 민트화이트</div>""", B + 12, H - B - 12, B + 12, W)
    p2 = col(f"""<div style="display:flex;justify-content:space-between;align-items:center">{logo(14,'ink')}<div style="font-size:10pt;font-weight:900">RS · INSOLE</div></div>
      <div style="font-size:30pt;font-weight:900;line-height:1.12">오후 4시,<br>발이 먼저 퇴근하고<br>싶을 때.</div>
      {shot('P2', 190, 90, 'insole-cut.png', '인솔 M·L 탑뷰', '그레이·모카무스 · 반굽 길이 비교', acc=INK, fs=0.5)}
      <div style="background:{INK};border-radius:4mm;padding:5mm 6mm;font-size:12.5pt;font-weight:700;line-height:1.75;color:#fff"><span style="color:{LIME}">01</span> 아치 아래 빈 공간, 가득<br><span style="color:{LIME}">02</span> 쓰던 깔창 밑에 한 장 더 (반굽)<br><span style="color:{LIME}">03</span> M 15cm · L 17cm</div>
      {price('21,500원', INK, INK)}
      <div style="font-size:7.5pt;color:#3d4a12">신발 형태·재질에 따라 착용감이 다를 수 있습니다. 본 제품은 의료기기가 아닙니다.</div>""", B + 12, H - B - 12, B + 12, W)
    p3 = col(f"""<div style="display:flex;justify-content:space-between;align-items:center"><img src="{A}refeeel-seal.png" style="width:40mm;background:{CREAM};border-radius:50%;padding:1.5mm"><div style="font-size:10pt;font-weight:900;color:{RF_YL}">INSTAGRAM EVENT</div></div>
      <div style="font-size:36pt;font-weight:900;line-height:1.08;color:{CREAM}">팔로우하면<br><span style="color:{RF_YL}">CXP 볼펜</span>,<br>스토리 태그엔<br><span style="color:{RF_YL}">칫솔</span>까지!</div>
      <div style="display:flex;align-items:center;gap:8mm"><div style="flex:none;width:62mm;height:62mm;background:#fff;border-radius:4mm;display:flex;align-items:center;justify-content:center;font-size:12pt;color:#666;text-align:center">인스타<br>QR</div>
        <div style="font-size:13pt;font-weight:700;line-height:1.9;color:{CREAM}"><span style="color:{RF_YL}">①</span> QR로 {EVENT_ACC} 팔로우<br><span style="color:{RF_YL}">②</span> 팔로우 화면 → 볼펜<br><span style="color:{RF_YL}">③</span> 스토리에 {EVENT_ACC} 태그<br>　 + #이벤트참여 → 칫솔</div></div>
      {shot('P3', 190, 55, 'cxp.jpg', '@re.feeel 로고 볼펜·칫솔 실물', '로고 인쇄된 볼펜 3 + 칫솔 2 + 원료(간벌재 칩) · 크림 배경', acc=RF_YL, fs=0.5)}
      <div style="font-size:10pt;line-height:1.6;color:{CREAM}"><b style="color:{RF_YL}">CXP 볼펜</b> — 숲을 가꾸며 솎아낸 나무(간벌재)로 만든 소재. re.feeel 칫솔·치실·양치컵과 같은 소재예요.</div>
      <div style="font-size:7.5pt;color:#9fb5a5">1인 1회 · 일일 수량 소진 시 종료 · ㈜알앤디메이커스 RhaRa Shoe · re.feeel</div>""", B + 12, H - B - 12, B + 12, W)
    write('04_pop_A4_x3', (W, H), [(p1, INK, tr), (p2, LIME, tr), (p3, RF_GR, tr)], 'POP A4 세로 ×3 v4 (워킹화 / 인솔 / 인스타 이벤트)')

# ───────── 리플렛 + 다국어 카탈로그 v4 (A4 3단 C접지) ─────────
def leaflet_v4():
    B, W, H = 3, 303, 216
    P, Q = [97, 100, 100], [100, 100, 97]
    def lines(widths):
        xs, s = [], B
        for wd in widths[:-1]:
            s += wd; xs.append(s)
        return trim_rect(W, H, B) + ''.join(f'<line class="fold" x1="{xx}" y1="{B}" x2="{xx}" y2="{H-B}"/>' for xx in xs) + \
            ''.join(f'<rect class="guide" x="{xx-4}" y="{B+3}" width="8" height="{H-2*B-6}"/>' for xx in xs)
    def box(x, w, bg, inner):
        return f'<div class="abs" style="left:{x}mm;top:0;width:{w}mm;height:{H}mm;background:{bg}">{col(inner, 12, H - 10, 9, w)}</div>'
    EN = lambda c: f'font-size:6.6pt;line-height:1.45;color:{c}'
    o1, o2 = B + 97, B + 197
    i1, i2 = B + 100, B + 200
    flap = box(0, o1, RF_GR, f"""<div><div style="font-size:7pt;font-weight:900;letter-spacing:.15em;color:{RF_YL}">re.feeel · BATH SLIPPER</div>
        <div style="font-size:17pt;font-weight:900;line-height:1.15;color:{CREAM};margin-top:2mm">벽지가<br>욕실화가 <span style="color:{RF_YL}">됐습니다.</span></div>
        <div style="font-size:8pt;font-weight:700;color:{RF_YL};margin-top:1mm">Wallpaper became bath slippers.</div></div>
      {shot('L-01', 78, 58, 'slipper-quilt.jpg', '욕실화 컬러 4종', '젖은 타일 탑뷰', acc=RF_YL, fs=0.28, r=3)}
      <div style="font-size:7.8pt;line-height:1.6;color:{CREAM}">실크벽지에서 분리한 PVC를 다시 원료로.<br>물빠짐 구멍 · 바닥 패턴 · 국내 제조<br>전국 생활용품 매장 납품 중</div>
      <div style="{EN('#b9c9bd')}">Made with PVC separated from silk wallpaper. Drain holes and a patterned sole. Made in Korea.</div>""")
    back = box(o1, 100, WHITE, f"""<div><div style="font-size:7pt;font-weight:900;letter-spacing:.15em">MAKER · 제조사</div>
        <div style="font-size:13pt;font-weight:900;margin-top:1mm">{CO["co"]}</div><div style="font-size:7.5pt;font-weight:700;color:{MUTE}">R&amp;D Makers Co., Ltd. · MADE IN KOREA</div>
        <div style="font-size:7.2pt;line-height:1.55;margin-top:2mm">버려지는 소재로 생활용품을 만드는 국내 제조사입니다.<br><span style="color:#555">A Korean maker turning discarded materials into everyday goods.</span></div></div>
      <div style="font-size:6.7pt;line-height:1.55;font-family:'Noto Sans SC',N"><b>中文</b>　我们是利用回收材料制造生活用品的韩国制造商。RhaRa Shoe 为站立工作的人设计工作鞋与鞋垫，鞋底防滑垫采用回收轮胎橡胶与回收壁纸 PVC。re.feeel 推出以林业副产物 CXP 材料制成的口腔护理用品及回收 PVC 浴室拖鞋。全部韩国制造，欢迎批发及 OEM/ODM 洽谈。</div>
      <div style="font-size:6.7pt;line-height:1.55;font-family:'Noto Sans JP',N"><b>日本語</b>　リサイクル素材で生活用品をつくる韓国のメーカーです。RhaRa Shoe は立ち仕事をする人のためのワーキングシューズとインソール。靴底のグリップパッドには廃タイヤゴムと壁紙由来の再生 PVC を使用。re.feeel は林業副産物を活用した CXP 素材のオーラルケア用品と再生 PVC のバススリッパ。すべて韓国製造。卸売・OEM/ODM のご相談を承ります。</div>
      <div style="display:flex;justify-content:space-between;align-items:center;border-top:.3mm solid {INK};padding-top:3mm"><div style="font-size:7.3pt;line-height:1.7">T  {CO["cs"]}<br>E  {CO["mail"]}<br>A  {CO["addr"]}<br>W  {CO["web"]} · IG {CO["ig"]}</div>{qr("flyer",22)}</div>
      <div style="background:{INK};color:#fff;border-radius:2mm;padding:2.5mm 3.5mm;font-size:7.2pt;font-weight:700;line-height:1.5">단체 구매 · 도매 · OEM/ODM 상담<br><span style="font-weight:400;color:{LIME}">Wholesale &amp; OEM/ODM inquiries welcome</span></div>""")
    cover = box(o2, W - o2, INK, f"""<div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:6.5pt;font-weight:700;letter-spacing:.2em;color:#9a9a9a">KR · EN · 中文 · 日本語</div><div style="font-size:6.5pt;font-weight:900;color:{LIME}">CATALOG 2026</div></div>
      <div><div style="font-size:30pt;font-weight:900;line-height:1.05;color:#fff">남은 것의<br><span style="color:{LIME}">다음 모양.</span></div><div style="font-size:8.5pt;font-weight:700;color:#bdbdbd;margin-top:2mm">The next shape of what's left.</div></div>
      {shot('L-02', 82, 62, 'walking-cut.png', '커버 — 워킹화 밑창 라임 4점 + 양치컵', '블랙 배경 · 두 브랜드 대표 제품 한 프레임', fs=0.3, r=3)}
      <div style="display:flex;align-items:center;gap:6mm">{logo(17)}<img src="{A}refeeel-seal.png" style="height:22mm;background:{CREAM};border-radius:50%;padding:.8mm"></div>
      <div style="font-size:7.3pt;line-height:1.6;color:#fff"><b style="color:{LIME}">RhaRa Shoe 라라슈</b> 서서 일하는 사람의 워킹화·인솔<br><b style="color:{RF_YL}">re.feeel</b> 구강용품 · 욕실화<br><span style="color:#9a9a9a">{CO["co"]}</span></div>""")
    out = flap + back + cover
    walk = box(0, i1, INK, f"""<div><div style="font-size:7pt;font-weight:900;letter-spacing:.15em;color:{LIME}">RhaRa Shoe · 01 WALKING</div>
        <div style="font-size:16pt;font-weight:900;line-height:1.15;color:#fff;margin-top:1.5mm">쿼드그립<br><span style="color:{LIME}">종일편한 워킹화</span></div>
        <div style="font-size:7.5pt;font-weight:700;color:#bdbdbd">QUAD GRIP All-Day Walking Shoes · 42,500원</div></div>
      <div style="display:flex;gap:4mm;align-items:center">{foot_map(30, labels=False)}<div><div style="font-size:30pt;font-weight:900;color:{LIME};line-height:1">60<span style="font-size:14pt">%</span></div>
        <div style="font-size:7.3pt;color:#fff;line-height:1.45">서 있을 때 체중의 약 60%가<br>뒤꿈치에 실린다는 연구가 있습니다.</div><div style="font-size:5.5pt;color:#8a8a8a;margin-top:1mm">{CAV_NOTE}</div>
        <div style="font-size:7.3pt;color:#fff;line-height:1.45;margin-top:2mm">→ 바닥에 닿는 길을 따라<br><b style="color:{LIME}">그립 패드 4곳</b></div></div></div>
      <div style="display:flex;flex-direction:column;gap:1.8mm">{paper_cards(0.3, LIME)}</div>
      <div style="font-size:5.5pt;color:#8a8a8a;line-height:1.4">{PAPER_NOTE}</div>
      <div style="{EN('#bdbdbd')}">Grip pads at four points along the path your foot meets the floor. Pad pattern designed with reference to two Korean studies. One-piece footbed. 230–280mm · Charcoal / Gray / Mint White.</div>""")
    ins = box(i1, 100, LIME, f"""<div><div style="font-size:7pt;font-weight:900;letter-spacing:.15em">RhaRa Shoe · 02 ARCH INSOLE</div>
        <div style="font-size:15pt;font-weight:900;line-height:1.15;margin-top:1.5mm">오후 4시, 발이 먼저<br>퇴근하고 싶을 때.</div>
        <div style="font-size:7.5pt;font-weight:700;color:#3d4a12">QUAD GRIP Arch Insole · 21,500원</div></div>
      {shot('L-03', 82, 58, 'insole-cut.png', '인솔 M·L + 쓰던 깔창 겹침', '기존 깔창 밑에 반굽을 받친 단면 연출', acc=INK, fs=0.3, r=3)}
      <div style="background:{INK};border-radius:2.5mm;padding:3.5mm 4mm;font-size:7.8pt;font-weight:700;line-height:1.75;color:#fff"><span style="color:{LIME}">01</span> 아치 아래 빈 공간, 가득<br><span style="color:{LIME}">02</span> 반굽 — 쓰던 깔창 밑에 한 장 더<br><span style="color:{LIME}">03</span> 우드칩 배합 소재 · M 15cm / L 17cm</div>
      <div style="{EN('#2a3410')}">Fills the space under your arch. Half-length: slip it under the insole you already use. Not a medical device.</div>
      <div style="font-size:5.8pt;color:#3d4a12;line-height:1.4">사출 특성상 ±5% · 신발 형태·재질에 따라 착용감이 다를 수 있습니다. 본 제품은 의료기기가 아닙니다.</div>""")
    oral = box(i2, W - i2, CREAM, f"""<div><div style="font-size:7pt;font-weight:900;letter-spacing:.15em;color:{RF_GR}">re.feeel · ORAL CARE</div>
        <div style="font-size:16pt;font-weight:900;line-height:1.15;margin-top:1.5mm">나무에서 온<br><span style="color:{RF_GR}">구강케어.</span></div>
        <div style="font-size:7.5pt;font-weight:700;color:{RF_GR}">Oral care from wood.</div></div>
      {shot('L-04', 80, 58, 'cup-tilt.jpg', '양치컵 40° + 칫솔', '흰 배경 측면 · 물방울', acc=RF_GR, fs=0.3, r=3, dark=False)}
      <div style="display:flex;justify-content:space-between;font-size:7pt;font-weight:900;color:{RF_GR};text-align:center">{'<span>→</span>'.join(f'<div><div style="width:15mm;height:15mm;border-radius:50%;background:{RF_GR};color:{CREAM};display:flex;align-items:center;justify-content:center;margin:0 auto 1mm;font-size:10pt">{i+1}</div>{t}</div>' for i, t in enumerate(['간벌재', 'CXP 소재', '칫솔·치실·컵']))}</div>
      <div style="font-size:7.6pt;line-height:1.65"><b>칫솔</b> · <b>칫솔형 치실</b>(리필 20개입) · <b>양치컵</b><br>숲을 가꾸며 솎아낸 간벌재로 만든 CXP 소재<br>양치컵은 40° 기울여 세워 말리는 구조</div>
      <div style="{EN('#555')}">Toothbrush, toothbrush-style floss and rinse cup made with CXP, a material using thinned wood from forest care.</div>""")
    write('06_leaflet_A4_3fold', (W, H), [(out, WHITE, lines(P)), (walk + ins + oral, WHITE, lines(Q))], '리플렛+다국어 카탈로그 A4 3단 C접지 v4')

def shot_list():
    seen, rows = set(), []
    for sid, t, d, ref in SHOTS:
        if sid in seen: continue
        seen.add(sid); rows.append(f'| {sid} | {t} | {d} | {ref or "—"} |')
    open(os.path.join(HERE, 'shot-list-v4.md'), 'w').write('# 스튜디오 촬영 레퍼런스 (박람회 인쇄물 v4)\n\n> 출력물의 📷 STUDIO 박스 = 이 컷으로 교체. 레퍼런스 열 = 구도 참고용 현재 사진(인쇄 사용 ✗)\n\n| ID | 컷 | 촬영 지시 | 현재 참고 사진 |\n|---|---|---|---|\n' + '\n'.join(rows) + '\n')

# ───────── 10. 포맥스 로고 사인 (자립형 · 재사용) ─────────
# 공통: 포맥스(PVC) 5T · UV 직접 인쇄 · 외곽 칼선 컷팅 · 하단 중앙 슬롯(5.2×40) + 끼움 받침 다리 → 분리해 납작 보관
# 재사용 원칙: 날짜·가격·전시회명 ✗ (계정·QR·제품명만) → 다음 전시회에서 그대로 씀
SIGNS = []
def contour_from_png(png, target_h, off, pad=0):
    src = Image.open(os.path.join(HERE, A, png)).convert('RGBA')
    w = round(target_h * src.width / src.height); h = target_h
    W, H = w + 2 * off + 2 * pad, h + 2 * off + 2 * pad
    m = np.zeros((H, W), np.uint8)
    al = np.array(src.resize((w, h)).split()[3])
    m[off + pad:off + pad + h, off + pad:off + pad + w] = (al > 40).astype(np.uint8) * 255
    m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * off + 1, 2 * off + 1)))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (41, 41)))
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = cv2.approxPolyDP(max(cs, key=cv2.contourArea), 0.6, True)[:, 0, :]
    return W, H, w, h, 'M' + ' L'.join(f'{x},{y}' for x, y in c) + ' Z'

def slot_lines(W, H, slot=True):
    if not slot: return ''
    cx = W / 2
    return f'<rect class="cut" x="{cx-2.6}" y="{H-40}" width="5.2" height="40"/><text class="lbl" x="{cx+6}" y="{H-30}">슬롯 5.2×40 (받침 끼움)</text>'

def sign(name, title, W, H, body, bg, cut, qty, where, mat):
    lines = cut + slot_lines(W, H) + f'<text class="lbl" x="4" y="{H-4}">{title} · {W}×{H}mm · {mat} · {qty}개</text>'
    write(name, (W, H), [(body, 'transparent', lines)], f'포맥스 사인 {title} {W}×{H}')
    SIGNS.append(dict(name=name, title=title, W=W, H=H, qty=qty, where=where, mat=mat))

def signs_foamex():
    r = lambda W, H, rr: f'<rect class="cut" x="0" y="0" width="{W}" height="{H}" rx="{rr}"/>'
    def panel(W, H, rr, bg, inner):
        return f'<div class="abs" style="left:0;top:0;width:{W}mm;height:{H}mm;background:{bg};border-radius:{rr}mm"></div>' + inner
    # S1 RS 로고 컷팅 (블랙 포맥스 실루엣 + 라임 로고)
    W, H, lw, lh, path = contour_from_png('rs-logo-lime.png', 260, 14, 0)
    H2 = H + 60
    body = f'''<svg class="abs" style="left:0;top:0" width="{W}mm" height="{H2}mm" viewBox="0 0 {W} {H2}"><path d="{path}" fill="{INK}"/><rect x="{14}" y="{H-30}" width="{W-28}" height="90" rx="10" fill="{INK}"/></svg>
      <img class="abs" src="{A}rs-logo-lime.png" style="left:14mm;top:14mm;width:{lw}mm;height:{lh}mm">
      <img class="abs" src="{A}rs-wordmark-lime.png" style="left:{14 + lw * 9 / 478:.1f}mm;top:{H - 30 + 45 - lw * 459 / 478 * WM_R / 2:.1f}mm;width:{lw * 459 / 478:.1f}mm">'''
    cut = f'<path class="cut" d="{path}"/><rect class="cut" x="14" y="{H-30}" width="{W-28}" height="90" rx="10"/>'
    sign('10a_foamex_RS_logo', 'S1 RS 로고 컷팅', W, H2, body, None, cut, 1, 'KD-03 3단진열대 상단 중앙 (높이 1,000 위 → 눈높이)', '블랙 포맥스 5T + 라임·화이트 UV')
    # S2 re.feeel 씰 원형
    D = 320
    body = f'''<div class="abs" style="left:0;top:0;width:{D}mm;height:{D}mm;border-radius:50%;background:{CREAM}"></div>
      <img class="abs" src="{A}refeeel-seal.png" style="left:12mm;top:12mm;width:{D-24}mm;height:{D-24}mm">
      <div class="abs" style="left:{D/2-60}mm;top:{D-2}mm;width:120mm;height:60mm;background:{RF_GR};border-radius:0 0 10mm 10mm;text-align:center;font-size:20pt;font-weight:900;color:{RF_YL};padding-top:16mm">@re.feeel</div>'''
    cut = f'<circle class="cut" cx="{D/2}" cy="{D/2}" r="{D/2}"/><rect class="cut" x="{D/2-60}" y="{D-10}" width="120" height="68" rx="10"/>'
    sign('10b_foamex_refeeel_seal', 'S2 re.feeel 씰 원형', D, D + 58, body, None, cut, 1, 'KD-12 구강 쇼케이스 상단 (높이 900 위)', '화이트 포맥스 5T + 풀컬러 UV')
    # S3 제품명 사인 ×2 (포디움 위)
    for key, en, ko, sub in [('walking', 'QUAD GRIP', '종일편한 워킹화', '바닥에 닿는 길을 따라 그립 패드 4곳'), ('insole', 'QUAD GRIP', '아치가득 인솔', '쓰던 깔창 밑에 한 장 더 — 반굽')]:
        W, H = 300, 160
        body = panel(W, H, 12, INK, f'''<div class="abs" style="left:18mm;top:14mm">{lockup(26)}</div>
          <div class="abs" style="left:18mm;top:52mm;font-size:30pt;font-weight:900;color:{LIME};letter-spacing:.04em">{en}</div>
          <div class="abs" style="left:18mm;top:70mm;font-size:46pt;font-weight:900;color:#fff">{ko}</div>
          <div class="abs" style="left:18mm;top:100mm;font-size:17pt;color:#cfcfcf">{sub}</div>
          <div class="abs" style="right:18mm;top:18mm">{dots(7, 4.5)}</div>''')
        sign(f'10c_foamex_product_{key}', f'S3 제품명 — {ko}', W, H, body, None, r(W, H, 12), 1, f'허니콤 포디움 위 ({ko} 옆)', '블랙 포맥스 5T + 라임·화이트 UV')
    # S4 이벤트 사인 (QR 실제 링크)
    W, H = 300, 220
    body = panel(W, H, 14, RF_GR, f'''<div class="abs" style="left:16mm;top:16mm;width:120mm;height:120mm;background:#fff;border-radius:6mm;padding:6mm"><img src="{A}qr-refeeel-ig.svg" style="width:108mm;height:108mm"></div>
      <div class="abs" style="left:146mm;top:18mm;font-size:16pt;font-weight:900;letter-spacing:.08em;color:{RF_YL}">INSTAGRAM</div>
      <div class="abs" style="left:146mm;top:28mm;font-size:30pt;font-weight:900;color:#fff">@re.feeel</div>
      <div class="abs" style="left:146mm;top:52mm;width:140mm;font-size:22pt;font-weight:900;line-height:1.35;color:{CREAM}">팔로우하면<br><span style="color:{RF_YL}">CXP 볼펜</span><br>스토리 태그엔<br><span style="color:{RF_YL}">칫솔</span>까지</div>
      <div class="abs" style="left:16mm;top:146mm;width:268mm;font-size:13pt;color:{CREAM};line-height:1.5">QR로 팔로우 → 화면 보여 주세요 · 1인 1회 · 준비 수량 소진 시 종료<br><span style="color:#9fb5a5">스토리에는 #이벤트참여 를 함께 적어 주세요</span></div>''')
    sign('10d_foamex_event_qr', 'S4 이벤트 QR (@re.feeel)', W, H, body, None, r(W, H, 14), 1, '기본 데스크(카운터) 위 — 통로 쪽 정면', '화이트 포맥스 5T + 풀컬러 UV')
    # S5 쿼드그립 미니 (3단 중단)
    W, H = 240, 120
    body = panel(W, H, 10, INK, f'''<div class="abs" style="left:10mm;top:8mm">{foot_map(40, labels=False)}</div>
      <div class="abs" style="left:62mm;top:20mm;font-size:16pt;font-weight:900;color:{LIME}">QUAD GRIP</div>
      <div class="abs" style="left:62mm;top:32mm;font-size:24pt;font-weight:900;color:#fff;line-height:1.25">바닥에 닿는 길을<br>따라 4곳.</div>
      <div class="abs" style="left:62mm;top:80mm;font-size:12pt;color:#bdbdbd">밑창을 뒤집어 확인해 보세요</div>''')
    sign('10e_foamex_quadgrip_mini', 'S5 쿼드그립 미니', W, H, body, None, r(W, H, 10), 1, 'KD-03 중단 (밑창 뒤집어 놓은 단) 또는 타워쇼케이스 앞', '블랙 포맥스 5T + 라임·화이트 UV')
    # S6 re.feeel 미니 ×2
    for key, en, ko, sub, bg, fg, ac in [('oral', 'ORAL CARE', '나무에서 온 구강케어.', '간벌재(임업부산물) 기반 CXP 소재 — 칫솔 · 치실 · 양치컵', CREAM, INK, RF_GR),
                                         ('slipper', 'BATH SLIPPER', '벽지가 욕실화가 됐습니다.', '실크벽지에서 분리한 PVC를 다시 원료로', RF_GR, CREAM, RF_YL)]:
        W, H = 240, 100
        body = panel(W, H, 10, bg, f'''<div class="abs" style="left:14mm;top:14mm;font-size:14pt;font-weight:900;letter-spacing:.08em;color:{ac}">re.feeel · {en}</div>
          <div class="abs" style="left:14mm;top:30mm;font-size:24pt;font-weight:900;color:{fg}">{ko}</div>
          <div class="abs" style="left:14mm;top:62mm;width:212mm;font-size:12pt;color:{fg};opacity:.8">{sub}</div>''')
        sign(f'10f_foamex_refeeel_{key}', f'S6 re.feeel — {en}', W, H, body, None, r(W, H, 10), 1, 'KD-12 쇼케이스 앞' if key == 'oral' else 'KD-01 욕실화 매대 위', '화이트 포맥스 5T + 풀컬러 UV')
    # S7 원장 코너 (성명 없이 — 재사용·계약 범위 안전)
    W, H = 260, 130
    body = panel(W, H, 10, INK, f'''<div class="abs" style="left:14mm;top:14mm;font-size:13pt;font-weight:900;letter-spacing:.1em;color:{LIME}">DESIGN ADVISORY</div>
      <div class="abs" style="left:14mm;top:26mm;font-size:24pt;font-weight:900;color:#fff;line-height:1.25">정형외과 전문의<br>설계 자문</div>
      <div class="abs" style="left:14mm;top:66mm;font-size:17pt;font-weight:900;color:{LIME}">이문홍정형외과 <span style="font-size:12pt;font-weight:400;color:#bdbdbd">서울 목동</span></div>
      <div class="abs" style="left:14mm;top:88mm;width:232mm;font-size:12pt;color:#bdbdbd;line-height:1.45">자문 범위: 패드 배치 · 인솔 형태 · 착용 방식<br>본 제품은 의료기기가 아닙니다.</div>
      <div class="abs" style="right:14mm;top:16mm">{foot_map(30, labels=False)}</div>''')
    sign('10g_foamex_advisory', 'S7 원장 코너', W, H, body, None, r(W, H, 10), 1, 'KET-22 아크릴단상 위 (X배너 ③ 옆)', '블랙 포맥스 5T + 라임·화이트 UV')
    # 받침 다리 (공용, 9개)
    W, H = 160, 70
    body = f'<div class="abs" style="left:0;top:0;width:{W}mm;height:{H}mm;background:{INK};border-radius:35mm 35mm 4mm 4mm"></div>'
    cut = f'<path class="cut" d="M0,{H} L0,35 A35,35 0 0 1 35,0 L{W-35},0 A35,35 0 0 1 {W},35 L{W},{H} Z"/><rect class="cut" x="{W/2-2.6}" y="0" width="5.2" height="35"/><text class="lbl" x="4" y="{H-4}">받침 다리 — 사인 슬롯에 직각 끼움 · 슬롯 5.2×35 위에서</text>'
    write('10h_foamex_stand_leg', (W, H), [(body, 'transparent', cut)], '포맥스 받침 다리 160×70 (공용)')
    SIGNS.append(dict(name='10h_foamex_stand_leg', title='받침 다리 (공용)', W=W, H=H, qty=9, where='사인 9개에 1개씩', mat='블랙 포맥스 5T'))

# ═════════════════════════ v5 (10/16) 스터닝 견적 "박람회 전체 디자인" 항목 맞춤 ═════════════════════════
# 견적 항목: 명함 1종 · 제품 네임택 1종 · 웰컴 쇼핑백 1종 · 테이블 사인 3면 · X배너 3 · 백월 2면(각 3면=족자 6) · 리플렛
# ───────── 명함 1종 (90×50, 도련 2, 양면) ─────────
def card_v5():
    B, W, H = 2, 94, 54
    tr = trim_rect(W, H, B)
    front = f'''<div class="abs" style="left:8mm;top:7mm">{lockup(13)}</div>
      <img class="abs" src="{A}refeeel-seal.png" style="right:8mm;top:7mm;width:15mm;background:{CREAM};border-radius:50%;padding:.6mm">
      <div class="abs" style="left:8mm;top:27mm;font-size:12pt;font-weight:900;line-height:1.15;color:#fff">남은 것의<br><span style="color:{LIME}">다음 모양.</span></div>
      <div class="abs" style="left:8mm;top:43mm;font-size:5.6pt;color:#bdbdbd">㈜알앤디메이커스 · RhaRa Shoe 라라슈 · re.feeel</div>'''
    back = f'''<div class="abs" style="left:0;top:0;width:3mm;height:{H}mm;background:{LIME}"></div>
      <div class="abs" style="left:9mm;top:8mm;font-size:12.5pt;font-weight:900">{CO["name"]}</div>
      <div class="abs" style="left:9mm;top:15mm;font-size:6.2pt;font-weight:700;color:{OLIVE}">{CO["title"]} · {CO["co"]}</div>
      <div class="abs" style="left:9mm;top:24mm;font-size:5.9pt;line-height:1.6"><b>M</b> {CO["tel"]}<br><b>T</b> {CO["cs"]}<br><b>E</b> {CO["mail"]}<br><b>A</b> {CO["addr"]}</div>
      <div class="abs" style="right:7mm;top:8mm;text-align:center">{qr("flyer",15)}</div>
      <div class="abs" style="right:7mm;bottom:7mm;text-align:right;font-size:5.4pt;line-height:1.5;color:#555">IG {CO["ig"]}<br>IG @re.feeel</div>'''
    write('01_namecard_v5', (W, H), [(front, INK, tr), (back, WHITE, tr)], '명함 1종 v5 (90×50 · 엑스트라 린넨 250g 양면)')

# ───────── 제품 네임택 1종 (100×70 · 아크릴 L자 꽂이 · 품목별 내용 교체) ─────────
NAMETAGS = [
 ('rs', '쿼드그립 종일편한 워킹화', 'QUAD GRIP All-Day Walking Shoes', '바닥에 닿는 길을 따라 그립 패드 4곳 · 깔창 없는 일체형', '230~280 · 차콜/그레이/민트화이트', '42,500원'),
 ('rs', '쿼드그립 아치가득 인솔', 'QUAD GRIP Arch Insole', '쓰던 깔창 밑에 한 장 더 · 반굽 M 15cm / L 17cm', '그레이 / 모카무스 · 의료기기 아님', '21,500원'),
 ('rf', "나이스샷 '왕모' 칫솔", 'CXP Toothbrush', '간벌재 기반 CXP 핸들 · 이중미세모 / 스파이럴모', '6개입', '____원'),
 ('rf', '어금니까지 쏙쏙 칫솔형 치실', 'Toothbrush-style Floss', 'ㄱ자 헤드 · 칫솔처럼 쥐는 손잡이 · 리필 교체형', '핸들 + 리필 20개입', '4,900원'),
 ('rf', '40° 기울여 말리는 양치컵', 'CXP Rinse Cup', '기울여 세워 말리는 구조 · CXP 소재', '110g · 국내 제조', '____원'),
 ('rf', '퀼트패턴 스마일 욕실화', 'Quilt Smile Bath Slipper', '실크벽지에서 분리한 PVC를 다시 원료로', '275mm · 차콜/네이비', '3,900원'),
 ('rf', '발등낮은 스마일 욕실화', 'Low-top Smile Bath Slipper', '실크벽지에서 분리한 PVC를 다시 원료로', '컬러는 매대에서 확인', '____원'),
]
def nametags_v5():
    B, W, H = 2, 104, 74
    tr = trim_rect(W, H, B) + f'<line class="fold" x1="{B}" y1="{H-B-12}" x2="{W-B}" y2="{H-B-12}"/><text class="lbl" x="{B+2}" y="{H-B-13}">아크릴 꽂이에 가려지는 하단 12mm — 문구 ✗</text>'
    pages = []
    for brand, ko, en, pt, opt, price in NAMETAGS:
        dark = brand == 'rs'
        bg, fg, acc, sub = (INK, '#fff', LIME, '#bdbdbd') if dark else (CREAM, INK, RF_GR, '#555')
        mark = logo(7, 'lime') if dark else f'<img src="{A}refeeel-seal.png" style="height:10mm;background:#fff;border-radius:50%">'
        body = f'''<div class="abs" style="left:0;top:0;width:{W}mm;height:3.5mm;background:{acc}"></div>
          <div class="abs" style="left:8mm;top:8mm">{mark}</div>
          <div class="abs" style="right:8mm;top:9mm;font-size:6pt;font-weight:900;letter-spacing:.1em;color:{acc}">{'RhaRa Shoe' if dark else 're.feeel'}</div>
          <div class="abs" style="left:8mm;top:21mm;width:88mm;font-size:13pt;font-weight:900;line-height:1.2;color:{fg}">{ko}</div>
          <div class="abs" style="left:8mm;top:29.5mm;font-size:6.3pt;font-weight:700;color:{acc}">{en}</div>
          <div class="abs" style="left:8mm;top:35mm;width:88mm;font-size:6.6pt;line-height:1.45;color:{fg}">{pt}<br><span style="color:{sub}">{opt}</span></div>
          <div class="abs" style="right:8mm;top:45.5mm;font-size:14pt;font-weight:900;color:{fg if not dark else LIME}">{price}</div>'''
        pages.append((body, bg, tr))
    write('11_nametag_100x70', (W, H), pages, f'제품 네임택 1종 100×70 (내용 {len(pages)}종) — 아크릴 L자 꽂이')

# ───────── 테이블 사인 3면 (삼각기둥 · 면 150×210 · 접어서 세움) ─────────
def table_sign_3face():
    B, FW, FH, GL = 3, 150, 210, 15
    W, H = 3 * FW + GL + 2 * B, FH + 2 * B
    xs = [B + FW * i for i in range(4)]
    lines = f'<path class="cut" d="M{B},{B} H{xs[3]} L{xs[3]+GL},{B+8} V{H-B-8} L{xs[3]},{H-B} H{B} Z"/>' + \
        ''.join(f'<line class="fold" x1="{x}" y1="{B}" x2="{x}" y2="{H-B}"/>' for x in xs[1:4]) + \
        f'<text class="lbl" x="{xs[3]+2}" y="{H/2}">풀칠</text>' + ''.join(f'<rect class="guide" x="{x+6}" y="{B+6}" width="{FW-12}" height="{FH-12}"/>' for x in xs[:3])
    def face(i, bg, inner):
        return f'<div class="abs" style="left:{xs[i]}mm;top:{B}mm;width:{FW}mm;height:{FH}mm;background:{bg}">{inner}</div>'
    f1 = face(0, INK, f'''<div class="abs" style="left:12mm;top:12mm">{lockup(16)}</div>
        <div class="abs" style="left:12mm;top:40mm;font-size:27pt;font-weight:900;line-height:1.05;color:{LIME}">Made<br>for<br>Standing.</div>
        <div class="abs" style="left:12mm;top:104mm;width:126mm;display:flex;gap:6mm;align-items:center">{foot_map(26, labels=False)}<div style="font-size:11.5pt;font-weight:900;color:#fff;line-height:1.35">직접 신어 보세요<br><span style="color:{LIME}">230~280 시착 가능</span><br><span style="font-size:8pt;font-weight:400;color:#bdbdbd">쿼드그립 워킹화 · 아치가득 인솔</span></div></div>
        <div class="abs" style="left:12mm;bottom:12mm;font-size:7pt;color:#8a8a8a">RhaRa Shoe 라라슈 · Made for Standing.</div>''')
    f2 = face(1, RF_GR, f'''<img class="abs" src="{A}refeeel-seal.png" style="left:12mm;top:12mm;width:40mm;background:{CREAM};border-radius:50%;padding:1.5mm">
        <div class="abs" style="left:12mm;top:62mm;font-size:22pt;font-weight:900;line-height:1.15;color:{CREAM}">생활을<br><span style="color:{RF_YL}">다시 채우다.</span></div>
        <div class="abs" style="left:12mm;top:108mm;width:126mm;font-size:9.5pt;line-height:1.6;color:{CREAM}"><b style="color:{RF_YL}">ORAL CARE</b> 나무(간벌재)에서 온 CXP 칫솔·치실·양치컵<br><b style="color:{RF_YL}">BATH SLIPPER</b> 실크벽지 PVC로 만든 욕실화</div>
        <div class="abs" style="left:12mm;bottom:12mm;font-size:7pt;color:#9fb5a5">re.feeel · ㈜알앤디메이커스 · 국내 제조</div>''')
    f3 = face(2, RF_YL, f'''<div class="abs" style="left:12mm;top:12mm;font-size:9pt;font-weight:900;letter-spacing:.1em;color:{RF_GR}">INSTAGRAM EVENT</div>
        <div class="abs" style="left:12mm;top:22mm;font-size:21pt;font-weight:900;line-height:1.15;color:{INK}">팔로우하면<br><span style="color:{RF_GR}">CXP 볼펜</span>,<br>스토리 태그엔<br><span style="color:{RF_GR}">칫솔</span>까지!</div>
        <div class="abs" style="left:12mm;top:104mm;display:flex;gap:6mm;align-items:center"><div style="width:52mm;height:52mm;background:#fff;border-radius:3mm;padding:2mm"><img src="{A}qr-refeeel-ig.svg" style="width:48mm;height:48mm"></div>
          <div style="font-size:9pt;font-weight:700;line-height:1.7;color:{INK}">① QR로 @re.feeel 팔로우<br>② 화면 보여 주면 볼펜<br>③ 스토리 태그 +<br>　 #이벤트참여 → 칫솔</div></div>
        <div class="abs" style="left:12mm;bottom:12mm;font-size:7pt;color:{RF_DK}">1인 1회 · 준비 수량 소진 시 종료</div>''')
    write('03_table_sign_3face', (W, H), [(f1 + f2 + f3, WHITE, lines)], '테이블 사인 3면 삼각기둥 (면 150×210, 펼침 465×216)')

# ───────── 웰컴 쇼핑백 1종 (W250×H330×D100 · 앞 라라슈 / 뒤 re.feeel) ─────────
def bag_v5():
    M, Wp, Dp, Hp, TOP, BOT, GL = 15, 250, 100, 330, 40, 65, 20
    W = 2 * M + 2 * Wp + 2 * Dp + GL; H = 2 * M + TOP + Hp + BOT
    x = [M, M + Wp, M + Wp + Dp, M + 2 * Wp + Dp, M + 2 * Wp + 2 * Dp, M + 2 * Wp + 2 * Dp + GL]
    yT, yB, yE = M + TOP, M + TOP + Hp, M + TOP + Hp + BOT
    cut = f'<path class="cut" d="M{x[0]},{M} H{x[4]} L{x[5]},{M+8} V{yE-8} L{x[4]},{yE} H{x[0]} Z"/>' + ''.join(f'<line class="cut" x1="{xx}" y1="{yB}" x2="{xx}" y2="{yE}"/>' for xx in x[1:5])
    fold = ''.join(f'<line class="fold" x1="{xx}" y1="{M}" x2="{xx}" y2="{yB}"/>' for xx in x[1:5]) + f'<line class="fold" x1="{x[0]}" y1="{yT}" x2="{x[4]}" y2="{yT}"/><line class="fold" x1="{x[0]}" y1="{yB}" x2="{x[4]}" y2="{yB}"/>'
    for gc in (x[1] + Dp / 2, x[3] + Dp / 2):
        fold += f'<line class="fold" x1="{gc}" y1="{yT}" x2="{gc}" y2="{yB-Dp/2}"/><line class="fold" x1="{gc-Dp/2}" y1="{yB}" x2="{gc}" y2="{yB-Dp/2}"/><line class="fold" x1="{gc+Dp/2}" y1="{yB}" x2="{gc}" y2="{yB-Dp/2}"/>'
    holes = ''.join(f'<circle class="cut" cx="{cx}" cy="{cy}" r="2.5"/>' for cx in (x[0] + 85, x[0] + 165, x[2] + 85, x[2] + 165) for cy in (yT + 25, yT - 25))
    lines = cut + fold + holes + f'<text class="lbl" x="{x[0]+3}" y="{M+8}">윗면 접어넣기 40mm</text><text class="lbl" x="{x[0]+3}" y="{yB+10}">바닥 날개 {BOT}mm</text>'
    b = 3
    body = f'<div class="abs" style="left:{x[0]-b}mm;top:{M-b}mm;width:{x[2]-x[0]}mm;height:{yE-M+2*b}mm;background:{INK}"></div>'
    body += f'<div class="abs" style="left:{x[2]}mm;top:{M-b}mm;width:{x[5]-x[2]+b}mm;height:{yE-M+2*b}mm;background:{RF_GR}"></div>'
    body += f'<div class="abs" style="left:{x[1]}mm;top:{M-b}mm;width:{Dp}mm;height:{yB-M+b}mm;background:{LIME}"></div><div class="abs" style="left:{x[3]}mm;top:{M-b}mm;width:{Dp}mm;height:{yB-M+b}mm;background:{RF_YL}"></div>'
    for sx, t in ((x[1], 'Made for Standing.'), (x[3], 'REFILL YOUR DAY · @re.feeel')):
        body += f'<div class="abs" style="left:{sx+Dp/2}mm;top:{yT+Hp/2}mm;transform:translate(-50%,-50%) rotate(-90deg);font-size:20pt;font-weight:900;white-space:nowrap;color:{INK if t.startswith("Made") else RF_GR}">{t}</div>'
    body += f'''<div class="abs" style="left:{x[0]+26}mm;top:{yT+38}mm">{lockup(42)}</div>
      <div class="abs" style="left:{x[0]+26}mm;top:{yT+110}mm;font-size:46pt;font-weight:900;line-height:1.02;color:{LIME}">Made<br>for<br>Standing.</div>
      <div class="abs" style="left:{x[0]+26}mm;top:{yT+235}mm">{foot_map(30, labels=False)}</div>
      <div class="abs" style="left:{x[0]+70}mm;top:{yT+250}mm;font-size:12pt;font-weight:700;color:#fff;line-height:1.5">서서 일하는 사람의 신발<br><span style="color:{LIME}">RhaRa Shoe 라라슈</span></div>
      <img class="abs" src="{A}refeeel-seal.png" style="left:{x[2]+26}mm;top:{yT+34}mm;width:80mm;background:{CREAM};border-radius:50%;padding:3mm">
      <div class="abs" style="left:{x[2]+26}mm;top:{yT+135}mm;font-size:36pt;font-weight:900;line-height:1.1;color:{CREAM}">남은 것의<br><span style="color:{RF_YL}">다음 모양.</span></div>
      <div class="abs" style="left:{x[2]+26}mm;top:{yT+232}mm;font-size:11pt;line-height:1.6;color:{CREAM}">나무에서 온 구강케어 · 벽지가 된 욕실화<br><b style="color:{RF_YL}">@re.feeel</b>  ·  {CO["co"]}</div>
      <div class="abs" style="left:{x[2]+26}mm;top:{yT+290}mm;font-size:8pt;color:#9fb5a5">이 쇼핑백은 다시 쓰라고 튼튼하게 만들었습니다.</div>'''
    write('05_welcome_bag_v5', (W, H), [(body, WHITE, lines)], '웰컴 쇼핑백 v5 W250×H330×D100 (앞 라라슈 / 뒤 re.feeel)')

card_v5(); table_sign_3face(); nametags_v5(); pops_v4(); bag_v5(); leaflet_v4(); xbanners_v4(); banners_v4(); standee(); shot_list(); signs_foamex()
json.dump(MANIFEST, open(os.path.join(HERE, 'manifest.json'), 'w'), ensure_ascii=False, indent=1)
for m in MANIFEST: print(m['name'], m['w'], 'x', m['h'], 'mm', m['pages'], 'p')
