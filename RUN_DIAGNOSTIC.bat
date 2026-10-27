@echo off
cls
color 0E
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  🔍 FULL DIAGNOSTIC TEST                                      ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo This will check everything and tell you what's wrong.
echo.
pause
cls

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 1: CHECKING SYSTEM
echo ═══════════════════════════════════════════════════════════════
echo.

echo [1.1] Checking MySQL (port 3306)...
netstat -an | findstr ":3306" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ MySQL is running
) else (
    echo ❌ MySQL is NOT running
    echo.
    echo ⚠️  ERROR FOUND: MySQL is not running!
    echo.
    echo SOLUTION:
    echo 1. Open XAMPP Control Panel
    echo 2. Click "Start" next to MySQL
    echo 3. Wait for it to turn green
    echo 4. Then run this script again
    echo.
    pause
    exit /b 1
)

echo [1.2] Checking Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Node.js is installed:
    node --version
) else (
    echo ❌ Node.js is NOT installed
    echo.
    echo ⚠️  ERROR FOUND: Node.js is not installed!
    echo.
    echo SOLUTION:
    echo 1. Download from: https://nodejs.org
    echo 2. Install Node.js
    echo 3. Restart computer
    echo 4. Then run this script again
    echo.
    pause
    exit /b 1
)

echo [1.3] Cleaning up old processes...
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 >nul
echo ✅ Cleanup done

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 2: TESTING MYSQL CONNECTION
echo ═══════════════════════════════════════════════════════════════
echo.

cd backend
node ../TEST_MYSQL_CONNECTION.js
set MYSQL_TEST=%ERRORLEVEL%
cd ..

if %MYSQL_TEST% NEQ 0 (
    echo.
    echo ⚠️  ERROR FOUND: Cannot connect to MySQL!
    echo.
    echo SOLUTION:
    echo 1. Make sure XAMPP MySQL is running
    echo 2. Make sure database "portfolio_db" exists
    echo 3. Import database\portfolio_db.sql into phpMyAdmin
    echo.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 3: TESTING BACKEND SERVER
echo ═══════════════════════════════════════════════════════════════
echo.

echo Starting backend server for 10 seconds...
echo.

cd backend
start /MIN cmd /c "node server.js"
cd ..

timeout /t 10 >nul

echo Testing if backend is responding...
curl http://localhost:5001/api/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend is working!
) else (
    echo ❌ Backend is NOT responding
    echo.
    echo Let's check the backend logs...
    echo.
    pause
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 4: ALL CHECKS COMPLETE
echo ═══════════════════════════════════════════════════════════════
echo.

echo Stopping test server...
taskkill /F /IM node.exe /T >nul 2>&1

echo.
echo ✅ DIAGNOSTIC COMPLETE!
echo.
echo Everything seems to be working.
echo Now let's try starting the full portfolio...
echo.
pause

REM Run the auto start
call AUTO_START_PORTFOLIO.bat
