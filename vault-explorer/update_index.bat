@echo off
chcp 65001 > NUL
rem 더블클릭 = 볼트 인덱스 갱신 (원본 .md 는 읽기만 함)
rem 볼트 경로를 고정하려면 build_index.py 상단 VAULT_PATH 를 수정
where py > NUL 2>&1
if %ERRORLEVEL%==0 (
  py -3 "%~dp0build_index.py" %*
) else (
  python "%~dp0build_index.py" %*
)
echo.
pause
