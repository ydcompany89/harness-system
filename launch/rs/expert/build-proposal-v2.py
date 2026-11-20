"""원장님 자문 의뢰서 4p(2026-09-11) → v2: 표지 + 워킹화 설계 + 질문·약속 2장 추가, 날짜 갱신
python3 build-proposal-v2.py <원본.pptx> <출력.pptx>
기존 4장의 디자인 요소(배경·헤더·카드·번호 원)를 그대로 복제해 같은 톤으로 만든다."""
import copy, sys, os
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor

SRC, OUT = sys.argv[1], sys.argv[2]
HERE = os.path.dirname(os.path.abspath(__file__))
ASSET = os.path.join(HERE, '../design/fair-print/assets')
INK, GREEN, MUTE, MINT = RGBColor(0x1B, 0x23, 0x20), RGBColor(0x34, 0x91, 0x64), RGBColor(0x5B, 0x67, 0x62), RGBColor(0xEB, 0xF3, 0xEF)
DATE_OLD, DATE_NEW = '2026.09.11', '2026.10.14'

prs = Presentation(SRC)
S = list(prs.slides)
blank = S[0].slide_layout


def find(slide, text=None, name=None):
    for sh in slide.shapes:
        if name and sh.name == name:
            return sh
        if text and sh.has_text_frame and sh.text_frame.text.startswith(text):
            return sh
    raise KeyError(text or name)


def clone(src_shape, dst_slide, x=None, y=None, w=None, h=None, text=None):
    el = copy.deepcopy(src_shape._element)
    dst_slide.shapes._spTree.append(el)
    sh = dst_slide.shapes[-1]
    if x is not None: sh.left = Inches(x)
    if y is not None: sh.top = Inches(y)
    if w is not None: sh.width = Inches(w)
    if h is not None: sh.height = Inches(h)
    if text is not None:
        set_text(sh, text)
    return sh


def set_text(sh, text):
    """첫 문단·첫 런 서식을 유지하고 줄마다 문단을 복제해 텍스트 교체"""
    tf = sh.text_frame
    p0 = tf.paragraphs[0]
    proto_p = copy.deepcopy(p0._p)
    for p in list(tf.paragraphs)[1:]:
        p._p.getparent().remove(p._p)
    lines = text.split('\n')
    for i, line in enumerate(lines):
        if i == 0:
            p = p0
        else:
            new = copy.deepcopy(proto_p)
            tf._txBody.append(new)
            p = tf.paragraphs[-1]
        runs = p.runs
        if runs:
            runs[0].text = line
            for r in runs[1:]:
                r._r.getparent().remove(r._r)
        else:
            p.add_run().text = line


def new_slide():
    s = prs.slides.add_slide(blank)
    for ph in list(s.placeholders):
        ph._element.getparent().remove(ph._element)
    return s


def textbox(slide, x, y, w, h, text, size, bold=False, color=INK, align=None):
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    for i, line in enumerate(text.split('\n')):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        if align: p.alignment = align
        r = p.add_run(); r.text = line
        f = r.font; f.size = Pt(size); f.bold = bold; f.color.rgb = color; f.name = 'Malgun Gothic'
        p.space_after = Pt(size * 0.35)
    return tb


# 원본에서 디자인 부품 가져오기
s2, s3 = S[1], S[2]
BG = find(s2, name='Rectangle 1')
CARD = find(s2, name='Rounded Rectangle 8')
OVAL = find(s2, name='Oval 9')
NUM = find(s2, text='01')
EYEBROW = find(s2, text='PRODUCT')
TITLE = find(s2, text='인솔은')
SUB = find(s2, text='친환경성 · 초경량성')
FOOT = find(s2, text='R&D MAKERS')
CT = find(s2, text='인체공학적 지지')
CTAG = find(s2, text='60% HALF-GEAR')
CDESC = find(s2, text='후족부')
CNOTE = find(s2, text='족저근막')
NOTE = find(s2, text='※')


