@echo off
chcp 65001 >nul
title FoundIt - Push to GitHub
echo ======================================================================
echo          FoundIt - Smart University Lost ^& Found System
echo          Pushing codebase to GitHub repository:
echo          https://github.com/ascii2959-afk/FoundIt-Smart-Lost-and-Found.git
echo ======================================================================
echo.

cd /d "e:\project team"

echo [1/5] Initializing Git local repository...
git init

echo [2/5] Staging files (HTML, CSS, JS, C++ source, README)...
git add .

echo [3/5] Creating initial commit...
git commit -m "Initial commit: FoundIt Smart University Lost & Found System with C++ Core"

echo [4/5] Renaming branch to main...
git branch -M main

echo [5/5] Setting up remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/ascii2959-afk/FoundIt-Smart-Lost-and-Found.git

echo.
echo ======================================================================
echo  Pushing commits to GitHub...
echo  (If this is your first time, a GitHub login popup will appear)
echo ======================================================================
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [Notice] Initial push had conflicts or remote had existing files.
    echo Retrying with force sync to guarantee project upload...
    git push -u origin main --force
)

echo.
echo ======================================================================
echo  Done! Your repository is now updated on GitHub:
echo  https://github.com/ascii2959-afk/FoundIt-Smart-Lost-and-Found
echo ======================================================================
echo.
pause
