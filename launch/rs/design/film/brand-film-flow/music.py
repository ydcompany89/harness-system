"""브랜드 필름 음악(합성, 저작권 무관): 저음 드론 + 섹션 전환 서브 히트 + 라이저 + 엔딩 화음 → edit/music.wav"""
import os, sys, numpy as np, soundfile as sf
LIB = os.path.expanduser('~/lemo-opuscar'); sys.path.insert(0, LIB + '/core/audio')
import sfx
from sfx import SR, t_, env_exp, lp, hp, noise, norm, add
DUR = 51.4; END = 47.4
buf = np.zeros((int(DUR * SR), 2))
mtof = lambda m: 440 * 2 ** ((m - 69) / 12)
def pad(ms, d, v=1.0, att=1.5, rel=1.5):
    tt = t_(d); x = sum(np.sin(2*np.pi*mtof(m)*tt + 0.3*np.sin(2*np.pi*0.2*tt)) + 0.3*np.sin(2*np.pi*mtof(m)*1.003*tt) for m in ms)
    e = np.minimum(1, tt/att) * np.minimum(1, (d-tt)/rel); return lp(norm(x*e), 1200) * v
def hit(v=1.0):
    d = 1.6; tt = t_(d); f = 38 + 50*np.exp(-tt/0.05)
    return norm(np.sin(2*np.pi*np.cumsum(f)/SR) * env_exp(d, 0.45)) * v
def pluck(m, v=1.0):
    d = 2.0; tt = t_(d); f = mtof(m)
    x = (np.sin(2*np.pi*f*tt) + .4*np.sin(4*np.pi*f*tt)*np.exp(-tt/.15)) * env_exp(d, .6); x[:80] *= np.linspace(0,1,80)
    return lp(norm(x), 3000) * v
# 드론: 섹션마다 화음 (A단조 → F → C → E)
for s, d, ch in [(0, 7.4, [45, 52]), (7, 10.8, [41, 48, 57]), (17.4, 14.8, [48, 55, 64]), (31.9, 7.8, [40, 47, 56]), (39.4, 8.0, [45, 52, 60])]:
    add(buf, pad(ch, d, 1.0), s, .30)
# 섹션 전환 서브 히트
for s in [7.0, 17.4, 25.4, 31.9, 39.4]: add(buf, hit(), s, .55)
# 만드는 장면: 플럭 펄스 (2박마다)
seq = [69, 72, 76, 72]
for i, s in enumerate(np.arange(17.4, 31.9, 1.0)): add(buf, pluck(seq[i % 4], .5), s, .16 + .04*(i/14))
# 라이저 39.4 직전
d = 2.5; tt = t_(d); r = hp(noise(d), 2000) * (tt/d)**2; add(buf, norm(r), 39.4 - d, .18)
# 엔딩: 반 박 정적 후 화음 + 히트
s0, s1 = int(46.9*SR), int(END*SR); f = int(.3*SR); buf[s0-f:s0] *= np.linspace(1,0,f)[:,None]; buf[s0:s1] = 0
add(buf, pad([45, 52, 57, 61, 64], 4.0, 1.0, att=.05, rel=2.5), END, .32); add(buf, hit(), END, .6)
for c in range(2): buf[:, c] = sfx.limit(np.tanh(sfx.compress(buf[:, c]*.7, thr=.15, ratio=4)*1.8)/1.8, .3)
os.makedirs('edit', exist_ok=True); sf.write('edit/music.wav', buf.astype(np.float32), SR); print('music', DUR)
