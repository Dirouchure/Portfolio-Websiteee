@echo off
cls
color 0A
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  🚀 AUTO-START PORTFOLIO - DIRO UCHURE                       ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo Starting your Full Stack Web Developer Portfolio...
echo.

REM Step 1: Check MySQL
echo [1/4] Checking MySQL status...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MySQL is running
) else (
    echo ⚠️ MySQL is NOT running! Please start MySQL in XAMPP!
    if exist "C:\xampp\xampp-control.exe" (
        start "" "C:\xampp\xampp-control.exe"
    )
)

REM Step 2: Kill old processes
echo [2/4] Cleaning up old processes...
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 >nul

REM Step 3: Start backend
echo [3/4] Starting Backend Server (port 5001)...
cd backend
start /MIN cmd /c "title BACKEND-PORTFOLIO && node server.js"
cd ..
timeout /t 5 >nul

REM Step 4: Start frontend
echo [4/4] Starting Frontend App (port 3001)...
cd frontend
start /MIN cmd /c "title FRONTEND-PORTFOLIO && set PORT=3001 && npm start"
cd ..

REM Step 5: Wait and open browser
echo [5/5] Starting browser...
echo.
echo Please wait 30-60 seconds for everything to compile...
echo.

timeout /t 30 >nul

REM Open default browser
start http://localhost:3001

echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ PORTFOLIO IS STARTING!
echo.
echo 🌐 Website: http://localhost:3001
echo 🔧 Backend: http://localhost:5001
echo.
echo 📱 Phone (Same WiFi): http://10.98.79.115:3001
echo.
echo 🔐 Admin Login: http://localhost:3001/admin/login
echo    Username: admin
echo    Password: admin123
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo Your browser will open automatically!
echo.
echo Backend and Frontend are running in background.
echo Check taskbar for minimized windows if needed.
echo.
echo To stop: Close the minimized terminal windows
echo Or run: taskkill /F /IM node.exe
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo Portfolio: Diro Uchure - Full Stack Web Developer ✨
echo.
pause
