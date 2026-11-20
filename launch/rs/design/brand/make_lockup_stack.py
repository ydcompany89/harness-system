"""세로형 락업 v2 (대표 11/03): 굵어진 RS 심볼 / 라라슈(심볼 바로 밑, 장평 넓게·자간 좁게) / RHARASHOE / MADE IN KOREA
실행: launch/rs 에서 python3 design/brand/make_lockup_stack.py → design/brand/rs-lockup-stack-{ink,lime,white}.svg
장평 = 가로 배율(sx), 자간 = track(em 단위, 음수 = 좁힘)."""
import numpy as np, potrace, cv2
from PIL import Image, ImageFilter
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
from fontTools.pens.transformPen import TransformPen
A='design/fair-print/assets/'
THICK = 3          # 심볼 굵기 증가량(원본 px, 둘레 방향) — 대표: 로고 좀 더 두껍게
lg=Image.open(A+'rs-logo-ink.png').convert('RGBA'); a=lg.split()[3]; a=a.crop(a.getbbox())
pad=Image.new('L',(a.width+40,a.height+40),0); pad.paste(a,(20,20)); a=pad
K=8; a=a.resize((a.width*K,a.height*K),Image.LANCZOS).filter(ImageFilter.GaussianBlur(K*0.6))
m=(np.array(a)>127).astype('uint8')
r=THICK*K; m=cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(2*r+1,2*r+1)))
ys,xs=np.where(m); P=10*K; m=m[ys.min()-P:ys.max()+1+P, xs.min()-P:xs.max()+1+P]
bm=(m==0)   # make_logo_svg.py 와 같은 방식(배경=True)
path=potrace.Bitmap(bm).trace(turdsize=50, alphamax=1.0, opticurve=True, opttolerance=0.2)
def curve_d(c, s, ox=0, oy=0):
    sp=c.start_point; d=f'M{sp.x*s+ox:.2f},{sp.y*s+oy:.2f}'
    for seg in c.segments:
        if seg.is_corner: d+=f'L{seg.c.x*s+ox:.2f},{seg.c.y*s+oy:.2f}L{seg.end_point.x*s+ox:.2f},{seg.end_point.y*s+oy:.2f}'
        else: d+=f'C{seg.c1.x*s+ox:.2f},{seg.c1.y*s+oy:.2f} {seg.c2.x*s+ox:.2f},{seg.c2.y*s+oy:.2f} {seg.end_point.x*s+ox:.2f},{seg.end_point.y*s+oy:.2f}'
    return d+'Z'
s=1/K; LW,LH=bm.shape[1]*s,bm.shape[0]*s

class AbsPen(BasePen):
    def __init__(s, gs): super().__init__(gs); s.d=[]; s.p=(0,0)
    def _moveTo(s,p): s.d.append(f'M{p[0]:.2f},{p[1]:.2f}'); s.p=p
    def _lineTo(s,p): s.d.append(f'L{p[0]:.2f},{p[1]:.2f}'); s.p=p
    def _curveToOne(s,a,b,c): s.d.append(f'C{a[0]:.2f},{a[1]:.2f} {b[0]:.2f},{b[1]:.2f} {c[0]:.2f},{c[1]:.2f}'); s.p=c
    def _qCurveToOne(s,q,e):
        p=s.p; a=(p[0]+2/3*(q[0]-p[0]),p[1]+2/3*(q[1]-p[1])); b=(e[0]+2/3*(q[0]-e[0]),e[1]+2/3*(q[1]-e[1])); s._curveToOne(a,b,e)
    def _closePath(s): s.d.append('Z')
def text_d(fontpath, text, size, track=0.0, sx=1.0):
    """한 줄 글자 윤곽 — 기준선 y=0, 왼쪽 x=0. 반환: (path, 폭)"""
    f=TTFont(fontpath); gs=f.getGlyphSet(); cmap=f.getBestCmap(); sc=size/f['head'].unitsPerEm; hm=f['hmtx']
    x=0; out=''; last=0
    for i,ch in enumerate(text):
        g=cmap[ord(ch)]; pen=AbsPen(gs); gs[g].draw(TransformPen(pen,(sc*sx,0,0,-sc,x,0))); out+=''.join(pen.d)
        adv=hm[g][0]*sc*sx; last=x+adv; x+=adv+(track*size if i<len(text)-1 else 0)
    return out, last
EN='design/fair-print/assets/poppins-600.woff2'; KO='design/fair-print/fonts/NotoSansKR-900.ttf'
# (글자, 폰트, 크기, 자간, 장평)  — 크기는 심볼 폭 기준으로 다시 맞춤
LINES=[('라라슈',KO,1.00,-0.06,1.30), ('RHARASHOE',EN,1.00,-0.03,1.10), ('MADE IN KOREA',EN,1.00,-0.02,1.12)]
WIDTH_RATIO=[0.62, 0.92, 0.80]   # 각 줄 폭 = 심볼 폭 × 비율
CAP={'ko':0.80,'en':0.70}         # 대략적 글자 높이/크기
rows=[]
for (t,fp,_,tr,sx),wr in zip(LINES,WIDTH_RATIO):
    d,w=text_d(fp,t,100,tr,sx); k=LW*wr/w; h=100*k*(CAP['ko'] if fp==KO else CAP['en'])
    rows.append((d,w,k,h))
GAP=LH*0.10
# 배치(대표 11/03 정정): RS 심볼 → 라라슈 → RHARASHOE → MADE IN KOREA (가운데 정렬)
y=0; parts=[]
logo_d=''.join(curve_d(c,s,0,0) for c in path); y=LH
for i,(d,w,k,h) in enumerate(rows):
    y+=(GAP*1.3 if i==0 else GAP)+h; parts.append(f'<g transform="translate({(LW-w*k)/2:.2f},{y:.2f}) scale({k:.5f})"><path d="{d}"/></g>')
H=y+LH*0.04
for n,c in (('ink','#0D0D0D'),('lime','#C6F432'),('white','#FFFFFF')):
    open(f'design/brand/rs-lockup-stack-{n}.svg','w').write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {-LH*0.04:.2f} {LW:.2f} {H+LH*0.04:.2f}" width="{LW*4:.0f}" height="{(H+LH*0.08)*4:.0f}">
<title>RS 세로형 락업 — 라라슈 / RHARASHOE / MADE IN KOREA</title>
<g fill="{c}"><path fill-rule="evenodd" d="{logo_d}"/>{''.join(parts)}</g></svg>
''')
print('ok', round(LW), round(LH), round(H))
