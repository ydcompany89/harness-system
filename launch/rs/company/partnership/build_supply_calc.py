# 라라슈 공급가·이익 배분 계산기 (노란 칸만 바꾸면 전체 자동 변동)
from openpyxl import Workbook
from openpyxl.styles import PatternFill, Font, Alignment, Border, Side
from openpyxl.formatting.rule import CellIsRule
Y=PatternFill("solid",fgColor="FFF2CC"); G=PatternFill("solid",fgColor="E8EEF4"); H=PatternFill("solid",fgColor="0D1B14")
thin=Side(style="thin",color="BBBBBB"); BD=Border(left=thin,right=thin,top=thin,bottom=thin)
W="#,##0;[Red]-#,##0"; P="0.0%"
wb=Workbook(); ws=wb.active; ws.title="계산기"
def put(r,c,v,fill=None,bold=False,fmt=None,color=None):
    x=ws.cell(r,c,v); x.border=BD; x.alignment=Alignment(vertical="center",wrap_text=True)
    if fill: x.fill=fill
    if bold or color: x.font=Font(bold=bold,color=color)
    if fmt: x.number_format=fmt
    return x
ws["A1"]="라라슈 공급가 · 이익 배분 계산기"; ws["A1"].font=Font(bold=True,size=15)
ws["A2"]="노란 칸만 바꾸세요. 나머지는 전부 자동 계산됩니다. (단위: 원, 켤레당 · 빨간 숫자 = 손해)"; ws["A2"].font=Font(color="666666")
def head(r,t):
    for c,v in enumerate([t,"워킹화","인솔","합계/메모"],1): put(r,c,v,H,True,color="FFFFFF")
# ── 1. 입력값
head(4,"① 입력값 (노란 칸)")
inp=[("판매가 (부가세 포함)",42500,21500,"제품 마스터 기준",W),
("라파 공급가 (부가세 제외)",20000,8000,"공급계약 초안 기준",W),
("추정 제조 원가 (라파 공개 전 COO 추정)",9600,2650,"라파 원가 공개 시 교체",W),
("결제·플랫폼 수수료율",0.033,0.12,"워킹화 자사몰 3.3% · 인솔 와디즈 등 12%",P),
("택배비",3000,3000,"",W),
("광고비 (1켤레 팔 때 드는 광고비)",14000,6000,"아래 '환산 ROAS'로 확인",W),
("교환·CS 비용",600,300,"",W),
("신동규측(알앤디) 판매 연동 보수 — 이익 나누기 전에 먼저",0,0,"0이면 보수 없음",W),
("이익 배분 비율 — 라파 몫",0.5,0.5,"5:5면 50%",P),
("월 판매 수량 (가정)",600,600,"MOQ 600 기준 가정",W)]
for i,(k,a,b,m,f) in enumerate(inp):
    r=5+i; put(r,1,k); put(r,2,a,Y,fmt=f); put(r,3,b,Y,fmt=f); put(r,4,m)
# rows: 5 price,6 supply,7 cost,8 feeRate,9 ship,10 ad,11 cs,12 bonus,13 split,14 qty
# ── 2. 켤레당 손익
head(16,"② 켤레당 손익 (자동)")
calc=[("판매가 (부가세 제외)","=B5/1.1","=C5/1.1","",W,False),
("라파 공급가","=-B6","=-C6","",W,False),
("결제·플랫폼 수수료","=-B17*B8","=-C17*C8","",W,False),
("택배비","=-B9","=-C9","",W,False),
("광고비","=-B10","=-C10","",W,False),
("교환·CS 비용","=-B11","=-C11","",W,False),
("신동규측 판매 연동 보수","=-B12","=-C12","",W,False),
("★ 라라슈 법인에 남는 돈","=SUM(B17:B23)","=SUM(C17:C23)","이게 0보다 작으면 나눌 이익이 없음",W,True),
("법인 이익률 (남는 돈 ÷ 판매가)","=IF(B17=0,0,B24/B17)","=IF(C17=0,0,C24/C17)","",P,False),
("환산 ROAS (판매가 ÷ 광고비)","=IF(B10=0,0,B5/B10)","=IF(C10=0,0,C5/C10)","300%면 광고 1만 원에 매출 3만 원",P,False)]
for i,(k,a,b,m,f,bo) in enumerate(calc):
    r=17+i; fl=G if bo else None; put(r,1,k,fl,bo); put(r,2,a,fl,bo,f); put(r,3,b,fl,bo,f); put(r,4,m,fl)
