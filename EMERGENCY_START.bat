@echo off
title EMERGENCY START - Diro Portfolio
color 0C
cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  🚨 EMERGENCY START                                           ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo This is the EMERGENCY version - it shows ALL errors!
echo.
pause

cls

echo.
echo [1] Killing everything...
taskkill /F /IM node.exe /T
timeout /t 3

echo.
echo [2] Testing MySQL...
netstat -an | findstr ":3306"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌❌❌ MYSQL IS NOT RUNNING! ❌❌❌
    echo.
    echo YOU MUST START MYSQL IN XAMPP FIRST!
    echo.
    pause
    exit /b 1
)

echo.
echo [3] Starting Backend...
echo If you see errors, READ THEM and tell me!
echo.
cd backend
node server.js &

timeout /t 10

echo.
echo [4] Check if backend is running...
curl http://localhost:5001/api/health
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Backend is not responding!
    echo Check the error above!
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Backend is working!
echo.
echo [5] Starting Frontend...
cd ..\frontend
start /MIN cmd /c "set PORT=3001 && npm start"

echo.
echo [6] Waiting 40 seconds for frontend...
timeout /t 40

echo.
echo [7] Opening browser...
start http://localhost:3001

echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo If you see this, it should be working!
echo Check your browser: http://localhost:3001
echo.
echo If NOT working, copy the ERROR messages above and tell me!
echo.
pause
