"""
네이버 검색광고 오픈API 클라이언트 (읽기 전용 조회 + 저수준 업데이트 함수).

⚠️ 실제 키로 처음 실행하기 전에 workflows/media-ops-automation.md 의
"검증 필요" 섹션을 먼저 확인할 것 — 엔드포인트 경로/필드명은 공식 문서 기준으로
작성했으나 라이브 계정으로 검증된 적은 없다.

이 파일은 저수준 API 래퍼만 제공한다. 실제 입찰가 변경은 반드시
apply_approved_bids.py (CSV에서 '승인' 상태인 행만 반영)를 통해서만 호출한다 —
이 모듈의 update_* 함수를 스크립트에서 직접 호출하지 말 것.
"""

import base64
import hashlib
import hmac
import os
import time

import requests
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://api.searchad.naver.com"


class NaverAdsClient:
    def __init__(self):
        self.license_key = os.environ["NAVER_API_LICENSE"]
        self.secret_key = os.environ["NAVER_API_SECRET"]
        self.customer_id = os.environ["NAVER_CUSTOMER_ID"]

    def _signature(self, timestamp: str, method: str, uri: str) -> str:
        message = f"{timestamp}.{method}.{uri}"
        digest = hmac.new(
            self.secret_key.encode("utf-8"),
            message.encode("utf-8"),
            hashlib.sha256,
        ).digest()
        return base64.b64encode(digest).decode("utf-8")

    def _headers(self, method: str, uri: str) -> dict:
        timestamp = str(int(time.time() * 1000))
        return {
            "X-Timestamp": timestamp,
            "X-API-KEY": self.license_key,
            "X-Customer": self.customer_id,
            "X-Signature": self._signature(timestamp, method, uri),
        }

    def _get(self, uri: str, params: dict | None = None) -> dict:
        resp = requests.get(
            BASE_URL + uri, headers=self._headers("GET", uri), params=params, timeout=15
        )
        resp.raise_for_status()
        return resp.json()

    def _put(self, uri: str, body: dict) -> dict:
        resp = requests.put(
            BASE_URL + uri, headers=self._headers("PUT", uri), json=body, timeout=15
        )
        resp.raise_for_status()
        return resp.json()

    # ---- 읽기 전용 조회 ----

    def campaigns(self) -> list[dict]:
        return self._get("/ncc/campaigns")

    def adgroups(self, campaign_id: str) -> list[dict]:
        return self._get("/ncc/adgroups", params={"nccCampaignId": campaign_id})

    def keywords(self, adgroup_id: str) -> list[dict]:
        return self._get("/ncc/keywords", params={"nccAdgroupId": adgroup_id})

    def stat_report(self, ids: list[str], fields: list[str], date_range: dict) -> dict:
        """ids: 캠페인/광고그룹/키워드 ID 목록, date_range: {"since": "YYYY-MM-DD", "until": "YYYY-MM-DD"}"""
        params = {
            "ids": ",".join(ids),
            "fields": str(fields),
            "timeRange": str(date_range),
        }
        return self._get("/stats", params=params)

    # ---- 저수준 업데이트 (apply_approved_bids.py 전용 — 직접 호출 금지) ----

    def update_keyword_bid(self, keyword_id: str, bid_amt: int) -> dict:
        return self._put(f"/ncc/keywords/{keyword_id}", {"bidAmt": bid_amt})

    def set_keyword_status(self, keyword_id: str, on: bool) -> dict:
        return self._put(f"/ncc/keywords/{keyword_id}", {"userLock": not on})

    def set_campaign_status(self, campaign_id: str, on: bool) -> dict:
        """신규 등록 캠페인은 항상 on=False(중지)로 생성하는 데 사용 — workflow Stage C 참고."""
        return self._put(f"/ncc/campaigns/{campaign_id}", {"userLock": not on})
