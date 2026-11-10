import math, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
S=2; W,H=1200,720
B='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'; R='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
F=lambda s,b=True: ImageFont.truetype(B if b else R,s*S,index=1)
LIME=(198,244,50); TXT=(242,244,242); SUB=(180,186,182)
def bez(p0,p1,p2,p3,n=24):
    return [((1-t)**3*p0[0]+3*(1-t)**2*t*p1[0]+3*(1-t)*t*t*p2[0]+t**3*p3[0],(1-t)**3*p0[1]+3*(1-t)**2*t*p1[1]+3*(1-t)*t*t*p2[1]+t**3*p3[1]) for t in np.linspace(0,1,n)]
def sc(pts,dx=0,dy=0): return [((x+dx)*S,(y+dy)*S) for x,y in pts]
def rot(pts,cx,cy,a):
    c,s=math.cos(a),math.sin(a); return [(cx+(x-cx)*c-(y-cy)*s, cy+(x-cx)*s+(y-cy)*c) for x,y in pts]
ease=lambda x: 0.5-0.5*math.cos(math.pi*min(max(x,0),1))
def bg():
    im=Image.new('RGB',(W*S,H*S),(0,0,0)); g=np.linspace(0,1,H*S)[:,None,None]
    arr=(np.array([22,24,23])*(1-g)+np.array([58,60,59])*g).astype(np.uint8); arr=np.broadcast_to(arr,(H*S,W*S,3)).copy()
    im=Image.fromarray(arr); d=ImageDraw.Draw(im)
    d.rounded_rectangle((24*S,24*S,(W-24)*S,(H-24)*S),radius=28*S,outline=(180,220,60),width=3*S)
    return im
# 기하 (단면 · 왼쪽=뒤꿈치)
X0,X1=110,610      # 신발 안쪽 바닥 길이
BASE=470           # 신발바닥 윗면 y
def floor_line(): return [(X0,BASE),(X1,BASE)]
def insole_shape(dx):
    # 반굽: 뒤꿈치(X0)~아치(X0+300), 아치 부분이 볼록
    top=bez((X0,BASE-14),(X0+90,BASE-22),(X0+170,BASE-46),(X0+300,BASE-4))
    cup=bez((X0-2,BASE),(X0-8,BASE-20),(X0-6,BASE-34),(X0+6,BASE-40),10)
    pts=cup+top+[(X0+300,BASE),(X0,BASE)]
    return [(x+dx,y) for x,y in pts]
def insole_top_y(x):
    t=np.linspace(0,1,200); P=bez((X0,BASE-14),(X0+90,BASE-22),(X0+170,BASE-46),(X0+300,BASE-4),200)
    if x<X0 or x>X0+300: return BASE
    i=min(range(200),key=lambda k:abs(P[k][0]-x)); return P[i][1]
def liner(lift_a, raised):
    # 쓰던 깔창: 두께 10 · 전체 길이, 앞코 기준 회전
    xs=np.linspace(X0,X1,60); top=[];bot=[]
    for x in xs:
        base=insole_top_y(x) if raised else BASE
        if raised: base=min(base,BASE)
        top.append((x,base-12)); bot.append((x,base))
    pts=top+bot[::-1]
    return rot(pts,X1,BASE,lift_a)
def shoe(d):
    # 겉창
    out=[(X0-40,BASE+10),(X1+70,BASE+10),(X1+90,BASE+40),(X1+70,BASE+62),(X0-30,BASE+62),(X0-50,BASE+40)]
    d.polygon(sc(out),fill=(18,18,20))
    for k in range(10): d.line(sc([(X0-20+k*70,BASE+62),(X0+10+k*70,BASE+62)]),fill=(40,40,44),width=4*S)
    # 중창
    d.rectangle(sc([(X0-40,BASE),(X1+80,BASE+12)]),fill=(70,74,78))
    # 갑피(단면 라인 뒤로)
    up=[(X0-45,BASE)]+bez((X0-45,BASE),(X0-60,BASE-160),(X0-10,BASE-230),(X0+40,BASE-235))+bez((X0+40,BASE-235),(X0+90,BASE-200),(X0+110,BASE-150),(X0+170,BASE-150))+bez((X0+170,BASE-150),(X0+330,BASE-200),(X1+20,BASE-150),(X1+90,BASE-30))+[(X1+90,BASE)]
    d.polygon(sc(up),fill=(38,44,66))
    # 단면 안쪽(속 공간) - 어둡게
    inner=[(X0,BASE)]+bez((X0,BASE),(X0-10,BASE-130),(X0+20,BASE-190),(X0+45,BASE-200))+bez((X0+45,BASE-200),(X0+90,BASE-170),(X0+120,BASE-125),(X0+180,BASE-118))+bez((X0+180,BASE-118),(X0+330,BASE-160),(X1-10,BASE-120),(X1,BASE-10))+[(X1,BASE)]
    d.polygon(sc(inner),fill=(16,18,26))
    # 끈 구멍 장식
    for k in range(4): d.ellipse(sc([(X0+250+k*55,BASE-178+k*14),(X0+262+k*55,BASE-166+k*14)]),fill=(90,96,120))
