import numpy as np, cv2, subprocess, sys, math, time
OUT=sys.argv[1]; W,H=int(sys.argv[2]),int(sys.argv[3]); NF=int(sys.argv[4]) if len(sys.argv)>4 else None
P=H>W; FPS=24; T=10.0; N=NF or int(T*FPS)
BG_TOP=np.array([0x16,0x2C,0x20],np.float32)/255  # RGB #162C20
BG_MID=np.array([0x0D,0x1B,0x14],np.float32)/255  # #0D1B14
def rot(ax,a):
    ax=np.array(ax,np.float64); ax/=np.linalg.norm(ax); c,s=math.cos(a),math.sin(a); x,y,z=ax
    return np.array([[c+x*x*(1-c),x*y*(1-c)-z*s,x*z*(1-c)+y*s],[y*x*(1-c)+z*s,c+y*y*(1-c),y*z*(1-c)-x*s],[z*x*(1-c)-y*s,z*y*(1-c)+x*s,c+z*z*(1-c)]])
# 4 ribbon rings: base orientation + spin axis + integer turns per loop
RINGS=[dict(base=rot((0,1,0),math.radians(0))@rot((1,0,0),math.radians(90)), spin=(0,1,0), k=1, R=1.0),
       dict(base=rot((0,1,0),math.radians(60))@rot((1,0,0),math.radians(90)), spin=(1,0.2,0.3), k=1, R=0.985),
       dict(base=rot((0,1,0),math.radians(120))@rot((1,0,0),math.radians(90)), spin=(0.3,0.4,1), k=-1, R=0.97),
       dict(base=rot((0,0,1),math.radians(8)), spin=(0,1,0), k=-1, R=0.955)]
TILT=rot((1,0,0),math.radians(22))@rot((0,0,1),math.radians(-14))
A_W,A_H=0.16,0.035   # ribbon cross-section half-width (radial) / half-thickness
def sdf_ring(p,R):
    # p: (...,3) local; ring in xz-plane, axis y; flat ribbon: wide in radial, thin in y? -> use wide in y like reference bands
    qx=np.sqrt(p[...,0]**2+p[...,2]**2)-R; qy=p[...,1]
    a,b=A_H,A_W   # radial thickness small, height (y) wide => band
    k0=np.sqrt((qx/a)**2+(qy/b)**2); k1=np.sqrt((qx/a**2)**2+(qy/b**2)**2)+1e-9
    return k0*(k0-1.0)/k1
def scene(p,Ms):
    d=None; idx=None
    for i,M in enumerate(Ms):
        lp=p@M  # world->local (M orthonormal, local = M^T p => p@M)
        di=sdf_ring(lp,RINGS[i]['R'])
        if d is None: d=di; idx=np.zeros(di.shape,np.int8)
        else: m=di<d; d=np.where(m,di,d); idx=np.where(m,i,idx)
    return d,idx
def env(dirv):
    # studio environment in RGB 0..1: dark green base, softbox bands, lime & mint glints
    x,y,z=dirv[...,0],dirv[...,1],dirv[...,2]
    base=np.stack([0.02+0.03*y,0.06+0.05*y,0.04+0.03*y],-1)
    top=np.clip(y,0,1)[...,None]**2*np.array([0.95,1.0,0.96])*1.6
    side=np.exp(-((x-0.95)/0.25)**2)[...,None]*np.array([1.0,1.0,1.0])*1.5+np.exp(-((x+0.15)/0.05)**2)[...,None]*np.clip(y+0.2,0,1)[...,None]*np.array([0.9,1.0,0.5])*1.4
    floor=np.clip(-y,0,1)[...,None]**2*np.array([0.20,0.45,0.30])
    band1=np.exp(-((x-0.55)/0.10)**2)[...,None]*np.clip(y+0.4,0,1)[...,None]*np.array([0.85,1.0,0.35])*1.6   # lime softbox
    band2=np.exp(-((x+0.6)/0.13)**2)[...,None]*np.clip(0.8-abs(y),0,1)[...,None]*np.array([0.55,0.95,0.80])*1.1  # mint
    rim=np.exp(-((z+0.2)/0.25)**2)[...,None]*np.exp(-((y+0.35)/0.2)**2)[...,None]*np.array([0.12,0.45,0.25])
    return base+top+side+floor+band1+band2+rim
