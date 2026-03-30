#Requires -Version 5.1
<#
.SYNOPSIS
  Publish your Configure changes to GitHub Pages.

.DESCRIPTION
  1. Looks for site-bundle-from-browser.json in the project root or Downloads
  2. Runs npm run publish-site (updates lib files, git commit, git push)
  3. GitHub Actions builds and deploys the live site in about 1-2 minutes

  Before running:
    - In the Configure panel, click Save on each section you changed
    - Click "Download for deploy" at the bottom of Configure
    - The file downloads as site-bundle-from-browser.json
    - Leave it in Downloads OR move it to the project root
    - Then run this script

.PARAMETER RepoRoot
  Path to the git repo. Default: parent folder of this script.

.PARAMETER SkipNpmInstall
  Skip npm ci (faster if deps are already installed).

.EXAMPLE
  .\scripts\Deploy-MallavaramSite.ps1 -SkipNpmInstall
#>

param(
    [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot),
    [switch]$SkipNpmInstall
)

$ErrorActionPreference = "Stop"

$packageJson = Join-Path $RepoRoot "package.json"
if (-not (Test-Path $packageJson)) {
    Write-Error "Not a project root: missing package.json at $RepoRoot"
}

Write-Host ""
Write-Host "=== Mallavaram site deploy ===" -ForegroundColor Cyan
Write-Host "Repo : $RepoRoot"
Write-Host ""

Push-Location $RepoRoot

try {
    # 1. npm install
    if (-not $SkipNpmInstall) {
        Write-Host "[1/2] npm ci ..." -ForegroundColor Yellow
        if (Test-Path (Join-Path $RepoRoot "package-lock.json")) {
            & npm ci
        } else {
            & npm install
        }
        if ($LASTEXITCODE -ne 0) { Write-Error "npm install failed." }
    } else {
        Write-Host "[1/2] Skipping npm install (-SkipNpmInstall)" -ForegroundColor DarkGray
    }

    # 2. Find the bundle file
    $bundleName       = "site-bundle-from-browser.json"
    $bundleInRoot     = Join-Path $RepoRoot $bundleName
    $bundleInDownloads = Join-Path $HOME "Downloads\$bundleName"

    if (Test-Path $bundleInRoot) {
        Write-Host "Found bundle: $bundleInRoot" -ForegroundColor Green
    } elseif (Test-Path $bundleInDownloads) {
        Write-Host "Found bundle in Downloads - copying to project root..." -ForegroundColor Yellow
        Copy-Item $bundleInDownloads $bundleInRoot
        Write-Host "Copied to: $bundleInRoot" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "ERROR: $bundleName not found." -ForegroundColor Red
        Write-Host ""
        Write-Host "Steps to fix:" -ForegroundColor Yellow
        Write-Host "  1. Open the site in your browser and go to the Configure section"
        Write-Host "  2. Click Save on each section you changed"
        Write-Host "  3. Click 'Download for deploy' at the bottom of Configure"
        Write-Host "  4. Re-run this script"
        Write-Host ""
        exit 1
    }

    # 3. Publish
    Write-Host ""
    Write-Host "[2/2] Publishing to GitHub ..." -ForegroundColor Yellow

    & npm run publish-site
    if ($LASTEXITCODE -ne 0) {
        Write-Error "publish-site failed. Try: git pull --rebase origin main  then re-run."
    }

    Write-Host ""
    Write-Host "Done! GitHub Actions will deploy your changes in ~1-2 minutes." -ForegroundColor Green
    $liveUrl = "https://mallavaramsvbs.org"
    Write-Host "Live site: $liveUrl" -ForegroundColor Cyan

} finally {
    Pop-Location
}
