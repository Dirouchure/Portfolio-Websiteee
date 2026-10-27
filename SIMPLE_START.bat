@echo off
echo Starting Portfolio...
echo.

REM Check MySQL
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL is running
) else (
    echo [!] WARNING: MySQL is NOT running in XAMPP!
    echo Please open XAMPP and click Start next to MySQL.
    if exist "C:\xampp\xampp-control.exe" (
        start "" "C:\xampp\xampp-control.exe"
    )
)

REM Kill old processes
taskkill /F /IM node.exe >nul 2>&1

REM Wait
timeout /t 2 >nul

REM Start backend
echo Starting backend...
cd backend
start /MIN cmd /c node server.js
cd ..

REM Wait
timeout /t 5 >nul

REM Start frontend
echo Starting frontend...
cd frontend
start /MIN cmd /c "set PORT=3001 && npm start"
cd ..

REM Wait and open
echo.
echo Waiting 30 seconds...
timeout /t 30 >nul

echo.
echo Opening browser...
start http://localhost:3001

echo.
echo Done! Check your browser.
echo.
pause
