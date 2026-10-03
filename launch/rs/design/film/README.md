# RS 런칭필름

| 파일 | 내용 |
|---|---|
| `build-insole.mjs` | 쿼드그립 아치가득 인솔 런칭필름 생성 (HTML → 스틸 6장 + webm) |
| `insole-film.mp4` | 1080×1920 · 30fps · 약 18초 (릴스·쇼츠용) |
| `insole-film-sheet.png` | 장면 6컷 한눈에 보기 |
| `insole-photo.png` | 09/30 시사출 실물 사진(부식 전) — **10/28 촬영본으로 교체 예정** |

구성: ① 로고(라임 도트 4개 → RS) ② 제품명 ③ 01 아치 라인을 따라 가득 ④ 02 뒤꿈치를 감싸는 컵(링 구조) ⑤ 03 우드칩 배합 소재 ⑥ 엔딩카드 2026.11.11 OPEN

문구 규칙: 구조·소재 사실만. 교정·통증·질병명·"편안함 보장" 금지. 음악·내레이션은 CapCut에서 추가(저작권 확인된 음원만).
mp4 변환: webm 생성 후 `ffmpeg -ss 0.4 -i insole-film.webm -c:v libx264 -pix_fmt yuv420p -r 30 -crf 20 insole-film.mp4`
