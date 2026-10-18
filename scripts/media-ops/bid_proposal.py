"""
네이버 키워드 입찰가/캠페인 조정 '제안'을 생성한다 (읽기 전용 — 아무것도 변경하지 않음).

사용법: python bid_proposal.py --since 2026-09-22 --until 2026-09-28

룰(기본값, 필요시 --target-roas 등으로 조정):
  - ROAS가 목표치의 80% 미만 + 클릭 20회 이상 -> 입찰가 10% 하향 제안
  - 클릭 20회 이상인데 전환 0 -> 상태 OFF 제안 (제안 사유에 명시, 상태 변경은 apply 단계에서만)

결과는 data/media-ops-naver-bid-log.csv 에 상태=`제안`으로 append 된다.
이 스크립트는 naver_ads_client의 update_* 함수를 절대 호출하지 않는다.
"""

import argparse
import csv
import datetime
import pathlib

from naver_ads_client import NaverAdsClient

CSV_PATH = pathlib.Path(__file__).resolve().parents[2] / "data" / "media-ops-naver-bid-log.csv"
CSV_HEADER = [
    "제안ID", "캠페인명", "광고그룹명", "키워드", "키워드ID", "현재입찰가", "제안입찰가",
    "현재예산", "제안예산", "제안사유", "생성일", "상태", "승인자", "적용일",
]


def build_proposals(client: NaverAdsClient, since: str, until: str, target_roas: float) -> list[dict]:
    proposals = []
    today = datetime.date.today().isoformat()
    seq = 0

    for campaign in client.campaigns():
        for adgroup in client.adgroups(campaign["nccCampaignId"]):
            keywords = client.keywords(adgroup["nccAdgroupId"])
            keyword_ids = [k["nccKeywordId"] for k in keywords]
            if not keyword_ids:
                continue

            report = client.stat_report(
                ids=keyword_ids,
                fields=["clkCnt", "salesAmt", "ccnt"],
                date_range={"since": since, "until": until},
            )

            for kw in keywords:
                stat = report.get(kw["nccKeywordId"], {})
                clicks = stat.get("clkCnt", 0)
                cost = stat.get("salesAmt", 0)
                conversions = stat.get("ccnt", 0)
                roas = (conversions / cost * 100) if cost else None

                current_bid = kw.get("bidAmt", 0)
                reason = None
                proposed_bid = current_bid

                if clicks >= 20 and conversions == 0:
                    reason = f"클릭 {clicks}회, 전환 0건 -> OFF 검토 제안"
                elif clicks >= 20 and roas is not None and roas < target_roas * 0.8:
                    proposed_bid = int(current_bid * 0.9)
                    reason = f"ROAS {roas:.0f}% (목표 {target_roas:.0f}%의 80% 미만) -> 입찰가 10% 하향 제안"

                if reason is None:
                    continue

                seq += 1
                proposals.append({
                    "제안ID": f"MO-{today.replace('-', '')}-{seq:03d}",
                    "캠페인명": campaign.get("name", ""),
                    "광고그룹명": adgroup.get("name", ""),
                    "키워드": kw.get("keyword", ""),
                    "키워드ID": kw.get("nccKeywordId", ""),
                    "현재입찰가": current_bid,
                    "제안입찰가": proposed_bid,
                    "현재예산": adgroup.get("dailyBudget", ""),
                    "제안예산": "",
                    "제안사유": reason,
                    "생성일": today,
                    "상태": "제안",
                    "승인자": "",
                    "적용일": "",
                })
    return proposals


def append_to_csv(rows: list[dict]) -> None:
    is_new = not CSV_PATH.exists()
    with CSV_PATH.open("a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_HEADER)
        if is_new:
            writer.writeheader()
        writer.writerows(rows)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--since", required=True)
    parser.add_argument("--until", required=True)
    parser.add_argument("--target-roas", type=float, default=300.0)
    args = parser.parse_args()

    client = NaverAdsClient()
    rows = build_proposals(client, args.since, args.until, args.target_roas)
    append_to_csv(rows)
    print(f"{len(rows)}건의 제안을 {CSV_PATH} 에 기록했습니다 (상태=제안, 아직 반영되지 않음).")
