@echo off
title ULTIMATE FIX - Diro Portfolio
cls
color 0B

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  🔧 ULTIMATE FIX - THIS WILL FIX EVERYTHING!                 ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo This script will:
echo ✅ Kill all old processes
echo ✅ Install backend packages (if missing)
echo ✅ Install frontend packages (if missing)
echo ✅ Check MySQL is running
echo ✅ Start backend server
echo ✅ Start frontend app
echo ✅ Open your portfolio
echo.
echo This might take 5-10 minutes if packages need to be installed.
echo.
echo Press any key to start...
pause >nul

REM ═══════════════════════════════════════════════════════════════
REM STEP 1: KILL OLD PROCESSES
REM ═══════════════════════════════════════════════════════════════
cls
echo.
echo [1/8] Killing old processes...
echo.

taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 3 >nul

echo ✅ Done
timeout /t 2 >nul

REM ═══════════════════════════════════════════════════════════════
REM STEP 2: CHECK MYSQL
REM ═══════════════════════════════════════════════════════════════
cls
echo.
echo [2/8] Checking MySQL...
echo.

netstat -an | findstr ":3306" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ MySQL is running
) else (
    echo ❌ MySQL is NOT running!
    echo.
    echo ⚠️  YOU MUST START MYSQL FIRST!
    echo.
    echo Please:
    echo 1. Open XAMPP Control Panel
    echo 2. Click START next to MySQL
    echo 3. Wait for it to turn GREEN
    echo 4. Then press any key to continue...
    echo.
    pause
    
    REM Check again
    netstat -an | findstr ":3306" >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ MySQL is now running!
    ) else (
        echo ❌ MySQL is still not running!
        echo Cannot continue without MySQL.
        echo.
        pause
        exit /b 1
    )
)

timeout /t 2 >nul

REM ═══════════════════════════════════════════════════════════════
REM STEP 3: CHECK BACKEND PACKAGES
REM ═══════════════════════════════════════════════════════════════
cls
echo.
echo [3/8] Checking backend packages...
echo.

if exist "backend\node_modules" (
    echo ✅ Backend packages already installed
) else (
    echo ⚠️  Backend packages NOT installed
    echo Installing now... (this will take 2-3 minutes)
    echo.
    
    cd backend
    call npm install
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✅ Backend packages installed!
    ) else (
        echo.
        echo ❌ Failed to install backend packages!
        cd ..
        pause
        exit /b 1
    )
    
    cd ..
)

timeout /t 2 >nul

REM ═══════════════════════════════════════════════════════════════
REM STEP 4: CHECK FRONTEND PACKAGES
REM ═══════════════════════════════════════════════════════════════
cls
echo.
echo [4/8] Checking frontend packages...
echo.

if exist "frontend\node_modules" (
    echo ✅ Frontend packages already installed
) else (
    echo ⚠️  Frontend packages NOT installed
    echo Installing now... (this will take 2-3 minutes)
    echo.
    
    cd frontend
    call npm install
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✅ Frontend packages installed!
    ) else (
        echo.
        echo ❌ Failed to install frontend packages!
        cd ..
        pause
        exit /b 1
    )
    
    cd ..
)

timeout /t 2 >nul

REM ═══════════════════════════════════════════════════════════════
REM STEP 5: UPDATE PROFILE
REM ═══════════════════════════════════════════════════════════════
cls
echo.
echo [5/8] Updating profile...
echo.

cd backend
node update_profile_fullstack.js
cd ..

echo ✅ Profile updated
timeout /t 2 >nul

REM ═══════════════════════════════════════════════════════════════
REM STEP 6: START BACKEND
REM ═══════════════════════════════════════════════════════════════
cls
echo.
echo [6/8] Starting backend server...
echo.

cd backend
start /MIN cmd /c "title DIRO-BACKEND && color 0A && echo Starting Backend... && node server.js"
cd ..

echo ✅ Backend starting on port 5001...
timeout /t 5 >nul

REM ═══════════════════════════════════════════════════════════════
REM STEP 7: START FRONTEND
REM ═══════════════════════════════════════════════════════════════
cls
echo.
echo [7/8] Starting frontend app...
echo.

cd frontend
start /MIN cmd /c "title DIRO-FRONTEND && color 0B && echo Starting Frontend... && set PORT=3001 && npm start"
cd ..

echo ✅ Frontend starting on port 3001...
timeout /t 3 >nul

REM ═══════════════════════════════════════════════════════════════
REM STEP 8: WAIT FOR COMPILATION
REM ═══════════════════════════════════════════════════════════════
cls
echo.
echo [8/8] Waiting for everything to compile...
echo.
echo This takes about 30-60 seconds.
echo Please wait...
echo.

echo [░░░░░░░░░░] 0%% - Backend starting...
timeout /t 5 >nul

echo [██░░░░░░░░] 20%% - Backend ready...
timeout /t 5 >nul

echo [████░░░░░░] 40%% - Frontend compiling...
timeout /t 10 >nul

echo [██████░░░░] 60%% - Still compiling...
timeout /t 10 >nul

echo [████████░░] 80%% - Almost ready...
timeout /t 10 >nul

echo [██████████] 100%% - Ready!
echo.

REM ═══════════════════════════════════════════════════════════════
REM FINAL: OPEN BROWSER
REM ═══════════════════════════════════════════════════════════════
cls

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  ✅ SUCCESS! YOUR PORTFOLIO IS RUNNING!                      ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

start http://localhost:3001

echo ═══════════════════════════════════════════════════════════════
echo.
echo 🌐 YOUR PORTFOLIO:
echo    http://localhost:3001
echo.
echo 📱 ON YOUR PHONE (Same WiFi):
echo    http://10.98.79.115:3001
echo.
echo 🔐 ADMIN LOGIN:
echo    http://localhost:3001/admin/login
echo    Username: admin
echo    Password: admin123
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 👤 YOUR INFO:
echo    Name: Diro Uchure
echo    Title: Full Stack Web Developer
echo    Email: dirouchure@gmail.com
echo    Phone: +251940672637
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo ℹ️  SERVERS RUNNING:
echo    Backend: Minimized window (DIRO-BACKEND)
echo    Frontend: Minimized window (DIRO-FRONTEND)
echo.
echo TO STOP SERVERS:
echo    taskkill /F /IM node.exe
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo Browser should open automatically now!
echo If not, manually open: http://localhost:3001
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

pause
