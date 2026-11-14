import cv2, numpy as np, subprocess, sys, math
SP='/tmp/claude-0/-home-user-harness-system/f589f59e-5047-5a0d-9959-068b0d0e969a/'
OUT=sys.argv[1]; W,H=int(sys.argv[2]),int(sys.argv[3]); mode=sys.argv[4]  # portrait/landscape
FPS=30; T=10.6; N=int(T*FPS)
def load(p):
    im=cv2.imread(p).astype(np.float32)
    b=np.concatenate([im[:20].reshape(-1,3),im[-20:].reshape(-1,3),im[:,:20].reshape(-1,3),im[:,-20:].reshape(-1,3)])
    return im,np.median(b,0)
A,bgA=load(SP+'images/81.jpg'); B,bgB=load(SP+'images/83.jpg'); C,bgC=load('/home/user/harness-system/launch/rs/landing/img/walking-main.jpg')
Pd=cv2.imread(SP+'scratchpad/vid/pad-src.jpg').astype(np.float32)
padsB=[(1466,1180),(1253,1015),(977,875),(684,977)]  # heel -> toe
ease=lambda x:0.5-0.5*math.cos(math.pi*min(max(x,0),1))
def place(src,bg,cx,cy,scale,rot,tx,ty):
    # map src point (cx,cy) to canvas (tx,ty) with scale & rotation
    M=cv2.getRotationMatrix2D((cx,cy),rot,scale); M[0,2]+=tx-cx; M[1,2]+=ty-cy
    img=cv2.warpAffine(src,M,(W,H),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=bg.tolist())
    mask=cv2.warpAffine(np.ones(src.shape[:2],np.float32),M,(W,H),borderValue=0)
    mask=cv2.GaussianBlur(mask,(0,0),W*0.03)[...,None]
    canvas=np.full((H,W,3),BG,np.float32)
    return canvas*(1-mask)+img*mask, M
BG=np.array([242,243,240],np.float32)  # BGR warm off-white
P = mode=='portrait'
def shotP(t):
    R=488; cx,cy=1602,1746
    s=(W*0.62/(2*R) if P else H*0.62/(2*R))*(1.0+0.12*ease(t))
    M=cv2.getRotationMatrix2D((cx,cy),8-10*t,s); tx,ty=W*(0.5 if P else 0.36),H*(0.47 if P else 0.5); M[0,2]+=tx-cx; M[1,2]+=ty-cy
    img=cv2.warpAffine(Pd,M,(W,H),flags=cv2.INTER_LINEAR,borderValue=BG.tolist())
    yy,xx=np.mgrid[0:H,0:W].astype(np.float32); d=np.sqrt((xx-tx)**2+(yy-ty)**2)/(R*s*0.97)
    mask=np.clip((1.0-d)/0.035,0,1)[...,None]
    canvas=np.full((H,W,3),BG,np.float32)
    # soft shadow
    sh=np.exp(-(((xx-tx)/(R*s*1.1))**2+((yy-ty-R*s*0.25)/(R*s*0.9))**2))[...,None]*28
    return canvas-sh*(1-mask)+ (img*1.10-canvas)*mask
def shotA(t):  # 0..1
    s=(W*1.2/1500 if P else H*1.25/2000)*(1.0+0.08*ease(t))
    img,_=place(A,bgA,720,1300,s,-2+3*t,W*(0.5 if P else 0.40),H*(0.47 if P else 0.52))
    # light sweep
    x=np.linspace(0,1,W)[None,:]; y=np.linspace(0,1,H)[:,None]
    band=np.exp(-((x*0.8+y*0.6)-(-0.3+1.9*t))**2/0.006)[...,None]
    return np.clip(img+band*38,0,255)
def shotB(t):
    s=(W*1.25/2000 if P else H*0.95/1500)*(1.0+0.06*ease(t))
    rot=(-62 if P else -18)+4*t
    img,M=place(B,bgB,1075,1030,s,rot,W*(0.5 if P else 0.36),H*(0.47 if P else 0.52))
    yy,xx=np.mgrid[0:H,0:W].astype(np.float32); glow=np.zeros((H,W),np.float32); ring=np.zeros((H,W),np.float32)
    for i,(px,py) in enumerate(padsB):
        X=M[0,0]*px+M[0,1]*py+M[0,2]; Y=M[1,0]*px+M[1,1]*py+M[1,2]
        st=0.12+i*0.16; k=(t-st)/0.35
        if k<0: continue
        r0=52*s; d=np.sqrt((xx-X)**2+(yy-Y)**2)
        a=math.exp(-max(k-0.15,0)*1.2)  # pop then settle
        glow+=np.exp(-(d/(r0*1.5))**2)*(0.55+0.45*a)
        if k<1: ring+=np.exp(-((d-r0*(1.1+2.2*k))/(r0*0.18))**2)*(1-k)
    lime=np.array([60,255,190],np.float32)  # BGR lime
    img=img+ (glow[...,None]*0.55+ring[...,None]*0.9)*(lime-img*0.35)*0.6
    return np.clip(img,0,255)
def shotC(t):
    s=(W*0.88/1161 if P else H*0.92/1354)*(1.0+0.07*ease(t))
    img,_=place(C,bgC,580,677,s,1.5-2*t,W*(0.5 if P else 0.33),H*(0.46 if P else 0.5))
    return img
cuts=[(0,1.8,shotP),(1.6,4.8,shotA),(4.6,8.2,shotB),(8.0,10.8,shotC)]
ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','bgr24','-s',f'{W}x{H}','-r',str(FPS),'-i','-',
  '-c:v','libx264','-preset','slow','-crf','27','-pix_fmt','yuv420p','-movflags','+faststart','-an',OUT],stdin=subprocess.PIPE)
rng=np.random.default_rng(1)
yy,xx=np.mgrid[0:H,0:W].astype(np.float32); vig=1-0.10*(((xx/W-0.5)**2+(yy/H-0.5)**2)*2)
for f in range(N):
    tt=f/FPS; acc=None; wsum=0
    for (a,b,fn) in cuts:
        if a<=tt<=b:
            w=min(1,(tt-a)/0.25 if a>0 else 1, (b-tt)/0.25)
            fr=fn((tt-a)/(b-a)); acc=fr*w if acc is None else acc+fr*w; wsum+=w
    if tt>10.35:  # loop blend into P start
        w=(tt-10.35)/0.25; fr=shotP(0); acc=(acc if acc is not None else 0)+fr*w; wsum+=w
    img=acc/max(wsum,1e-3)
    img=img*vig[...,None]+rng.normal(0,2.2,(H,W,1)).astype(np.float32)
    ff.stdin.write(np.clip(img,0,255).astype(np.uint8).tobytes())
    if f==0: cv2.imwrite(OUT.replace('.mp4','-poster.jpg'),np.clip(img,0,255).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,80])
ff.stdin.close(); ff.wait(); print('done',OUT)
