import numpy as np, cv2, math
from PIL import Image, ImageDraw, ImageFont
SP='/tmp/claude-0/-home-user-harness-system/f589f59e-5047-5a0d-9959-068b0d0e969a/'
W,H=720,1280; asp=W/H; fov=0.74; CZ=4.2
def rot(ax,a):
    ax=np.array(ax,float); ax/=np.linalg.norm(ax); c,s=math.cos(a),math.sin(a); x,y,z=ax
    return np.array([[c+x*x*(1-c),x*y*(1-c)-z*s,x*z*(1-c)+y*s],[y*x*(1-c)+z*s,c+y*y*(1-c),y*z*(1-c)-x*s],[z*x*(1-c)-y*s,z*y*(1-c)+x*s,c+z*z*(1-c)]])
def sdf_ring(p,R,a,b):
    qx=np.sqrt(p[...,0]**2+p[...,2]**2)-R; qy=p[...,1]
    k0=np.sqrt((qx/a)**2+(qy/b)**2); k1=np.sqrt((qx/a**2)**2+(qy/b**2)**2)+1e-9
    return k0*(k0-1.0)/k1
def env(d):
    x,y,z=d[...,0],d[...,1],d[...,2]
    base=np.stack([0.02+0.03*y,0.06+0.05*y,0.04+0.03*y],-1)
    top=np.clip(y,0,1)[...,None]**2*np.array([0.95,1.0,0.96])*1.6
    side=np.exp(-((x-0.95)/0.25)**2)[...,None]*1.5+np.exp(-((x+0.15)/0.05)**2)[...,None]*np.clip(y+0.2,0,1)[...,None]*np.array([0.9,1.0,0.5])*1.4
    floor=np.clip(-y,0,1)[...,None]**2*np.array([0.20,0.45,0.30])
    b1=np.exp(-((x-0.55)/0.10)**2)[...,None]*np.clip(y+0.4,0,1)[...,None]*np.array([0.85,1.0,0.35])*1.6
    b2=np.exp(-((x+0.6)/0.13)**2)[...,None]*np.clip(0.8-abs(y),0,1)[...,None]*np.array([0.55,0.95,0.80])*1.1
    return base+top+side+floor+b1+b2
def px2w(px,py): return np.array([((px/W)*2-1)*asp*fov*CZ, -((py/H)*2-1)*fov*CZ, 0.0])
def render(bg, rings):  # rings: list of (center, M, R, a, b)
    ys,xs=np.mgrid[0:H,0:W].astype(float)
    u=((xs+0.5)/W*2-1)*asp*fov; v=-((ys+0.5)/H*2-1)*fov
    rd=np.stack([u,v,-np.ones_like(u)],-1); rd/=np.linalg.norm(rd,axis=-1,keepdims=True)
    ro=np.array([0,0,CZ]); RD=rd.reshape(-1,3); t=np.full(len(RD),2.5); alive=np.ones(len(RD),bool); hit=np.zeros(len(RD),bool)
    def scene(p):
        d=None
        for c,M,R,a,b in rings:
            di=sdf_ring((p-c)@M,R,a,b); d=di if d is None else np.minimum(d,di)
        return d
    for it in range(110):
        idx=np.nonzero(alive)[0]
        if not len(idx): break
        p=ro+RD[idx]*t[idx,None]; d=scene(p); t[idx]+=d*0.9
        h=d<0.0008; hit[idx[h]]=True; alive[idx[h]]=False; alive[idx[t[idx]>8]]=False
    img=bg.reshape(-1,3).copy(); hi=np.nonzero(hit)[0]
    p=ro+RD[hi]*t[hi,None]; e=0.0015
    n=np.stack([scene(p+np.array(v_))-scene(p-np.array(v_)) for v_ in ([e,0,0],[0,e,0],[0,0,e])],-1); n/=np.linalg.norm(n,axis=-1,keepdims=True)+1e-9
    dv=RD[hi]; refl=dv-2*np.sum(dv*n,-1,keepdims=True)*n; cosv=np.clip(-np.sum(dv*n,-1),0,1); fres=0.35+0.65*(1-cosv)**3
    ph=cosv*7+refl[...,1]*2.5+refl[...,0]*1.5
    irid=np.stack([0.55+0.35*np.cos(ph+2.2),0.80+0.20*np.cos(ph+0.3),0.45+0.35*np.cos(ph+1.0)],-1)
    img[hi]=np.clip(env(refl)*(0.45+0.55*irid)*(0.75+0.25*fres[...,None])+np.array([0.02,0.05,0.035]),0,1.6)
    img=img.reshape(H,W,3)
    bl=cv2.GaussianBlur(np.clip(img-0.75,0,None).astype(np.float32),(0,0),W*0.008); img=img+bl*0.6
    return np.clip(img/(1+img*0.25)*1.2,0,1)
def bgc():
    gy=np.linspace(0,1,H)[:,None,None]; top=np.array([0x16,0x2C,0x20])/255; mid=np.array([0x0D,0x1B,0x14])/255
    return np.broadcast_to(top*(1-gy)+mid*gy,(H,W,3)).copy()
