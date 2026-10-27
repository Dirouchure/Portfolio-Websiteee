@echo off
cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  SIMPLE TEST - TELL ME RESULTS                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo [1/5] Killing all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 3 >nul

echo.
echo [2/5] Testing if port 5001 is free...
netstat -ano | findstr :5001
if %errorlevel% == 0 (
    echo ❌ Port 5001 is STILL in use!
    echo Something else is using it.
) else (
    echo ✅ Port 5001 is FREE!
)

echo.
echo [3/5] Testing if MySQL is running...
netstat -ano | findstr :3306
if %errorlevel% == 0 (
    echo ✅ MySQL is running on port 3306
) else (
    echo ❌ MySQL is NOT running! Start XAMPP!
)

echo.
echo [4/5] Checking if backend folder exists...
if exist "backend\server.js" (
    echo ✅ Backend folder found
) else (
    echo ❌ Backend folder NOT found!
)

echo.
echo [5/5] Checking if frontend folder exists...
if exist "frontend\package.json" (
    echo ✅ Frontend folder found
) else (
    echo ❌ Frontend folder NOT found!
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo COPY EVERYTHING ABOVE AND SEND TO ME!
echo.
echo This will tell me exactly what's wrong.
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
pause
