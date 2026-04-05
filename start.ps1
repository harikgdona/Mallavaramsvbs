#Requires -Version 5.1
<#
.SYNOPSIS
  Full local startup: ensure dependencies, then run the Next.js dev server.

.PARAMETER Install
  Always run npm ci (or npm install) before starting, even if node_modules exists.

.PARAMETER Lan
  Bind dev server on all interfaces (0.0.0.0). Other devices must open http://<THIS-PC-LAN-IP>:3000
  (never http://0.0.0.0 — that address is not reachable from a phone). Sets NEXT_DEV_EXTRA_ORIGINS from your LAN IPs.

.EXAMPLE
  .\start.ps1
.EXAMPLE
  .\start.ps1 -Install
.EXAMPLE
  .\start.ps1 -Lan
#>

param(
    [switch]$Install,
    [switch]$Lan
)

$ErrorActionPreference = "Stop"
$RepoRoot = $PSScriptRoot
$packageJson = Join-Path $RepoRoot "package.json"
$nodeModules = Join-Path $RepoRoot "node_modules"

if (-not (Test-Path $packageJson)) {
    Write-Error "Expected package.json next to this script: $RepoRoot"
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm not found. Install Node.js LTS from https://nodejs.org/ and retry."
}

Push-Location $RepoRoot
try {
    Write-Host ""
    Write-Host "=== Mallavaram local dev ===" -ForegroundColor Cyan
    Write-Host "Repo: $RepoRoot"
    Write-Host ""

    $needInstall = $Install -or -not (Test-Path $nodeModules)
    if ($needInstall) {
        if (Test-Path (Join-Path $RepoRoot "package-lock.json")) {
            Write-Host "Running npm ci ..." -ForegroundColor Yellow
            npm ci
        }
        else {
            Write-Host "Running npm install ..." -ForegroundColor Yellow
            npm install
        }
        if ($LASTEXITCODE -ne 0) {
            Write-Error "npm failed (exit $LASTEXITCODE)."
        }
        Write-Host "Dependencies OK." -ForegroundColor Green
        Write-Host ""
    }
    else {
        Write-Host "Skipping npm (node_modules present). Use -Install to reinstall." -ForegroundColor DarkGray
        Write-Host ""
    }

    if ($Lan) {
        Write-Host ""
        Write-Host "LAN mode: server listens on all interfaces (0.0.0.0:3000)." -ForegroundColor Yellow
        Write-Host "You cannot open 0.0.0.0 in a browser. On your phone/tablet use one of these:" -ForegroundColor White

        $lanIps = @()
        try {
            $lanIps = @(
                Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
                Where-Object {
                    $_.IPAddress -notlike '127.*' -and
                    $_.IPAddress -match '^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)'
                } |
                Select-Object -ExpandProperty IPAddress -Unique
            )
        }
        catch { }

        if ($lanIps.Count -eq 0) {
            Write-Host "  (Could not auto-detect LAN IP. Run ipconfig and use your Wi-Fi IPv4, e.g. http://192.168.1.42:3000 )" -ForegroundColor DarkGray
        }
        else {
            foreach ($ip in $lanIps) {
                Write-Host ("  http://{0}:3000" -f $ip) -ForegroundColor Green
            }
            $env:NEXT_DEV_EXTRA_ORIGINS = ($lanIps -join ",")
            Write-Host ""
            Write-Host ("NEXT_DEV_EXTRA_ORIGINS={0} (required for Next.js hot reload on LAN)" -f $env:NEXT_DEV_EXTRA_ORIGINS) -ForegroundColor DarkGray
        }

        Write-Host ""
        Write-Host "If the page does not load: Windows Firewall may block port 3000." -ForegroundColor DarkGray
        Write-Host "Allow Node.js or inbound TCP 3000 on Private networks, then retry." -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "Starting npm run dev:lan ..." -ForegroundColor Yellow
        npm run dev:lan
    }
    else {
        Write-Host "Starting dev server at http://localhost:3000 ..." -ForegroundColor Yellow
        npm run dev
    }
}
finally {
    Pop-Location
}
