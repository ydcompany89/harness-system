import numpy as np, cv2, math, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
SP='/tmp/claude-0/-home-user-harness-system/f589f59e-5047-5a0d-9959-068b0d0e969a/'
W,H=720,1280; asp=W/H; fov=0.74; CZ=4.2; FPS=24; T=12.0; N=int(T*FPS)
NF=int(sys.argv[1]) if len(sys.argv)>1 else N
exec(open(SP+'scratchpad/stills.py').read().split('# ring specs')[0].split("W,H=720,1280")[1].split('\n',1)[1])  # reuse rot/sdf/env/render/sole helpers
def ease(x): x=min(max(x,0),1); return 0.5-0.5*math.cos(math.pi*x)
def q_from_m(M):
    t=np.trace(M)
    if t>0: s=math.sqrt(t+1)*2; return np.array([0.25*s,(M[2,1]-M[1,2])/s,(M[0,2]-M[2,0])/s,(M[1,0]-M[0,1])/s])
    i=np.argmax(np.diag(M))
    if i==0: s=math.sqrt(1+M[0,0]-M[1,1]-M[2,2])*2; return np.array([(M[2,1]-M[1,2])/s,0.25*s,(M[0,1]+M[1,0])/s,(M[0,2]+M[2,0])/s])
    if i==1: s=math.sqrt(1+M[1,1]-M[0,0]-M[2,2])*2; return np.array([(M[0,2]-M[2,0])/s,(M[0,1]+M[1,0])/s,0.25*s,(M[1,2]+M[2,1])/s])
    s=math.sqrt(1+M[2,2]-M[0,0]-M[1,1])*2; return np.array([(M[1,0]-M[0,1])/s,(M[0,2]+M[2,0])/s,(M[1,2]+M[2,1])/s,0.25*s])
def m_from_q(q):
    w,x,y,z=q/np.linalg.norm(q)
    return np.array([[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]])
def slerp(A,B,k):
    qa,qb=q_from_m(A),q_from_m(B)
    if np.dot(qa,qb)<0: qb=-qb
    d=min(np.dot(qa,qb),1.0); th=math.acos(d)
    if th<1e-4: return m_from_q(qa)
    return m_from_q((math.sin((1-k)*th)*qa+math.sin(k*th)*qb)/math.sin(th))
RINGS=[dict(base=rot((0,1,0),0)@rot((1,0,0),math.radians(90)),spin=(0,1,0),k=1,R=1.0),
       dict(base=rot((0,1,0),math.radians(60))@rot((1,0,0),math.radians(90)),spin=(1,0.2,0.3),k=1,R=0.985),
       dict(base=rot((0,1,0),math.radians(120))@rot((1,0,0),math.radians(90)),spin=(0.3,0.4,1),k=-1,R=0.97),
       dict(base=rot((0,0,1),math.radians(8)),spin=(0,1,0),k=-1,R=0.955)]
TILT=rot((1,0,0),math.radians(22))@rot((0,0,1),math.radians(-14))
def cluster_M(t):
    ph=2*math.pi*t/T; G=rot((0.2,1,0.1),0.35*math.sin(ph))@rot((1,0,0),0.25*math.sin(ph*2+0.7)*0.5)
    return [TILT@G@rot(r['spin'],r['k']*ph)@r['base'] for r in RINGS]
C0=px2w(W*0.5,H*0.40); A0,B0=0.035,0.16
padw=[px2w(x,y) for x,y in padp]; Rpad=(padR*1.45)/W*2*asp*fov*CZ
flat=rot((1,0,0),math.radians(90))
t_split,t_land,t_fade=4.0,6.6,7.2
Msplit=cluster_M(t_split)
def rings_at(t):
    if t<t_split: return [(C0,M,r['R'],A0,B0) for M,r in zip(cluster_M(t),RINGS)],1.0
    k=ease((t-t_split)/(t_land-t_split)); out=[]
    for i,r in enumerate(RINGS):
        ki=ease((t-t_split-0.12*i)/(t_land-t_split-0.36))
        c=C0*(1-ki)+(padw[i]+np.array([0,0,0.12]))*ki+np.array([0,0,0.9*math.sin(math.pi*ki)])
        out.append((c,slerp(Msplit[i],flat,ki),r['R']*(1-ki)+Rpad*ki,A0*(1-ki)+A0*0.5*ki,B0*(1-ki)+B0*0.45*ki))
    alpha=1-ease((t-t_fade)/1.4)
    return out,alpha
font=lambda sz,b=True: ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-%s.ttc'%('Bold' if b else 'Regular'),sz,index=1)
def text_layer(t):
    L=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(L)
    a1=ease((t-4.4)/0.8)*(1-ease((t-7.3)/0.6))
    a2=ease((t-7.8)/0.8)*(1-ease((t-10.8)/0.6))
    if a1>0:
        d.text((48,96),'오래 서 있는 하루를 위한,',font=font(44),fill=(242,244,242,int(255*a1)))
        d.text((48,156),'약속.',font=font(44),fill=(242,244,242,int(255*a1)))
        d.text((48,226),'쿼드그립 그립 패드',font=font(32),fill=(198,244,50,int(255*a1)))
    if a2>0:
        d.text((48,96),'4 RINGS = 4 GRIP PADS',font=font(44),fill=(198,244,50,int(255*a2)))
        d.text((48,160),'발이 바닥에 닿는 순서대로, 4곳.',font=font(32,False),fill=(242,244,242,int(255*a2)))
    return L
def pipe(out): return subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-c:v','libx264','-preset','slow','-crf','21','-pix_fmt','yuv420p','-an',out],stdin=subprocess.PIPE)
fc=pipe(SP+'scratchpad/vid/reveal_clean_noaudio.mp4'); ft=pipe(SP+'scratchpad/vid/reveal_text_noaudio.mp4')
frame0=None
yy,xx=np.mgrid[0:H,0:W].astype(float)
for f in range(NF):
    t=f/FPS
    rings,ra=rings_at(t)
    sole_a=ease((t-4.6)/1.6)
    glow=ease((t-7.4)/0.8)
    # sequential pulse heel->toe 8.0..9.6
    base=bgc()*(1-sole_a)+with_sole(0)*sole_a if sole_a<1 else with_sole(0)
    if glow>0:
        g=np.zeros((H,W))
        for i,(x,y) in enumerate(padp):
            pulse=1+0.6*math.exp(-((t-(8.0+0.4*i))/0.18)**2)
            g+=np.exp(-(((xx-x)**2+(yy-y)**2)/(padR*2.2)**2))*pulse
        base=base+g[...,None]*np.array([0.78,0.96,0.2])*0.55*glow
    if ra>0.002:
        img=render(base,rings); img=base*(1-ra)+img*ra
    else: img=base
    # loop: dissolve back to frame0 at the end
    if f==0: frame0=img.copy()
    lk=ease((t-10.8)/1.2)
    if lk>0: img=img*(1-lk)+frame0*lk
    img8=(np.clip(img,0,1)*255).astype(np.uint8)
    fc.stdin.write(img8.tobytes())
    im=Image.fromarray(img8).convert('RGBA'); im.alpha_composite(text_layer(t)); ft.stdin.write(np.asarray(im.convert('RGB')).tobytes())
    if f%48==0: print('frame',f,flush=True)
for p in (fc,ft): p.stdin.close(); p.wait()
print('done')