# --- sole cutout placed vertically
src=cv2.cvtColor(cv2.imread(SP+'images/83.jpg'),cv2.COLOR_BGR2RGB).astype(np.float32)/255
hsv=cv2.cvtColor((src*255).astype(np.uint8),cv2.COLOR_RGB2HSV); lum=src.mean(-1)
m=((lum<0.62)|(hsv[...,1]>90)).astype(np.uint8)*255
m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((25,25),np.uint8)); n,l,st,_=cv2.connectedComponentsWithStats(m); big=1+np.argmax(st[1:,4]); m=(l==big).astype(np.uint8)*255
cnts,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE); m=np.zeros_like(m); cv2.drawContours(m,cnts,-1,255,-1)
m=cv2.GaussianBlur(m,(0,0),2).astype(np.float32)/255
pads=[(1466,1180),(1253,1015),(977,875),(684,977)]
s=0.62; Mx=cv2.getRotationMatrix2D((1075,1030),-62,s); Mx[0,2]+=W*0.5-1075; Mx[1,2]+=H*0.50-1030
sole=cv2.warpAffine(src,Mx,(W,H)); sm=cv2.warpAffine(m,Mx,(W,H))[...,None]
padp=[(Mx[0,0]*x+Mx[0,1]*y+Mx[0,2], Mx[1,0]*x+Mx[1,1]*y+Mx[1,2]) for x,y in pads]
padR=52*s
def with_sole(glow=0):
    b=bgc(); shadow=cv2.GaussianBlur(sm[...,0],(0,0),18)[...,None]
    b=b*(1-0.5*np.roll(shadow,18,axis=0)); b=b*(1-sm)+sole*sm
    if glow:
        yy,xx=np.mgrid[0:H,0:W].astype(float); g=np.zeros((H,W))
        for x,y in padp: g+=np.exp(-(((xx-x)**2+(yy-y)**2)/(padR*2.2)**2))
        b=b+g[...,None]*np.array([0.78,0.96,0.2])*0.55*glow
    return b
# ring specs
A,B=0.035,0.16
cluster=[px2w(W*0.5,H*0.42)]*4
Rc=[1.0,0.985,0.97,0.955]
padw=[px2w(x,y) for x,y in padp]; Rpad=(padR*1.45)/W*2*asp*fov*CZ
flat=rot((1,0,0),math.radians(90))  # ring plane facing camera
def tilt(deg): return rot((1,0,0),math.radians(90-deg))
# panel 1: video frame
p1=cv2.cvtColor(cv2.imread(SP+'scratchpad/vid/rings-m-f120.jpg'),cv2.COLOR_BGR2RGB).astype(np.float32)/255
# panel 2: rings split & descending, tilted
mid=[cluster[0]*0.45+pw*0.55 for pw in padw]
p2=render(bgc()*0.95+with_sole()*0.05, [(mid[i]+np.array([0,0.35,0.2]), tilt(55)@rot((0,1,0),math.radians(25*i)), Rpad*1.9, A*0.8, B*0.8) for i in range(4)])
# panel 3: rings landed flat around pads
p3=render(with_sole(), [(padw[i]+np.array([0,0,0.12]), flat, Rpad, A*0.5, B*0.45) for i in range(4)])
# panel 4: landed + glow
p4=render(with_sole(glow=1), [(padw[i]+np.array([0,0,0.12]), flat, Rpad, A*0.5, B*0.45) for i in range(4)])
font=lambda sz,b=True: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc' if b else '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',sz,index=1)
def toimg(a): return Image.fromarray((np.clip(a,0,1)*255).astype(np.uint8))
panels=[toimg(x) for x in (p1,p2,p3,p4)]
caps=[('01  은유','링 4개가 천천히 회전'),('02  해석','링이 흩어지며 바닥으로'),('03  착지','밑창 4곳에 정확히 내려앉음'),('04  실물','라임 패드 4개가 켜짐')]
d4=ImageDraw.Draw(panels[3])
d4.text((40,70),'4 RINGS = 4 GRIP PADS',font=font(40),fill=(198,244,50))
d4.text((40,128),'발이 바닥에 닿는 순서대로, 4곳.',font=font(30,False),fill=(242,244,242))
d2=ImageDraw.Draw(panels[1]); d2.text((40,70),'오래 서 있는 하루를 위한,',font=font(40),fill=(242,244,242)); d2.text((40,124),'약속.',font=font(40),fill=(242,244,242)); d2.text((40,192),'쿼드그립 그립 패드',font=font(30),fill=(198,244,50))
for i,(a,b) in enumerate(caps):
    pn=panels[i]; dd=ImageDraw.Draw(pn); dd.rectangle((0,H-150,W,H),fill=(10,21,15)); dd.text((40,H-128),a,font=font(34),fill=(198,244,50)); dd.text((40,H-78),b,font=font(28,False),fill=(242,244,242))
for i,pn in enumerate(panels): pn.save(SP+f'scratchpad/vid/story_{i+1}.png')
G=24; sheet=Image.new('RGB',(W*4+G*5,H+G*2+90),(10,21,15)); ds=ImageDraw.Draw(sheet)
ds.text((G,22),'RHARA SHOE · 첫 화면 은유 → 실물 전환 (마지막 2초)',font=font(40),fill=(242,244,242))
for i,pn in enumerate(panels): sheet.paste(pn,(G+i*(W+G),90+G))
sheet.save(SP+'scratchpad/vid/storyboard.png'); sheet.resize((sheet.width//3,sheet.height//3)).save(SP+'scratchpad/vid/storyboard_s.png'); print('ok')
