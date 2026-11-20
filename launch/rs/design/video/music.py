# 라라슈 히어로 12초 루프 BGM — 전부 직접 합성 (샘플·외부 음원 없음)
import numpy as np, wave, math
SR=48000; T=12.0; n=int(SR*T); t=np.arange(n)/SR
rng=np.random.default_rng(7)
def note(f): return 440*2**((f-69)/12)
def env_adsr(start,dur,a=0.8,r=1.2):
    tt=t-start; att=np.clip(tt/a,0,1); rel=np.clip(1-(tt-dur)/r,0,1); e=np.minimum(att,rel); e[tt<0]=0; return e**1.5
def pad(midis,start,dur,amp=0.06):
    out=np.zeros((n,2)); e=env_adsr(start,dur)
    for m in midis:
        f=note(m)
        for det,pan in ((-0.12,0.3),(0.12,0.7),(0,0.5)):
            ff=f*2**(det/12/8); ph=rng.uniform(0,2*np.pi)
            w=np.sin(2*np.pi*ff*t+ph)+0.25*np.sin(4*np.pi*ff*t+ph)+0.08*np.sin(6*np.pi*ff*t)
            out[:,0]+=w*e*amp*(1-pan); out[:,1]+=w*e*amp*pan
    return out
mix=np.zeros((n,2))
# chords (A minor-ish -> F -> C/E bright -> back to Am for loop)
mix+=pad([45,52,57,59,64],-0.5,4.6)        # Am9   0-4
mix+=pad([41,48,53,57,64],4.0,2.6)          # Fmaj7 4-6.6 (descend)
mix+=pad([40,48,55,59,62,67],6.4,4.4,0.055) # C/E add9 6.6-10.8 (reveal)
mix+=pad([45,52,57,59,64],10.6,1.6)         # Am back (loop)
# soft pulse (heartbeat-like, standing rhythm) every 1.0s, muted during reveal
for k in range(12):
    st=k*1.0; i0=int(st*SR); L=int(0.35*SR); tt=np.arange(L)/SR
    if i0+L>n: L=n-i0; tt=tt[:L]
    amp=0.10 if not (6.4<st<10.6) else 0.05
    s=np.sin(2*np.pi*(55*np.exp(-tt*6))*tt)*np.exp(-tt*9)*amp
    mix[i0:i0+L]+=s[:,None]
# riser during descend (filtered noise swell 4.2-6.6)
i0,i1=int(4.2*SR),int(6.6*SR); L=i1-i0; nz=rng.normal(0,1,L)
nz=np.convolve(nz,np.ones(40)/40,'same'); sw=np.linspace(0,1,L)**2
mix[i0:i1,0]+=nz*sw*0.05; mix[i0:i1,1]+=np.roll(nz,300)*sw*0.05
# landing impact 6.6 (soft low thud + click)
i0=int(6.6*SR); L=int(0.8*SR); tt=np.arange(L)/SR
thud=np.sin(2*np.pi*(70*np.exp(-tt*4)+40)*tt)*np.exp(-tt*5)*0.35+rng.normal(0,1,L)*np.exp(-tt*80)*0.05
mix[i0:i0+L]+=thud[:,None]
# 4 chimes heel->toe as pads light (8.0,8.4,8.8,9.2)
for k,(st,m) in enumerate(zip((8.0,8.4,8.8,9.2),(76,79,81,84))):
    i0=int(st*SR); L=int(2.2*SR); tt=np.arange(L)/SR; f=note(m)
    bell=(np.sin(2*np.pi*f*tt)+0.4*np.sin(2*np.pi*f*2.76*tt)*np.exp(-tt*3)+0.2*np.sin(2*np.pi*f*5.4*tt)*np.exp(-tt*6))*np.exp(-tt*2.2)*0.07
    pan=0.35+0.1*k
    mix[i0:i0+L,0]+=bell*(1-pan); mix[i0:i0+L,1]+=bell*pan
# simple reverb (noise-decay IR), done in FFT
L=int(2.2*SR); irt=np.arange(L)/SR; ir=rng.normal(0,1,(L,2))*np.exp(-irt*2.6)[:,None]; ir/=np.abs(ir).sum(0)/12
N2=1<<int(np.ceil(np.log2(n+L)))
wet=np.stack([np.fft.irfft(np.fft.rfft(mix[:,c],N2)*np.fft.rfft(ir[:,c],N2),N2)[:n+L] for c in range(2)],-1)
# wrap reverb tail to start for seamless loop
tail=wet[n:]; wet=wet[:n]; wet[:len(tail)]+=tail
out=mix*0.75+wet*0.35
# loop crossfade guard
fade=int(0.03*SR); out[:fade]*=np.linspace(0,1,fade)[:,None]; out[-fade:]*=np.linspace(1,0,fade)[:,None]
out=out/np.abs(out).max()*0.7
pcm=(out*32767).astype('<i2')
with wave.open('/tmp/claude-0/-home-user-harness-system/f589f59e-5047-5a0d-9959-068b0d0e969a/scratchpad/vid/bgm12.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