# ── 3. 누가 얼마 가져가나
head(28,"③ 켤레당 누가 얼마 가져가나 (자동)")
who=[("라파 제조 마진 (공급가 − 추정 원가)","=B6-B7","=C6-C7","공급가 안에 이미 들어 있는 라파 몫",W,False),
("라파 제조 마진율","=IF(B6=0,0,B29/B6)","=IF(C6=0,0,C29/C6)","",P,False),
("라파 이익 배분 (법인 남는 돈이 +일 때만)","=MAX(B24,0)*B13","=MAX(C24,0)*C13","",W,False),
("신동규측 이익 배분","=MAX(B24,0)*(1-B13)","=MAX(C24,0)*(1-C13)","",W,False),
("★ 라파 합계 (제조 마진 + 배분)","=B29+B31","=C29+C31","",W,True),
("★ 신동규측 합계 (판매 보수 + 배분)","=B12+B32","=C12+C32","",W,True),
("차이 (라파 − 신동규측)","=B33-B34","=C33-C34","",W,False)]
for i,(k,a,b,m,f,bo) in enumerate(who):
    r=29+i; fl=G if bo else None; put(r,1,k,fl,bo); put(r,2,a,fl,bo,f); put(r,3,b,fl,bo,f); put(r,4,m,fl)
# ── 4. 월 합계
head(37,"④ 한 달 합계 (켤레당 × 월 판매 수량)")
mon=[("월 매출 (부가세 제외)","=B17*B14","=C17*C14"),
("월 광고비","=B10*B14","=C10*C14"),
("라라슈 법인 월 이익","=B24*B14","=C24*C14"),
("라파 월 수취 (제조 마진 + 배분)","=B33*B14","=C33*C14"),
("신동규측 월 수취","=B34*B14","=C34*C14")]
for i,(k,a,b) in enumerate(mon):
    r=38+i; bo=k.startswith("라라슈"); fl=G if bo else None
    put(r,1,k,fl,bo); put(r,2,a,fl,bo,W); put(r,3,b,fl,bo,W); put(r,4,f"=B{r}+C{r}",fl,True,W)
# ── 5. 손익분기
head(44,"⑤ 손익분기 — 법인이 0원이 되는 선 (자동)")
be=[("법인 손해 안 보는 최대 공급가","=B17+B19+B20+B21+B22+B23","=C17+C19+C20+C21+C22+C23","이보다 공급가가 높으면 법인 손해"),
("법인 손해 안 보는 최대 광고비","=B17-B6+B19+B20+B22+B23","=C17-C6+C19+C20+C22+C23","켤레당 광고비 상한"),
("손해 안 보는 최소 ROAS","=IF(B46<=0,\"불가\",B5/B46)","=IF(C46<=0,\"불가\",C5/C46)","이 효율보다 광고가 나쁘면 법인 손해")]
for i,(k,a,b,m) in enumerate(be):
    r=45+i; put(r,1,k); put(r,2,a,fmt=W if i<2 else P); put(r,3,b,fmt=W if i<2 else P); put(r,4,m)
# ── 6. 공급가별 비교표
head(49,"⑥ 공급가를 바꾸면 — 법인 남는 돈 / 라파 합계 (자동)")
put(50,1,"공급가 낮추는 폭 (워킹화 / 인솔)",Y); put(50,2,2000,Y,fmt=W); put(50,3,1000,Y,fmt=W); put(50,4,"이 폭만큼 단계별로 낮춰 봄",Y)
for c,v in enumerate(["워킹화 공급가","법인 남는 돈","라파 합계","인솔 공급가","법인 남는 돈","라파 합계"],1): put(51,c,v,G,True)
for k in range(6):
    r=52+k
    put(r,1,f"=$B$6-{k}*$B$50",fmt=W); put(r,2,f"=$B$24+{k}*$B$50",fmt=W)
    put(r,3,f"=(A{r}-$B$7)+MAX(B{r},0)*$B$13",fmt=W)
    put(r,4,f"=$C$6-{k}*$C$50",fmt=W); put(r,5,f"=$C$24+{k}*$C$50",fmt=W)
    put(r,6,f"=(D{r}-$C$7)+MAX(E{r},0)*$C$13",fmt=W)
ws["A59"]="※ 추정 원가는 COO 추정입니다. 라파 원가 공개(체크리스트 8·19·22번)를 받으면 노란 칸 '추정 제조 원가'만 바꾸세요."
ws["A60"]="※ 가격·공급가·배분 비율 확정은 두 공동대표 합의 사항(L3)입니다. 이 표는 협상 준비용입니다."
for c,w in zip("ABCDEF",[46,16,16,16,16,16]): ws.column_dimensions[c].width=w
ws.freeze_panes="B5"
wb.save("/home/user/harness-system/launch/rs/company/partnership/5_공급가_이익배분_계산기.xlsx")
