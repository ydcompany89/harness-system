import cv2, numpy as np, subprocess, sys, math
OUT=sys.argv[1]; W,H=int(sys.argv[2]),int(sys.argv[3]); P=H>W
FPS=30; T=12.0; N=int(T*FPS)
BG=np.array([236,242,242],np.float32)  # BGR of #F2F2EC (warm off-white)
INK=np.array([20,27,13],np.float32)     # #0D1B14
LIME=np.array([50,244,198],np.float32)  # #C6F432
FOREST=np.array([48,61,7],np.float32)   # #073D30
yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
U=min(W,H)
ease=lambda x:0.5-0.5*math.cos(math.pi*min(max(x,0),1))
def back(x):  # overshoot ease
    x=min(max(x,0),1); c=1.7; return 1+(c+1)*(x-1)**3+c*(x-1)**2
# stride points (heel -> toe), sole-like gentle S path
if P: pts=[(0.40,0.66),(0.58,0.56),(0.47,0.45),(0.62,0.34)]; quadC=(0.5,0.50); gap=0.17
else: pts=[(0.20,0.70),(0.33,0.56),(0.27,0.42),(0.41,0.30)]; quadC=(0.31,0.50); gap=0.11
pts=[(x*W,y*H) for x,y in pts]
qd=U*gap if P else W*gap
quad=[(-1,1),(1,1),(-1,-1),(1,-1)]  # bottom-left, bottom-right, top-left, top-right (heel->toe order mapping)
quad=[(quadC[0]*W+a*qd*0.5, quadC[1]*H+b*qd*0.5) for a,b in quad]
R=U*(0.050 if P else 0.042)
land=[0.9+1.05*i for i in range(4)]
def pos(i,t):
    k=ease((t-5.2)/2.2); back_k=ease((t-10.4)/1.4)
    x=pts[i][0]+(quad[i][0]-pts[i][0])*k; y=pts[i][1]+(quad[i][1]-pts[i][1])*k
    # gentle rotation of quad while held
    if t>7.4:
        a=math.radians(12*ease((t-7.4)/3.0)); cx,cy=quadC[0]*W,quadC[1]*H
        dx,dy=x-cx,y-cy; x,y=cx+dx*math.cos(a)-dy*math.sin(a), cy+dx*math.sin(a)+dy*math.cos(a)
    return x,y
def weight(i,t):
    w=ease((t-land[i])/0.6)
    return w*(1-ease((t-10.6)/1.2))
# spline path for stride line
def catmull(p,n=200):
    P2=[p[0]]+p+[p[-1]]; out=[]
    for i in range(1,len(P2)-2):
        p0,p1,p2,p3=map(np.array,(P2[i-1],P2[i],P2[i+1],P2[i+2]))
        for s in np.linspace(0,1,n//3,endpoint=False):
            out.append(0.5*((2*p1)+(-p0+p2)*s+(2*p0-5*p1+4*p2-p3)*s*s+(-p0+3*p1-3*p2+p3)*s**3))
    out.append(np.array(p[-1])); return np.array(out)
path=catmull(pts); seg=np.r_[0,np.cumsum(np.linalg.norm(np.diff(path,axis=0),axis=1))]; seg/=seg[-1]
ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','bgr24','-s',f'{W}x{H}','-r',str(FPS),'-i','-',
  '-c:v','libx264','-preset','slow','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart','-an',OUT],stdin=subprocess.PIPE)
