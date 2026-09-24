#!/usr/bin/env python3
"""RS 런칭 트래커(launch/rs/checklist.csv) → 마스터 대시보드 시트 행 포맷 변환.

마스터 대시보드: 구글시트 '알앤디메이커스_마스터_대시보드' (todotoday PWA가 Apps Script로 읽음)
컬럼: ID | 구분 | 프로젝트 | 할일 | 담당 | 마감일 | 상태 | 우선순위 | 비고

사용법:
  python3 scripts/rs_to_dashboard.py                 # 오늘부터 10일 이내 + 핵심 마일스톤
  python3 scripts/rs_to_dashboard.py --days 14 --start-id 28 --today 2026-09-24
출력: launch/rs/dashboard-sync.csv  → 시트 맨 아래에 붙여넣기 (기존 행은 건드리지 않음)
"""
import argparse, csv, datetime as dt, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "launch/rs/checklist.csv"
OUT = ROOT / "launch/rs/dashboard-sync.csv"

# 기간과 무관하게 항상 대시보드에 올릴 마일스톤
MILESTONES = {"B05", "K05", "DP04", "H05", "P05", "P07", "G02", "G03", "X01"}
OWNER = {"대표": "신동규", "대표/공장": "신동규"}

def owner(v):
    if v in OWNER:
        return OWNER[v]
    if v.startswith(("rs-launch-pm", "content-creator", "researcher", "sales-ops", "daily-assistant")):
        return f"Claude({v})"
    return v

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=10)
    ap.add_argument("--start-id", type=int, default=28)
    ap.add_argument("--today", default=dt.date.today().isoformat())
    a = ap.parse_args()
    today = dt.date.fromisoformat(a.today)

    out, nid = [], a.start_id
    for r in csv.DictReader(open(SRC, encoding="utf-8")):
        if r["상태"] in ("완료", "보류"):
            continue
        try:
            due = dt.date.fromisoformat(r["마감일"])
            left = (due - today).days
        except ValueError:  # '수시', '[확인필요]' 등
            due, left = None, None
        in_window = left is not None and left <= a.days
        if not (in_window or r["ID"] in MILESTONES):
            continue
        if left is not None and left <= 7:
            gubun = "긴급"
        elif left is not None and left <= 14:
            gubun = "이번주"
        else:
            gubun = "중기"
        prio = "높음" if (r["사람승인"] == "필요" and left is not None and left <= 14) or r["ID"] in MILESTONES else "중간"
        out.append([nid, gubun, f"RS런칭-{r['영역']}", r["과제"], owner(r["담당"]),
                    r["마감일"], r["상태"], prio, f"[{r['ID']}] {r['메모']}".strip()])
        nid += 1

    out.sort(key=lambda x: x[5])
    for i, row in enumerate(out):
        row[0] = a.start_id + i
    with open(OUT, "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(["ID", "구분", "프로젝트", "할일", "담당", "마감일", "상태", "우선순위", "비고"])
        w.writerows(out)
    print(f"{len(out)} rows -> {OUT.relative_to(ROOT)}")

if __name__ == "__main__":
    main()
