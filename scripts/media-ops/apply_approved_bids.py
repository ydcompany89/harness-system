"""
data/media-ops-naver-bid-log.csv 에서 상태=`승인` 인 행만 실제로 반영한다.

⚠️ 이 스크립트는 사람이 CSV의 '상태' 컬럼을 직접 `승인`으로 바꾼 뒤에만 실행한다.
   `제안` 상태인 행은 절대 건드리지 않는다 — 이게 이 스크립트의 핵심 안전장치다.

사용법: python apply_approved_bids.py --approver "신동규"
"""

import argparse
import csv
import datetime
import pathlib

from naver_ads_client import NaverAdsClient

CSV_PATH = pathlib.Path(__file__).resolve().parents[2] / "data" / "media-ops-naver-bid-log.csv"


def load_rows() -> list[dict]:
    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def write_rows(rows: list[dict]) -> None:
    if not rows:
        return
    with CSV_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)


def apply_approved(rows: list[dict], client: NaverAdsClient, approver: str) -> tuple[list[dict], int, int]:
    today = datetime.date.today().isoformat()
    applied, failed = 0, 0

    for row in rows:
        if row["상태"] != "승인":
            continue  # 승인 안 된 행은 절대 건드리지 않는다

        keyword_id = row.get("키워드ID") or None
        try:
            if not keyword_id:
                raise ValueError("키워드ID가 비어 있어 어떤 키워드인지 특정할 수 없음 — 수동 확인 필요")

            if "OFF 검토" in row["제안사유"]:
                client.set_keyword_status(keyword_id, on=False)
            else:
                client.update_keyword_bid(keyword_id, int(row["제안입찰가"]))

            row["상태"] = "적용완료"
            row["승인자"] = row["승인자"] or approver
            row["적용일"] = today
            applied += 1
        except Exception as exc:  # noqa: BLE001 — 실패 사유를 CSV에 남기기 위해 광범위하게 캐치
            row["상태"] = f"적용실패: {exc}"
            failed += 1

    return rows, applied, failed


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--approver", required=True)
    args = parser.parse_args()

    rows = load_rows()
    approved_count = sum(1 for r in rows if r["상태"] == "승인")
    if approved_count == 0:
        print("상태=`승인`인 행이 없습니다. CSV를 먼저 검토하고 승인 표시를 한 뒤 다시 실행하세요.")
        raise SystemExit(0)

    client = NaverAdsClient()
    rows, applied, failed = apply_approved(rows, client, args.approver)
    write_rows(rows)
    print(f"적용 완료 {applied}건, 실패 {failed}건 (승인 대상 {approved_count}건 중)")
