"""레오 EP.01 — 로파이 비트(합성) + 효과음 → out/mix.wav  (외부 샘플 없음)
실행: $LIB/.venv/bin/python mix.py"""
import json, os, sys
import numpy as np
import soundfile as sf
LIB = os.environ.get('LIB', os.path.expanduser('~/lemo-opuscar'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
import sfx
from sfx import SR, t_, env_exp, lp, hp, bp, noise, norm, add

HERE = os.path.dirname(os.path.abspath(__file__))
ev = json.load(open(os.path.join(HERE, 'events.json')))
DUR = ev['dur']; EV = ev['ev']; BEAT = 0.5
buf = np.zeros((int((DUR + 0.5) * SR), 2)); mus = np.zeros_like(buf)
def mtof(m): return 440 * 2 ** ((m - 69) / 12)

def kick(v=1.0):
    d = .3; tt = t_(d); f = 50 + 70 * np.exp(-tt / .03)
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .1)) * v
def snare(v=1.0):
    d = .2; return norm(bp(noise(d), 1500, 6000) * env_exp(d, .05) + .4 * np.sin(2 * np.pi * 190 * t_(d)) * env_exp(d, .03)) * v
def hat(v=1.0):
    d = .05; return norm(hp(noise(d), 7500) * env_exp(d, .012)) * v
def keys(ms, d=1.0, v=1.0):   # 로파이 전자피아노 화음 (살짝 디튠)
    tt = t_(d); x = 0
    for m in ms:
        f = mtof(m); x = x + np.sin(2 * np.pi * f * tt) + .3 * np.sin(2 * np.pi * f * 2.001 * tt) * np.exp(-tt / .2)
    x = x * np.minimum(1, tt / .01) * np.exp(-tt / .7)
    return lp(norm(x), 2500) * v
def glide(f0, f1, d, v=1.0):  # 한숨용 하강 톤 (뿌우~)
    tt = t_(d); f = f0 * (f1 / f0) ** (tt / d); ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + .5 * np.sin(2 * ph) + .25 * np.sin(3 * ph)
    return lp(norm(x * np.minimum(1, tt / .03) * np.minimum(1, (d - tt) / .15)), 1800) * v

STOP = 12.0   # 아웃트로 직전 정지 (index.html의 NEW 경계와 맞춤)
# 화음 진행 (Fmaj7 - Em7 - Dm7 - Cmaj7), 마디(2초)마다
prog = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]]
for i, t in enumerate(np.arange(0, STOP, 2.0)):
    add(mus, keys(prog[i % 4], 1.9, .5), t, .32, 0)
# 비트: 0~4.5 가볍게(햇만), 4.5~ 킥/스네어, 10.0 강하게
t = 0.0
while t < STOP - 1e-6:
    b = int(round(t / BEAT))
    add(mus, hat(.8), t, .12, .3); add(mus, hat(.5), t + .25, .08, .3)
    if t >= 4.5:
        if b % 2 == 0: add(mus, kick(), t, .7 if t >= 10 else .5)
        else: add(mus, snare(), t, .35 if t >= 10 else .25)
    t += BEAT
# 8.0~10.0 한숨 구간: 음악 낮춤
s0, s1 = int(8.0 * SR), int(10.0 * SR); mus[s0:s1] *= .55
# 9.5 정지 → 아웃트로 화음
f = int(.01 * SR); mus[int(STOP * SR) - f:int(STOP * SR)] *= np.linspace(1, 0, f)[:, None]; mus[int(STOP * SR):] = 0
add(mus, keys([60, 64, 67, 71, 74], 2.4, .6), 13.25, .45)

for e in EV:
    t = e['t']; ty = e['type']
    if ty == 'door':   # 문 종소리: 2음 딩동
        add(buf, sfx.ding(.6), t + .02, .35, -.2); add(buf, sfx.ding(.45), t + .22, .25, .2)
    elif ty == 'shiver': add(buf, bp(noise(.6), 300, 1200) * env_exp(.6, .25) * .4, t, .3)
    elif ty == 'hum':   # 에어컨 웅— (1.5초)
        d = 1.5; x = lp(noise(d), 500) * .6 + .3 * np.sin(2 * np.pi * 120 * t_(d))
        x *= np.minimum(1, t_(d) / .2) * np.minimum(1, (d - t_(d)) / .2); add(buf, norm(x), t, .3)
    elif ty == 'zoom': add(buf, sfx.whoosh(.3, .6), t - .1, .35)
    elif ty == 'hit': add(buf, sfx.thump(.8, 80), t, .5); add(buf, sfx.clack(1.4, .5), t, .25)
    elif ty == 'beep': add(buf, np.sin(2 * np.pi * 2000 * t_(.08)) * .5, t, .25); add(buf, np.sin(2 * np.pi * 2000 * t_(.08)) * .5, t + .14, .25)
    elif ty == 'sigh': add(buf, glide(330, 165, 1.1, .7), t, .35)
    elif ty == 'tie': add(buf, sfx.pop(.7), t, .4); add(buf, sfx.whoosh(.2, .4), t - .08, .2)
    elif ty == 'dot': add(buf, sfx.click(1.1 + .1 * e['i'], .5), t, .45)
    elif ty == 'logo': add(buf, sfx.whoosh(.45, .5), t - .2, .35)
    elif ty == 'stamp': add(buf, sfx.thump(.6, 110), t, .4); add(buf, sfx.clack(.8, .4), t, .3)

mix = mus * .8 + buf * .6
for c in range(2): mix[:, c] = sfx.limit(np.tanh(sfx.compress(mix[:, c] * .6, thr=.12, ratio=5) * 2.2) / 2.2, .3)
mix = mix[:int(DUR * SR)]
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR); print('mix', mix.shape[0] / SR, 's')
