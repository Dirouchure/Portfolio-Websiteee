@echo off
echo ╔════════════════════════════════════════════╗
echo ║   PUSH PORTFOLIO TO GITHUB                 ║
echo ╚════════════════════════════════════════════╝
echo.

echo Before starting, make sure:
echo 1. You have a GitHub account
echo 2. You created a new repository on GitHub
echo 3. You have the repository URL
echo.

pause

echo.
echo [Step 1/4] Initializing Git...
git init

echo.
echo [Step 2/4] Adding all files...
git add .

echo.
echo [Step 3/4] Creating first commit...
git commit -m "Initial commit: Professional Portfolio Website by Diro Uchure"

echo.
echo [Step 4/4] Connecting to GitHub...
echo.
echo IMPORTANT: Enter your GitHub repository URL
echo Example: https://github.com/Dirouchure/portfolio-website.git
echo.
set /p REPO_URL="Enter your repository URL: "

git remote add origin %REPO_URL%
git branch -M main
git push -u origin main

echo.
echo ╔════════════════════════════════════════════╗
echo ║  ✅ PUSHED TO GITHUB!                      ║
echo ╚════════════════════════════════════════════╝
echo.
echo Your portfolio is now on GitHub!
echo.
echo To update later, run:
echo   git add .
echo   git commit -m "Update"
echo   git push
echo.
pause
