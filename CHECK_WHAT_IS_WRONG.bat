@echo off
cls
color 0E
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  🔍 CHECKING WHAT IS WRONG...                                ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo [1/6] Checking if MySQL is running...
echo.
netstat -an | findstr ":3306" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ MySQL is running on port 3306
) else (
    echo ❌ MySQL is NOT running on port 3306
    echo    Solution: Start XAMPP MySQL Control Panel
)
echo.

echo [2/6] Checking if port 5001 is in use...
echo.
netstat -an | findstr ":5001" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ⚠️  Port 5001 is already in use
    echo    Solution: Running cleanup...
    taskkill /F /IM node.exe /T >nul 2>&1
    timeout /t 2 >nul
    echo    ✅ Cleanup done
) else (
    echo ✅ Port 5001 is free
)
echo.

echo [3/6] Checking if port 3001 is in use...
echo.
netstat -an | findstr ":3001" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ⚠️  Port 3001 is already in use
    echo    Solution: Running cleanup...
    taskkill /F /IM node.exe /T >nul 2>&1
    timeout /t 2 >nul
    echo    ✅ Cleanup done
) else (
    echo ✅ Port 3001 is free
)
echo.

echo [4/6] Checking if Node.js is installed...
echo.
node --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Node.js is installed
    node --version
) else (
    echo ❌ Node.js is NOT installed
    echo    Solution: Install Node.js from https://nodejs.org
)
echo.

echo [5/6] Checking if backend files exist...
echo.
if exist "backend\server.js" (
    echo ✅ Backend files exist
) else (
    echo ❌ Backend files missing
)
echo.

echo [6/6] Checking if frontend files exist...
echo.
if exist "frontend\package.json" (
    echo ✅ Frontend files exist
) else (
    echo ❌ Frontend files missing
)
echo.

echo ═══════════════════════════════════════════════════════════════
echo.
echo 🔍 DIAGNOSTIC COMPLETE
echo.
echo Now let's try to start the backend manually to see the error...
echo.
pause
echo.
echo Starting backend...
echo.

cd backend
node server.js

pause
