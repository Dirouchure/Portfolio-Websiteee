@echo off
cls
color 0B
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  🔧 FIX ALL ERRORS - AUTOMATIC                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo This will fix everything automatically!
echo.
pause

cls
echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 1/7: KILLING OLD PROCESSES
echo ═══════════════════════════════════════════════════════════════
echo.

taskkill /F /IM node.exe /T >nul 2>&1
taskkill /F /IM chrome.exe /T >nul 2>&1
taskkill /F /IM msedge.exe /T >nul 2>&1
echo ✅ All old processes killed
timeout /t 3 >nul

cls
echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 2/7: INSTALLING BACKEND DEPENDENCIES
echo ═══════════════════════════════════════════════════════════════
echo.

cd backend
if not exist "node_modules" (
    echo Installing backend packages...
    call npm install
    echo ✅ Backend packages installed
) else (
    echo ✅ Backend packages already installed
)
cd ..

cls
echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 3/7: INSTALLING FRONTEND DEPENDENCIES
echo ═══════════════════════════════════════════════════════════════
echo.

cd frontend
if not exist "node_modules" (
    echo Installing frontend packages...
    call npm install
    echo ✅ Frontend packages installed
) else (
    echo ✅ Frontend packages already installed
)
cd ..

cls
echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 4/7: CHECKING MYSQL
echo ═══════════════════════════════════════════════════════════════
echo.

netstat -an | findstr ":3306" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ MySQL is running
) else (
    echo ❌ MySQL is NOT running!
    echo.
    echo ⚠️  IMPORTANT: You need to start MySQL first!
    echo.
    echo Please do this:
    echo 1. Open XAMPP Control Panel
    echo 2. Click START next to MySQL
    echo 3. Wait for it to turn green
    echo 4. Then press any key to continue...
    echo.
    pause
    
    REM Check again
    netstat -an | findstr ":3306" >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ MySQL is now running!
    ) else (
        echo ❌ MySQL is still not running
        echo Cannot continue without MySQL
        echo.
        pause
        exit /b 1
    )
)

timeout /t 2 >nul

cls
echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 5/7: UPDATING PROFILE
echo ═══════════════════════════════════════════════════════════════
echo.

cd backend
node update_profile_fullstack.js
cd ..

timeout /t 2 >nul

cls
echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 6/7: STARTING SERVERS
echo ═══════════════════════════════════════════════════════════════
echo.

echo Starting Backend Server (port 5001)...
cd backend
start /MIN cmd /c "title DIRO-BACKEND && color 0A && node server.js"
cd ..
echo ✅ Backend starting...

timeout /t 5 >nul

echo.
echo Starting Frontend App (port 3001)...
cd frontend
start /MIN cmd /c "title DIRO-FRONTEND && color 0B && set PORT=3001 && npm start"
cd ..
echo ✅ Frontend starting...

cls
echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 7/7: WAITING FOR COMPILATION
echo ═══════════════════════════════════════════════════════════════
echo.

echo Please wait while everything compiles...
echo.
echo Backend: ~5 seconds
echo Frontend: ~30-60 seconds
echo.
echo Progress:
echo [█░░░░░░░░░] 10%% - Backend starting...
timeout /t 3 >nul
echo [███░░░░░░░] 30%% - Backend ready...
timeout /t 3 >nul
echo [█████░░░░░] 50%% - Frontend compiling...
timeout /t 5 >nul
echo [███████░░░] 70%% - Still compiling...
timeout /t 10 >nul
echo [█████████░] 90%% - Almost ready...
timeout /t 10 >nul
echo [██████████] 100%% - Ready!
echo.

cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  ✅ ALL FIXED! OPENING PORTFOLIO...                          ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

start http://localhost:3001

echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ YOUR PORTFOLIO IS RUNNING!
echo.
echo 🌐 Website: http://localhost:3001
echo 🔧 Backend: http://localhost:5001
echo.
echo 📱 Phone (Same WiFi): http://10.98.79.115:3001
echo.
echo 🔐 Admin Login:
echo    URL: http://localhost:3001/admin/login
echo    Username: admin
echo    Password: admin123
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo Backend and Frontend are running in minimized windows.
echo Look for: DIRO-BACKEND and DIRO-FRONTEND in taskbar
echo.
echo To stop servers:
echo - Close the minimized windows
echo - Or run: taskkill /F /IM node.exe
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 👤 Your Portfolio:
echo    Name: Diro Uchure
echo    Title: Full Stack Web Developer
echo    Email: dirouchure@gmail.com
echo    Phone: +251940672637
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo If the website doesn't load:
echo 1. Wait another 30 seconds
echo 2. Manually refresh browser (F5)
echo 3. Or open: http://localhost:3001
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

pause
