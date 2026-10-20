"""RS 로고(PNG 트레이스) + RhaRa Shoe 라라슈(글자 윤곽선) 벡터 SVG → design/brand/rs-logo-rharashoe-{ink,lime,white}.svg
실행: launch/rs 에서 python3 design/brand/make_logo_svg.py (pip: potracer, brotli)"""
import numpy as np, potrace
from PIL import Image, ImageFilter
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
A='design/fair-print/assets/'
# 1) 로고 트레이스
lg=Image.open(A+'rs-logo-ink.png').convert('RGBA'); a=lg.split()[3]; a=a.crop(a.getbbox()); pad=Image.new('L',(a.width+20,a.height+20),0); pad.paste(a,(10,10)); a=pad
K=8; a=a.resize((a.width*K,a.height*K),Image.LANCZOS).filter(ImageFilter.GaussianBlur(K*0.6))
bm=np.array(a)<=127
path=potrace.Bitmap(bm).trace(turdsize=50, alphamax=1.0, opticurve=True, opttolerance=0.2)
def curve_d(c, s):
    sp=c.start_point; d=f'M{sp.x*s:.2f},{sp.y*s:.2f}'
    for seg in c.segments:
        if seg.is_corner: d+=f'L{seg.c.x*s:.2f},{seg.c.y*s:.2f}L{seg.end_point.x*s:.2f},{seg.end_point.y*s:.2f}'
        else: d+=f'C{seg.c1.x*s:.2f},{seg.c1.y*s:.2f} {seg.c2.x*s:.2f},{seg.c2.y*s:.2f} {seg.end_point.x*s:.2f},{seg.end_point.y*s:.2f}'
    return d+'Z'
s=1/K; LW,LH=a.width*s,a.height*s
logo_d=''.join(curve_d(c,s) for c in path)
# 2) 글자 윤곽선
def text_d(fontpath, text, size, x0, base):
    f=TTFont(fontpath); gs=f.getGlyphSet(); cmap=f.getBestCmap(); upm=f['head'].unitsPerEm; sc=size/upm
    hm=f['hmtx']; x=x0; out=''
    for ch in text:
        g=cmap[ord(ch)]; pen=SVGPathPen(gs)
        gs[g].draw(TransformPen(pen,(sc,0,0,-sc,x,base))); out+=pen.getCommands(); x+=hm[g][0]*sc
    return out, x-x0
EN='design/fair-print/assets/poppins-600.woff2'; KO='design/fair-print/fonts/NotoSansKR-700.ttf'
sz=40
en_d,wen=text_d(EN,'RhaRa Shoe',sz,0,0)
gap=sz*0.28
ko_d,wko=text_d(KO,'라라슈',sz*0.95,wen+gap,0)
TW=wen+gap+wko
# 로고 폭에 맞춰 워드마크 스케일
k=LW/TW; capH=sz*0.72*k
gapY=LH*0.16; ty=LH+gapY+capH
H=ty+sz*0.25*k
def svg(color):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {LW:.2f} {H:.2f}" width="{LW*4:.0f}" height="{H*4:.0f}">
<title>RS RhaRa Shoe 라라슈</title>
<g fill="{color}"><path fill-rule="evenodd" d="{logo_d}"/>
<g transform="translate(0,{ty:.2f}) scale({k:.5f})"><path d="{en_d}"/><path d="{ko_d}"/></g></g></svg>
'''
import os; os.makedirs('design/brand',exist_ok=True)
for n,c in (('ink','#0D0D0D'),('lime','#C6F432'),('white','#FFFFFF')):
    open(f'design/brand/rs-logo-rharashoe-{n}.svg','w').write(svg(c))
print(LW,LH,H,len(logo_d))
