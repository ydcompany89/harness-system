# 수출 견적서 양식 (알앤디메이커스) — 기존 '해외수출OEM제조 견적서와 적재정보' 양식 구조(견적·품목정보·적재정보)를 신발·생활용품용으로 변환
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
F = "맑은 고딕"
NAVY = PatternFill("solid", fgColor="0D1B14"); LIME = PatternFill("solid", fgColor="C6F432")
YEL = PatternFill("solid", fgColor="FFF4C2"); GRY = PatternFill("solid", fgColor="EEF1EC")
th = Side(style="thin", color="B7C0B9"); B = Border(left=th, right=th, top=th, bottom=th)
C = Alignment(horizontal="center", vertical="center", wrap_text=True); L = Alignment(horizontal="left", vertical="center", wrap_text=True)
def put(ws, cell, v, fill=None, bold=False, color="000000", size=10, al=L, fmt=None, border=True):
    c = ws[cell]; c.value = v; c.font = Font(name=F, bold=bold, color=color, size=size); c.alignment = al
    if fill: c.fill = fill
    if border: c.border = B
    if fmt: c.number_format = fmt
    return c
def head(ws, row, cols, labels):
    for col, lab in zip(cols, labels): put(ws, f"{col}{row}", lab, NAVY, True, "FFFFFF", 9.5, C)

wb = Workbook()
# ───────── 1. 견적서 (QUOTATION) ─────────
ws = wb.active; ws.title = "1_견적서 QUOTATION"
for col, w in zip("ABCDEFGHIJKL", [5, 26, 24, 11, 12, 13, 13, 13, 9, 11, 15, 22]): ws.column_dimensions[col].width = w
ws.merge_cells("A1:L1"); put(ws, "A1", "수출 견적서  QUOTATION  見積書", NAVY, True, "C6F432", 18, C)
ws.row_dimensions[1].height = 38
info = [("견적번호 Quote No.", "RNDM-EX-2026-001", "견적일 Date", "=TODAY()"),
        ("받는 분 To (Buyer)", "", "유효기간 Valid until", "=J3+30"),
        ("담당자 Attn.", "", "통화 Currency", "KRW"),
        ("공급자 From", "알앤디메이커스 주식회사 (R&D Makers Co., Ltd.)", "거래조건 Incoterms", "EXW"),
        ("주소 Address", "대전광역시 유성구 국제과학7로 8 / 8, Gukjegwahak 7-ro, Yuseong-gu, Daejeon, Korea", "결제조건 Payment", "T/T 선금 30% · 선적 전 잔금 70%"),
        ("연락처 Contact", "신동규 대표이사 Dongkyu Shin, CEO · rndceo@rndmakers.kr · +82-507-1317-2516", "출고지 Ship from", "[출고 창고 주소]"),
        ("사업자번호 Biz No.", "709-81-02967", "납기 Lead time", "발주·선금 확인 후 [ ]일")]
for i, (a, b, c, d) in enumerate(info):
    r = 3 + i
    put(ws, f"A{r}", a, GRY, True, size=9); ws.merge_cells(f"A{r}:B{r}")
    put(ws, f"C{r}", b, YEL if b in ("", "[출고 창고 주소]") else None); ws.merge_cells(f"C{r}:G{r}")
    put(ws, f"H{r}", c, GRY, True, size=9); ws.merge_cells(f"H{r}:I{r}")
    put(ws, f"J{r}", d, YEL, fmt="yyyy-mm-dd" if "=" in str(d) else None); ws.merge_cells(f"J{r}:L{r}")
