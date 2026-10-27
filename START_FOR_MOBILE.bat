@echo off
color 0A
cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║         📱 STARTING PORTFOLIO FOR MOBILE ACCESS              ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

REM Get current IP address
echo 🔍 Detecting your computer's IP address...
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address" ^| findstr /v "127.0.0.1"') do (
    set "IP=%%a"
    set "IP=!IP: =!"
    goto :found_ip
)

:found_ip
setlocal enabledelayedexpansion
set IP=%IP: =%
echo ✅ Your IP: %IP%
echo.

REM Update frontend .env file
echo 📝 Configuring API URL for mobile access...
echo REACT_APP_API_URL=http:%IP%:5001/api> frontend\.env
echo ✅ API URL configured: http:%IP%:5001/api
echo.

REM Check if XAMPP is running
echo 🔍 Checking XAMPP MySQL...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MySQL is running
) else (
    echo ❌ MySQL is NOT running!
    echo ⚠️  Please start XAMPP MySQL first!
    echo.
    pause
    exit /b
)
echo.

REM Start Backend
echo 🚀 Starting Backend Server (Port 5001)...
start "Portfolio Backend" cmd /c "cd /d "%~dp0backend" && node server.js"
timeout /t 3 /nobreak > nul
echo ✅ Backend started
echo.

REM Start Frontend
echo 🚀 Starting Frontend Server (Port 3001)...
start "Portfolio Frontend" cmd /c "cd /d "%~dp0frontend" && set PORT=3001 && npm start"
echo ✅ Frontend starting (will take 30-60 seconds)...
echo.

echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ PORTFOLIO IS STARTING!
echo.
echo 📱 MOBILE ACCESS:
echo    Open on your phone: http:%IP%:3001
echo.
echo 💻 COMPUTER ACCESS:
echo    http://localhost:3001
echo    http:%IP%:3001
echo.
echo 🔐 ADMIN PANEL:
echo    http:%IP%:3001/admin/login
echo    Username: admin
echo    Password: admin123
echo.
echo ⚠️  IMPORTANT:
echo    - Phone must be on SAME WiFi
echo    - Wait 30-60 seconds for frontend to build
echo    - Clear mobile browser cache if needed
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 📋 Two windows will open:
echo    1. Backend (Node.js server)
echo    2. Frontend (React app)
echo.
echo ⏳ Waiting for frontend to start...
timeout /t 30 /nobreak > nul
echo.
echo ✅ Frontend should be ready now!
echo.
echo 🌐 Browser will open automatically...
timeout /t 5 /nobreak > nul
start http://localhost:3001
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 🎉 PORTFOLIO IS READY!
echo.
echo 📱 Share this URL with your phone:
echo    http:%IP%:3001
echo.
echo Press any key to minimize this window...
pause > nul
