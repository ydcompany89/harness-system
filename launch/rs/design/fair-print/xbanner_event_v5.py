"""킨텍스 부스 이벤트 X배너 600×1800 v5 — 최종 룰렛(대표 확정 10/30: 8칸 · 1등1 2등2 3등3 꽝2)
python3 xbanner_event_v5.py → 07d_xbanner_event_v5_600x1800_{art,dieline}.html
build.py 의 공용 함수(col·qr·lockup·write 등)를 그대로 씀. 재사용 인쇄물이라 날짜 없음.
"""
import math, os
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'build.py')).read()
src = src[:src.index('\ncard_v5(); counter_signs()')]   # 함수 정의까지만 (전체 재생성 방지)
exec(src)

W, H = 600, 1800
gl = trim_rect(W, H, 0) + ''.join(f'<circle class="cut" cx="{cx}" cy="{cy}" r="6"/>' for cx in (25, W - 25) for cy in (25, H - 25)) + \
    f'<rect class="guide" x="40" y="60" width="{W-80}" height="{H-120}"/><text class="lbl" x="45" y="56" style="font-size:12px">아일렛(타공) 4곳 · 안전영역 40mm</text>'

# 원판 8칸 — 같은 등수끼리 붙지 않게 배치
SEG = [('1등', '젤 볼펜'), ('3등', '치실'), ('2등', '왕모칫솔'), ('꽝', ''), ('3등', '치실'), ('2등', '왕모칫솔'), ('3등', '치실'), ('꽝', '')]
STY = {'1등': (INK, LIME), '2등': (LIME, INK), '3등': ('#FFFFFF', INK), '꽝': ('#E9E6DF', MUTE)}
def wheel(mm):
    s, n, R = '', len(SEG), 100
    for i, (rank, item) in enumerate(SEG):
        a0, a1 = math.radians(-90 - 22.5 + i * 45), math.radians(-90 + 22.5 + i * 45)
        p = lambda a: f'{R*math.cos(a):.2f},{R*math.sin(a):.2f}'
        fill, fg = STY[rank]
        s += f'<path d="M0,0 L{p(a0)} A{R},{R} 0 0 1 {p(a1)} Z" fill="{fill}" stroke="{INK}" stroke-width="1.6"/>'
        ang = i * 45; cx, cy = 66 * math.sin(math.radians(ang)), -66 * math.cos(math.radians(ang))
        if item:
            s += f'<g transform="translate({cx:.2f},{cy:.2f}) "><text text-anchor="middle" font-family="N" font-weight="900" font-size="19" fill="{fg}" y="-2">{rank}</text><text text-anchor="middle" font-family="N" font-weight="700" font-size="10.5" fill="{fg}" y="13">{item}</text></g>'
        else:
            s += f'<g transform="translate({cx:.2f},{cy:.2f}) "><text text-anchor="middle" font-family="N" font-weight="900" font-size="21" fill="{fg}" y="7">꽝</text></g>'
    s += f'<circle r="16" fill="{LIME}" stroke="{INK}" stroke-width="3"/><circle r="5" fill="{INK}"/><path d="M-10,-114 L10,-114 L0,-88 Z" fill="#E03030" stroke="{INK}" stroke-width="2"/>'
    return f'<svg viewBox="-118 -118 236 236" style="width:{mm}mm;height:{mm}mm;display:block;margin:0 auto">{s}</svg>'

GR = '#5BA51F'   # 레퍼런스의 진한 연두 라벨
def band(txt, size, skew=-6):
    return f'<div style="display:inline-block;background:{LIME};transform:skewX({skew}deg);padding:2mm 12mm 4mm;margin-left:-4mm"><div style="transform:skewX({-skew}deg);font-size:{size}pt;font-weight:900;line-height:1.1;color:{INK}">{txt}</div></div>'

def tile(rank, name, inner):
    return f"""<div style="flex:0 0 116mm;min-width:0;text-align:center"><div style="height:210mm;border-radius:10mm;background:#F3F3F1;display:grid;place-items:center;overflow:hidden">{inner}</div>
      <div style="font-size:46pt;font-weight:900;color:{GR};margin-top:4mm">{rank}</div><div style="font-size:48pt;font-weight:900;line-height:1.1">{name}</div></div>"""
cutimg = lambda f, w, rot: f'<img src="{A}{f}" style="width:{w}mm;transform:rotate({rot}deg)">'

