# 라라슈 브랜드 소개 영상 — 구글 Flow 프롬프트 (12초 × 4클립 = 48초)

> 레퍼런스: 대표 제공 영상 (40초, 신발 브랜드 'STAND+' 필름)
> 레퍼런스 구조: 유리 진열장 속 돌덩이 → 만드는 사람의 눈·손(마우스·키보드·코드) → 와이어프레임·도면 → 떠오르는 신발 → 진열장에서 돌과 신발이 합쳐지며 로고
> **우리 버전 컨셉: "From Road to Floor."** — 도로를 달리던 타이어 고무가, 서서 일하는 사람의 바닥이 되기까지.
> 같은 문법(차가운 블루그레이 + 매크로 클로즈업 + 진열장 리빌)을 쓰되, 이야기는 **우리 실화**(폐타이어 → 식당 사장님의 하루 → 4점 패드 → Made for Standing)로 채운다.

---

## ⚠️ 시작 전 원칙 (꼭 지킬 것)
1. **AI로 우리 신발을 그리지 않는다.** Flow가 만든 신발은 실제 제품과 다르다 → 표시광고 위험 + 브랜드 원칙 위반(제품은 실물만).
   → 영상 속 "신발 자리"는 비워 두고, **10/28 실물 촬영 영상/사진을 편집에서 끼운다.**
2. **글자는 Flow에서 만들지 않는다.** 한글·로고가 깨진다 → 자막·로고는 CapCut에서 얹는다.
3. 성능 장면 금지: 미끄러지는 장면, 물이 안 들어가는 장면, 충격 받는 장면 ✗
4. 실존 인물 아님: 등장인물은 "식당 사장님", "만드는 사람"으로만 (특정인 얼굴 흉내 ✗)

---

## 공통 스타일 블록 (4개 프롬프트 맨 앞에 매번 그대로 붙여넣기)
```
STYLE: cinematic premium footwear brand film, cold blue-grey color palette with deep shadows,
one single neon lime (#C6F432) accent used sparingly, high contrast, soft top light,
macro lens close-ups and shallow depth of field, slow precise camera moves (dolly, slow push-in),
subtle 35mm film grain, minimal and clean, quiet tension.
16:9, 24fps, photoreal.
NEGATIVE: no text, no letters, no logos, no brand names, no watermarks, no visible shoe brand,
no sneakers or shoes in focus, no slipping or falling, no water splashing on shoes,
no cartoon, no glow effects, no lens flares.
AUDIO: no dialogue, no music. Subtle ambient sound only.
```
> Flow가 한 클립 안에서 컷 전환을 잘 못 하면 → 각 클립의 [A][B][C]를 **4초짜리 3개로 따로 생성**해서 붙이면 된다.

---

## CLIP 1 — 도로 (0:00–0:12) · ORIGIN
**의미:** 수명을 다한 타이어. 이야기의 시작.
```
[STYLE 블록]

SCENE: Night. A worn car tire on wet dark asphalt, lit by a single cold street light.
[A 0-4s] Extreme macro of the worn tire tread, rain droplets on rubber, slow push-in.
[B 4-8s] Wide shot: a stack of discarded tires in an empty recycling yard at dawn, blue haze, slow dolly sideways.
[C 8-12s] Macro slow motion: small black rubber granules falling and bouncing on a dark metal tray,
one tiny granule catches a thin neon lime rim light.
```

## CLIP 2 — 서 있는 사람 (0:12–0:24) · PEOPLE
**의미:** 하루 10~12시간 서서 일하는 식당 사장님들. 우리가 만드는 이유.
```
[STYLE 블록]

SCENE: Early morning inside a small Korean gimbap restaurant kitchen, stainless steel counters,
wet tiled floor, steam rising, cold blue window light.
[A 0-4s] A Korean restaurant owner in his 40s ties a charcoal apron behind his back, seen from behind, slow push-in.
[B 4-8s] Extreme close-up of his tired but focused eye, steam drifting past, shallow depth of field (like a portrait study).
[C 8-12s] Low angle at floor level: feet standing still on the wet tiled kitchen floor, shoes out of focus and in shadow,
only the floor tiles in focus, a long shadow, time passing.
```

