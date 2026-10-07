#!/bin/sh
# 라라슈 워킹화 런칭필름 빌드: sh build.sh  → rs-walking-launch.mp4
# 준비: sh scripts/setup-lemo-opuscar.sh (라이브러리 ~/lemo-opuscar)
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
export PLAYWRIGHT_CHROME=${PLAYWRIGHT_CHROME:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
REPO=$(cd "$HERE/../../../../.." && pwd)
# 자원 (저장소의 원본에서 복사; 폰트·사진은 git 제외)
mkdir -p "$HERE/assets" "$HERE/fonts"
cp -n "$REPO"/launch/rs/qc/photos-2026-09-30/0[1-4]-*.jpg "$HERE/assets/" 2>/dev/null || true
cp -n "$REPO/launch/rs/design/brand/rs-logo-source.png" "$HERE/assets/" 2>/dev/null || true
cp -n "$REPO"/launch/rs/design/hangtag/fonts/NotoSansKR-*.ttf "$HERE/fonts/" 2>/dev/null || true
cd "$LIB"
node core/render/events.mjs "$HERE" --size 1080x1920
node core/render/video.mjs "$HERE" --fps 24 --size 1080x1920 --workers 3 --out "$HERE/out/video.mp4"
"$LIB/.venv/bin/python" "$HERE/mix.py"
ffmpeg -loglevel error -y -i "$HERE/out/mix.wav" -af "loudnorm=I=-14:TP=-2:LRA=11,alimiter=limit=0.78:level=false" -ar 48000 "$HERE/out/mix-lim.wav"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix-lim.wav" "$HERE/rs-walking-launch.mp4" 24 0
node core/render/still.mjs "$HERE" 21.5 --size 1080x1920 --out "$HERE/out" >/dev/null && cp "$HERE/out/t_21.5.jpg" "$HERE/poster.jpg"
