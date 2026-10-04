# 레오 사장 (REO) — 캐릭터 바이블 v2

> 2026-10-03 · 대표 확정: 화자 = 수달 캐릭터, 이름 = **레오 사장**
> 이전 시안 8장(`refs/`)을 검토해 하나로 통일한 기준서. **AI 이미지·영상 생성, 스티커, 박람회 등신대 모두 이 문서가 기준.**
> 시트 이미지: `reo-sheet.png` (빌드: `node build-sheet.mjs`)

---

## 1. 이전 시안 검토 — 유지 / 수정 / 폐기

| 시안 | 유지 | 수정 | 폐기 |
|---|---|---|---|
| 턴어라운드 (`old-turnaround.png`) | ✅ **마스터 기준**: 라임 헤어밴드·검정 선글라스·흰 조리복·차콜 앞치마·검정 클로그·꼬리 | 등판 "Re:sole & shoe / EST. 2024" → **RS 로고 + "레오네 주방"**, 앞치마 "APPROVED WORKER" → **"REO"** 단독 | — |
| 포스터 (`old-poster.png`) | 실사 톤·팔짱 포즈·젖은 주방 바닥 무드 | 헤드라인 "Re:sole & shoe" → RS / RhaRa Shoe | 신발 클로즈업을 **실제 제품처럼 쓰는 것** |
| 주방 무릎 컷 (`old-kitchen.png`) | 가장 "현장감" 있음 — 릴스 톤 기준 | 앞치마 데님 → 차콜로 통일 | — |
| 코믹 (`old-comic.jpg`) "그립달" | 펜선 코믹 스타일 → **스티커·만화(서브 스타일)** 용 | 이름 GRIPDAL → 레오, 라임 렌즈 → 검정 렌즈+라임 반사선 | "미끄러질 시간 없지?" (미끄럼 뉘앙스 카피) |
| 그린 마스코트 (`old-mascot-green.png`) | 표정 4종 아이디어(LET'S GO/CHECK/FOCUS/RELAX) | — | **전체 폐기**: 구 브랜드(Re sole & shoe)·초록 팔레트·모자·"미끄러짐 ZERO/충격흡수/방수" 표기 |
| RESCUE STEP 보드 | 로고 구조 아이디어 | — | **전체 폐기**: 다른 브랜드명, "NO SLIP" 단정 카피, AI 신발 |
| 캠페인 보드 (2024 날짜) | REO's GARA STATION(박람회 부스) 아이디어 | 날짜 2024 → 2026, 브랜드명 RS로 | "TIRED FEET? EXIT HERE" 등 효능 뉘앙스 |
| 브랜드 보드 (20~27번) | REO ISSUE 코믹 시리즈 포맷, "겉은 재미있게, 속은 진지하게" | — | ⚠️ **"TEST RESULT COF 0.95 PASS (실제 데이터 예시)" 가짜 시험 수치** — 절대 게시 금지, "미끄러지지 않게·지치지 않게" 약속 문구 |

**핵심 문제 3가지**
1. 스타일이 3갈래(실사 / 펜선 코믹 / 귀여운 마스코트) → **메인 1 + 서브 1**로 정리
2. 브랜드명이 3개(Re:sole & shoe · RESCUE STEP · GRIPDAL) → **RS · RhaRa Shoe · 라라슈** 하나로
3. AI가 그린 신발·가짜 시험 수치가 섞임 → **제품은 실물 사진만, 수치는 성적서만**

---

## 2. 기본 설정

| 항목 | 설정 |
|---|---|
| 이름 | **레오 사장** (REO) |
| 정체 | 동네 식당 **'레오네 주방'** 사장. 주방 막내부터 11년, 가게 연 지 3년 |
| 성격 | 무뚝뚝한데 속이 여림. 손님한텐 웃고 뒤에선 한숨. 직원 편, 사장님들 편 |
| 말투 | 짧은 반말 혼잣말. 설명하지 않고 툭 던짐 |
| 시그니처 대사 | **"…오늘도 영업 시작."** (영상 끝, 앞치마 끈 묶으며) |
| 보조 대사 | "…또 켜놨네." / "버틴다." / "사장도 사람이다." / "퇴근은 언제 하냐." |
| 세계관 | 레오네 주방 = 가상의 동네 식당. 직원 2명(사람), 단골손님, 거래처 사장님 |
| 하는 일 | 사장님 공감 상황 연기 → 시청자가 "우리 가게 얘기네" |

---

## 3. 디자인 고정값 (매번 반드시 지킬 것)

| # | 요소 | 규칙 |
|---|---|---|
| 1 | 헤어밴드 | **라임 #C6F432**, 이마 가운데 작은 **검정 RS 로고**, 오른쪽 뒤로 매듭 |
| 2 | 선글라스 | **검정 렌즈** 웨이파러형. 렌즈에 얇은 라임 반사선 1줄(선택). 놀랄 때만 콧등으로 내림 |
| 3 | 상의 | **흰 조리복**, 소매 팔꿈치까지 걷음, 단추 2열 |
| 4 | 앞치마 | **차콜 #2B2B2B** 캔버스, 가슴 흰 패치 **"REO"**, 앞주머니 2개, 라임 스티치(선택) |
| 5 | 하의 | 검정 작업 바지 |
| 6 | 신발 | 검정 슬립온 클로그 **실루엣만** — 로고·밑창 디테일 그리지 않음 (실제 제품은 실물 촬영으로만) |
| 7 | 체형 | 사람에 가까운 직립 비율, 단단한 체격, 꼬리는 항상 보이게 |
| 8 | 털색 | 진갈색, 주둥이·뺨 밝은 베이지 |

**금지**: 모자(구 마스코트), 초록 팔레트, 데님 앞치마, "Re:sole/RESCUE STEP/GRIPDAL" 표기, 2024 날짜, 신발에 RS 로고 크게.

## 4. 스타일 2종

| 구분 | 용도 | 기준 이미지 |
|---|---|---|
| **메인: 실사형** | 릴스·쇼츠·피드, 박람회 등신대 | `old-kitchen.png` 톤 + `old-turnaround.png` 의상 |
| **서브: 펜선 코믹** | 스티커, 4컷 만화(REO ISSUE), 굿즈 | `old-comic.jpg` 스타일 (렌즈·이름만 수정) |

## 5. 표정 6종 / 포즈 6종

| 표정 | 쓰임 | 포즈 | 쓰임 |
|---|---|---|---|
| 무표정 (기본, 선글라스) | 대부분 | **팔짱** | 시그니처, 썸네일 |
| 한숨 (어깨 처짐) | 공감 장면 | **앞치마 끈 묶기** | 모든 영상 엔딩 |
| 놀람 (선글라스 콧등으로) | 훅 0~1초 | 리모컨·계산기 들고 멍 | 에어컨·전기세 편 |
| 뿌듯 (입꼬리만) | 마무리 | 바닥 물청소 대걸레 | 젖은 바닥 편 |
| 피곤 (벽에 기대기) | 마감 후 | 의자에 앉아 신발 벗기 | 퇴근 편 (통증 표현 X) |
| 끄덕 (인정) | 공감 댓글 응답 | 주문서 쌓인 걸 보며 팔 걷기 | 바쁜 날 편 |

## 6. 레오가 하지 않는 것 (표시광고 가드)
- 신발 성능을 말로 주장하지 않는다 ("안 미끄러져", "안 아파", "피로가 풀려" 금지)
- 통증·질병 이야기 안 함 (족저근막염·허리·무릎)
- 가짜 시험 수치·인증 마크를 들고 나오지 않는다
- 경쟁 브랜드 신발을 비하하지 않는다
- 실제 사람인 척하지 않는다 — 계정 소개에 "AI로 생성한 캐릭터" 표기 유지

---

## 7. AI 생성 프롬프트 팩

### 마스터 프롬프트 (EN)
```
REO, an anthropomorphic river otter restaurant owner, semi-realistic cinematic style,
upright human-like proportions, sturdy build, dark brown fur with light beige muzzle and cheeks, visible tail,
neon lime (#C6F432) sweatband headband with a small black "RS" logo at the center, knot at the right back,
black wayfarer sunglasses with black lenses,
white double-breasted chef jacket with sleeves rolled to the elbows,
charcoal canvas apron with a white chest patch reading "REO", two front pockets,
black work pants, plain black slip-on clogs with no visible logo,
small Korean neighborhood restaurant kitchen, stainless steel, warm practical lighting, slightly wet tiled floor
```

### 네거티브
```
cap, hat, green palette, denim apron, cartoon chibi, text "Re:sole", "RESCUE STEP", "GRIPDAL", "2024",
large logo on shoes, detailed shoe outsole, extra fingers, distorted sunglasses, missing tail, lime-tinted lenses
```

### 장면 템플릿
`[마스터 프롬프트] + , [포즈], [표정], [장면], vertical 9:16, [카메라: medium shot / close-up]`
- 예) `..., holding an air-conditioner remote and staring at it, mouth slightly open in disbelief, sunglasses slid down the nose, empty restaurant at 8am, vertical 9:16, medium close-up`

