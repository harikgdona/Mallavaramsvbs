# Remove unnecessary folders
$foldersToRemove = @(
    "node_modules",
    ".next",
    "dist",
    "build",
    ".vscode",
    ".idea"
)

foreach ($folder in $foldersToRemove) {
    $path = Join-Path (Get-Location) $folder
    if (Test-Path $path) {
        Write-Host "Removing $folder..."
        Remove-Item -Recurse -Force $path
        Write-Host "$folder removed"
    }
}

# Remove unnecessary files
$filesToRemove = @(
    ".DS_Store",
    "*.log",
    ".env.local",
    ".env*.local"
)

foreach ($file in $filesToRemove) {
    Get-ChildItem -Recurse -Force -Filter $file -ErrorAction SilentlyContinue | 
        ForEach-Object {
            Write-Host "Removing $_..."
            Remove-Item -Force $_
        }
}

Write-Host "Cleanup complete! Ready for git push."