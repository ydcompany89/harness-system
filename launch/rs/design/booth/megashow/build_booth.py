"""메가쇼 킨텍스 기본부스 2개(6m×3m) — 배치도·정면도·집기(KDRS)·진열 가이드 → booth-plan.html (render: node ../../fair-print/render.mjs 방식 대신 pdf.mjs)"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
FP = '../../fair-print/'
INK, LIME, CREAM, GR, YL = '#0D0D0D', '#C6F432', '#F5F2EC', '#1F472C', '#FBD827'

# (code, 품명, 규격, 단가(공급가), 수량, 용도, 구분, x, y, w, d, 색)  — 좌표 mm, 원점=뒷벽 왼쪽, y=통로 방향
F = [
 ('KD-03', '3단진열대 2', 'W1480·D900·H1000', 110000, 1, '워킹화 3색 × 사이즈 계단 진열 (상단 페어 / 중단 밑창 뒤집어 / 하단 박스)', 'RS', 250, 0, 1480, 900, INK),
 ('KD-13', '타워쇼케이스', 'W900·D450·H2000', 140000, 1, '히어로 쇼케이스 — 워킹화 3색 1족씩 + 인솔 2색 (조명형)', 'RS', 0, 1050, 450, 900, INK),
 ('KD-04', '진열대 2 (포디움)', 'W500·D500·H1000', 45000, 2, '통로 앞 포디움 — 워킹화 1족 / 인솔 + 쓰던 깔창 겹침 시연 (PET 래핑)', 'RS', 700, 2350, 500, 500, INK),
 ('KC-10', '벤치의자', 'W1450·D400·H400', 50000, 1, '시착 존 — 앉아서 신어 보기', 'RS', 900, 1250, 1450, 400, '#444'),
 ('KET-13', '전신거울', '-', 30000, 1, '시착 존 거울', 'RS', 0, 2150, 120, 600, '#999'),
 ('KE-11', 'TV 50"', '스탠드 포함', 350000, 1, '브랜드 필름 + 원장 인터뷰 루프 (무음 자막)', 'RS', 1950, 80, 900, 450, '#222'),
 ('KET-22', '아크릴단상 1', 'W600·H1160', 130000, 1, '원장 자문 코너 — 밑창 라임 4점 + 반굽 인솔 + (족부 모형)', 'RS', 2300, 1250, 600, 400, '#bbb'),
 ('KD-08', '판매매대', 'W1500·D730·H820', 50000, 1, '계산·이벤트 카운터 — 볼펜 증정·QR·명함 (PET 래핑)', '공용', 2250, 2200, 1500, 730, INK),
 ('KC-08', '에어 바 스툴(검정)', 'Ø420·H940', 25000, 2, '카운터 스태프', '공용', 2500, 1650, 420, 420, '#555'),
 ('KD-12', '3단쇼케이스진열대', 'W900·D450·H900', 70000, 1, '칫솔·칫솔형 치실·양치컵 (유리 쇼케이스)', 're.feeel', 3150, 0, 900, 450, GR),
 ('KD-01', '1단진열대 2', 'W1480·D600·H750', 60000, 1, '욕실화 매대 — 컬러별 박스 + 번들', 're.feeel', 4250, 0, 1480, 600, GR),
 ('KD-07', '선반진열대', 'W1000·D300 (기본부스 전용)', 30000, 3, '우측 벽 욕실화 컬러 진열 (판넬 1장당 선반 1)', 're.feeel', 5700, 0, 300, 3000, GR),
 ('KET-16', '스탠드카다로그꽂이', '-', 30000, 1, '다국어 리플렛', '공용', 3850, 2450, 350, 350, '#777'),
 ('KET-14', 'POP거치대', 'W350·H1200~2000', 20000, 2, 'POP — 워킹화·인솔 가격 / 인스타 이벤트', '공용', 2000, 2700, 300, 250, '#777'),
 ('KET-32', 'X배너 거치대', '600×1800', 10000, 3, '① 라라슈 ② re.feeel ③ 정형외과 (출력물 스터닝)', '공용', 0, 0, 0, 0, None),
 ('KET-09', '휴지통 45L', '-', 5000, 1, '카운터 뒤', '공용', 3700, 1900, 250, 250, '#777'),
]
OPT = [
 ('KD-13', '타워쇼케이스 (추가)', 'W900·D450·H2000', 140000, 1, 're.feeel 히어로 — 양치컵 40° 연출 + CXP 원료 칩 (조명형)'),
 ('KD-02', '2단진열대 2', 'W1480·D600·H1000', 80000, 1, '인솔 M·L × 2색 체험대 (쓰던 깔창과 겹쳐 신어보기)'),
 ('KC-03', '땅콩의자(검정)', 'W450·D580·H450', 20000, 2, '시착 보조 / 상담석'),
]
XB = [(150, 2650, '① 라라슈', LIME), (2950, 1150, '③ 정형외과', LIME), (5250, 2650, '② re.feeel', YL)]
STD = (4700, 2250, '레오 등신대')

def won(n): return f'{n:,}'
base = sum(f[3] * f[4] for f in F)
opt = sum(o[3] * o[4] for o in OPT)

S = 0.16  # px per mm (plan)
def plan_svg():
    W, H = 6000, 3000
    s = [f'<svg viewBox="-300 -500 {W+600} {H+1100}" style="width:100%;font-family:N">',
         f'<rect x="0" y="0" width="{W}" height="{H}" fill="#f4f4f2" stroke="#999" stroke-width="10"/>',
         f'<rect x="0" y="0" width="3000" height="{H}" fill="#e9eedb"/><rect x="3000" y="0" width="3000" height="{H}" fill="#e3ebe5"/>',
         f'<line x1="3000" y1="0" x2="3000" y2="{H}" stroke="#bbb" stroke-dasharray="40 30" stroke-width="8"/>']
    # 뒷벽 족자 6 + 측벽
    names = ['RS 1', 'RS 2', 'RS 3', 're 1', 're 2', 're 3']
    for i, n in enumerate(names):
        c = LIME if i < 3 else YL
        s.append(f'<rect x="{i*1000+25}" y="-90" width="950" height="70" fill="{c}"/><text x="{i*1000+500}" y="-130" font-size="90" text-anchor="middle" font-weight="900">족자 {n}</text>')
    s.append(f'<rect x="-90" y="0" width="70" height="{H}" fill="#333"/><text x="-130" y="1500" font-size="80" text-anchor="middle" transform="rotate(-90 -130 1500)">좌측벽 (판넬 3)</text>')
    s.append(f'<rect x="{W+20}" y="0" width="70" height="{H}" fill="#333"/><text x="{W+170}" y="1500" font-size="80" text-anchor="middle" transform="rotate(90 {W+170} 1500)">우측벽 (판넬 3) — KD-07 선반 ×3</text>')
    for f in F:
        code, nm, _, _, q, _, g, x, y, w, d, col = f
        if not col or w == 0: continue
        reps = [(x, y)] if not (code == 'KD-04') else [(700, 2350), (1700, 2350)]
        if code == 'KC-08': reps = [(2550, 1650), (3100, 1650)]
        if code == 'KET-14': reps = [(1950, 2700), (4050, 2050)]
        if code == 'KD-07': reps = [(5700, 50), (5700, 1050), (5700, 2050)]; w, d = 300, 900
        for rx, ry in reps:
            tc = '#fff' if col in (INK, GR, '#222', '#444', '#555') else INK
            s.append(f'<rect x="{rx}" y="{ry}" width="{w}" height="{d}" fill="{col}" rx="20"/>')
            fs = 70 if min(w, d) >= 400 else 55
            s.append(f'<text x="{rx+w/2}" y="{ry+d/2+fs*0.35}" font-size="{fs}" fill="{tc}" text-anchor="middle" font-weight="900">{code}</text>')
    for x, y, n, c in XB:
        s.append(f'<rect x="{x}" y="{y}" width="600" height="120" fill="{c}" stroke="{INK}" stroke-width="10"/><text x="{x+300}" y="{y+220}" font-size="70" text-anchor="middle" font-weight="900">X배너 {n}</text>')
    x, y, n = STD
    s.append(f'<ellipse cx="{x+400}" cy="{y+250}" rx="400" ry="230" fill="#fff" stroke="{INK}" stroke-width="10"/><text x="{x+400}" y="{y+275}" font-size="70" text-anchor="middle" font-weight="900">{n}</text>')
    s.append(f'<text x="1500" y="{H+330}" font-size="110" text-anchor="middle" font-weight="900" fill="#3d4a12">RS 라라슈 존 (3m)</text><text x="4500" y="{H+330}" font-size="110" text-anchor="middle" font-weight="900" fill="{GR}">re.feeel 존 (3m)</text>')
    s.append(f'<text x="3000" y="{H+520}" font-size="90" text-anchor="middle" fill="#666">▼ 통로 (관람객 동선) ▼</text>')
    s.append('</svg>')
    return ''.join(s)

def elev_svg():
    """뒷벽 정면도: 족자 6장(v4 미리보기) + 앞 집기 실루엣"""
    W, H = 6000, 2500
    s = [f'<svg viewBox="-100 -200 {W+200} {H+400}" style="width:100%;font-family:N">',
         f'<rect x="0" y="0" width="{W}" height="{H}" fill="#ddd"/>',
         f'<rect x="0" y="-180" width="{W}" height="170" fill="{INK}"/><text x="3000" y="-65" font-size="110" fill="{LIME}" text-anchor="middle" font-weight="900">RS RhaRa Shoe · re.feeel — ㈜알앤디메이커스   (상호간판: 기본부스 제공)</text>']
    for i in range(6):
        s.append(f'<image href="{FP}out/08_banner_950x2380_x6_preview-{i+1}.png" x="{i*1000+25}" y="{H-2380-60}" width="950" height="2380" preserveAspectRatio="none"/>')
    def blk(x, w, h, col, label, tc='#fff', y=None):
        y = H - h if y is None else y
        return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{col}" opacity=".93" rx="15"/><text x="{x+w/2}" y="{y+90}" font-size="66" fill="{tc}" text-anchor="middle" font-weight="900">{label}</text>'
    s.append(blk(250, 1480, 1000, INK, 'KD-03 3단 — 워킹화 3색'))
    s.append(blk(1950, 900, 520, '#111', 'TV 50"', y=H - 1450) + f'<rect x="2380" y="{H-930}" width="40" height="930" fill="#111"/>')
    s.append(blk(3150, 900, 900, GR, 'KD-12 쇼케이스 — 구강'))
    s.append(blk(4250, 1480, 750, GR, 'KD-01 — 욕실화 매대'))
    s.append(f'<text x="3000" y="{H+150}" font-size="80" text-anchor="middle" fill="#555">뒷벽 정면도 (폭 6,000 · 높이 2,500) — 족자 하단 1,000mm는 진열대에 가려짐 → 핵심 문구는 1,050~1,950 시선 띠에 배치 완료</text></svg>')
    return ''.join(s)

rows = ''.join(f'<tr><td>{f[0]}</td><td>{f[1]}</td><td>{f[2]}</td><td class="r">{won(f[3])}</td><td class="c">{f[4]}</td><td class="r">{won(f[3]*f[4])}</td><td><span class="tag {"rs" if f[6]=="RS" else "rf" if f[6]=="re.feeel" else "co"}">{f[6]}</span> {f[5]}</td></tr>' for f in F)
orows = ''.join(f'<tr class="opt"><td>{o[0]}</td><td>{o[1]}</td><td>{o[2]}</td><td class="r">{won(o[3])}</td><td class="c">{o[4]}</td><td class="r">{won(o[3]*o[4])}</td><td>{o[5]}</td></tr>' for o in OPT)

DISPLAY = [
 ('RS', '워킹화', 'KD-13 타워쇼케이스 (히어로) · KD-03 3단 · KD-04 포디움 ①', '타워: 차콜·그레이·민트화이트 1족씩 — 1족은 뒤집어 <b>밑창 라임 4점</b>이 보이게<br>3단: 상단 3색 페어 / 중단 밑창 뒤집어 3족 + 미니 POP "바닥에 닿는 길을 따라 4곳" / 하단 사이즈별 박스(230~280)<br>포디움 ①: 1족 45° + 물 스프레이로 젖은 타일 조각 위에 연출', '시착용 230~280 각 1족 (3색 중 1색) = 6족 + 판매 재고는 카운터 뒤'),
 ('RS', '인솔', 'KD-04 포디움 ② · KD-13 하단 · KET-22 원장 코너', '포디움 ②: 운동화 1족 단면 연출 — <b>쓰던 깔창 밑에 반굽</b>을 받친 모습 (잘라 놓은 샘플 신발)<br>타워 하단: 그레이·모카무스 M·L 4종<br>원장 코너: 반굽 인솔 + 밑창 라임 4점 + 족부 모형 (원장 승인 후)', 'M·L × 2색 체험용 각 2 + 판매 박스'),
 ('re.feeel', '칫솔·치실·양치컵', 'KD-12 3단쇼케이스', '상단: 양치컵 40° 기울여 세운 연출 3개 (칫솔 꽂아서)<br>중단: 칫솔 2종(이중미세모/스파이럴모) 6개입 박스 + 낱개 펼침<br>하단: 칫솔형 치실 세트 + 리필 20개입 · CXP 원료 칩 접시', '쇼케이스 위 "나무에서 온 구강케어" 미니 POP'),
 ('re.feeel', '욕실화', 'KD-07 선반 ×3 (우측벽) · KD-01 매대', '우측벽 선반 3단: 컬러별 1켤레씩 발등 보이게 (퀼트 스마일 / 발등낮은 스마일)<br>KD-01 매대: 컬러별 박스 적재 + "2켤레 묶음" 번들 표시 · 젖은 타일 조각 위 1켤레', '현장 판매 재고 매대 하부'),
 ('공용', '이벤트·리플렛', 'KD-08 판매매대 · KET-16 · KET-14', '카운터: CXP 볼펜 바구니 + 인스타 QR 스탠드 + 결제 단말 · POP 이벤트 거치<br>카다로그꽂이: 다국어 리플렛 (통로 쪽)', '볼펜 1인 1개 — 일 수량 정해 소진 시 종료'),
]
drows = ''.join(f'<tr><td><span class="tag {"rs" if d[0]=="RS" else "rf" if d[0]=="re.feeel" else "co"}">{d[0]}</span><br><b>{d[1]}</b></td><td>{d[2]}</td><td>{d[3]}</td><td>{d[4]}</td></tr>' for d in DISPLAY)

html = f'''<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>메가쇼 부스 배치·집기·진열 가이드</title>
<style>@font-face{{font-family:N;font-weight:400;src:url({FP}fonts/NotoSansKR-400.ttf)}}@font-face{{font-family:N;font-weight:700;src:url({FP}fonts/NotoSansKR-700.ttf)}}@font-face{{font-family:N;font-weight:900;src:url({FP}fonts/NotoSansKR-900.ttf)}}
@page{{size:A3 landscape;margin:12mm}}body{{font-family:N;font-size:9pt;color:#111;line-height:1.45;margin:0}}
h1{{font-size:20pt;margin:0}}h2{{font-size:13pt;margin:6mm 0 2mm;padding:1.5mm 3mm;background:{INK};color:{LIME};display:inline-block;border-radius:1.5mm}}
.sub{{color:#666}}table{{border-collapse:collapse;width:100%}}td,th{{border:1px solid #ccc;padding:1.3mm 2mm;vertical-align:top}}th{{background:#f0f0ee;text-align:left}}
.r{{text-align:right;white-space:nowrap}}.c{{text-align:center}}.opt td{{background:#fbfbf6;color:#555}}.tot td{{font-weight:900;background:#f4f9e0}}
.tag{{display:inline-block;padding:.2mm 1.5mm;border-radius:1mm;font-size:7.5pt;font-weight:900}}.rs{{background:{INK};color:{LIME}}}.rf{{background:{GR};color:{YL}}}.co{{background:#ddd}}
.grid{{display:grid;grid-template-columns:1.05fr 1fr;gap:8mm;align-items:start}}.pb{{break-before:page;height:0}}.note{{font-size:8.3pt;color:#444}}.warn{{color:#B00020;font-weight:700}}</style></head><body>
<div style="display:flex;justify-content:space-between;align-items:flex-end"><div><h1>메가쇼 킨텍스 — 부스 배치 · 집기 · 진열 가이드</h1>
<div class="sub">기본부스 2개 (6m × 3m) · 2026.11.12~15 · 벽면 그래픽 = 족자봉 + PET 6장 (v4) · 집기 = KDRS 렌탈 (단가 부가세 별도)</div></div>
<div style="font-size:9pt;font-weight:900">㈜알앤디메이커스 · RS 라라슈 · re.feeel</div></div>
<div class="grid" style="margin-top:4mm"><div><h2>① 평면 배치도 (위에서 본 모습)</h2>{plan_svg()}</div>
<div><h2>② 뒷벽 정면도</h2>{elev_svg()}
<p class="note">· 동선: 통로 → <b>포디움·X배너로 멈춤</b> → 시착 벤치 → 원장 코너 → 카운터(볼펜 이벤트·결제) → re.feeel 쇼케이스·욕실화 벽<br>
· 왼쪽 = 라라슈(블랙·라임), 오른쪽 = re.feeel(그린·옐로) — 가운데 카운터가 두 브랜드를 잇는 구조<br>
· 레퍼런스 이미지처럼 <b>블랙 포디움 + 라임 로고</b>는 KD-04 진열대·KD-08 판매매대 앞면에 <b>PET 래핑</b> (렌탈사 부착 방식 확인)</p></div></div>

<div class="pb"></div><h2>③ 집기 렌탈 내역 (KDRS 카탈로그 기준)</h2>
<table><tr><th>코드</th><th>품명</th><th>규격</th><th>단가</th><th>수량</th><th>금액</th><th>용도</th></tr>{rows}
<tr class="tot"><td colspan="5">기본안 합계 (공급가)</td><td class="r">{won(base)}</td><td>부가세 포함 {won(round(base*1.1))}원</td></tr>
<tr><th colspan="7">옵션 (예산 여유 시)</th></tr>{orows}
<tr class="tot"><td colspan="5">기본 + 옵션 (공급가)</td><td class="r">{won(base+opt)}</td><td>부가세 포함 {won(round((base+opt)*1.1))}원 · 예산 2,000,000원 대비 여유 {won(2000000-round((base+opt)*1.1))}원 (운반·설치비·추가 집기 대비)</td></tr></table>
<p class="note"><span class="warn">확인:</span> ① KDRS 단가가 <b>전시 기간 전체(4일) 기준</b>인지, 운반·설치·철거비 별도인지 ② 기본부스 제공 집기(안내데스크·의자·조명·콘센트) 중복 여부 — 중복되면 KD-08·KC-08 빼고 그만큼 옵션으로 ③ 스포트 조명·전기는 사무국 별도 신청 ④ <b>2차 변경 승인 기준 집기 임차료 2,059천원(공급가)</b> — 덜 쓰면 잔액 반납이므로 옵션 포함 집행 권장 ⑤ KD-07 선반은 기본부스 판넬에만 설치 가능 → 우측벽이 판넬인지 (코너 부스면 개방면) 배정 도면 확인</p>

<h2>④ 품목별 진열 가이드</h2>
<table><tr><th style="width:10%">브랜드·품목</th><th style="width:20%">집기</th><th>진열 방법</th><th style="width:18%">준비 수량</th></tr>{drows}</table>
<h2>⑤ 출력물 ↔ 위치</h2>
<table><tr><th>출력물 (스터닝)</th><th>위치</th></tr>
<tr><td>족자 6 (950×2380 PET)</td><td>뒷벽 판넬 1~6 · S고리 걸이 · 라라슈 3 왼쪽 / re.feeel 3 오른쪽</td></tr>
<tr><td>X배너 ① 라라슈</td><td>왼쪽 통로 앞 모서리 (첫 시선)</td></tr>
<tr><td>X배너 ② re.feeel</td><td>오른쪽 통로 앞 (레오 등신대 옆)</td></tr>
<tr><td>X배너 ③ 정형외과</td><td>원장 코너(아크릴단상) 옆 — 부스 안쪽 중앙</td></tr>
<tr><td>POP 3</td><td>POP거치대 2 (워킹화·인솔 가격 / 이벤트) + 카운터 위 A4 아크릴</td></tr>
<tr><td>리플렛 1,000부</td><td>카다로그꽂이 + 카운터 · 쇼핑백 동봉</td></tr>
<tr><td><b>추가 제안</b> PET 래핑 3장</td><td>KD-04 포디움 앞면 2 (480×980) · KD-08 판매매대 앞면 1 (1450×780) — 스터닝 추가 견적 필요</td></tr></table>
</body></html>'''
open(os.path.join(HERE, 'booth-plan.html'), 'w').write(html)
print('base', base, 'opt', opt, 'vat', round((base+opt)*1.1))
