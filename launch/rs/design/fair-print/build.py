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
        html = f'<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>{title}</title><style>@page{{size:{w}mm {h}mm;margin:0}}{CSS}</style></head><body>{body}</body></html>'
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

cards(); table_sign(); price_labels(); shopping_bag(); leaflet(); xbanners(); banners(); standee()
json.dump(MANIFEST, open(os.path.join(HERE, 'manifest.json'), 'w'), ensure_ascii=False, indent=1)
for m in MANIFEST: print(m['name'], m['w'], 'x', m['h'], 'mm', m['pages'], 'p')