## CLIP 3 — 만드는 손 (0:24–0:36) · MAKING
**의미:** 폐타이어 고무가 네 개의 패드가 되기까지. 레퍼런스의 "눈·손·도면" 파트.
```
[STYLE 블록]

SCENE: A dim design workshop at night, one desk lamp, technical drawings and rubber samples on the table.
[A 0-4s] Close-up of a craftsman's hand drawing four small circles on a technical sketch of a shoe outsole with a pencil,
the paper is pale, the pencil line is precise.
[B 4-8s] Macro: black rubber granules being pressed into a small round steel mold, a hydraulic press slowly lowering.
[C 8-12s] Top-down: four small round neon lime (#C6F432) rubber pads lined up in a row on a dark steel surface,
thin white wireframe lines draw themselves around them like a 3D design overlay.
```

## CLIP 4 — 진열장 (0:36–0:48) · REVEAL
**의미:** 레퍼런스 엔딩의 진열장 리빌. 돌 대신 **타이어 조각**, 그 위 빈 자리에 **실물 신발**을 편집으로 합성.
```
[STYLE 블록]

SCENE: A minimal grey concrete studio, a tall empty glass display case standing in the center,
soft cold light from above.
[A 0-4s] Darkness, then the top light inside the glass case slowly turns on, revealing a broken chunk of old tire rubber
lying on the floor of the case. Slow push-in.
[B 4-8s] Small rubber granules drift upward around the tire chunk in slow motion and settle back down.
[C 8-12s] Static locked-off wide shot: the glass case is lit, the tire chunk at the bottom,
clean empty space above it in the center of the case (for product placement later). Hold still.
```
→ C구간은 **카메라 고정**이라 편집에서 실물 신발 사진/영상을 진열장 안 빈 공간에 합성하기 쉽다.

---

## 편집 (CapCut) — 붙이는 법
| 시간 | 소스 | 자막 (CapCut, Noto Sans KR / 라임은 한 단어만) |
|---|---|---|
| 0:00–0:12 | CLIP 1 | 0:08 `한때 도로를 달리던 고무.` |
| 0:12–0:24 | CLIP 2 | 0:16 `하루 10시간, 서서 일하는 사람들.` |
| 0:24–0:36 | CLIP 3 | 0:30 `그 고무를, 네 개의 패드로.` → 0:34 `QUAD GRIP` (모노 라벨) |
| 0:36–0:44 | CLIP 4 + **실물 신발 합성** (10/28 촬영본, 진열장 안 빈 공간) | 0:40 `From Road to Floor.` |
| 0:44–0:48 | 오프블랙 엔딩카드 (런칭필름 엔딩 재사용 가능) | `Made for Standing.` / RS 로고 / `RhaRa Shoe · 라라슈` / `2026. 11. 11 OPEN` |
- 컷은 음악 박자에 맞춰 하드컷 (디졸브 X). 음악은 저작권 확인된 음원 또는 런칭필름 합성 음악 재사용.
- 실물 끼워 넣을 컷 추가 추천: CLIP 3 끝(0:35) 뒤에 **실물 밑창 패드 클로즈업 1초** → 라임 패드(AI)와 실물 패드가 이어지는 매치컷.
- 세로(9:16) 버전: 같은 프롬프트에서 `16:9`를 `9:16 vertical`로 바꿔 한 번 더 생성 (릴스·쇼츠용).

## 자막 문구 금지어 체크
- ✗ 미끄럼·충격·방수·편안함 보장·친환경 신발·타이어로 만든 신발
- ○ 위 표의 문구는 모두 사실(소재 출처·구조·대상)만 말함

## 생성 순서 팁
1. CLIP 4부터 생성 → 진열장 톤이 정해지면 그 프레임을 Flow 참조 이미지로 넣어 나머지 클립 색감을 맞춘다
2. 마음에 드는 컷이 나오면 **같은 시드/같은 대화창**에서 다음 클립 진행
3. 클립마다 3~4번 뽑고 고르기 (신발이 크게 나오거나 글자가 생긴 컷은 버림)
