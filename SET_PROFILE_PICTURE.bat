@echo off
cls
color 0A
echo.
echo ===================================================================
echo   PORTFOLIO PROFILE IMAGE SETUP FOR NETLIFY ^& LOCALHOST
echo ===================================================================
echo.

cd /d "%~dp0"

if not exist "frontend\public\images" mkdir "frontend\public\images"
if not exist "frontend\build\images" mkdir "frontend\build\images"

set "FOUND=0"

if exist "backend\uploads\profile\1792744084542-729016836.jpg" (
    echo [1/3] Copying profile image to frontend\public\images\profile.jpg...
    copy /y "backend\uploads\profile\1792744084542-729016836.jpg" "frontend\public\images\profile.jpg" >nul
    copy /y "backend\uploads\profile\1792744084542-729016836.jpg" "frontend\public\images\avatar.jpg" >nul

    echo [2/3] Copying profile image to frontend\build\images\profile.jpg...
    copy /y "backend\uploads\profile\1792744084542-729016836.jpg" "frontend\build\images\profile.jpg" >nul
    copy /y "backend\uploads\profile\1792744084542-729016836.jpg" "frontend\build\images\avatar.jpg" >nul

    set "FOUND=1"
)

if "%FOUND%"=="0" if exist "backend\uploads\profile\1791741809999-180633976.jpg" (
    echo [1/3] Copying profile image from fallback upload...
    copy /y "backend\uploads\profile\1791741809999-180633976.jpg" "frontend\public\images\profile.jpg" >nul
    copy /y "backend\uploads\profile\1791741809999-180633976.jpg" "frontend\build\images\profile.jpg" >nul
    set "FOUND=1"
)

if "%FOUND%"=="1" (
    echo.
    echo ===================================================================
    echo   SUCCESS! Your profile picture is now set in the files:
    echo   - frontend\public\images\profile.jpg
    echo   - frontend\build\images\profile.jpg
    echo.
    echo   When you deploy to Netlify:
    echo   Your photo will appear automatically on the homepage and about page!
    echo ===================================================================
) else (
    echo.
    echo [WARNING] Could not find the source photo in backend\uploads\profile\.
    echo Please make sure your photo is saved as:
    echo frontend\public\images\profile.jpg
)

echo.
pause
