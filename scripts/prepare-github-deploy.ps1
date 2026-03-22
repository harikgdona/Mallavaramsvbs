<#
.SYNOPSIS
  Prepares the Mallavaram_website repo for GitHub + GitHub Pages (keeps repo small).

.DESCRIPTION
  - Ensures .gitignore excludes node_modules, .next, out (so nothing huge is committed)
  - Removes those paths from Git index if they were accidentally committed
  - Stages the files GitHub Actions needs (you still run commit/push yourself)
  - Does NOT run npm install (optional; CI does that on GitHub)

.USAGE
  From repo root:
    powershell -ExecutionPolicy Bypass -File .\scripts\prepare-github-deploy.ps1

  Stage everything safe + commit message:
    powershell -ExecutionPolicy Bypass -File .\scripts\prepare-github-deploy.ps1 -Commit -Message "Deploy: ready for GitHub Pages"
#>

param(
    [switch]$Commit,
    [string]$Message = "chore: prepare for GitHub Pages deploy"
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot

Write-Host "=== Repo root: $RepoRoot ===" -ForegroundColor Cyan

# --- .gitignore lines we require ---
$gitignorePath = Join-Path $RepoRoot ".gitignore"
$required = @(
    "node_modules/",
    ".next/",
    "out/",
    ".env.local"
)
if (-not (Test-Path $gitignorePath)) {
    $required | Set-Content -Path $gitignorePath -Encoding UTF8
    Write-Host "Created .gitignore" -ForegroundColor Green
}
else {
    $existing = Get-Content $gitignorePath -Raw -ErrorAction SilentlyContinue
    foreach ($line in $required) {
        if ($existing -notmatch [regex]::Escape($line.TrimEnd('/'))) {
            Add-Content -Path $gitignorePath -Value "`n$line"
            Write-Host "Appended to .gitignore: $line" -ForegroundColor Yellow
        }
    }
}

# --- Must exist for CI ---
$mustHave = @(
    "package.json",
    "package-lock.json",
    "next.config.mjs",
    ".github\workflows\deploy.yml"
)
$missing = @()
foreach ($f in $mustHave) {
    if (-not (Test-Path (Join-Path $RepoRoot $f))) { $missing += $f }
}
if ($missing.Count -gt 0) {
    Write-Host "`nMISSING (add these before deploy):" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "  - $_" }
    exit 1
}

# --- Git: stop tracking bulky folders if they were committed ---
if (-not (Test-Path (Join-Path $RepoRoot ".git"))) {
    Write-Host "`nNot a git repo yet. Run:" -ForegroundColor Yellow
    Write-Host "  git init" -ForegroundColor White
    Write-Host "  git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git" -ForegroundColor White
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 0
}

$toUntrack = @("node_modules", ".next", "out")
foreach ($dir in $toUntrack) {
    $tracked = git ls-files $dir 2>$null
    if ($tracked) {
        Write-Host "Removing from Git index (files stay on disk): $dir" -ForegroundColor Yellow
        git rm -r --cached $dir 2>$null
        if ($LASTEXITCODE -ne 0) { git rm -r --cached "$dir/" 2>$null }
    }
}

# --- Stage what we want GitHub to see ---
$addPaths = @(
    "app",
    "components",
    "sections",
    "public",
    "i18n",
    "package.json",
    "package-lock.json",
    "next.config.mjs",
    "tsconfig.json",
    "tailwind.config.ts",
    "postcss.config.mjs",
    ".github",
    ".gitignore",
    "scripts"
)
foreach ($p in $addPaths) {
    $full = Join-Path $RepoRoot $p
    if (Test-Path $full) {
        git add -- $p
    }
}
# Optional files
foreach ($opt in @(".npmrc", "next-env.d.ts")) {
    if (Test-Path (Join-Path $RepoRoot $opt)) { git add -- $opt }
}

Write-Host "`n=== git status (short) ===" -ForegroundColor Cyan
git status -sb

if ($Commit) {
    git commit -m $Message
    Write-Host "`nCommitted. Push with:" -ForegroundColor Green
    Write-Host "  git push -u origin main" -ForegroundColor White
}
else {
    Write-Host "`n--- Next steps (run in repo root) ---" -ForegroundColor Green
    Write-Host "  1. Review:  git status" -ForegroundColor White
    Write-Host "  2. Commit:  git commit -m `"Your message`"" -ForegroundColor White
    Write-Host "  3. Push:    git push -u origin main" -ForegroundColor White
    Write-Host "`nOr re-run with -Commit:" -ForegroundColor DarkGray
    Write-Host "  powershell -ExecutionPolicy Bypass -File .\scripts\prepare-github-deploy.ps1 -Commit -Message `"chore: deploy`"" -ForegroundColor DarkGray
}

Write-Host "`nGitHub: Settings → Pages → Source = GitHub Actions" -ForegroundColor Cyan
Write-Host "Local folder can stay small: do not commit node_modules or .next (they are gitignored)." -ForegroundColor Cyan