ICON = {
 1: f'<div style="width:120mm;height:120mm;border:3mm solid {INK};border-radius:16mm;display:grid;place-items:center;position:relative">{logo(52, "ink")}<div style="position:absolute;right:-10mm;bottom:-10mm;width:46mm;height:46mm;border-radius:50%;background:{GR};border:2.5mm solid #fff;color:#fff;display:grid;place-items:center;font-size:56pt;font-weight:900;line-height:1">+</div></div>',
 2: f'<svg viewBox="0 0 120 120" style="width:120mm;height:120mm"><rect x="4" y="12" width="112" height="96" rx="14" fill="#fff" stroke="{INK}" stroke-width="6"/><circle cx="38" cy="42" r="10" fill="#F2C230"/><path d="M14 98 L48 58 L70 82 L84 66 L108 98 Z" fill="{GR}"/></svg>',
 3: '<svg viewBox="-60 -64 120 124" style="width:120mm;height:124mm">' + ''.join(
     f'<path d="M0,0 L{50*math.cos(math.radians(-112.5+i*45)):.1f},{50*math.sin(math.radians(-112.5+i*45)):.1f} A50,50 0 0 1 {50*math.cos(math.radians(-67.5+i*45)):.1f},{50*math.sin(math.radians(-67.5+i*45)):.1f} Z" fill="{[INK,LIME,"#fff",LIME,"#E9E6DF","#fff",LIME,"#E9E6DF"][i]}" stroke="{INK}" stroke-width="2.5"/>' for i in range(8)) +
     f'<circle r="8" fill="{LIME}" stroke="{INK}" stroke-width="3"/><path d="M-8,-62 L8,-62 L0,-44 Z" fill="#E03030" stroke="{INK}" stroke-width="2"/></svg>'}
def step(no, text, sub=''):
    return f"""<div style="display:flex;align-items:center;gap:12mm;padding:9mm 0;border-bottom:1mm solid #d9d9d9">
      <div style="flex:none;width:70mm;height:70mm;border-radius:10mm;background:{LIME};display:grid;place-items:center;font-size:80pt;font-weight:900;line-height:1">{no}</div>
      <div style="flex:none;width:130mm;display:grid;place-items:center">{ICON[no]}</div>
      <div><div style="font-size:62pt;font-weight:900;line-height:1.2">{text}</div>{f'<div style="font-size:30pt;font-weight:700;color:#333;margin-top:3mm">{sub}</div>' if sub else ''}</div></div>"""

body = col(f"""<div style="display:flex;justify-content:space-between;align-items:center"><div style="display:flex;align-items:center;gap:8mm">{logo(62, 'ink')}<div style="font-size:30pt;font-weight:900;line-height:1.15">RHARA SHOE<br>라라슈</div></div><div style="border-left:1.5mm solid {INK};padding-left:10mm;font-size:38pt;font-weight:900;line-height:1.2">BOOTH<br>EVENT</div></div>
  <div><div style="font-size:150pt;font-weight:900;line-height:1.1">사진 올리고</div>{band('룰렛 돌리고!', 150)}
    <div style="font-size:52pt;font-weight:900;margin-top:8mm">라라슈 부스 이벤트에 참여하세요!</div></div>
  <div style="margin:0 -50mm;background:{LIME};padding:14mm 50mm;display:flex;align-items:center;gap:14mm">
    <div style="background:#fff;padding:6mm;border-radius:6mm">{qr('kintex', 210)}</div>
    <div style="border-left:2mm solid {INK};padding-left:12mm;font-size:96pt;font-weight:900;line-height:1.1">지금<br>QR 스캔하고<br>참여하세요!</div></div>
  <div style="display:flex;gap:7mm;align-items:stretch">
    <div style="flex:none;width:116mm;background:{GR};color:#fff;border-radius:10mm;padding:12mm 10mm;display:flex;flex-direction:column;justify-content:center;font-weight:900;line-height:1.15"><div style="font-size:52pt">행운의<br>룰렛<br>경품</div><div style="font-size:110pt;margin-top:4mm">3종</div></div>
    {tile('1등', '젤 볼펜', f'<img src="{A}prize-pen-v.png" style="height:190mm">')}
    {tile('2등', '왕모칫솔', f'<img src="{A}prize-brush-v.png" style="height:195mm">')}
    {tile('3등', '칫솔형 치실', f'<div style="width:100%;height:100%;background:url({A}prize-floss-v.jpg) center/cover"></div>')}</div>
  <div><div style="text-align:center">{band('참여 방법 (3단계)', 80, -8)}</div>
    {step(1, '라라슈 팔로우<br>또는 알림 신청')}
    {step(2, '부스에서 찍은 사진<br>피드에 올리기', '본문 맨 앞 [협찬] #라라슈 #쿼드그립워킹화 #아치가득인솔')}
    {step(3, '룰렛 돌리고<br>경품 받기!')}</div>
  <div style="text-align:center;font-size:32pt;font-weight:700;color:#333;line-height:1.5">· 1인 1회 참여 · 당일 경품 소진 시 종료<br>· 비공개 계정은 참여가 제한돼요</div>""", 60, 1745, 50, W)

write('07d_xbanner_event_v5_600x1800', (W, H), [(body, '#FFFFFF', gl)], 'X배너 600×1800 v5 — 부스 이벤트 (최종 룰렛 8칸)')
print('ok')