put(ws, "A11", "환율 Exchange rate (입력)", GRY, True, size=9); ws.merge_cells("A11:B11")
put(ws, "C11", "1 JPY =", GRY, al=C); put(ws, "D11", 9.3, YEL, fmt="0.00"); put(ws, "E11", "KRW", GRY, al=C)
put(ws, "F11", "1 USD =", GRY, al=C); put(ws, "G11", 1400, YEL, fmt="#,##0"); put(ws, "H11", "KRW", GRY, al=C)
ws.merge_cells("I11:L11"); put(ws, "I11", "※ 노란 칸만 입력 · 환율은 견적일 기준으로 바꿔 쓰세요", al=L, size=9, color="5F6B64")
head(ws, 13, "ABCDEFGHIJKL", ["No", "품명 (한글)", "Product name (EN)", "규격 Spec", "컬러 Color", "단가 KRW\nUnit price", "단가 JPY\n(환산)", "단가 USD\n(환산)", "MOQ", "수량 Qty", "금액 KRW\nAmount", "비고 Remark"])
ws.row_dimensions[13].height = 34
items = [("쿼드그립 아치가득 인솔 M", "Quad-Grip Arch-Fit Half Insole (M)", "15cm · 신발 220~255mm", "그레이/모카무스", 600, "돈키호테 추천"),
         ("쿼드그립 아치가득 인솔 L", "Quad-Grip Arch-Fit Half Insole (L)", "17cm · 신발 260~290mm", "그레이/모카무스", 600, "돈키호테 추천"),
         ("CXP 양치컵", "CXP Tilt-Dry Tumbler (40°)", "[용량] ml", "[ ]", 2000, "돈키호테 추천"),
         ("칫솔형 치실", "Toothbrush-type Floss Pick", "[개입]", "[ ]", 2000, "100엔숍 후보"),
         ("스마일 욕실화", "Smile Bath Slippers", "[사이즈]", "[ ]", 600, "100엔숍 후보 · 다이소 계약 확인 후"),
         ("쿼드그립 종일편한 워킹화", "Quad-Grip All-Day Walking Clog", "230~280mm", "차콜/그레이/민트화이트", 600, "선택 · 의견용"),
         ("", "", "", "", "", ""), ("", "", "", "", "", "")]
for i, it in enumerate(items):
    r = 14 + i
    put(ws, f"A{r}", i + 1, al=C)
    for col, v in zip("BCDE", it[:4]): put(ws, f"{col}{r}", v, YEL if (v == "" or "[" in str(v)) else None)
    put(ws, f"F{r}", None, YEL, fmt="#,##0")
    put(ws, f"G{r}", f'=IF(F{r}="","",ROUND(F{r}/$D$11,1))', fmt="#,##0.0", al=C)
    put(ws, f"H{r}", f'=IF(F{r}="","",ROUND(F{r}/$G$11,2))', fmt="0.00", al=C)
    put(ws, f"I{r}", it[4] if it[4] != "" else None, fmt="#,##0", al=C)
    put(ws, f"J{r}", None, YEL, fmt="#,##0", al=C)
    put(ws, f"K{r}", f'=IF(OR(F{r}="",J{r}=""),"",F{r}*J{r})', fmt="#,##0")
    put(ws, f"L{r}", it[5], size=9)
    ws.row_dimensions[r].height = 32
tr = 14 + len(items)
put(ws, f"A{tr}", "합계 TOTAL", LIME, True, al=C); ws.merge_cells(f"A{tr}:I{tr}")
put(ws, f"J{tr}", f"=SUM(J14:J{tr-1})", LIME, True, fmt="#,##0", al=C)
put(ws, f"K{tr}", f"=SUM(K14:K{tr-1})", LIME, True, fmt="#,##0")
put(ws, f"L{tr}", f'=IF(K{tr}=0,"","≈ JPY "&TEXT(K{tr}/$D$11,"#,##0"))', LIME, True)
notes = ["※ 조건 Terms",
         "1. 단가는 EXW(출고지 인도) 기준이며 부가가치세 영세율(수출) 적용 / Prices are EXW, VAT zero-rated for export.",
         "2. 국제 운송·보험·일본 수입 통관·관세·현지 표시(일본어 라벨) 비용은 바이어 부담 / Freight, insurance, import duties and Japanese labeling at buyer's cost unless agreed.",
         "3. MOQ 이상 주문 시 일본어 표기 패키지·채널 전용 구성 협의 가능 / Japanese-language packaging available above MOQ.",
         "4. 일본 수입에 필요한 시험·인증·서류 중 비용이 큰 항목은 범위와 비용 분담을 별도 협의 / Costly testing or certification for Japan to be agreed separately.",
         "5. 본 견적은 유효기간 내 발주 기준이며, 원자재 가격·환율 변동 시 조정될 수 있음 / Subject to change after validity date."]
for i, n in enumerate(notes):
    r = tr + 2 + i; ws.merge_cells(f"A{r}:L{r}"); put(ws, f"A{r}", n, None, i == 0, size=9 if i else 10, border=False)
