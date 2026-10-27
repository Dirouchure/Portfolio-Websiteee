@echo off
cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  UPDATE PROFILE TO FULL STACK WEB DEVELOPER                  ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo Updating your profile in database...
echo.

cd backend
node update_profile_fullstack.js

echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ PROFILE UPDATED!
echo.
echo Your new profile:
echo   Name: Diro Uchure
echo   Title: Full Stack Web Developer
echo.
echo To see changes:
echo   1. Just refresh your browser (if servers running)
echo   2. Or run START_FRESH.bat to restart everything
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
pause
