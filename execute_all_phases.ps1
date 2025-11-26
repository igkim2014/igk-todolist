# GitHub CLI를 PATH에 추가
$env:PATH = "C:\Program Files\GitHub CLI;" + $env:PATH

# 현재 디렉토리로 이동
Set-Location "C:\test\igk-todolist"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "모든 Phase 이슈 생성 시작" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Phase 2 배치 파일의 gh 명령어만 추출하여 실행
Write-Host "Phase 2: 백엔드 개발 (8개 이슈)" -ForegroundColor Yellow
Write-Host ""

# Phase 2 배치 파일 실행 (사용자 입력 없이 자동 실행)
$batContent = Get-Content "create_issues_phase2.bat" -Encoding UTF8
$inGhCommand = $false
$ghCommand = ""

foreach ($line in $batContent) {
    if ($line -match "^gh issue create") {
        $inGhCommand = $true
        $ghCommand = $line
    }
    elseif ($inGhCommand) {
        if ($line -match "^\s*--") {
            $ghCommand += " " + $line.Trim()
        }
        else {
            # gh 명령어 완성, 실행
            $ghCommand = $ghCommand -replace '\^', ''
            $ghCommand = $ghCommand.Trim()
            if ($ghCommand -ne "") {
                Write-Host "실행 중..." -ForegroundColor Gray
                Invoke-Expression $ghCommand
            }
            $inGhCommand = $false
            $ghCommand = ""
        }
    }
}

Write-Host ""
Write-Host "Phase 3: 프론트엔드 개발 (8개 이슈)" -ForegroundColor Yellow
Write-Host ""

# Phase 3 배치 파일 실행
$batContent = Get-Content "create_issues_phase3.bat" -Encoding UTF8
$inGhCommand = $false
$ghCommand = ""

foreach ($line in $batContent) {
    if ($line -match "^gh issue create") {
        $inGhCommand = $true
        $ghCommand = $line
    }
    elseif ($inGhCommand) {
        if ($line -match "^\s*--") {
            $ghCommand += " " + $line.Trim()
        }
        else {
            $ghCommand = $ghCommand -replace '\^', ''
            $ghCommand = $ghCommand.Trim()
            if ($ghCommand -ne "") {
                Write-Host "실행 중..." -ForegroundColor Gray
                Invoke-Expression $ghCommand
            }
            $inGhCommand = $false
            $ghCommand = ""
        }
    }
}

Write-Host ""
Write-Host "Phase 4: 통합 및 배포 (7개 이슈)" -ForegroundColor Yellow
Write-Host ""

# Phase 4 배치 파일 실행
$batContent = Get-Content "create_issues_phase4.bat" -Encoding UTF8
$inGhCommand = $false
$ghCommand = ""

foreach ($line in $batContent) {
    if ($line -match "^gh issue create") {
        $inGhCommand = $true
        $ghCommand = $line
    }
    elseif ($inGhCommand) {
        if ($line -match "^\s*--") {
            $ghCommand += " " + $line.Trim()
        }
        else {
            $ghCommand = $ghCommand -replace '\^', ''
            $ghCommand = $ghCommand.Trim()
            if ($ghCommand -ne "") {
                Write-Host "실행 중..." -ForegroundColor Gray
                Invoke-Expression $ghCommand
            }
            $inGhCommand = $false
            $ghCommand = ""
        }
    }
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "모든 이슈 생성 완료!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

# 생성된 이슈 목록 표시
Write-Host "생성된 이슈 목록:" -ForegroundColor Cyan
gh issue list --limit 30