r = tr + 2 + len(notes) + 1
ws.merge_cells(f"H{r}:L{r}"); put(ws, f"H{r}", "알앤디메이커스 주식회사  대표이사  신동규  (인)", None, True, size=11, al=Alignment(horizontal="right"), border=False)
dv = DataValidation(type="list", formula1='"EXW,FOB Busan,FOB Incheon,CIF,DAP"', allow_blank=True); ws.add_data_validation(dv); dv.add("J6")
dv2 = DataValidation(type="list", formula1='"KRW,JPY,USD"', allow_blank=True); ws.add_data_validation(dv2); dv2.add("J5")
ws.freeze_panes = "A14"; ws.page_setup.orientation = "landscape"; ws.page_setup.fitToWidth = 1; ws.sheet_properties.pageSetUpPr.fitToPage = True

# ───────── 2. 품목 정보 (Additional Information) ─────────
w2 = wb.create_sheet("2_품목정보 PRODUCT INFO")
cols = "ABCDEFGHIJ"
for col, w in zip(cols, [5, 24, 28, 14, 30, 26, 16, 14, 16, 26]): w2.column_dimensions[col].width = w
w2.merge_cells("A1:J1"); put(w2, "A1", "품목 정보  ADDITIONAL INFORMATION", NAVY, True, "C6F432", 14, C); w2.row_dimensions[1].height = 30
head(w2, 3, cols, ["No", "품명 (한글)", "Product name (EN)", "HS code\n(관세사 확인)", "소재 Material", "주요 특징 Key feature (EN)", "시험·인증\nTest / Cert.", "원산지\nOrigin", "JAN/바코드\nBarcode", "보관·주의 Care"])
w2.row_dimensions[3].height = 34
p2 = [("쿼드그립 아치가득 인솔", "Quad-Grip Arch-Fit Half Insole", "6406.90", "합성수지(E-실리폴리렌) 폼", "Half-length insole placed under the existing footbed; no cutting needed. Arch line up to 15mm, ring-shaped heel cup.", "KIMC T-26-1844-1 (폼 시트 물성)", "Korea"),
      ("CXP 양치컵", "CXP Tilt-Dry Tumbler", "3924.10", "[CXP 배합 소재]", "Stands tilted at 40° so the inside dries.", "[ ]", "Korea"),
      ("칫솔형 치실", "Toothbrush-type Floss Pick", "[3306.20 / 9603.21 확인]", "[ ]", "Floss pick with a toothbrush-style handle.", "[ ] · 위생용품", "Korea"),
      ("스마일 욕실화", "Smile Bath Slippers", "6402.99", "[PVC 등]", "[ ]", "[ ]", "Korea"),
      ("쿼드그립 종일편한 워킹화", "Quad-Grip All-Day Walking Clog", "6402.99", "합성수지(E-실리폴리렌: EVA·실리콘 배합)", "One-piece footbed (no loose insole), grip pads at 4 contact points. 257g per shoe (270mm).", "KIMC S-26-0313 (미끄럼) · A-26-0929 (유해물질)", "Korea")]
for i, it in enumerate(p2):
    r = 4 + i; put(w2, f"A{r}", i + 1, al=C)
    for col, v in zip("BCDEFGH", it): put(w2, f"{col}{r}", v, YEL if "[" in v else None, size=9.5)
    put(w2, f"I{r}", "", YEL); put(w2, f"J{r}", "", YEL); w2.row_dimensions[r].height = 46
w2.merge_cells("A10:J10"); put(w2, "A10", "※ HS code는 초안입니다. 신고 전 관세사 확인 필수. 시험성적서 수치는 B2B 검토용으로만 제공(광고·홍보 사용은 시험기관 동의 필요). 일본 판매용 JAN 코드는 GS1 Korea 바코드로 대체 가능 여부를 바이어와 확인.", size=9, border=False)

# ───────── 3. 적재 정보 (Packing info) ─────────
w3 = wb.create_sheet("3_적재정보 PACKING")
cols3 = "ABCDEFGHIJKLMNO"
for col, w in zip(cols3, [5, 24, 12, 12, 12, 16, 10, 12, 12, 18, 12, 12, 12, 12, 30]): w3.column_dimensions[col].width = w
w3.merge_cells("A1:O1"); put(w3, "A1", "적재 정보  PACKING INFORMATION (cm · g)", NAVY, True, "C6F432", 14, C); w3.row_dimensions[1].height = 30
for rng, lab in [("C3:F3", "낱개 UNIT (1켤레/1개)"), ("G3:J3", "카톤 CASE (CT)"), ("K3:N3", "팔레트 PALLET 1100×1100")]:
    w3.merge_cells(rng); put(w3, rng.split(":")[0], lab, LIME, True, al=C)