rng=np.random.default_rng(3); grain=[rng.normal(0,1.6,(H,W,1)).astype(np.float32) for _ in range(8)]
cx0,cy0=quadC[0]*W,quadC[1]*H
base=np.exp(-np.sqrt((xx-cx0)**2+((yy-cy0)*0.8)**2)/(U*0.9))*0.55
vign=(1-0.07*(((xx/W-0.5)**2+(yy/H-0.5)**2)*2))[...,None]
for f in range(N):
    t=f/FPS
    F=base.copy()
    cur=[pos(i,t) for i in range(4)]; ws=[weight(i,t) for i in range(4)]
    for (x,y),w in zip(cur,ws):
        if w>0: F+=w*0.42*np.exp(-np.sqrt((xx-x)**2+(yy-y)**2)/(U*0.16))
    v=F*16 - 2*t/T  # integer drift cycles -> seamless loop
    gy,gx=np.gradient(F*16); g=np.sqrt(gx*gx+gy*gy)+1e-6
    d=np.abs(v-np.round(v))/g  # distance to iso-line in px
    line=np.clip(1-d/0.9,0,1)
    img=np.empty((H,W,3),np.float32); img[:]=BG
    img=img*(1-line[...,None]*0.22)+INK*line[...,None]*0.22
    ov=img.copy()
    # stride line drawing
    k=min(max((t-0.4)/(land[3]+0.3-0.4),0),1); fade=1-ease((t-5.0)/1.2)
    if k>0 and fade>0:
        n=int(np.searchsorted(seg,k)); pts_draw=path[:max(n,2)].astype(np.int32)
        lay=np.zeros((H,W),np.float32); cv2.polylines(lay,[pts_draw],False,1.0,max(1,int(U/360)),cv2.LINE_AA)
        img=img*(1-lay[...,None]*0.75*fade)+INK*lay[...,None]*0.75*fade
    # ripples
    lay=np.zeros((H,W),np.float32)
    for i,(x,y) in enumerate(cur):
        for j in range(3):
            st=land[i]+j*0.22; age=t-st
            if 0<age<2.0:
                r=R*(1.0+age*2.3); a=(1-age/2.0)**1.6
                cv2.circle(lay,(int(x*4),int(y*4)),int(r*4),a,max(1,int(U/420))*4,cv2.LINE_AA,2)
        # held pulses
        if 7.6<t<10.4:
            age=((t-7.6-i*0.12)%1.4); a=0.5*(1-age/1.4)**2
            cv2.circle(lay,(int(x*4),int(y*4)),int(R*(1.05+age*1.1)*4),a,max(1,int(U/520))*4,cv2.LINE_AA,2)
    img=img*(1-lay[...,None]*0.55)+FOREST*lay[...,None]*0.55
    # horizon hairline
    hk=ease((t-7.6)/1.0)*(1-ease((t-10.4)/1.0))
    if hk>0:
        yh=int(quadC[1]*H+qd*1.25); L=int(W*0.36*hk)
        lay=np.zeros((H,W),np.float32); cv2.line(lay,(int(cx0-L),yh),(int(cx0+L),yh),1.0,1,cv2.LINE_AA)
        img=img*(1-lay[...,None]*0.5)+INK*lay[...,None]*0.5
    # circles
    disk_hl=[]; sh=np.zeros((H,W),np.float32); disk=np.zeros((H,W),np.float32); ring=np.zeros((H,W),np.float32)
    for i,(x,y) in enumerate(cur):
        s=back((t-land[i])/0.55)*(1-ease((t-10.6)/1.1))
        if s<=0.01: continue
        r=R*s
        cv2.circle(sh,(int(x*4),int((y+R*0.35)*4)),int(r*1.05*4),0.18,-1,cv2.LINE_AA,2)
        cv2.circle(disk,(int(x*4),int(y*4)),int(r*4),1.0,-1,cv2.LINE_AA,2)
        cv2.circle(ring,(int(x*4),int(y*4)),int(r*4),1.0,max(1,int(U/900*4*s)),cv2.LINE_AA,2)
        hl=np.exp(-(((xx-(x-r*0.35))**2+(yy-(y-r*0.4))**2)/(r*r*0.5+1e-3)))*s; disk_hl.append(hl)
    if sh.any():
        sh=cv2.GaussianBlur(sh,(0,0),R*0.45)
        img=img*(1-sh[...,None])
        img=img*(1-disk[...,None])+LIME*disk[...,None]
        hl=sum(disk_hl)*disk if disk_hl else 0
        img=img+ (np.array([235,255,245],np.float32)-img)*(hl*0.45)[...,None] if disk_hl else img
        img=img*(1-ring[...,None]*0.55)+FOREST*ring[...,None]*0.55
    img=img*vign+grain[f%8]
    ff.stdin.write(np.clip(img,0,255).astype(np.uint8).tobytes())
    if abs(t-8.6)<1e-6 or f==int(8.6*FPS): cv2.imwrite(OUT.replace('.mp4','-poster.jpg'),np.clip(img,0,255).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,82])
ff.stdin.close(); ff.wait(); print('done',OUT)
