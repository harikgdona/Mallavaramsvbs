#Requires -Version 5.1
<#
.SYNOPSIS
  One-shot: install deps, Playwright Chromium, export Configure data, publish (commit + push).

.DESCRIPTION
  Expects admin credentials in .env.local (copy from .env.example). Never commit .env.local.
  Sets MALLAVARAM_EXPORT_VERBOSE and MALLAVARAM_PUBLISH_VERBOSE so npm steps print detailed lines.

.PARAMETER SkipNpmInstall
  Skip npm ci / npm install (use when dependencies are already installed).

.PARAMETER SkipPlaywrightInstall
  Skip npx playwright install chromium (use when browsers are already installed).

.PARAMETER LogFile
  Optional path to append the same timestamped lines (e.g. .\deploy-log.txt).

.EXAMPLE
  .\Deploy-Mallavaram.ps1
.EXAMPLE
  .\Deploy-Mallavaram.ps1 -LogFile .\deploy-log.txt
#>

param(
    [switch]$SkipNpmInstall,
    [switch]$SkipPlaywrightInstall,
    [string]$LogFile = ""
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    $line = "[{0:yyyy-MM-dd HH:mm:ss}] {1}" -f (Get-Date), $Message
    Write-Host $line
    if ($script:LogFile -ne "") {
        Add-Content -LiteralPath $script:LogFile -Value $line -Encoding UTF8
    }
}

$RepoRoot = $PSScriptRoot
$packageJson = Join-Path $RepoRoot "package.json"

if (-not (Test-Path $packageJson)) {
    Write-Error "Expected package.json next to this script at: $RepoRoot"
}

if ($LogFile -ne "") {
    $dir = Split-Path -Parent $LogFile
    if ($dir -and -not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    Write-Step "--- Mallavaram deploy log start ---"
}

$envLocal = Join-Path $RepoRoot ".env.local"
$envExample = Join-Path $RepoRoot ".env.example"

Write-Step "Repo: $RepoRoot"
if (Test-Path $envLocal) {
    Write-Step "Found .env.local (contents not shown; never paste secrets)."
    try {
        Get-Content -LiteralPath $envLocal -Encoding UTF8 | ForEach-Object {
            $t = $_.Trim()
            if ($t -match '^\s*#' -or $t -eq '') { return }
            if ($t -match '^\s*(MALLAVARAM_SITE_URL|MALLAVARAM_ADMIN_USER|MALLAVARAM_EXPORT_HEADED|MALLAVARAM_PUBLISH_VERBOSE|MALLAVARAM_ADMIN_PASSWORD_FILE)\s*=') {
                if ($t -match 'MALLAVARAM_ADMIN_USER\s*=') {
                    $v = ($t -split '=', 2)[1].Trim().Trim('"').Trim([char]39)
                    Write-Step "  .env.local MALLAVARAM_ADMIN_USER=$v"
                }
                elseif ($t -match 'MALLAVARAM_SITE_URL\s*=') {
                    $v = ($t -split '=', 2)[1].Trim().Trim('"').Trim([char]39)
                    Write-Step ('  .env.local MALLAVARAM_SITE_URL=' + $v + ' (script appends hash configure if missing)')
                }
                elseif ($t -match 'MALLAVARAM_ADMIN_PASSWORD_FILE\s*=') {
                    Write-Step "  .env.local MALLAVARAM_ADMIN_PASSWORD_FILE=(set)"
                }
            }
        }
    }
    catch {
        Write-Warning "Could not parse .env.local for display: $_"
    }
}
else {
    Write-Warning "No .env.local - create from .env.example"
    if (Test-Path $envExample) {
        Write-Step "  Template: $envExample"
    }
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm not found. Install Node.js LTS and retry."
}

$env:MALLAVARAM_EXPORT_VERBOSE = "1"
$env:MALLAVARAM_PUBLISH_VERBOSE = "1"
Write-Step "Environment: MALLAVARAM_EXPORT_VERBOSE=1 MALLAVARAM_PUBLISH_VERBOSE=1"

Push-Location $RepoRoot
try {
    Write-Host ""
    Write-Host "=== Mallavaram one-shot deploy ===" -ForegroundColor Cyan
    Write-Step "Started deploy-from-browser pipeline"

    if (-not $SkipNpmInstall) {
        if (Test-Path (Join-Path $RepoRoot "package-lock.json")) {
            Write-Step "Running npm ci ..."
            npm ci
        }
        else {
            Write-Step "Running npm install ..."
            npm install
        }
        if ($LASTEXITCODE -ne 0) {
            Write-Error "npm install failed (exit $LASTEXITCODE)."
        }
        Write-Step "npm install OK"
    }
    else {
        Write-Step "Skipped npm install (-SkipNpmInstall)"
    }

    if (-not $SkipPlaywrightInstall) {
        Write-Step "Running npx playwright install chromium ..."
        npx playwright install chromium
        if ($LASTEXITCODE -ne 0) {
            Write-Error "playwright install failed (exit $LASTEXITCODE)."
        }
        Write-Step "Playwright Chromium OK"
    }
    else {
        Write-Step "Skipped Playwright install (-SkipPlaywrightInstall)"
    }

    Write-Step "Running npm run deploy-from-browser ..."
    npm run deploy-from-browser
    if ($LASTEXITCODE -ne 0) {
        Write-Error "deploy-from-browser failed (exit $LASTEXITCODE)."
    }
    Write-Step "npm run deploy-from-browser finished (exit 0)"

    $bundle = Join-Path $RepoRoot "site-bundle-from-browser.json"
    if (Test-Path $bundle) {
        $len = (Get-Item $bundle).Length
        Write-Step "site-bundle-from-browser.json size: $len bytes"
    }
    else {
        Write-Step "site-bundle-from-browser.json not found at repo root (ignored by git)"
    }

    Write-Host ""
    Write-Host "Done. After GitHub Actions finishes, refresh the live site." -ForegroundColor Green
    Write-Step "--- Mallavaram deploy log end (success) ---"
}
finally {
    Pop-Location
}
