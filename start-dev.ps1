# Quick start: Mallavaram website - Next.js dev server
# Usage: .\start-dev.ps1
# If execution policy blocks scripts: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

if (-not (Test-Path -LiteralPath "node_modules")) {
    Write-Host "node_modules not found - running npm install..." -ForegroundColor Yellow
    npm install
}

Write-Host 'Starting dev server (press Ctrl+C to stop)...' -ForegroundColor Cyan
npm run dev