### 일관성 규칙
- 생성할 때마다 **턴어라운드 이미지를 레퍼런스로 첨부** (캐릭터 레퍼런스/요소 기능)
- 결과물 검수: §3 고정값 8개 체크 → 하나라도 틀리면 폐기
- 마음에 드는 결과는 `refs/approved/`에 저장해 다음 생성 레퍼런스로 누적

---

## 8. 다음 단계
1. 대표 승인 → `old-turnaround.png`를 v2 고정값으로 **재생성** (등판·패치 문구 수정판)
2. 표정 6종 + 포즈 6종 시트 생성
3. 1편 "에어컨 밤새 켜둔 날" 콘티 (marketing-expert)

## 턴어라운드 마스터 (2026-10-04 확정 후보)
- 원본: `refs/reo-turnaround-master-2026-10-04.jpg` (Gemini 이미지, 6컷)
- 4뷰 시트: `reo-turnaround-v2.jpg` (FRONT · 3/4 · SIDE · BACK)
- 통과: 얼굴·목 진갈색 / 앞치마 흰 REO 패치 / 등 라임 RS / 구멍 없는 매끈한 클로그 / 깨진 글자 없음
- 사용 시 주의: 원본 우하단 Gemini 워터마크 → 원본은 내부 참조용, 외부 게시는 4뷰 시트나 개별 크롭만
