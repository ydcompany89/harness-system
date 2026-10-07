#!/bin/sh
# SEO·AEO·GEO·네이버 최적화 스킬 fire-your-seo-agency 설치 (클라우드 세션마다 다시 실행)
# 사용: sh scripts/setup-fire-seo.sh  →  Claude Code에서 /fire-your-seo-agency 사이트 진단해줘
# 출처: https://github.com/leopard627/fire-your-seo-agency (MIT, v1.2.1 검토 2026-10-04 — 문서+검증 스크립트만, 외부 전송 코드 없음)
# 우리 규칙: 이 스킬의 "직답 문단"·메타·구조화 데이터도 workflows/marketing-principles.md 금지어(성능·질병명) 검사를 먼저 통과해야 함
set -e
claude plugin marketplace add leopard627/fire-your-seo-agency
claude plugin install fire-your-seo-agency@fire-your-seo-agency
echo "✓ fire-your-seo-agency ready"