# camera
cam=np.array([0,0,4.2]); fov=0.46 if not P else 0.74
ys,xs=np.mgrid[0:H,0:W].astype(np.float64)
asp=W/H
u=((xs+0.5)/W*2-1)*asp*fov; v=-((ys+0.5)/H*2-1)*fov
# object placement: landscape left third, portrait upper-middle
off=np.array([-1.0,0.0,0]) if not P else np.array([0,0.30,0])
rd=np.stack([u,v,-np.ones_like(u)],-1); rd/=np.linalg.norm(rd,axis=-1,keepdims=True)
ro=np.broadcast_to(cam,rd.shape).copy()
# background
gy=(ys/H)[...,None]; bgimg=BG_TOP*(1-gy)+BG_MID*gy
cxp,cyp=(0.30*W,0.5*H) if not P else (0.5*W,0.40*H)
glow=np.exp(-(((xs-cxp)/(W*0.35))**2+((ys-cyp)/(H*0.35))**2))[...,None]*np.array([0.03,0.07,0.04])
bgimg=bgimg+glow
ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-',
 '-c:v','libx264','-preset','slow','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart','-an',OUT],stdin=subprocess.PIPE)
# bounding sphere culling
bc=off; bR=1.25
oc=ro-bc; bq=np.sum(oc*rd,-1); cq=np.sum(oc*oc,-1)-bR*bR; disc=bq*bq-cq; hitS=disc>0
idxs=np.nonzero(hitS); RO=ro[idxs]; RD=rd[idxs]; t0=np.maximum(-bq[idxs]-np.sqrt(disc[idxs]),0)
rng=np.random.default_rng(2)
for f in range(N):
    tt=f/FPS; ph=2*math.pi*tt/T
    G=rot((0.2,1,0.1),0.35*math.sin(ph))@rot((1,0,0),0.25*math.sin(ph*2+0.7)*0.5)
    Ms=[TILT@G@rot(r['spin'],r['k']*ph)@r['base'] for r in RINGS]
    t=t0.copy(); alive=np.ones(len(t),bool); hit=np.zeros(len(t),bool)
    for it in range(90):
        a=np.nonzero(alive)[0]
        if len(a)==0: break
        p=RO[a]+RD[a]*t[a,None]-off
        d,_=scene(p,Ms)
        t[a]+=d*0.9
        h=d<0.0008; hit[a[h]]=True; alive[a[h]]=False
        far=t[a]>8; alive[a[far]]=False
    img=bgimg.copy()
    hi=np.nonzero(hit)[0]
    if len(hi):
        p=RO[hi]+RD[hi]*t[hi,None]-off; e=0.0015
        n=np.stack([scene(p+np.array([e,0,0]),Ms)[0]-scene(p-np.array([e,0,0]),Ms)[0],
                    scene(p+np.array([0,e,0]),Ms)[0]-scene(p-np.array([0,e,0]),Ms)[0],
                    scene(p+np.array([0,0,e]),Ms)[0]-scene(p-np.array([0,0,e]),Ms)[0]],-1)
        n/=np.linalg.norm(n,axis=-1,keepdims=True)+1e-9
        dv=RD[hi]; refl=dv-2*np.sum(dv*n,-1,keepdims=True)*n
        cosv=np.clip(-np.sum(dv*n,-1),0,1)
        fres=0.35+0.65*(1-cosv)**3
        # thin-film-ish iridescence within green family
        ph2=cosv*7.0+refl[...,1]*2.5+refl[...,0]*1.5
        irid=np.stack([0.55+0.35*np.cos(ph2+2.2),0.80+0.20*np.cos(ph2+0.3),0.45+0.35*np.cos(ph2+1.0)],-1)
        col=env(refl)*(0.45+0.55*irid)*(0.75+0.25*fres[...,None])+np.array([0.02,0.05,0.035])
        # tint toward body color in grazing dark areas
        col=np.clip(col,0,1.6)
        full=np.zeros((len(t),3)); full[hi]=col
        m=np.zeros(len(t),bool); m[hi]=True
        sel=(idxs[0][m],idxs[1][m]); img[sel]=full[m]
    # soft bloom
    lum=np.clip(img-0.75,0,None); bl=cv2.GaussianBlur(lum.astype(np.float32),(0,0),W*0.008)
    img=img+bl*0.6
    img=img/(1+img*0.25)*1.2  # gentle tone map
    img=img+rng.normal(0,0.006,(H,W,1))
    ff.stdin.write((np.clip(img,0,1)*255).astype(np.uint8).tobytes())
    if f==0 or f==N//2:
        cv2.imwrite(OUT.replace('.mp4',f'-f{f}.jpg'),cv2.cvtColor((np.clip(img,0,1)*255).astype(np.uint8),cv2.COLOR_RGB2BGR),[cv2.IMWRITE_JPEG_QUALITY,85])
ff.stdin.close(); ff.wait(); print('done')
