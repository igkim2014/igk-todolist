@echo off
chcp 65001 > nul
echo ======================================
echo IGK-TodoList GitHub 이슈 생성 통합 스크립트
echo ======================================
echo.
echo 이 스크립트는 모든 Phase의 이슈를 순차적으로 생성합니다.
echo.
echo 총 이슈 개수: 약 27개 (일부 통합됨)
echo - Phase 1: 4개 이슈
echo - Phase 2: 8개 이슈
echo - Phase 3: 8개 이슈
echo - Phase 4: 7개 이슈
echo.
echo ======================================
echo.

REM GitHub CLI 설치 확인
where gh >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [오류] GitHub CLI가 설치되어 있지 않습니다.
    echo.
    echo 설치 방법:
    echo 1. winget install --id GitHub.cli
    echo 또는
    echo 2. https://cli.github.com/ 에서 다운로드
    echo.
    pause
    exit /b 1
)

echo [확인] GitHub CLI 설치 확인됨
echo.

REM 인증 확인
gh auth status >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [오류] GitHub CLI 인증이 필요합니다.
    echo.
    echo 인증 방법:
    echo gh auth login
    echo.
    pause
    exit /b 1
)

echo [확인] GitHub CLI 인증 확인됨
echo.

REM 저장소 확인
gh repo view >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [오류] GitHub 저장소가 연결되어 있지 않습니다.
    echo 현재 디렉토리가 git 저장소인지 확인하세요.
    echo.
    pause
    exit /b 1
)

echo [확인] GitHub 저장소 연결 확인됨
echo.

REM 사용자 확인
echo.
echo 계속하시겠습니까? 약 27개의 GitHub 이슈가 생성됩니다.
echo.
set /p confirm="계속하려면 'Y'를 입력하세요 (Y/N): "
if /i not "%confirm%"=="Y" (
    echo 취소되었습니다.
    pause
    exit /b 0
)

echo.
echo ======================================
echo 이슈 생성 시작
echo ======================================
echo.

REM Phase 1 실행
echo [실행] Phase 1: 데이터베이스 구축
call create_github_issues.bat
if %ERRORLEVEL% NEQ 0 (
    echo [경고] Phase 1 실행 중 오류 발생
)
echo.

REM Phase 2 실행
echo [실행] Phase 2: 백엔드 개발
call create_issues_phase2.bat
if %ERRORLEVEL% NEQ 0 (
    echo [경고] Phase 2 실행 중 오류 발생
)
echo.

REM Phase 3 실행
echo [실행] Phase 3: 프론트엔드 개발
call create_issues_phase3.bat
if %ERRORLEVEL% NEQ 0 (
    echo [경고] Phase 3 실행 중 오류 발생
)
echo.

REM Phase 4 실행
echo [실행] Phase 4: 통합 및 배포
call create_issues_phase4.bat
if %ERRORLEVEL% NEQ 0 (
    echo [경고] Phase 4 실행 중 오류 발생
)
echo.

echo ======================================
echo 모든 이슈 생성 완료
echo ======================================
echo.
echo GitHub에서 생성된 이슈를 확인하세요:
gh issue list --limit 50
echo.
echo 또는 웹에서 확인:
gh repo view --web
echo.
pause
