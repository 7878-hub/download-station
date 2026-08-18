<#
.SYNOPSIS
    下载站一键更新脚本
.DESCRIPTION
    1. 扫描 downloads 目录，自动更新 files.json
    2. 自动 git add / commit / push 到 GitHub
    3. GitHub Pages 会在 1 分钟内自动更新
#>

# 改成 Continue，警告不会中断脚本
$ErrorActionPreference = "Continue"
$repoPath = $PSScriptRoot

Set-Location $repoPath

# 抑制 git 自身的 CRLF 警告
$env:GIT_PAGER = "cat"
git config core.autocrlf false 2>$null | Out-Null

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "       下载站一键更新工具" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# --- 第一步：扫描文件，更新 files.json ---
$downloadsPath = Join-Path $repoPath "downloads"
$jsonPath = Join-Path $repoPath "files.json"

if (-not (Test-Path $downloadsPath)) {
    Write-Host "[X] downloads 目录不存在！" -ForegroundColor Red
    Read-Host "按回车退出"
    exit 1
}

$files = Get-ChildItem -Path $downloadsPath -File | ForEach-Object {
    [PSCustomObject]@{
        name = $_.Name
        size = $_.Length
        date = $_.LastWriteTime.ToString("yyyy-MM-ddTHH:mm:ss")
        path = "downloads/" + [uri]::EscapeDataString($_.Name)
    }
} | Sort-Object { [DateTime]$_.date } -Descending

if ($files.Count -eq 0) {
    Write-Host "[!] downloads 目录是空的，没文件可更新" -ForegroundColor Yellow
    Read-Host "按回车退出"
    exit 0
}

$json = $files | ConvertTo-Json -Depth 3
if ($files.Count -eq 1) {
    $json = "[$json]"
}
$json | Out-File -FilePath $jsonPath -Encoding UTF8 -NoNewline

$totalSize = [math]::Round(($files | Measure-Object -Property size -Sum).Sum / 1MB, 2)
Write-Host "[OK] files.json 已更新" -ForegroundColor Green
Write-Host "     文件数量: $($files.Count) 个" -ForegroundColor White
Write-Host "     总大小:   $totalSize MB" -ForegroundColor White
Write-Host ""

# --- 第二步：Git 提交并推送 ---
Write-Host "--- 正提交到 GitHub ---" -ForegroundColor Cyan

# 检查有没有改动
$status = & git status --porcelain 2>$null
if (-not $status) {
    Write-Host "[OK] 没有新的改动，网站已是最新" -ForegroundColor Green
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "  完成！网站地址:" -ForegroundColor Green
    Write-Host "  https://7878-hub.github.io/download-station/" -ForegroundColor Yellow
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "按回车退出"
    exit 0
}

# Git add - 用 2>$null 抑制警告
Write-Host "[..] 暂存改动..." -ForegroundColor Yellow
& git add . 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[X] git add 失败" -ForegroundColor Red
    Read-Host "按回车退出"
    exit 1
}
Write-Host "[OK] 已暂存改动" -ForegroundColor Green

# Git commit
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMsg = "更新文件 - $timestamp (共 $($files.Count) 个文件)"
& git commit -m $commitMsg 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[X] git commit 失败" -ForegroundColor Red
    Read-Host "按回车退出"
    exit 1
}
Write-Host "[OK] 已提交: $commitMsg" -ForegroundColor Green

# Git push
Write-Host "[..] 正在推送到 GitHub..." -ForegroundColor Yellow
$pushOutput = & git push origin main 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] 推送成功！" -ForegroundColor Green
} else {
    Write-Host "[X] 推送失败！" -ForegroundColor Red
    Write-Host "    错误信息: $pushOutput" -ForegroundColor Red
    Write-Host ""
    Write-Host "    可能原因: 网络问题（GitHub 访问慢/被墙）" -ForegroundColor Yellow
    Write-Host "    解决: 打开 Watt Toolkit 加速 GitHub 后重试" -ForegroundColor Yellow
    Write-Host "    或者: 打开 GitHub Desktop 手动点 Push origin" -ForegroundColor Yellow
    Read-Host "按回车退出"
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  全部完成！网站会在 1 分钟内更新" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  网站地址:" -ForegroundColor White
Write-Host "  https://7878-hub.github.io/download-station/" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  提示: 如果打不开网站，可能是网络问题" -ForegroundColor DarkGray
Write-Host "  用 Watt Toolkit 加速 GitHub 即可" -ForegroundColor DarkGray
Write-Host ""
Read-Host "按回车退出"
