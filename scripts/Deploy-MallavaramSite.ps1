#Requires -Version 5.1
<#
.SYNOPSIS
  Publish your Configure changes to GitHub Pages.

.DESCRIPTION
  1. Checks for uncommitted code changes and asks permission to commit them
  2. Looks for site-bundle-from-browser.json in the project root or Downloads
  3. Runs npm run publish-site (updates lib files, git commit, git push)
  4. GitHub Actions builds and deploys the live site in about 1-2 minutes

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
    # 0. Check for uncommitted code changes
    Write-Host "[0/3] Checking for uncommitted code changes..." -ForegroundColor Yellow

    $gitStatus = & git status --porcelain 2>&1
    # Filter out the bundle/content files that publish-site handles itself
    $managedFiles = @(
        "lib/publicSiteContent.json",
        "lib/siteManualSchema.ts",
        "site-bundle-from-browser.json"
    )
    $pendingLines = $gitStatus | Where-Object {
        $line = $_.Trim()
        if ($line -eq "") { return $false }
        $filePath = $line.Substring(3).Trim().Replace("/", "\")
        foreach ($managed in $managedFiles) {
            if ($filePath -eq $managed.Replace("/", "\")) { return $false }
        }
        return $true
    }

    if ($pendingLines.Count -gt 0) {
        Write-Host ""
        Write-Host "WARNING: You have uncommitted code changes that are NOT yet on GitHub:" -ForegroundColor Yellow
        Write-Host ""
        foreach ($line in $pendingLines) {
            Write-Host "  $line" -ForegroundColor White
        }
        Write-Host ""
        Write-Host "If you skip this, the live site will be built WITHOUT these changes." -ForegroundColor Red
        Write-Host ""
        $answer = Read-Host "Commit these changes now before deploying? (Y/N)"
        if ($answer -match "^[Yy]") {
            $commitMsg = Read-Host "Enter a commit message (or press Enter for default)"
            if ([string]::IsNullOrWhiteSpace($commitMsg)) {
                $commitMsg = "chore: commit pending code changes before content deploy"
            }
            & git add -A
            & git commit -m $commitMsg
            if ($LASTEXITCODE -ne 0) { Write-Error "git commit failed." }
            & git push
            if ($LASTEXITCODE -ne 0) { Write-Error "git push failed. Try: git pull --rebase origin main  then re-run." }
            Write-Host "Code changes committed and pushed." -ForegroundColor Green
        } else {
            Write-Host "Skipping code commit. Proceeding with content deploy only." -ForegroundColor DarkGray
        }
    } else {
        Write-Host "No uncommitted code changes found." -ForegroundColor Green
    }

    # 1. npm install
    Write-Host ""
    if (-not $SkipNpmInstall) {
        Write-Host "[1/3] npm ci ..." -ForegroundColor Yellow
        if (Test-Path (Join-Path $RepoRoot "package-lock.json")) {
            & npm ci
        } else {
            & npm install
        }
        if ($LASTEXITCODE -ne 0) { Write-Error "npm install failed." }
    } else {
        Write-Host "[1/3] Skipping npm install (-SkipNpmInstall)" -ForegroundColor DarkGray
    }

    # 2. Find the bundle file
    $bundleName        = "site-bundle-from-browser.json"
    $bundleInRoot      = Join-Path $RepoRoot $bundleName
    $bundleInDownloads = Join-Path $HOME "Downloads\$bundleName"

    Write-Host ""
    Write-Host "[2/3] Looking for $bundleName ..." -ForegroundColor Yellow

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
    Write-Host "[3/3] Publishing content to GitHub ..." -ForegroundColor Yellow

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
