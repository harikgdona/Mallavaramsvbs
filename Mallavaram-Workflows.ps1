#Requires -Version 5.1
<#
.SYNOPSIS
  Mallavaram website - one entry point for local dev and Configure -> deploy workflows.

.DESCRIPTION
  Pick exactly ONE mode (mutually exclusive switches). Older short names still work as aliases.

  1) -RunWebsiteLocally  (alias: -LocalDev)
     Run Next.js locally and test in your browser (http://localhost:3000).

  2) -MergeDownloadedBundleIntoLibNoGit  (alias: -ApplyConfigureLocal)
     Runs npm run publish-site:local (merge bundle into lib/, no Git), then npm run build by default so static output
     matches the new lib/ files. Use -SkipProductionBuildAfterLibMerge to skip the build (faster).
     Bundle file: prefers %USERPROFILE%\Downloads\site-bundle-from-browser.json (typical after "Download for deploy"
     from localhost OR https://Mallavaramsvbs.org Configure). Falls back to repo root if Downloads has no file.
     Optional: -ConfigureBundleJsonPath "C:\full\path\export.json"
     Note: This script cannot restart npm run dev in another terminal; if you use dev mode, restart that window after merge.

  3) -MergeDownloadedBundleAndPushToGitHub  (alias: -PublishConfigureToGit)
     Same bundle resolution as (2); runs npm run publish-site (commit + push). GitHub Actions updates the public site.

  4) -PlaywrightExportThenPushToGitHub  (alias: -ExportBundleFromBrowser)  [advanced]
     When you prefer NOT to use "Download for deploy": Playwright opens the site, reads localStorage, writes
     site-bundle-from-browser.json, then runs publish-site (commit + push). Requires .env.local admin creds.
     Use -AutoStartDevServerIfLocalhost if MALLAVARAM_SITE_URL is localhost and dev is not already running.

.PARAMETER WebsiteProjectRoot
  Git repo root. Default: folder containing this script.  (Alias: RepoRoot)

.PARAMETER InstallNpmPackagesFirst
  (-RunWebsiteLocally) Run npm ci / npm install before starting dev.  (Alias: Install)

.PARAMETER ListenOnLocalNetwork
  (-RunWebsiteLocally) Bind 0.0.0.0 and print LAN URLs (npm run dev:lan).  (Alias: Lan)

.PARAMETER SkipNpmInstall
  Skip npm ci before publish/export steps.

.PARAMETER SkipPlaywrightChromiumInstall
  (-PlaywrightExportThenPushToGitHub) Skip npx playwright install chromium.  (Alias: SkipPlaywrightInstall)

.PARAMETER AutoStartDevServerIfLocalhost
  (-PlaywrightExportThenPushToGitHub) Start npm run dev in background, export, then stop dev (localhost only).  (Alias: StartDevServer)

.PARAMETER PlaywrightExportLogFile
  (-PlaywrightExportThenPushToGitHub) Append timestamped lines to this file.  (Alias: LogFile)

.PARAMETER ConfigureBundleJsonPath
  (-MergeDownloadedBundleIntoLibNoGit / -MergeDownloadedBundleAndPushToGitHub) Full path to a bundle JSON.
  When omitted, uses Downloads first, then repo root.  (Alias: BundlePath)

.PARAMETER SkipProductionBuildAfterLibMerge
  (-MergeDownloadedBundleIntoLibNoGit) Do not run npm run build after merging (default is to run build).  (Alias: SkipBuildAfterLibMerge)

.EXAMPLE
  .\Mallavaram-Workflows.ps1 -RunWebsiteLocally
.EXAMPLE
  .\Mallavaram-Workflows.ps1 -RunWebsiteLocally -InstallNpmPackagesFirst -ListenOnLocalNetwork
.EXAMPLE
  .\Mallavaram-Workflows.ps1 -MergeDownloadedBundleIntoLibNoGit
.EXAMPLE
  .\Mallavaram-Workflows.ps1 -MergeDownloadedBundleIntoLibNoGit -SkipProductionBuildAfterLibMerge
.EXAMPLE
  .\Mallavaram-Workflows.ps1 -MergeDownloadedBundleAndPushToGitHub
.EXAMPLE
  .\Mallavaram-Workflows.ps1 -MergeDownloadedBundleAndPushToGitHub -ConfigureBundleJsonPath "C:\Users\Me\Downloads\site-bundle-from-browser.json"
