# FoundIt - Automated Push to GitHub
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " FoundIt - Pushing codebase to GitHub" -ForegroundColor Cyan
Write-Host " Repo: https://github.com/ascii2959-afk/FoundIt-Smart-Lost-and-Found.git" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

Set-Location "e:\project team"

Write-Host "`n[1/5] Initializing Git repository..." -ForegroundColor Yellow
git init

Write-Host "[2/5] Adding all files..." -ForegroundColor Yellow
git add .

Write-Host "[3/5] Creating commit..." -ForegroundColor Yellow
git commit -m "Initial commit: FoundIt Smart University Lost & Found System with C++ Core"

Write-Host "[4/5] Setting branch to main..." -ForegroundColor Yellow
git branch -M main

Write-Host "[5/5] Configuring remote origin..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/ascii2959-afk/FoundIt-Smart-Lost-and-Found.git

Write-Host "`nUploading to GitHub..." -ForegroundColor Green
git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nRetrying with force push..." -ForegroundColor Yellow
    git push -u origin main --force
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host " Successfully completed! Visit your repository:" -ForegroundColor Green
Write-Host " https://github.com/ascii2959-afk/FoundIt-Smart-Lost-and-Found" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Read-Host "`nPress Enter to exit"