def label(d,y,num,text,a,tx,ty):
    if a<=0: return
    col=tuple(int(c*a) for c in LIME)
    d.ellipse(sc([(52,y-13),(78,y+13)]),fill=col); d.text(sc([(65,y)])[0],num,font=F(13),fill=(13,27,20),anchor='mm')
    d.text(sc([(90,y)])[0],text,font=F(20,False),fill=tuple(int(c*a) for c in TXT),anchor='lm')
    r=13
    d.ellipse(sc([(tx-r,ty-r),(tx+r,ty+r)]),fill=col,outline=(13,27,20),width=2*S); d.text(sc([(tx,ty)])[0],num,font=F(13),fill=(13,27,20),anchor='mm')
def frame(t,T):
    im=bg(); d=ImageDraw.Draw(im)
    # 단계
    lift=ease((t-0.5)/0.7)*(1-ease((t-2.1)/0.6))
    slide=ease((t-1.1)/0.9)
    raised=t>=1.95
    shoe(d)
    # 인솔
    if slide>0:
        dx=0; dy=-(1-slide)*170
        pts=[(x,y+dy) for x,y in insole_shape(0)]; d.polygon(sc(pts),fill=(112,116,116)); d.line(sc(pts+[pts[0]]),fill=LIME,width=3*S)
        # 아치 하이라이트
        d.line(sc([(X0+90,BASE-24+dy),(X0+200,BASE-34+dy)]),fill=(150,154,154),width=3*S)
    # 쓰던 깔창
    a=math.radians(13)*lift
    L=liner(a, raised and slide>=1)
    d.polygon(sc(L),fill=(190,194,190)); d.line(sc(L+[L[0]]),fill=(120,124,120),width=2*S)
    # 신발바닥 선 강조
    d.line(sc(floor_line()),fill=(120,124,128),width=2*S)
    # 라벨 (2.7s~)
    la=[ease((t-2.7-0.25*i)/0.35) for i in range(3)]
    label(d,90,'03','아치가득 반굽 (아래)',la[2],X0+200,BASE-24)
    label(d,128,'02','쓰던 깔창 (위)',la[1],X0+400,BASE-26)
    label(d,166,'01','신발바닥',la[0],X0+520,BASE+6)
    # 오른쪽 문구 (항상)
    d.text(sc([(700,250)])[0],'뒤꿈치부터 아치까지',font=F(34),fill=TXT)
    d.text(sc([(700,298)])[0],'대부분의 신발에 착용할 수 있어요',font=F(34),fill=TXT)
    d.text(sc([(700,372)])[0],'신발 속 빈 공간이 채워져',font=F(26,False),fill=SUB)
    d.text(sc([(700,410)])[0],'신을 때 신발이 헐겁게 흘러내리는',font=F(26,False),fill=SUB)
    d.text(sc([(700,448)])[0],'느낌을 잡아 줘요',font=F(26,False),fill=SUB)
    # 단계 캡션
    step='① 쓰던 깔창을 들고' if t<1.1 else ('② 아치가득 인솔을 깔고' if t<2.1 else '③ 깔창을 다시 덮으면 끝')
    d.text(sc([(360,600)])[0],step,font=F(24),fill=LIME,anchor='mm')
    return im.resize((W,H),Image.LANCZOS)
T=4.6; fps=10; frames=[frame(i/fps,T) for i in range(int(T*fps))]
pal=frames[-1].quantize(colors=128,method=Image.Quantize.MEDIANCUT)
q=[f.quantize(palette=pal,dither=Image.Dither.NONE) for f in frames]
durs=[100]*len(q); durs[-1]=1400
q[0].save('/home/user/harness-system/launch/rs/deploy/인솔_깔창밑에한장더_1200x720.gif',save_all=True,append_images=q[1:],duration=durs,loop=0,optimize=True)
frames[int(3.8*fps)].save('preview.png'); frames[int(1.5*fps)].save('preview_mid.png')
