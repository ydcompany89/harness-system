# 캔두코리아 욕실화 6종 견적서 (2026-11-25 대표 지시)
# 실행: python3 build_candu_quote.py  → 알앤디메이커스_견적서_캔두코리아_욕실화6종_2026-11-25.xlsx
from pathlib import Path
from openpyxl import Workbook
from openpyxl.drawing.image import Image as XLImage
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side

HERE = Path(__file__).parent
OUT = HERE / "알앤디메이커스_견적서_캔두코리아_욕실화6종_치실_양치컵_2026-11-25.xlsx"
NAVY = PatternFill("solid", fgColor="0D1B14"); GRY = PatternFill("solid", fgColor="F2F4F2")
thin = Side(style="thin", color="B7BFB9"); BOX = Border(left=thin, right=thin, top=thin, bottom=thin)
C = Alignment(horizontal="center", vertical="center", wrap_text=True)
L = Alignment(horizontal="left", vertical="center", wrap_text=True)
R = Alignment(horizontal="right", vertical="center")

def put(ws, ref, v, fill=None, bold=False, color="191F28", size=10, al=L, fmt=None, border=True):
    c = ws[ref]; c.value = v; c.font = Font(name="맑은 고딕", bold=bold, color=color, size=size); c.alignment = al
    if fill: c.fill = fill
    if fmt: c.number_format = fmt
    if border: c.border = BOX
    return c

MOQ = 1200
ITEMS = [  # 번호, 품명(한글), 품명(영문), 색상, 단가(원, 부가세 별도), MOQ, 단위   — 11/25 대표 수정본 반영
    (1, "아치가득 슬리퍼", "Arch 100% Slipper", "블랙 Black", 2900, 1200, "족"),
    (2, "슬롯 배수 욕실화", "Slot-Drain Bath Slipper", "아이보리 / 그레이", 2900, 1200, "족"),
    (3, "격자 패턴 욕실화", "Lattice Drain Bath Slipper", "베이지 / 딥그레이", 1900, 1200, "족"),
    (4, "밴드형 슬롯 배수 욕실화", "Band Slot-Drain Bath Slipper", "아이보리 / 딥그레이", 1900, 1200, "족"),
    (5, "스마일 무늬 욕실화", "Smile Print Bath Slipper", "그레이 / 아이보리 / 딥그린", 1900, 1200, "족"),
    (6, "격자 패턴 욕실화 (re.feeel)", "Lattice Drain Bath Slipper (re.feeel)", "네이비 / 차콜", 2900, 1200, "족"),
    (7, "어금니까지 쏙쏙 칫솔형 치실\n1세트 (리필 20개입)", "Toothbrush-type Floss Holder\n1 set (20 refills)", "그린 Green", 3900, 500, "세트"),
    (8, "물때제로 거꾸로 양치컵\n1개입", "Upside-down Quick-dry Cup\n1 pc", "베이지 Beige", 1980, 500, "개"),
]

wb = Workbook(); ws = wb.active; ws.title = "견적서 QUOTATION"
for col, w in zip("ABCDEFGHI", [6, 18, 26, 30, 17, 14, 12, 16, 22]): ws.column_dimensions[col].width = w
ws.merge_cells("A1:I1"); put(ws, "A1", "견적서  QUOTATION", NAVY, True, "C6F432", 18, C, border=False)
ws.row_dimensions[1].height = 40

info = [("견적번호 Quote No.", "RNDM-Q-20261125-01", "견적일 Date", "2026-11-25"),
        ("받는 분 To", "캔두코리아 박덕수 대표님", "유효기간 Valid", "견적일로부터 30일"),
        ("공급자 From", "알앤디메이커스 주식회사 (R&D Makers Co., Ltd.)", "통화 Currency", "KRW (원)"),
        ("주소 Address", "대전광역시 유성구 국제과학7로 8", "사업자번호", "709-81-02967"),
        ("담당 Contact", "대표이사 신동규 · 0507-1317-2516", "단가 기준", "국내 공급가 · 부가세 별도")]