def header(s, eyebrow, title, sub):
    clone(BG, s)
    clone(EYEBROW, s, text=eyebrow)
    clone(TITLE, s, text=title)
    clone(SUB, s, text=sub)
    clone(FOOT, s, text=f'R&D MAKERS  |  {DATE_NEW}')

# ───────── 표지 ─────────
cover = new_slide()
clone(BG, cover)
clone(CARD, cover, x=7.05, y=0.9, w=5.55, h=5.7)
cover.shapes.add_picture(os.path.join(ASSET, 'walking-cut.png'), Inches(7.6), Inches(1.25), height=Inches(3.7))
textbox(cover, 7.45, 5.2, 4.8, 0.3, 'RS · RhaRa Shoe', 13, True, GREEN)
textbox(cover, 7.45, 5.55, 4.9, 0.6, '쿼드그립 종일편한 워킹화 · 쿼드그립 아치가득 인솔', 11, False, MUTE)
textbox(cover, 0.8, 1.05, 5, 0.3, 'PROPOSAL  ·  FOR ORTHOPEDIC ADVISOR', 10, True, GREEN)
textbox(cover, 0.8, 1.7, 6.0, 1.9, '기능성 신발 + 인솔\n설계 자문 의뢰서', 36, True, INK)
textbox(cover, 0.8, 3.55, 6.0, 0.9, '외식업·단체급식 현장의 ‘미끄러움’과 ‘발 피로’,\n정형외과 전문의의 시선으로 함께 설계하고 싶습니다.', 14, False, MUTE)
for i in range(4):
    o = clone(OVAL, cover, x=0.8 + i * 0.42, y=4.75, w=0.26, h=0.26)
textbox(cover, 0.8, 5.75, 6.0, 0.3, '주식회사 알앤디메이커스  ·  대표이사 신동규', 12, True, INK)
textbox(cover, 0.8, 6.1, 6.0, 0.3, f'{DATE_NEW}  ·  010-6880-2516  ·  rndceo@rndmakers.kr', 10, False, MUTE)

# ───────── 워킹화 설계 ─────────
ws = new_slide()
header(ws, 'PRODUCT', '워킹화는 바닥부터 다시 설계했습니다.', '쿼드그립 4점 패드 · 깔창 없는 일체형 안창 · 초경량 · 국내 제조')
clone(find(s2, name='Rounded Rectangle 5'), ws)
ws.shapes.add_picture(os.path.join(ASSET, 'outsole-lime.jpg'), Inches(1.02), Inches(2.6), width=Inches(3.95))
textbox(ws, 1.02, 4.45, 3.95, 0.3, '밑창 4점 쿼드그립 패드 (라임)', 11, True, INK)
textbox(ws, 1.02, 4.8, 3.95, 1.4, '패턴만 새긴 것이 아니라, 폐타이어 재생고무로\n따로 배합한 패드를 밑창에 끼워 넣은 구조입니다.\n\n발이 닿는 순서: 뒤꿈치 → 발 중간 → 발볼 → 앞꿈치', 9.6, False, MUTE)
rows = [
    ('01', '쿼드그립 4점 패드', '특허 출원', '재생고무 + 재생 PVC 배합 패드 4개를\n밑창에 끼워 넣은 구조', '원장님께 여쭙고 싶은 점\n처음 딛는 뒤꿈치 바깥 모서리에도\n패드가 필요할까요?'),
    ('02', '깔창 없는 일체형 안창', 'E-실리폴리렌', 'EVA + 실리콘 배합 소재로 안창까지 한 몸.\n깔창이 밀리거나 딸려 나오지 않습니다.', '원장님께 여쭙고 싶은 점\n아치 높이 — 평발·요족에도\n무리 없을까요?'),
    ('03', '초경량 · 국내 제조', '257g · 270mm', '하루 1만 보면 신발도 1만 번 듭니다.\n사출부터 패드 끼움·검수까지 국내 공장.', '원장님께 여쭙고 싶은 점\n발볼·클로그 뒤꿈치 형태가\n장시간 근무에 적합할까요?'),
]
for i, (n, t, tag, d, q) in enumerate(rows):
    y = 2.05 + i * 1.57
    clone(CARD, ws, x=5.55, y=y, w=7.05, h=1.42)
    clone(OVAL, ws, x=5.82, y=y + 0.25)
    clone(NUM, ws, x=5.82, y=y + 0.26, text=n)
    clone(CT, ws, x=6.38, y=y + 0.16, text=t)
    clone(CTAG, ws, x=8.7, y=y + 0.18, w=1.3, text=tag)
    clone(CDESC, ws, x=6.38, y=y + 0.58, text=d)
    clone(CNOTE, ws, x=10.08, y=y + 0.2, h=1.0, text=q)
