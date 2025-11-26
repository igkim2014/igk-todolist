# GitHub CLI 경로를 PATH에 추가
$env:PATH += ";C:\Program Files\GitHub CLI"

# 현재 디렉토리로 이동
Set-Location "C:\test\igk-todolist"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "IGK-TodoList GitHub 이슈 생성" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Phase 2 실행
Write-Host "[실행] Phase 2: 백엔드 개발" -ForegroundColor Yellow
& ".\create_issues_phase2.bat"
Write-Host ""

# Phase 3 실행
Write-Host "[실행] Phase 3: 프론트엔드 개발" -ForegroundColor Yellow
& ".\create_issues_phase3.bat"
Write-Host ""

# Phase 4 실행
Write-Host "[실행] Phase 4: 통합 및 배포" -ForegroundColor Yellow
& ".\create_issues_phase4.bat"
Write-Host ""

Write-Host "======================================" -ForegroundColor Green
Write-Host "모든 이슈 생성 완료" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

# 생성된 이슈 목록 표시
gh issue list --limit 50