.EXAMPLE
  .\Mallavaram-Workflows.ps1 -PlaywrightExportThenPushToGitHub -AutoStartDevServerIfLocalhost
#>

[CmdletBinding(DefaultParameterSetName = 'Menu')]
param(
    [Parameter(ParameterSetName = 'RunWebsiteLocally', Mandatory = $true)]
    [Alias('LocalDev')]
    [switch]$RunWebsiteLocally,

    [Parameter(ParameterSetName = 'MergeDownloadedBundleIntoLibNoGit', Mandatory = $true)]
    [Alias('ApplyConfigureLocal')]
    [switch]$MergeDownloadedBundleIntoLibNoGit,

    [Parameter(ParameterSetName = 'MergeDownloadedBundleAndPushToGitHub', Mandatory = $true)]
    [Alias('PublishConfigureToGit')]
    [switch]$MergeDownloadedBundleAndPushToGitHub,

    [Parameter(ParameterSetName = 'PlaywrightExportThenPushToGitHub', Mandatory = $true)]
    [Alias('ExportBundleFromBrowser')]
    [switch]$PlaywrightExportThenPushToGitHub,

    [Alias('RepoRoot')]
    [string]$WebsiteProjectRoot = "",

    [Parameter(ParameterSetName = 'RunWebsiteLocally')]
    [Alias('Install')]
    [switch]$InstallNpmPackagesFirst,

    [Parameter(ParameterSetName = 'RunWebsiteLocally')]
    [Alias('Lan')]
    [switch]$ListenOnLocalNetwork,

    [Parameter(ParameterSetName = 'MergeDownloadedBundleIntoLibNoGit')]
    [Parameter(ParameterSetName = 'MergeDownloadedBundleAndPushToGitHub')]
    [Parameter(ParameterSetName = 'PlaywrightExportThenPushToGitHub')]
    [switch]$SkipNpmInstall,

    [Parameter(ParameterSetName = 'PlaywrightExportThenPushToGitHub')]
    [Alias('SkipPlaywrightInstall')]
    [switch]$SkipPlaywrightChromiumInstall,

    [Parameter(ParameterSetName = 'PlaywrightExportThenPushToGitHub')]
    [Alias('StartDevServer')]
    [switch]$AutoStartDevServerIfLocalhost,

    [Parameter(ParameterSetName = 'PlaywrightExportThenPushToGitHub')]
    [Alias('LogFile')]
    [string]$PlaywrightExportLogFile = "",

    [Parameter(ParameterSetName = 'MergeDownloadedBundleIntoLibNoGit')]
    [Parameter(ParameterSetName = 'MergeDownloadedBundleAndPushToGitHub')]
    [Alias('BundlePath')]
    [string]$ConfigureBundleJsonPath = "",

    [Parameter(ParameterSetName = 'MergeDownloadedBundleIntoLibNoGit')]
    [Alias('SkipBuildAfterLibMerge')]
    [switch]$SkipProductionBuildAfterLibMerge
)

# $PSScriptRoot is not always set when the default param value is bound; resolve after param.
if ([string]::IsNullOrWhiteSpace($WebsiteProjectRoot)) {
    $WebsiteProjectRoot = Split-Path -Parent $PSCommandPath
}
if ([string]::IsNullOrWhiteSpace($WebsiteProjectRoot)) {
    Write-Error "Could not determine project folder. Pass -WebsiteProjectRoot (or -RepoRoot) explicitly."
}

$ErrorActionPreference = "Stop"

$script:LogFile = $PlaywrightExportLogFile
$script:DevServerStarted = $false
$script:DevServerRootProcessId = $null

function Write-Step {
    param([string]$Message)
    $line = "[{0:yyyy-MM-dd HH:mm:ss}] {1}" -f (Get-Date), $Message
    Write-Host $line
    if ($script:LogFile -ne "") {
        Add-Content -LiteralPath $script:LogFile -Value $line -Encoding UTF8
    }
}

function Get-MallavaramSiteUrlFromEnvLocal {
    param([string]$Root)
    $p = Join-Path $Root ".env.local"
    if (-not (Test-Path -LiteralPath $p)) { return $null }
    foreach ($line in Get-Content -LiteralPath $p -Encoding UTF8) {
        $t = $line.Trim()
        if ($t -match '^\s*#' -or $t -eq '') { continue }
        if ($t -match '^\s*MALLAVARAM_SITE_URL\s*=\s*(.+)$') {
            return $matches[1].Trim().Trim('"').Trim([char]39)
        }
    }
    return $null
}

