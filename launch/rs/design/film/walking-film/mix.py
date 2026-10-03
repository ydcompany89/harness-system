"""라라슈 워킹화 런칭필름 — 음악(합성) + 효과음 → out/mix.wav
120 BPM, A단조. 외부 샘플 없이 numpy 합성만 사용 (저작권 깨끗).
실행: $LIB/.venv/bin/python mix.py  (LIB 환경변수 = 라이브러리 경로)
"""
import json, os, sys
import numpy as np
import soundfile as sf
LIB = os.environ.get('LIB', os.path.expanduser('~/lemo-opuscar'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
import sfx
from sfx import SR, t_, env_exp, lp, hp, bp, noise, norm, add

HERE = os.path.dirname(os.path.abspath(__file__))
ev = json.load(open(os.path.join(HERE, 'events.json')))
DUR = ev['dur']; EV = ev['ev']
BEAT = 0.5
buf = np.zeros((int((DUR + 0.5) * SR), 2))
mus = np.zeros_like(buf)
rng = np.random.default_rng(11)


def mtof(m): return 440 * 2 ** ((m - 69) / 12)


def kick(v=1.0):
    d = .32; tt = t_(d); f = 48 + 90 * np.exp(-tt / .03)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return norm(np.sin(ph) * env_exp(d, .12) + hp(noise(d), 3000) * env_exp(d, .002) * .25) * v


def hat(v=1.0, open_=False):
    d = .18 if open_ else .05
    return norm(hp(noise(d), 7000) * env_exp(d, .05 if open_ else .012)) * v


def glock(m, v=1.0, d=1.4):   # 사인파 말렛 (비화성 배음 약간)
    tt = t_(d); f = mtof(m)
    x = (np.sin(2 * np.pi * f * tt) * env_exp(d, .5) + .35 * np.sin(2 * np.pi * f * 2.76 * tt) * env_exp(d, .12)
         + .15 * np.sin(2 * np.pi * f * 5.4 * tt) * env_exp(d, .05))
    a = int(.002 * SR); x[:a] *= np.linspace(0, 1, a)
    return norm(x) * v


def bass(m, d=.22, v=1.0):   # 펄스 베이스: 2·3배음으로 작은 스피커에서도 들리게
    tt = t_(d); f = mtof(m)
    x = np.sin(2 * np.pi * f * tt) + .45 * np.sin(4 * np.pi * f * tt) + .25 * np.sin(6 * np.pi * f * tt)
    x *= np.minimum(1, tt / .005) * env_exp(d, .09)
    return lp(norm(x), 900) * v


STOP, END = 18.0, 18.5
# ----- 음악 -----
# 0–4: 점마다 글로켄 (A4 C#5 E5 A5), 로고에 화음
for t, m in zip([0.25, 0.5, 0.75, 1.0], [69, 73, 76, 81]):
    add(mus, glock(m, .5), t, .5, -.2 + .13 * (m - 69) / 4)
for m in [69, 76, 81]: add(mus, glock(m, .35, 2.5), 1.25, .35)
# 4–18: 킥 4분, 햇 8분 (4~), 베이스 8분 (7~). 18.0 정지
t = 4.0
while t < STOP - 1e-6:
    add(mus, kick(), t, .9)
    for k in (0, .25):
        if t + k < STOP: add(mus, hat(1, open_=(k == .25 and int((t - 4) / BEAT) % 4 == 3)), t + k, .22, .25)
    t += BEAT
# 베이스 라인: 마디마다 A-A-G-E 순환 (8분음)
line = [45, 45, 57, 45, 43, 43, 55, 40]
t = 7.0; i = 0
while t < STOP - 1e-6:
    add(mus, bass(line[i % len(line)]), t, .55); t += BEAT / 2; i += 1
# 장면마다 글로켄 모티프 (빌드: 한 장면씩 한 음 높게)
for t0, base in [(4.5, 76), (7.0, 76), (10.75, 78), (14.75, 80)]:
    for k, dm in enumerate([0, -7, -3, 0]):
        add(mus, glock(base + dm, .3, 1.0), t0 + k * BEAT * 2, .28, .3)
# 엔딩: 반 마디 정적 뒤 킥 + 화음
add(mus, kick(1.0), END, 1.0)
for m in [57, 64, 69, 73, 76]: add(mus, glock(m, .3, 3.5), END, .3)
add(mus, bass(33, d=1.6), END, .5)

# ----- 효과음 (이벤트 기준) -----
for e in EV:
    t = e['t']; ty = e['type']
    if ty == 'dot': add(buf, sfx.click(1.1 + .1 * e['i'], .5), t, .45)
    elif ty == 'enddot': add(buf, sfx.click(1.0, .4), t, .35)
    elif ty == 'logo': add(buf, sfx.whoosh(.45, .5), t - .2, .35)
    elif ty == 'wipe': add(buf, sfx.whoosh(.3, .4), t - .15, .25)
    elif ty == 'num': add(buf, sfx.clack(.9, .5), t, .35)
    elif ty == 'pad': add(buf, sfx.thump(.6, 90), t, .45); add(buf, sfx.click(.7, .3), t, .2)
    elif ty == 'tag': add(buf, sfx.clack(1.2, .4), t, .3)
    elif ty == 'push': add(buf, lp(sfx.whoosh(.6, .5), 1200), t - .3, .35)
    elif ty == 'end': add(buf, sfx.thump(.7, 60), t, .45)
    elif ty == 'stamp': add(buf, sfx.thump(.6, 110), t, .4); add(buf, sfx.clack(.8, .4), t, .3)

# 정지 구간: 음악을 STOP에서 끊고 END부터 다시 (잔향 꼬리 절단)
s0, s1 = int(STOP * SR), int(END * SR)
fade = int(.01 * SR)
mus[s0 - fade:s0] *= np.linspace(1, 0, fade)[:, None]
mus[s0:s1] = 0
mix = mus * .8 + buf * .55
for c in range(2): mix[:, c] = sfx.limit(np.tanh(sfx.compress(mix[:, c] * .6, thr=.12, ratio=5) * 2.2) / 2.2, .3)
mix = mix[:int(DUR * SR)]
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR)
print('mix', mix.shape[0] / SR, 's')
