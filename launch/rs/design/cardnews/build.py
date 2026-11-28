"""RHARA SHOE 카드뉴스 생성기 (인스타 캐러셀 1080×1350)
사용: python3 build.py sets/<세트>.json  →  out/<id>/01.png ... (+ 미리보기는 스크래치에서)
내용은 JSON만 고친다. 디자인 규칙: 잉크 배경 · 라임 포인트 · 로고는 마지막 장에만 작게 (정보형 = 판매 문구 ✗)"""
import json, sys, os, subprocess, pathlib
D = pathlib.Path(__file__).resolve().parent
A = (D / '../fair-print/assets').resolve(); F = (D / '../fair-print/fonts').resolve()
s = json.load(open(sys.argv[1])); out = D / 'out' / s['id']; out.mkdir(parents=True, exist_ok=True)
nl = lambda t: t.replace('\n', '<br>')
CSS = f'''@font-face{{font-family:N;font-weight:400;src:url({F}/NotoSansKR-400.ttf)}}@font-face{{font-family:N;font-weight:700;src:url({F}/NotoSansKR-700.ttf)}}@font-face{{font-family:N;font-weight:900;src:url({F}/NotoSansKR-900.ttf)}}
*{{margin:0;padding:0;box-sizing:border-box}}body{{width:1080px;height:1350px;background:#0D0D0D;color:#EDEDE8;font-family:N;letter-spacing:-.02em;position:relative;overflow:hidden}}
.L{{color:#C6F432}}.ser{{position:absolute;left:90px;top:80px;font-size:26px;font-weight:700;color:#8A8A85;letter-spacing:.02em}}
.pg{{position:absolute;right:90px;top:80px;font-size:26px;font-weight:700;color:#8A8A85}}
.sw{{position:absolute;right:90px;bottom:80px;font-size:24px;color:#8A8A85}}'''
def page(inner, i, n):
    return f'<html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="ser">{s["series"]}</div><div class="pg">{i}/{n}</div>{inner}{"<div class=sw>옆으로 넘기기 →</div>" if i < n else ""}</body></html>'
n = len(s['items']) + 2; pages = []
c = s['cover']
pages.append(f'''<div style="position:absolute;left:90px;top:330px;font-size:34px;font-weight:700;color:#0D0D0D;background:#C6F432;padding:10px 22px;border-radius:8px">{c["kicker"]}</div>
<div style="position:absolute;left:90px;top:440px;font-size:112px;font-weight:900;line-height:1.18;color:#fff">{nl(c["title"])}</div>
<div style="position:absolute;left:90px;top:{440 + 132 * (c["title"].count(chr(10)) + 1) + 60}px;font-size:40px;color:#C9C9C4">{c["sub"]}</div>
<div style="position:absolute;left:90px;right:90px;bottom:200px;display:flex;gap:22px">{"".join(f'<div style="flex:1;height:14px;border-radius:7px;background:{"#C6F432" if k==0 else "#2A2A2A"}"></div>' for k in range(5))}</div>''')
for k, it in enumerate(s['items']):
    pages.append(f'''<div style="position:absolute;left:90px;top:250px;font-size:220px;font-weight:900;color:#C6F432;line-height:1">{it["no"]}</div>
<div style="position:absolute;left:90px;top:520px;font-size:96px;font-weight:900;line-height:1.2;color:#fff">{nl(it["title"])}</div>
<div style="position:absolute;left:90px;top:800px;width:900px;font-size:40px;line-height:1.6;color:#C9C9C4">{nl(it["body"])}</div>
<div style="position:absolute;left:90px;right:90px;top:1040px;border:3px solid #C6F432;border-radius:18px;padding:26px 34px;font-size:36px;font-weight:700;color:#C6F432">☐&nbsp; {it["tip"]}</div>''')
e = s['end']
chk = ''.join(f'<div style="font-size:40px;color:#EDEDE8;margin-bottom:18px">☐&nbsp; {it["title"].replace(chr(10), " ")}</div>' for it in s['items'])
pages.append(f'''<div style="position:absolute;left:90px;top:220px;font-size:84px;font-weight:900;line-height:1.22;color:#fff">{nl(e["title"])}</div>
<div style="position:absolute;left:90px;top:520px">{chk}</div>
<div style="position:absolute;left:90px;right:90px;top:960px;background:#C6F432;color:#0D0D0D;border-radius:18px;padding:30px 34px;font-size:40px;font-weight:900">{e["cta"]}</div>
<div style="position:absolute;left:90px;bottom:90px;display:flex;align-items:center;gap:22px"><img src="{A}/rs-logo-lime.png" style="height:64px"><div style="font-size:26px;color:#8A8A85">{e["brand"]}</div></div>''')
tmp = out / '_html'; tmp.mkdir(exist_ok=True)
for i, p in enumerate(pages, 1): (tmp / f'{i:02d}.html').write_text(page(p, i, n))
subprocess.run(['node', str(D / 'render.mjs'), str(tmp), str(out)], check=True)
for f in tmp.iterdir(): f.unlink()
tmp.rmdir(); print('saved', out, n, 'pages')
