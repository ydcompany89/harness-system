from docx import Document
from docx.shared import Pt, Mm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

OUT = "launch/rs/gov/금형보관증_알앤디메이커스_라파.docx"
FONT = "맑은 고딕"
d = Document()
s = d.sections[0]
s.page_height, s.page_width = Mm(297), Mm(210)
s.top_margin = s.bottom_margin = Mm(15); s.left_margin = s.right_margin = Mm(18)
st = d.styles["Normal"]; st.font.name = FONT; st.font.size = Pt(9.5)
st.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
st.paragraph_format.space_after = Pt(0); st.paragraph_format.line_spacing = 1.15

def shade(cell, hexcolor):
    tcPr = cell._tc.get_or_add_tcPr(); sh = OxmlElement("w:shd")
    sh.set(qn("w:val"), "clear"); sh.set(qn("w:color"), "auto"); sh.set(qn("w:fill"), hexcolor); tcPr.append(sh)

def para(text="", size=9.5, bold=False, align=None, before=0, after=0, color=None):
    p = d.add_paragraph(); r = p.add_run(text); r.font.size = Pt(size); r.bold = bold
    if color: r.font.color.rgb = RGBColor.from_string(color)
    if align: p.alignment = align
    p.paragraph_format.space_before = Pt(before); p.paragraph_format.space_after = Pt(after)
    return p

def put(cell, text, bold=False, size=9, align=WD_ALIGN_PARAGRAPH.LEFT, color=None):
    cell.text = ""; p = cell.paragraphs[0]; p.alignment = align
    r = p.add_run(text); r.bold = bold; r.font.size = Pt(size)
    if color: r.font.color.rgb = RGBColor.from_string(color)
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER

def table(rows, widths, head_cols=(), head_row=False):
    t = d.add_table(rows=len(rows), cols=len(widths)); t.style = "Table Grid"; t.alignment = WD_TABLE_ALIGNMENT.CENTER; t.autofit = False
    for j, w in enumerate(widths): t.columns[j].width = Mm(w)
    for i, row in enumerate(rows):
        for j, v in enumerate(row):
            c = t.cell(i, j); c.width = Mm(widths[j])
            isHead = (j in head_cols) or (head_row and i == 0)
            put(c, v, bold=isHead, align=WD_ALIGN_PARAGRAPH.CENTER if (isHead or head_row) else WD_ALIGN_PARAGRAPH.LEFT,
                color="9A9A9A" if v.startswith("(") else None)
            if isHead: shade(c, "E8EEF4")
        t.rows[i].height = Mm(8.5)
    return t

para("금 형 보 관 증", 20, True, WD_ALIGN_PARAGRAPH.CENTER, after=2)
para("(중요재산 보관 확인서)", 10, False, WD_ALIGN_PARAGRAPH.CENTER, after=8, color="555555")

table([["중요재산관리번호", "P20261006000168", "등재구분", "e나라도움(등록) - 계약검사"]],
      [32, 50, 22, 70], head_cols=(0, 2))

para("1. 소유자 및 보관자", 10.5, True, before=8, after=3)
table([
    ["구분", "소유자 (맡기는 쪽)", "보관자 (맡아 두는 쪽)"],
    ["상 호", "알앤디메이커스 주식회사", "라파"],
    ["대 표 자", "신동규", "최재호"],
    ["사업자등록번호", "709-81-02967", "(        -      -          )"],
    ["주 소", "대전광역시 유성구 국제과학7로 8", "(                                         )"],
    ["보관 장소", "—", "(공장 주소 · 보관 위치 기재)"],
], [32, 71, 71], head_cols=(0,), head_row=True)

para("2. 보관 금형 내역", 10.5, True, before=8, after=3)
table([
    ["No", "금형명", "규격 · 사이즈", "수량", "취득일", "취득가액(원)", "비고"],
    ["1", "쿼드그립 워킹화 금형", "(사이즈 범위)", "(  )벌", "(    .  .  )", "(           )", "명판 부착"],
    ["2", "", "", "", "", "", ""],
    ["3", "", "", "", "", "", ""],
], [10, 42, 28, 16, 24, 28, 26], head_row=True)

para("3. 보관 조건", 10.5, True, before=8, after=3)
terms = [
    "위 금형의 소유권은 알앤디메이커스 주식회사(이하 \"소유자\")에 있으며, 라파(이하 \"보관자\")는 생산을 위해 이를 맡아 보관한다.",
    "보관자는 위 금형을 제3자에게 양도·대여·담보 제공·처분할 수 없으며, 소유자의 서면 동의 없이 소유자 제품 생산 외의 용도로 사용하지 않는다.",
    "위 금형은 소유자의 중요재산으로 등록되어 있으므로, 보관자는 보관 장소를 옮기거나 변경·폐기가 필요한 경우 사전에 소유자에게 알리고 서면 동의를 받는다.",
    "보관자는 선량한 관리자의 주의로 금형을 보관하며, 훼손·분실·고장이 생기면 즉시 소유자에게 알린다. 보관자의 잘못으로 생긴 손해는 보관자가 원상회복 또는 배상한다.",
    "보관자는 금형에 소유자 상호와 중요재산관리번호가 적힌 표식(명판)을 붙여 두고, 소유자 또는 관계 기관의 확인·점검(현장 확인, 사진 촬영 등)에 협조한다.",
    "소유자가 반환을 요청하면 보관자는 지체 없이 금형을 반환한다. 보관 기간은 보관일부터 반환일까지로 한다.",
]
for i, t in enumerate(terms, 1):
    p = para(f"{i}.  {t}", 9.3, after=2.5)
    p.paragraph_format.left_indent = Mm(5); p.paragraph_format.first_line_indent = Mm(-5)

para("위와 같이 금형을 틀림없이 보관하고 있음을 확인합니다.", 10, True, WD_ALIGN_PARAGRAPH.CENTER, before=14, after=8)
para("2026년      월      일", 10.5, False, WD_ALIGN_PARAGRAPH.CENTER, after=12)

t = d.add_table(rows=2, cols=2); t.alignment = WD_TABLE_ALIGNMENT.CENTER; t.autofit = False
for j in range(2): t.columns[j].width = Mm(87)
sign = [("소 유 자", "알앤디메이커스 주식회사", "대표이사  신 동 규"), ("보 관 자", "라      파", "대   표  최 재 호")]
for j, (role, name, rep) in enumerate(sign):
    c = t.cell(0, j); c.width = Mm(87); put(c, role, bold=True, size=10, align=WD_ALIGN_PARAGRAPH.CENTER)
    c = t.cell(1, j); c.width = Mm(87); c.text = ""
    p = c.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(f"\n{name}\n\n{rep}   (인)"); r.font.size = Pt(10.5)

para("첨부  1. 금형 사진(명판 부착 상태) 1부   2. 양사 사업자등록증 사본 각 1부", 8.5, before=22, color="555555")
d.save(OUT); print(OUT)
