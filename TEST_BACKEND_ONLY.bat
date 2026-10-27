@echo off
cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  🔍 TEST BACKEND ONLY                                         ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo This will start ONLY the backend so you can see any errors.
echo.
pause

cls
echo.
echo Killing old processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo ✅ Done
echo.

echo Starting backend...
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

cd backend
node server.js

pause