head(w3, 4, cols3, ["No", "품명", "순중량 g\nNet wt", "총중량 g\nGross wt", "포장 가로×세로×높이 cm", "바코드 UPC/JAN", "입수 ea\n/CT", "순중량 kg\n/CT", "총중량 kg\n/CT", "카톤 크기 cm\nL×W×H", "단당 박스\nTie", "적재 단수\nHigh", "팔레트당\n박스 CT", "팔레트당\n수량 ea", "비고"])
w3.row_dimensions[4].height = 40
names = ["아치가득 인솔 M", "아치가득 인솔 L", "CXP 양치컵", "칫솔형 치실", "스마일 욕실화", "종일편한 워킹화"]
for i, n in enumerate(names):
    r = 5 + i; put(w3, f"A{r}", i + 1, al=C); put(w3, f"B{r}", n)
    for col in "CDEFGJKL": put(w3, f"{col}{r}", None, YEL, fmt="#,##0", al=C)
    put(w3, f"H{r}", f'=IF(OR(C{r}="",G{r}=""),"",ROUND(C{r}*G{r}/1000,1))', fmt="0.0", al=C)
    put(w3, f"I{r}", None, YEL, fmt="0.0", al=C)
    put(w3, f"M{r}", f'=IF(OR(K{r}="",L{r}=""),"",K{r}*L{r})', fmt="#,##0", al=C)
    put(w3, f"N{r}", f'=IF(OR(M{r}="",G{r}=""),"",M{r}*G{r})', fmt="#,##0", al=C)
    put(w3, f"O{r}", "워킹화 한쪽 257g(270mm) — 켤레 중량 실측 필요" if "워킹화" in n else "", size=9)
w3.merge_cells("A12:O12"); put(w3, "A12", "※ 노란 칸 실측 후 입력. 순중량/CT·팔레트당 박스·팔레트당 수량은 자동 계산. 카톤 크기는 라파 출고 박스 기준.", size=9, border=False)

# ───────── 4. 작성 가이드 ─────────
w4 = wb.create_sheet("4_작성가이드")
w4.column_dimensions["A"].width = 110
guide = ["수출 견적서 작성 가이드 (알앤디메이커스)", "",
 "① 1번 시트 노란 칸만 채우면 엔화·달러 환산과 금액·합계가 자동 계산됩니다.",
 "② 단가 결정권: RHARA SHOE(인솔·워킹화) 단가 = 신동규·최재호 공동대표 합의(L3) 후 입력 / re.feeel 품목 = 대표 결정.",
 "③ 국내 공급가(인솔 10,750원, 소비자가 50%)를 그대로 쓰지 않는다 — 일본은 벤더·수입·소매 마진이 붙어 현지가가 2배 이상 됨. 원가(라파 공급가 8,000원+포장·출고) 위에 수출 마진을 얹어 정한다.",
 "④ 거래조건 기본은 EXW(출고지 인도). 바이어가 원하면 FOB 부산(내륙운송·수출통관 우리 부담) — 그 비용을 단가에 더한다.",
 "⑤ 결제는 T/T 선금 30% · 선적 전 잔금 70%를 기본으로 하고, 첫 거래는 선금 비율을 낮추지 않는다.",
 "⑥ 다이소 납품 욕실화는 다이소 계약(디자인·독점·비밀유지) 확인 전 견적에 넣지 않는다.",
 "⑦ 시험성적서 수치는 B2B 검토용으로만. 일본 현지 광고·POP에 쓰려면 KIMC 사전 동의 필요.",
 "⑧ 보낼 때는 PDF로 저장해 첨부(편집 가능한 엑셀 원본은 보내지 않음).",
 "", "원본 양식: 구글드라이브 '해외수출관련자료' > 해외수출OEM제조 견적서와 적재정보 양식(250107) — 견적·품목정보·적재정보 3단 구조를 그대로 따름."]
for i, g in enumerate(guide):
    c = w4.cell(row=i + 1, column=1, value=g); c.font = Font(name=F, bold=(i == 0), size=13 if i == 0 else 10.5); c.alignment = L
wb.save("알앤디메이커스_수출견적서_양식.xlsx"); print("saved")
