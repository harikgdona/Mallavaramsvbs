#Requires -Version 5.1
<#
.SYNOPSIS
  Export your browser's Configure changes and publish them to GitHub Pages.

.DESCRIPTION
  Full pipeline:
    1. npm install (unless -SkipNpmInstall)
    2. Start `next dev` on localhost:3000 (so Playwright reads YOUR localStorage)
    3. Run export-site-bundle (Playwright logs in headlessly, reads localStorage)
    4. Stop the dev server
    5. Run publish-site (updates lib files, git commit, git push)

  Prerequisites:
    - .env.local must have MALLAVARAM_ADMIN_USER and MALLAVARAM_ADMIN_PASSWORD set
    - MALLAVARAM_SITE_URL=http://localhost:3000 in .env.local (already set)
    - You must have made and SAVED your changes in the Configure page
      (each section has a Save button -- click it before running this script)
    - Git must be authenticated (run `git push` manually once if unsure)
    - Playwright Chromium must be installed: npx playwright install chromium

.PARAMETER RepoRoot
  Path to the git repo. Default: parent folder of this script.

.PARAMETER SkipNpmInstall
  Skip npm ci (faster if deps are already installed).

.PARAMETER DevPort
  Port for the local dev server. Default: 3000.

.EXAMPLE
  .\scripts\Deploy-MallavaramSite.ps1

.EXAMPLE
  .\scripts\Deploy-MallavaramSite.ps1 -SkipNpmInstall
#>

param(
    [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot),
    [switch]$SkipNpmInstall,
    [int]$DevPort = 3000
)

$ErrorActionPreference = "Stop"

$packageJson = Join-Path $RepoRoot "package.json"
if (-not (Test-Path $packageJson)) {
    Write-Error "Not a project root: missing package.json at $RepoRoot"
}

Write-Host ""
Write-Host "=== Mallavaram site deploy ===" -ForegroundColor Cyan
Write-Host "Repo : $RepoRoot"
Write-Host "Port : $DevPort"
Write-Host ""

$devProcess = $null
$devWasAlreadyRunning = $false

function Test-PortOpen([int]$port) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:$port" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
        return $r.StatusCode -lt 500
    } catch {
        return $false
    }
}

function Stop-DevServer {
    if ($null -ne $devProcess -and -not $devProcess.HasExited) {
        Write-Host ""
        Write-Host "Stopping dev server (PID $($devProcess.Id))..." -ForegroundColor DarkGray
        Stop-Process -Id $devProcess.Id -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }
    # Also kill anything still holding the port
    try {
        $portProcs = Get-NetTCPConnection -LocalPort $DevPort -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty OwningProcess -ErrorAction SilentlyContinue |
            Sort-Object -Unique
        foreach ($pid in $portProcs) {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    } catch { }
}

try {
    Push-Location $RepoRoot

    # ── 1. npm install ──────────────────────────────────────────────────────
    if (-not $SkipNpmInstall) {
        Write-Host "[1/4] npm ci ..." -ForegroundColor Yellow
        if (Test-Path (Join-Path $RepoRoot "package-lock.json")) {
            & npm ci
        } else {
            & npm install
        }
        if ($LASTEXITCODE -ne 0) { Write-Error "npm install failed." }
    } else {
        Write-Host "[1/4] Skipping npm install (-SkipNpmInstall)" -ForegroundColor DarkGray
    }

    # ── 2. Start dev server (if not already running) ────────────────────────
    Write-Host ""
    Write-Host "[2/4] Checking for dev server on port $DevPort ..." -ForegroundColor Yellow

    if (Test-PortOpen $DevPort) {
        Write-Host "      Dev server already running on port $DevPort — reusing it." -ForegroundColor Green
        $devWasAlreadyRunning = $true
    } else {
        Write-Host "      Starting Next.js dev server on port $DevPort ..." -ForegroundColor Yellow

        # On Windows, npm is a .cmd file — must use cmd /c to launch it as a process
        $devProcess = Start-Process `
            -FilePath "cmd.exe" `
            -ArgumentList "/c", "npm run dev -- --port $DevPort" `
            -WorkingDirectory $RepoRoot `
            -PassThru `
            -WindowStyle Hidden

        Write-Host "      Dev server PID: $($devProcess.Id)"
        Write-Host "      Waiting for http://localhost:$DevPort to be ready (up to 90s)..."

        $ready = $false
        $deadline = (Get-Date).AddSeconds(90)
        while ((Get-Date) -lt $deadline) {
            if (Test-PortOpen $DevPort) { $ready = $true; break }
            Start-Sleep -Seconds 2
        }

        if (-not $ready) {
            Write-Error "Dev server did not become ready within 90 seconds. Check that port $DevPort is free and that `npm run dev` works manually."
        }
        Write-Host "      Dev server is ready." -ForegroundColor Green
    }

    # ── 3. Export from browser localStorage ────────────────────────────────
    Write-Host ""
    Write-Host "[3/4] Exporting Configure data from your browser localStorage ..." -ForegroundColor Yellow
    Write-Host "      (Playwright opens localhost:$DevPort, logs in, reads your saved settings)"
    Write-Host ""

    & npm run export-site-bundle
    if ($LASTEXITCODE -ne 0) {
        Write-Error "export-site-bundle failed.`nCheck:`n  1. .env.local has correct MALLAVARAM_ADMIN_USER and MALLAVARAM_ADMIN_PASSWORD`n  2. Playwright Chromium is installed: npx playwright install chromium`n  3. You clicked Save in each Configure section before running this script`n  4. See export-login-debug.png in the repo root for a screenshot of the failure"
    }

    # ── 4. Publish (commit + push) ──────────────────────────────────────────
    Write-Host ""
    Write-Host "[4/4] Publishing to GitHub ..." -ForegroundColor Yellow

    & npm run publish-site
    if ($LASTEXITCODE -ne 0) {
        Write-Error "publish-site failed.`nTry: git pull --rebase origin main  then re-run."
    }

    Write-Host ""
    Write-Host "All done! GitHub Actions will deploy your changes in ~1-2 minutes." -ForegroundColor Green
    Write-Host "Live site: https://mallavaramsvbs.org" -ForegroundColor Cyan

} finally {
    if (-not $devWasAlreadyRunning) {
        Stop-DevServer
    }
    Pop-Location
}
