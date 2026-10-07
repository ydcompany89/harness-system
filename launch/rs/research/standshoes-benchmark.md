# STAND+ (standshoes.com) 사이트 분해 + 라라슈 자사몰 설계안 (2026-10-05)

> 분석 방법: 세션 네트워크가 사이트 직접 접속을 막아, **검색엔진에 색인된 페이지 목록·요약**으로 구조를 재구성함. 화면 레이아웃·문구 원문은 접속 허용 후(또는 캡처) 보강.
> 출처: [홈](https://www.standshoes.com/) · [전체 상품](https://www.standshoes.com/collections/all) · [인솔](https://www.standshoes.com/products/stand-ortholite-x-40-insoles) · [셰프용](https://www.standshoes.com/pages/shoes-for-chefs) · [회복용](https://www.standshoes.com/pages/shoes-for-recovery) · [Heeluxe 착화 연구](https://www.standshoes.com/pages/heeluxe-study-full-report) · [전체 리뷰](https://www.standshoes.com/pages/all-reviews) · [About](https://www.standshoes.com/pages/about-us) · [Our Values](https://www.standshoes.com/pages/our-values) · [FSA](https://www.standshoes.com/pages/flexible-spending-accounts) · [WARC 사례](https://www.warc.com/content/article/MarketingSociety/Stand_Rewriting_the_Rules_of_Performance_Footwear/161355)

## 1. 사이트 지도 (Shopify 기반 — /collections /products /pages 구조)
| 층 | 페이지 | 역할 |
|---|---|---|
| 홈 | `/` | 브랜드 한 줄 + 대표 상품 + 후기 수 |
| 상품 목록 | `/collections/all`, `/collections/types?q=Shoes` | 전체 스타일·컬러, 종류별 필터 |
| 상품 상세 | `/products/antigrav2-…`, `/products/…insoles` | 신발 3종(AntiGrav 1·2·3, $65~140) + **인솔 별매** |
| **직업별 랜딩** | `/pages/shoes-for-chefs`, `/pages/shoes-for-recovery`, `/pages/athletes-recovery-slides` | 같은 신발을 **직업·상황별로 다시 포장** (검색·광고 착지점) |
| **증거** | `/pages/heeluxe-study-full-report`, `/pages/all-reviews` | 제3자 연구소 착화 연구 + 리뷰 모음 (평점 4.8, 5점 리뷰 2,600+) |
| 브랜드 | `/pages/about-us`, `/pages/our-values`, `/pages/weargales` | 창업 이야기, 가치, 옛 브랜드명(Gales) 이전 안내 |
| 구매 장벽 제거 | `/pages/flexible-spending-accounts` | 미국 의료비 계좌로 결제 가능 안내 |
| 고객지원 | `/pages/contact-us`, `/pages/accessibility` | 문의, 접근성 |
| 이벤트 | `/pages/pro-level-recovery-event` | 캠페인 랜딩 |

## 2. 이 사이트가 잘 파는 이유 5가지 (구조만 가져올 것)
1. **직업별 랜딩** — "셰프용 신발" 페이지가 따로 있음 → 검색어·광고·박람회 QR이 각자 맞는 문으로 들어옴
2. **라인업 사다리** — 3단 가격($65 / $120 / $140) + 인솔 별매 → 고르기 쉽고 객단가 선택지
3. **증거 전용 페이지** — 주장 대신 제3자 연구 보고서 + 리뷰 모음을 **별도 페이지**로
4. **이름 붙은 구조** — Energy-Recovery™, DualCush™, AntiGrav → 기능에 이름 (우리: 쿼드그립·E-실리폴리렌·아치가득)
5. **결제 장벽 제거 페이지** — 그들은 FSA, 우리는 **단체구매·사업자 세금계산서**

## 3. 그대로 가져오면 안 되는 것 ⚠️
| STAND+ | 한국에서 우리는 |
|---|---|
| pain relief, reduce fatigue, absorbs impact, slip-resistant | 표시광고법·의료기기 오인 → **구조 사실**로만 (쿼드그립 4점 패드, 깔창 없는 일체형 안창, 도톰한 발목 테두리) |
| 리뷰 속 질병명(족저근막염 등) | 리뷰 게시 전 **질병명 포함 리뷰 가림 규칙** 필요 |
| Recovery 페이지·"회복" 단어 | 쓰지 않음 |
| 연구 보고서 페이지 | 우리는 **성적서 확보 후에만** 만든다 (그 전엔 "시험 진행 중" 공개 X) |
| 브랜드명 STAND+ / 슬로건 유사성 | "Made for Standing." 유사성 변리사 확인 (C12) |

## 4. 라라슈 자사몰 사이트맵 (우리 버전)
| 페이지 | 주소 (예: rs.rndmakers.kr) | 내용 |
|---|---|---|
| 홈 | `/` | Made for Standing. · 제품 2종 · 현장 이야기 · 알림/구매 |
| 워킹화 | `/walking` | 쿼드그립 종일편한 워킹화 42,500원 · 구조 3가지 · 사이즈표(발볼) · 세척법 |
| 인솔 | `/insole` | 아치가득 인솔 21,500원 · "가지고 계신 신발용" · 대상 표현(아치 낮은 편·오래 서는 분) |
| **직업별** | `/for/kitchen` · `/for/cafe` · `/for/store` | 식당·주방 / 카페·베이커리 / 매장·서비스 — 같은 제품, 장면만 다르게 |
| 소재 | `/material` | From Road to Floor. 폐타이어 → 그립 패드, 리타이렌, E-실리폴리렌 |
| 이야기 | `/story` | 친구 세 명의 가게, 김밥집 사장님 VOC, 레오 사장(AI 캐릭터) |
| 후기 | `/reviews` | 11.11 이후. 체험단 후기는 [협찬] 표기 |
| 단체구매 | `/b2b` | 식당·프랜차이즈 수량 구간표, 사업자 세금계산서 |
| 사이즈·FAQ | `/guide` | 발 길이 재는 법(퇴근 무렵), 교환·배송 |
| 알림·이벤트 | `/go` (현재 랜딩) | PHASE 전환형 — 지금의 rharashoe 랜딩을 그대로 이 자리로 |

## 5. 홈 섹션 순서 (와이어프레임)
1. 히어로: `Made for Standing.` + 실물 사진 + [구매/알림]
2. 누구를 위해: 서서 일하는 직업 3장면 카드 → 직업별 페이지
3. 제품 2종 카드 (가격·구조 3줄)
4. 구조 설명: 쿼드그립 · 일체형 안창 · 발목 테두리 (아이콘 배지 재사용)
5. 현장의 소리: 김밥집 사장님 한마디 (이름 비공개)
6. 소재: From Road to Floor. (1문단 + 실물 사진)
7. 레오 사장 한 컷 + 인스타 연결
8. 단체구매 배너
9. 사이즈 가이드 + FAQ 5개
10. 푸터: 회사 정보·사업자·고객센터·개인정보

## 6. 플랫폼 선택
| 선택지 | 장점 | 단점 |
|---|---|---|
| **아임웹** (추천) | 한국 결제·배송·세금계산서 기본, 디자인 자유도, 비개발자 운영 | 월 이용료 |
| 카페24 | 쇼핑몰 기능 최다, 마켓 연동 | 디자인 손이 많이 감 |
| 스마트스토어만 | 비용 0, 네이버 유입 | 브랜드 사이트 역할 불가, SEO 구조 통제 X |
| 쇼피파이 (STAND+와 동일) | 해외 판매 | 국내 PG·세금계산서 불편 |
→ **아임웹 자사몰 + 스마트스토어 병행**, 지금 랜딩은 `/go`로 흡수. 11/11 전엔 자사몰 대신 **랜딩 + 스마트스토어**로 열고, 자사몰은 11월 중 오픈도 가능.

## 확인 필요
- [ ] rndmakers.kr 현재 빌더 (아임웹이면 같은 계정에 라라슈 사이트 추가가 빠름)
- [ ] 자사몰 오픈 시점: 11/11 동시 vs 11월 말
- [ ] 사이트 직접 분석 (네트워크 허용 → 새 세션) 또는 전체 화면 캡처로 레이아웃·문구 보강
