"""라라슈 브랜드 필름 편집: python3 build.py → rs-brand-film-16x9.mp4 (클립: clips/, 그래픽: edit/)"""
import subprocess
SEG = [  # (소스, 시작, 길이)
    ('clips/01-tire.mp4', 0.0, 7.0), ('clips/02-kitchen.mp4', 0.0, 4.0), ('clips/02-kitchen.mp4', 4.0, 2.9),
    ('clips/08-floor.mp4', 1.0, 3.5), ('clips/03-making.mp4', 0.0, 4.0), ('clips/03-making.mp4', 4.0, 4.0),
    ('clips/04-pads.mp4', 0.0, 6.5), ('PHOTO', 0, 2.5), ('clips/05-case-burst.mp4', 2.5, 5.0),
    ('clips/07-case-reveal.mp4', 1.0, 8.0), ('END', 0, 4.0)]
OV = [('t1', 1.5, 6.2), ('t2', 8.0, 13.6), ('t3', 18.0, 24.9), ('t4', 26.0, 31.6), ('t5', 32.1, 34.3), ('t6', 40.5, 46.9), ('logo-glass', 44.0, 47.3)]
TOTAL = sum(s[2] for s in SEG)
inp, fv, fa = [], [], []
srcs = []
for src, ss, d in SEG:
    if src not in srcs: srcs.append(src)
for s in srcs:
    if s == 'PHOTO': inp += ['-loop', '1', '-t', '3', '-i', 'edit/outsole-studio.png']
    elif s == 'END': inp += ['-loop', '1', '-t', '5', '-i', 'edit/endcard.png']
    else: inp += ['-i', s]
for name, a, b in OV: inp += ['-loop', '1', '-t', str(TOTAL), '-i', f'edit/{name}.png']
inp += ['-i', 'edit/music.wav']
nov = len(srcs); music = nov + len(OV)
CROP = 'crop=1164:655:58:32,scale=1920:1080:flags=lanczos'   # 살짝 확대(가장자리 정리). Flow의 AI 표시(✦)는 지우지 않는다 — AI 생성 고지 유지
for i, (src, ss, d) in enumerate(SEG):
    k = srcs.index(src)
    if src == 'PHOTO':
        fv.append(f"[{k}:v]scale=1920:1080,zoompan=z='1+0.0008*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=24,trim=duration={d},setpts=PTS-STARTPTS,format=yuv420p[v{i}]")
        fa.append(f"anullsrc=r=48000:cl=stereo,atrim=duration={d}[a{i}]")
    elif src == 'END':
        fv.append(f"[{k}:v]scale=1920:1080,fps=24,trim=duration={d},setpts=PTS-STARTPTS,fade=in:st=0:d=0.4,format=yuv420p[v{i}]")
        fa.append(f"anullsrc=r=48000:cl=stereo,atrim=duration={d}[a{i}]")
    else:
        fade = ',fade=in:st=0:d=0.8' if i == 0 else ''
        fv.append(f"[{k}:v]trim=start={ss}:duration={d},setpts=PTS-STARTPTS,{CROP},fps=24{fade},format=yuv420p[v{i}]")
        fa.append(f"[{k}:a]atrim=start={ss}:duration={d},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo[a{i}]")
n = len(SEG)
f = fv + fa + [''.join(f'[v{i}][a{i}]' for i in range(n)) + f'concat=n={n}:v=1:a=1[cv][ca]']
last = 'cv'
for j, (name, a, b) in enumerate(OV):
    k = nov + j
    f.append(f"[{k}:v]format=rgba,fade=t=in:st={a}:d=0.35:alpha=1,fade=t=out:st={b-0.35}:d=0.35:alpha=1[o{j}]")
    f.append(f"[{last}][o{j}]overlay=0:0:enable='between(t,{a},{b})'[x{j}]"); last = f'x{j}'
f.append(f"[ca]volume=0.45[amb];[{music}:a]volume=1.0[mus];[amb][mus]amix=inputs=2:normalize=0,alimiter=limit=0.8[aout]")
cmd = ['ffmpeg', '-loglevel', 'error', '-y'] + inp + ['-filter_complex', ';'.join(f), '-map', f'[{last}]', '-map', '[aout]',
       '-t', str(TOTAL), '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', 'edit/raw.mp4']
subprocess.run(cmd, check=True)
# 음량 -14 LUFS 맞춤
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', 'edit/raw.mp4', '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', 'rs-brand-film-16x9.mp4'], check=True)
print('done', TOTAL)
