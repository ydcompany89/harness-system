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

def step(no, title, body, reward):
    return f"""<div style="background:{INK};border-radius:14mm;padding:12mm 14mm;display:flex;flex-direction:column;gap:4mm">
      <div style="display:flex;justify-content:space-between;align-items:baseline"><div style="font-size:34pt;font-weight:900;color:{LIME};letter-spacing:.1em">STEP {no}</div><div style="font-size:34pt;font-weight:900;color:{LIME}">→ {reward}</div></div>
      <div style="font-size:58pt;font-weight:900;color:#fff;line-height:1.2">{title}</div>
      <div style="font-size:33pt;color:#d6d6d6;line-height:1.4">{body}</div></div>"""

row = lambda rank, item, cells, pct, hi=False: f"""<div style="display:grid;grid-template-columns:70mm 1fr 70mm 90mm;align-items:center;padding:4.5mm 0;border-top:1mm solid {INK}">
  <div style="font-size:40pt;font-weight:900">{rank}</div><div style="font-size:40pt;font-weight:900">{item}</div>
  <div style="font-size:30pt;text-align:center">{cells}칸</div><div style="font-size:40pt;font-weight:900;text-align:right">{pct}</div></div>"""

body = col(f"""<div style="display:flex;justify-content:space-between;align-items:center"><div style="display:flex;align-items:center;gap:8mm">{logo(70, 'ink')}<div style="font-size:30pt;font-weight:900;color:{INK};line-height:1.15">RHARA SHOE<br>라라슈</div></div><div style="font-size:38pt;font-weight:900;color:{INK};letter-spacing:.12em;text-align:right">BOOTH<br>EVENT</div></div>
  <div style="font-size:165pt;font-weight:900;line-height:1.08;color:{INK}">피드 올리면<br><span style="display:inline-block;margin-top:6mm;background:{INK};color:{LIME};padding:1mm 8mm 5mm;line-height:1.1">룰렛 1회!</span></div>
  <div style="display:flex;flex-direction:column;gap:7mm">
    {step(1, 'A 또는 B 하나만', 'A 와디즈 오픈 알림 신청 → 완료 화면 보여 주기<br>B @rharashoe 팔로우 + 부스 사진 스토리<br>　(첫 줄 [협찬] · #라라슈)', 're.feeel 칫솔')}
    {step(2, '상품 사진 피드 올리기', '공개 계정 · 본문 맨 앞 [협찬]<br>@rharashoe #라라슈 #쿼드그립워킹화 #아치가득인솔', '룰렛 1회')}</div>
  {wheel(400)}
  <div style="border-bottom:1mm solid {INK}">
    {row('1등', '젤 볼펜', 1, '12.5%')}{row('2등', '데이투나잇 왕모칫솔', 2, '25%')}{row('3등', '치실', 3, '37.5%')}{row('꽝', '—', 2, '25%')}</div>
  <div style="display:flex;flex-direction:column;gap:10mm"><div style="font-size:200pt;font-weight:900;line-height:1.05;color:{INK}">QR로 빠르게<br>이벤트 참여</div>
  <div style="display:flex;align-items:center;gap:12mm">{qr('kintex', 165)}<div style="font-size:28pt;color:#2f3a0c;line-height:1.45">1인 1회 · 그날 1등 소진 시 2등으로 대체<br>하루 수량 소진 시 마감 · 비공개 계정 불인정<br>경품 손잡이·케이스 등 일부에 버려진 목재를<br>가공한 새활용 소재를 썼어요<br>(적용 부위는 부스에서 안내)</div></div></div>""", 70, 1730, 50, W)

write('07d_xbanner_event_v5_600x1800', (W, H), [(body, LIME, gl)], 'X배너 600×1800 v5 — 부스 이벤트 (최종 룰렛 8칸)')
print('ok')