function Test-MallavaramDevServerUp {
    param([string]$BaseUrl = "http://127.0.0.1:3000/")
    try {
        $r = Invoke-WebRequest -Uri $BaseUrl -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
        return ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500)
    }
    catch {
        return $false
    }
}

function Start-MallavaramDevServerBackground {
    param([string]$Root)
    $log = Join-Path $Root ".deploy-next-dev.log"
    if (Test-Path -LiteralPath $log) {
        Remove-Item -LiteralPath $log -Force -ErrorAction SilentlyContinue
    }
    Write-Step "Starting background: npm run dev (log: $log)"
    $cmdLine = "npm run dev > `"$log`" 2>&1"
    $p = Start-Process -FilePath "cmd.exe" `
        -ArgumentList @('/c', $cmdLine) `
        -WorkingDirectory $Root `
        -WindowStyle Minimized `
        -PassThru
    if (-not $p) { Write-Error "Failed to start npm run dev" }
    $script:DevServerRootProcessId = $p.Id
    $script:DevServerStarted = $true
    for ($i = 0; $i -lt 120; $i++) {
        if (Test-MallavaramDevServerUp) {
            Write-Step "Dev server responded on http://127.0.0.1:3000/ (after ${i}s)"
            return
        }
        Start-Sleep -Seconds 1
    }
    Stop-MallavaramDevServerTree
    Write-Error "Dev server did not become ready within 120s. See log: $log"
}

function Stop-MallavaramDevServerTree {
    if (-not $script:DevServerStarted -or -not $script:DevServerRootProcessId) { return }
    Write-Step "Stopping dev server (PID $($script:DevServerRootProcessId)) ..."
    $null = & taskkill.exe /PID $script:DevServerRootProcessId /T /F 2>&1
    $script:DevServerStarted = $false
    $script:DevServerRootProcessId = $null
}

function Resolve-SiteBundlePathForPublish {
    param(
        [string]$Root,
        [string]$ExplicitPath = ""
    )
    $bundleName = "site-bundle-from-browser.json"
    $inDownloads = Join-Path $HOME "Downloads\$bundleName"
    $inRoot = Join-Path $Root $bundleName

    if (-not [string]::IsNullOrWhiteSpace($ExplicitPath)) {
        if (Test-Path -LiteralPath $ExplicitPath) {
            $resolved = (Resolve-Path -LiteralPath $ExplicitPath).Path
            Write-Host "Using bundle (-ConfigureBundleJsonPath): $resolved" -ForegroundColor Green
            return $resolved
        }
        Write-Error "Bundle not found at -ConfigureBundleJsonPath: $ExplicitPath"
    }

    if (Test-Path -LiteralPath $inDownloads) {
        $resolved = (Resolve-Path -LiteralPath $inDownloads).Path
        Write-Host "Using bundle (Downloads): $resolved" -ForegroundColor Green
        return $resolved
    }

    if (Test-Path -LiteralPath $inRoot) {
        $resolved = (Resolve-Path -LiteralPath $inRoot).Path
        Write-Host "Using bundle (repo root): $resolved" -ForegroundColor Yellow
        Write-Host "Tip: browser exports usually go to Downloads; that path is preferred when both exist." -ForegroundColor DarkGray
        return $resolved
    }

    Write-Host ""
    Write-Host "Missing $bundleName" -ForegroundColor Red
    Write-Host "  On http://localhost:3000 or https://Mallavaramsvbs.org -> Configure:" -ForegroundColor Yellow
    Write-Host "  1) Save each section you changed" -ForegroundColor Yellow
    Write-Host "  2) Click 'Download for deploy' (saves to Downloads as $bundleName)" -ForegroundColor Yellow
    Write-Host "  3) Re-run this workflow, or pass -ConfigureBundleJsonPath (-BundlePath), or place the file at:" -ForegroundColor Yellow
    Write-Host "     $inDownloads" -ForegroundColor Gray
    Write-Host "     or $inRoot" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

function Show-Menu {
    Write-Host ""
    Write-Host "Mallavaram-Workflows.ps1 - choose one mode:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  1. Local dev (browser test):" -ForegroundColor White
    Write-Host "     .\Mallavaram-Workflows.ps1 -RunWebsiteLocally" -ForegroundColor Gray
    Write-Host "     .\Mallavaram-Workflows.ps1 -RunWebsiteLocally -InstallNpmPackagesFirst -ListenOnLocalNetwork   # deps + phone/Wi-Fi" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  2. Downloaded bundle -> lib/ + npm run build (no Git; use -SkipProductionBuildAfterLibMerge to skip build):" -ForegroundColor White
    Write-Host "     .\Mallavaram-Workflows.ps1 -MergeDownloadedBundleIntoLibNoGit" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  3. Downloaded bundle -> lib/ + Git push -> live site:" -ForegroundColor White
    Write-Host "     .\Mallavaram-Workflows.ps1 -MergeDownloadedBundleAndPushToGitHub" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  4. Playwright export + Git push (needs .env.local):" -ForegroundColor White
    Write-Host "     .\Mallavaram-Workflows.ps1 -PlaywrightExportThenPushToGitHub -AutoStartDevServerIfLocalhost" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  (Older names still work: -LocalDev, -ApplyConfigureLocal, -PublishConfigureToGit, -ExportBundleFromBrowser)" -ForegroundColor DarkGray
    Write-Host ""
}

# --- validate repo ---
$RepoRoot = $WebsiteProjectRoot
$packageJson = Join-Path $RepoRoot "package.json"
if (-not (Test-Path -LiteralPath $packageJson)) {
    Write-Error "Not a project root: missing package.json at $RepoRoot"
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm not found. Install Node.js LTS."
}

if ($PSCmdlet.ParameterSetName -eq 'Menu') {
    Show-Menu
    exit 0
}

Push-Location $RepoRoot
try {
    if ($RunWebsiteLocally) {
        Write-Host ""
        Write-Host "=== [1] Local dev - open http://localhost:3000 ===" -ForegroundColor Cyan
        $nodeModules = Join-Path $RepoRoot "node_modules"
        $needInstall = $InstallNpmPackagesFirst -or -not (Test-Path $nodeModules)
        if ($needInstall) {
            if (Test-Path (Join-Path $RepoRoot "package-lock.json")) {
                Write-Host "npm ci ..." -ForegroundColor Yellow
                npm ci
            }
            else {
                npm install
            }
            if ($LASTEXITCODE -ne 0) { Write-Error "npm install failed." }
        }
        if ($ListenOnLocalNetwork) {
            Write-Host "LAN: use http://<your-PC-IP>:3000 (see npm output). npm run dev:lan" -ForegroundColor Yellow
            try {
                $lanIps = @(
                    Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
                    Where-Object {
                        $_.IPAddress -notlike '127.*' -and
                        $_.IPAddress -match '^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)'
                    } |
                    Select-Object -ExpandProperty IPAddress -Unique
                )
                foreach ($ip in $lanIps) {
                    Write-Host ("  http://{0}:3000" -f $ip) -ForegroundColor Green
                }
                if ($lanIps.Count -gt 0) {
                    $env:NEXT_DEV_EXTRA_ORIGINS = ($lanIps -join ",")
                }
            }
            catch { }
            npm run dev:lan
        }
        else {
            Write-Host "Starting http://localhost:3000 (Ctrl+C to stop) ..." -ForegroundColor Yellow
            npm run dev
        }
        exit 0
    }

    if ($MergeDownloadedBundleIntoLibNoGit) {
        Write-Host ""
        Write-Host "=== [2] publish-site:local (bundle -> lib/, no Git) ===" -ForegroundColor Cyan
        $bundleFile = Resolve-SiteBundlePathForPublish -Root $RepoRoot -ExplicitPath $ConfigureBundleJsonPath
        if (-not $SkipNpmInstall) {
            if (Test-Path (Join-Path $RepoRoot "package-lock.json")) { npm ci } else { npm install }
            if ($LASTEXITCODE -ne 0) { Write-Error "npm failed." }
        }
        npm run publish-site:local -- "--file=$bundleFile"
        if ($LASTEXITCODE -ne 0) { Write-Error "publish-site:local failed." }

        if (-not $SkipProductionBuildAfterLibMerge) {
            Write-Host ""
            Write-Host "=== npm run build (static export uses updated lib/) ===" -ForegroundColor Cyan
            npm run build
            if ($LASTEXITCODE -ne 0) { Write-Error "npm run build failed." }
            Write-Host ""
            Write-Host "Build finished. Output is in the out\ folder." -ForegroundColor Green
        }
        else {
            Write-Host ""
            Write-Host "Skipped npm run build (-SkipProductionBuildAfterLibMerge)." -ForegroundColor Yellow
        }

        if (Test-MallavaramDevServerUp) {
            Write-Host ""
            Write-Host "npm run dev appears to be running: in that terminal press Ctrl+C, then npm run dev again so dev mode reloads lib/." -ForegroundColor Yellow
        }
        elseif (-not $SkipProductionBuildAfterLibMerge) {
            Write-Host "To preview like dev: npm run dev (restart if it was already running before the merge)." -ForegroundColor DarkGray
        }
        else {
            Write-Host "Run npm run build or restart npm run dev to pick up updated lib/." -ForegroundColor DarkGray
        }

        Write-Host ""
        Write-Host "Done." -ForegroundColor Green
        exit 0
    }

    if ($MergeDownloadedBundleAndPushToGitHub) {
        Write-Host ""
        Write-Host "=== [3] publish-site (bundle -> lib/ + Git push -> GitHub Pages) ===" -ForegroundColor Cyan
        $bundleFile = Resolve-SiteBundlePathForPublish -Root $RepoRoot -ExplicitPath $ConfigureBundleJsonPath
        if (-not $SkipNpmInstall) {
            if (Test-Path (Join-Path $RepoRoot "package-lock.json")) { npm ci } else { npm install }
            if ($LASTEXITCODE -ne 0) { Write-Error "npm failed." }
        }
        npm run publish-site -- "--file=$bundleFile"
        if ($LASTEXITCODE -ne 0) {
            Write-Error "publish-site failed. Try: git pull --rebase origin main"
        }
        Write-Host ""
        Write-Host "Done. Wait for GitHub Actions, then refresh the live site." -ForegroundColor Green
        exit 0
    }

    if ($PlaywrightExportThenPushToGitHub) {
        Write-Host ""
        Write-Host "=== [4] Playwright export + publish-site (Git push) ===" -ForegroundColor Cyan
        if ($PlaywrightExportLogFile -ne "") {
            $dir = Split-Path -Parent $PlaywrightExportLogFile
            if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
            Write-Step "--- export log start ---"
        }
        if (-not $SkipNpmInstall) {
            if (Test-Path (Join-Path $RepoRoot "package-lock.json")) { npm ci } else { npm install }
            if ($LASTEXITCODE -ne 0) { Write-Error "npm failed." }
        }
        if (-not $SkipPlaywrightChromiumInstall) {
            npx playwright install chromium
            if ($LASTEXITCODE -ne 0) { Write-Error "playwright install failed." }
        }
        $env:MALLAVARAM_EXPORT_VERBOSE = "1"
        $env:MALLAVARAM_PUBLISH_VERBOSE = "1"

        $siteUrl = Get-MallavaramSiteUrlFromEnvLocal -Root $RepoRoot
        $localHostPattern = "^\s*https?://(localhost|127\.0\.0\.1)\b"
        $wantsLocal = $siteUrl -and ($siteUrl -match $localHostPattern)
        if ($wantsLocal) {
            if (-not (Test-MallavaramDevServerUp)) {
                if ($AutoStartDevServerIfLocalhost) {
                    Start-MallavaramDevServerBackground -Root $RepoRoot
                }
                else {
                    Write-Error (
                        "Next.js not running on port 3000. Either run .\Mallavaram-Workflows.ps1 -RunWebsiteLocally (-LocalDev) in another window, " +
                        "then re-run -PlaywrightExportThenPushToGitHub (-ExportBundleFromBrowser), or add -AutoStartDevServerIfLocalhost (-StartDevServer)."
                    )
                }
            }
        }

        try {
            npm run deploy-from-browser
            if ($LASTEXITCODE -ne 0) { Write-Error "deploy-from-browser failed." }
        }
        finally {
            Stop-MallavaramDevServerTree
        }
        Write-Host ""
        Write-Host "Done (export + git push)." -ForegroundColor Green
        exit 0
    }
}
finally {
    Pop-Location
}
