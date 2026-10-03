#!/bin/sh
# 영상 제작 도구 Lemo-Opuscar 설치 (클라우드 세션은 컨테이너가 매번 새로 뜨므로 세션마다 다시 실행)
# 사용: sh scripts/setup-lemo-opuscar.sh
# 출처: https://github.com/lemomo-ai/lemo-opuscar (MIT) — 코드 렌더링(HTML render(t) → 프레임별 캡처 → ffmpeg) + 음악·효과음 합성·믹스
set -e
claude plugin marketplace add lemomo-ai/lemo-opuscar
claude plugin install lemo-opuscar@lemolab
S=$(find /root/.claude/plugins -path "*lemo-opuscar/scripts/setup.sh" | head -1)
sh "$S"                                   # 라이브러리 → ~/lemo-opuscar
cd ~/lemo-opuscar
npm install --no-audit --no-fund --loglevel=error
# 클라우드 환경: playwright 브라우저 다운로드(cdn.playwright.dev)가 막혀 있음 → 내장 Chromium 사용
export PLAYWRIGHT_CHROME=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
grep -q PLAYWRIGHT_CHROME ~/.bashrc || echo "export PLAYWRIGHT_CHROME=$PLAYWRIGHT_CHROME" >> ~/.bashrc
# ffmpeg: 시스템에 없으면 npm ffmpeg-static 사용
command -v ffmpeg >/dev/null || { npm i --prefix /tmp/ffs ffmpeg-static >/dev/null && ln -sf /tmp/ffs/node_modules/ffmpeg-static/ffmpeg ~/.local/bin/ffmpeg; }
uv venv --quiet --python /usr/local/bin/python3 .venv 2>/dev/null || true
uv pip install --quiet --python .venv/bin/python -r requirements.txt
echo "$(cat requirements.txt | cksum | cut -d' ' -f1)-$(.venv/bin/python -V 2>&1 | cut -d. -f1,2)" > .venv/.lemo-core
echo "✓ lemo-opuscar ready (LIB=~/lemo-opuscar). 세로: --size 1080x1920"