for i, (a, b, c, d) in enumerate(info):
    r = 3 + i
    put(ws, f"A{r}", a, GRY, True, size=9); ws.merge_cells(f"A{r}:B{r}")
    put(ws, f"C{r}", b); ws.merge_cells(f"C{r}:E{r}")
    put(ws, f"F{r}", c, GRY, True, size=9); ws.merge_cells(f"F{r}:G{r}")
    put(ws, f"H{r}", d); ws.merge_cells(f"H{r}:I{r}")
    for col in "BDEGI": ws[f"{col}{r}"].border = BOX

H = 9
heads = ["No", "사진\nPhoto", "품명\nProduct", "Product name (EN)", "기준 색상\nColor", "단가(원)\nUnit price\n부가세 별도", "최소 주문\nMOQ", "MOQ 기준 금액(원)\nAmount at MOQ", "비고\nRemark"]
for i, h in enumerate(heads):
    put(ws, f"{'ABCDEFGHI'[i]}{H}", h, NAVY, True, "FFFFFF", 9, C)
ws.row_dimensions[H].height = 44
for k, (no, ko, en, color, price, moq, unit) in enumerate(ITEMS):
    r = H + 1 + k
    ws.row_dimensions[r].height = 92
    put(ws, f"A{r}", no, al=C); put(ws, f"B{r}", "", al=C)
    put(ws, f"C{r}", ko, bold=True); put(ws, f"D{r}", en); put(ws, f"E{r}", color, al=C)
    put(ws, f"F{r}", price, fmt="#,##0", al=R, bold=True)
    put(ws, f"G{r}", moq, fmt=f'#,##0"{unit}"', al=R)
    put(ws, f"H{r}", f"=F{r}*G{r}", fmt="#,##0", al=R)
    put(ws, f"I{r}", "색상 변경 가능\nColor changeable" if no <= 6 else "", size=9)
    img = XLImage(str(HERE / "img" / f"{no}.jpg")); img.width, img.height = 118, 118
    ws.add_image(img, f"B{r}")

n = H + len(ITEMS) + 2
terms = [
    "1. 단가는 국내 공급가 기준이며 부가가치세는 별도입니다. (수출 신고 시 영세율 적용 가능)  /  Unit prices are domestic supply prices, VAT excluded.",
    "2. 최소 주문 단위(MOQ): 욕실화 품목당 1,200족 · 칫솔형 치실·양치컵 품목당 500개(세트)  /  MOQ: bath slippers 1,200 pairs per item; floss & cup 500 units per item.",
    "3. 욕실화는 색상 변경 가능 (색상별 수량·추가 비용은 협의)  /  Bath slipper colors can be changed upon request.",
    "4. 포장: 귀사에서 OPP 포장재를 사급해 주시면 당사가 넣어 포장하는 기준입니다.  /  Packing: buyer supplies OPP bags; we pack the products.",
    "5. 사이즈 구성·납기·인도 장소·결제 조건은 발주 전 협의합니다.  /  Size assortment, lead time, delivery and payment terms to be agreed before order.",
    "6. 사진: 1~6번은 보내 드린 샘플 실물, 7~8번은 제품 사진입니다.  /  Photos 1–6: actual samples sent; 7–8: product photos.",
]
put(ws, f"A{n}", "거래 조건  Terms & Conditions", NAVY, True, "C6F432", 11, L, border=False); ws.merge_cells(f"A{n}:I{n}")
for i, t in enumerate(terms):
    r = n + 1 + i
    put(ws, f"A{r}", t, size=10, border=False); ws.merge_cells(f"A{r}:I{r}"); ws.row_dimensions[r].height = 22
r = n + len(terms) + 2
put(ws, f"A{r}", "알앤디메이커스 주식회사  대표이사 신동규", bold=True, al=R, border=False); ws.merge_cells(f"A{r}:I{r}")

ws.page_setup.orientation = "landscape"; ws.page_setup.paperSize = ws.PAPERSIZE_A4
ws.page_setup.fitToWidth = 1; ws.page_setup.fitToHeight = 1; ws.sheet_properties.pageSetUpPr.fitToPage = True
ws.print_options.horizontalCentered = True
wb.save(OUT); print(OUT)
