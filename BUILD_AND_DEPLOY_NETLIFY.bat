@echo off
cls
color 0B
echo.
echo ===================================================================
echo   PORTFOLIO - COMPLETE BUILD ^& DEPLOY FOR NETLIFY
echo ===================================================================
echo.

cd /d "%~dp0"

echo [STEP 1/4] Ensuring profile picture is in frontend...
if not exist "frontend\src\assets" mkdir "frontend\src\assets"
if not exist "frontend\public\images" mkdir "frontend\public\images"

if exist "backend\uploads\profile\1792744084542-729016836.jpg" (
    copy /y "backend\uploads\profile\1792744084542-729016836.jpg" "frontend\src\assets\profile.jpg" >nul
    copy /y "backend\uploads\profile\1792744084542-729016836.jpg" "frontend\public\images\profile.jpg" >nul
    copy /y "backend\uploads\profile\1792744084542-729016836.jpg" "frontend\public\profile.jpg" >nul
    echo   [OK] Profile photo synced from uploads
) else (
    if exist "frontend\src\assets\profile.jpg" (
        copy /y "frontend\src\assets\profile.jpg" "frontend\public\images\profile.jpg" >nul
        copy /y "frontend\src\assets\profile.jpg" "frontend\public\profile.jpg" >nul
        echo   [OK] Profile photo synced from assets
    ) else (
        echo   [INFO] Using existing profile photo in frontend\public\images\profile.jpg
    )
)

echo.
echo [STEP 2/4] Building production React bundle (npm run build)...
cd frontend
call npm run build
cd ..

if exist "frontend\build" (
    echo   [OK] Production build created successfully!
    if not exist "frontend\build\images" mkdir "frontend\build\images"
    if exist "frontend\public\images\profile.jpg" (
        copy /y "frontend\public\images\profile.jpg" "frontend\build\images\profile.jpg" >nul
        copy /y "frontend\public\images\profile.jpg" "frontend\build\profile.jpg" >nul
    )
    copy /y "frontend\public\_redirects" "frontend\build\_redirects" >nul 2>&1
) else (
    echo   [ERROR] Failed to build frontend. Please check errors above.
    pause
    exit /b 1
)

echo.
echo [STEP 3/4] Committing changes to Git...
git add .
git commit -m "Fix profile image and Netlify static hosting deployment"
echo.
echo Pushing changes to GitHub origin main...
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo   [NOTICE] Git push encountered an issue (e.g. login credentials or network).
    echo   You can push manually via Git or deploy directly via Netlify Drag ^& Drop!
)

echo.
echo ===================================================================
echo   ALL DONE! HOW TO SEE YOUR PROFILE ON NETLIFY:
echo ===================================================================
echo.
echo 1. IF NETLIFY IS CONNECTED TO GITHUB:
echo    - Netlify will now automatically build your latest push.
echo    - Wait about 1-2 minutes for the deploy to complete.
echo.
echo 2. IF YOU DEPLOY BY DRAG ^& DROP:
echo    - Open https://app.netlify.com/drop
echo    - Drag and drop this exact folder:
echo      %~dp0frontend\build
echo.
echo 3. VERY IMPORTANT (BROWSER CACHE):
echo    - Open your Netlify site URL
echo    - Press CTRL + SHIFT + R (hard reload to clear old cached site)
echo    - Or open the site in an Incognito / Private window!
echo.
echo ===================================================================
pause
