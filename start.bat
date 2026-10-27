@echo off
echo ===================================================
echo   Starting Portfolio Website (Backend + Frontend)
echo ===================================================
echo.
echo [1/2] Launching Backend on Port 5001...
start "Portfolio Backend (Port 5001)" cmd /k "cd /d %~dp0backend && node server.js"

echo [2/2] Launching Frontend on Port 3000/3001...
start "Portfolio Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo Both services are now running in their own windows!
echo Keep both windows open while developing.
echo.
pause