clone(NOTE, ws, text='※ 미끄럼 저항(KS M ISO 13287 · 세제/글리세린)·반발탄성 시험 의뢰 예정 — 결과는 원장님께 가장 먼저 공유드립니다.')

# ───────── 질문 · 약속 ─────────
qs = new_slide()
header(qs, 'COLLABORATION', '원장님께 여쭙고 싶은 것, 그리고 저희의 약속', '설계는 함께 보고, 알릴 때는 원장님 기준을 먼저 지키겠습니다.')
clone(CARD, qs, x=0.72, y=2.05, w=5.9, h=4.65)
clone(CARD, qs, x=6.85, y=2.05, w=5.75, h=4.65)
textbox(qs, 1.02, 2.3, 4, 0.3, 'QUESTIONS  ·  착용해 보신 뒤', 10, True, GREEN)
qlist = ['패드 4점 위치 — 뒤꿈치 바깥 모서리 보강이 필요할까요?', '일체형 안창의 아치 높이는 적절할까요?', '발볼(라스트 폭)과 클로그 뒤꿈치 형태는 어떤가요?', '인솔의 아치 높이·길이·뒤꿈치 컵 깊이는?', '오래 서서 일하는 분들이 신발을 고를 때\n꼭 봐야 할 기준 3가지는?']
for i, q in enumerate(qlist):
    y = 2.75 + i * 0.75
    clone(OVAL, qs, x=1.02, y=y)
    clone(NUM, qs, x=1.02, y=y + 0.01, text=f'{i+1:02d}')
    textbox(qs, 1.6, y + 0.04, 4.8, 0.65, q, 11.5, False, INK)
textbox(qs, 7.15, 2.3, 4, 0.3, 'OUR PROMISE', 10, True, GREEN)
plist = [('검증 전 효능 표현 금지', '교정·치료·통증·질환명을 광고에 쓰지 않습니다.'),
         ('사전 검수', '코멘트·사진은 원장님 검수 후에만, 문장 임의 편집 없음'),
         ('대가 관계 공개', '‘자문료를 받았습니다’를 함께 표기합니다.'),
         ('‘추천’이 아닌 ‘설계 자문’', '병원명 노출은 원장님 선택, 종료 시 게시물 정리')]
for i, (t, d) in enumerate(plist):
    y = 2.75 + i * 0.95
    clone(OVAL, qs, x=7.15, y=y)
    clone(NUM, qs, x=7.15, y=y + 0.01, text='✓')
    textbox(qs, 7.75, y - 0.02, 4.6, 0.3, t, 12.5, True, INK)
    textbox(qs, 7.75, y + 0.32, 4.6, 0.5, d, 10.3, False, MUTE)

# ───────── 날짜·일정 갱신 + 순서 ─────────
for s in S:
    for sh in s.shapes:
        if sh.has_text_frame:
            for p in sh.text_frame.paragraphs:
                for r in p.runs:
                    if DATE_OLD in r.text: r.text = r.text.replace(DATE_OLD, DATE_NEW)
                    if '2026년 9–10월 중' in r.text: r.text = r.text.replace('2026년 9–10월 중', '2026년 10월 (~10/24)')
lst = prs.slides._sldIdLst
ids = list(lst)
o1, o2, o3, o4, cov, wk, qa = ids
for el in ids: lst.remove(el)
for el in (cov, o1, o2, wk, o3, qa, o4): lst.append(el)
prs.save(OUT)
print('saved', OUT)
