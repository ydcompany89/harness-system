# 레오 사장 EP.01 — "출근했는데 매장이 시원하다" (자막판)

- 결과물: `reo-ep01-aircon.mp4` (1080×1920 · 30fps · 15.5초 · -14 LUFS), `cover.jpg`, `sheet.jpg`
- 빌드: `sh build.sh` (Lemo-Opuscar 필요: `sh scripts/setup-lemo-opuscar.sh`)
- 콘티 원본: `launch/rs/content/instagram-2month-plan.md` 1화 (자막 7줄로 확장, 컷당 1.5~2초로 늘림)
- 현재 버전 = **v0 애니매틱**: 배경은 코드 그림, 레오는 턴어라운드 마스터 컷아웃(`cutout.py`). 표정·포즈 변화가 없음.

## 자막 / 컷
| # | 시간 | 화면 | 자막 |
|---|---|---|---|
| 1 | 0.0–1.5 | 김밥집 아침, 레오 들어옴 | 아침 8시, 출근했는데 |
| 2 | 1.5–3.0 | 멈칫, 부르르 | …어? 매장이 시원하다 |
| 3 | 3.0–4.5 | 에어컨 클로즈업 18° | (밤새 돌아간 에어컨) |
| 4 | 4.5–6.0 | 얼굴 줌인 + ! | …설마. |
| 5 | 6.0–8.0 | 리모컨 들고 멍 | …밤새 켜놨네. |
| 6 | 8.0–10.0 | 한숨 + 전기요금 고지서 | 전기세… (한숨) |
| 7 | 10.0–12.0 | 뒷모습, 앞치마 끈 꽉 | …오늘도 영업 시작. |
| 8 | 12.0–15.5 | 라임 도트 4 → RS 로고 | RhaRa Shoe · 라라슈 / 11.11 OPEN |
- 우상단 상시 `AI 캐릭터` 표기. 제품 성능 언급 없음 (순수 공감편).

## v1 업그레이드: 컷 이미지 교체
`assets/cut1.png` ~ `cut7.png` (세로 9:16)를 넣고 `sh build.sh` → 해당 컷만 이미지로 바뀌고 자막·소리·타이밍은 그대로.
Gemini에서 **턴어라운드 마스터를 첨부**하고, 한 대화창에서 순서대로 생성 (캐릭터 일관성 유지).

공통 앞부분:
```
Use the attached character sheet exactly (same otter REO: dark brown fur incl. face and neck, lime RS headband,
black sunglasses, white chef jacket rolled sleeves, charcoal apron with white "REO" patch, black pants,
plain black slip-on clogs with NO holes). Flat 2D cartoon with clean black outlines, same style as the sheet.
Small Korean gimbap restaurant at 8am, warm morning light. Vertical 9:16. NO text, NO letters anywhere.
Keep the lower 30% of the frame simple (subtitles go there).
```
| 파일 | 컷별 뒷부분 |
|---|---|
| cut1 | REO opening the glass front door and stepping in, full body, empty restaurant behind |
| cut2 | REO stopped mid-step, rubbing his arms, shivering, cold air lines, medium shot |
| cut3 | close-up of a wall-mounted air conditioner running, louver open, cold air flowing (no REO) |
| cut4 | close-up of REO's face, sunglasses slid down his nose, eyes wide in shock |
| cut5 | REO holding an AC remote at chest height, staring at it blankly, mouth slightly open |
| cut6 | REO slumping his shoulders with a big sigh, a paper bill in one hand, medium shot |
| cut7 | REO from behind, tying his apron strings at the waist, determined posture |
검수: 얼굴·목 색, REO 패치, 신발 구멍 없음, 글자 없음 — 하나라도 틀리면 다시 생성.
