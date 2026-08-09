@echo off
echo ╔════════════════════════════════════════════╗
echo ║   COMPLETE PORTFOLIO SETUP                 ║
echo ╚════════════════════════════════════════════╝
echo.

echo [1/3] Fixing login...
cd backend
call node fix_login_complete.js
echo.

echo [2/3] Starting backend...
start "Portfolio Backend" cmd /k "cd /d %~dp0backend && node server.js"
timeout /t 3 /nobreak >nul

echo [3/3] Starting frontend...
start "Portfolio Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ╔════════════════════════════════════════════╗
echo ║  ✅ SETUP COMPLETE!                        ║
echo ╚════════════════════════════════════════════╝
echo.
echo Two windows will open:
echo   1. Backend Server (port 5000)
echo   2. Frontend App (port 3000)
echo.
echo Login at: http://localhost:3000/admin/login
echo Username: admin
echo Password: admin123
echo.
echo Press any key to close this window...
pause >nul
