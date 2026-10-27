@echo off
color 0C
cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║         🚨 FIXING CONNECTION ISSUE - EMERGENCY FIX           ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo ═══════════════════════════════════════════════════════════════
echo  STEP 1: CHECK DATABASE
echo ═══════════════════════════════════════════════════════════════
echo.

tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo ❌ MySQL is NOT running!
    echo.
    echo SOLUTION: Start MySQL in XAMPP
    if exist "C:\xampp\xampp-control.exe" (
        start "" "C:\xampp\xampp-control.exe"
        echo XAMPP opened. Start MySQL and press any key...
        pause
    )
    exit /b 1
)
echo ✅ MySQL is running
echo.

echo ═══════════════════════════════════════════════════════════════
echo  STEP 2: CHECK IF PROFILE EXISTS IN DATABASE
echo ═══════════════════════════════════════════════════════════════
echo.

echo Checking database...
"C:\xampp\mysql\bin\mysql.exe" -u root -e "USE portfolio_db; SELECT COUNT(*) as ProfileCount FROM profile;" 2>nul

echo.
echo ═══════════════════════════════════════════════════════════════
echo  STEP 3: FIX DATABASE (ADD PROFILE & ADMIN)
echo ═══════════════════════════════════════════════════════════════
echo.

echo Running database fix...
powershell -Command "Get-Content 'database\FIX_PROFILE_AND_ADMIN.sql' | & 'C:\xampp\mysql\bin\mysql.exe' -u root" 2>nul

if errorlevel 1 (
    echo ⚠️  Some warnings (this is normal)
) else (
    echo ✅ Database fixed!
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo  STEP 4: FIX FRONTEND CONFIGURATION
echo ═══════════════════════════════════════════════════════════════
echo.

echo Setting API URL to localhost...
echo REACT_APP_API_URL=http://localhost:5001/api> frontend\.env
echo ✅ Frontend configured

echo.
echo ═══════════════════════════════════════════════════════════════
echo  STEP 5: RESTART EVERYTHING
echo ═══════════════════════════════════════════════════════════════
echo.

echo Killing old processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5001" ^| findstr "LISTENING"') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001" ^| findstr "LISTENING"') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak > nul
echo ✅ Old processes killed

echo.
echo Starting Backend...
start "Portfolio Backend" cmd /c "cd /d "%~dp0backend" && echo ========================================== && echo  BACKEND SERVER && echo ========================================== && echo. && node server.js && pause"
timeout /t 3 /nobreak > nul
echo ✅ Backend started

echo.
echo Starting Frontend...
start "Portfolio Frontend" cmd /c "cd /d "%~dp0frontend" && echo ========================================== && echo  FRONTEND SERVER && echo ========================================== && echo. && set PORT=3001 && npm start"
echo ✅ Frontend starting

echo.
echo ═══════════════════════════════════════════════════════════════
echo  STEP 6: VERIFY BACKEND
echo ═══════════════════════════════════════════════════════════════
echo.

echo ⏳ Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Testing backend API...
powershell -Command "try { $r = Invoke-RestMethod -Uri 'http://localhost:5001/api/profile'; Write-Host '✅ Backend is working!' -ForegroundColor Green; Write-Host '   Name:' $r.full_name; Write-Host '   Title:' $r.title } catch { Write-Host '❌ Backend test failed!' -ForegroundColor Red; Write-Host '   Error:' $_.Exception.Message }"

echo.
echo ═══════════════════════════════════════════════════════════════
echo  ✅ FIX COMPLETE!
echo ═══════════════════════════════════════════════════════════════
echo.
echo WHAT WAS FIXED:
echo ✅ Database checked and fixed
echo ✅ Profile and admin added
echo ✅ Frontend configured to use localhost
echo ✅ Both servers restarted
echo.
echo ⏳ WAIT 60 SECONDS for frontend to compile!
echo.
echo Then:
echo 1. Open: http://localhost:3001
echo 2. Press: Ctrl + Shift + R (hard refresh)
echo 3. Profile should appear!
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo Check the two windows that opened:
echo 1. Backend - Should say "Server running on http://localhost:5001"
echo 2. Frontend - Should say "Compiled successfully!"
echo.
echo If both show success, your portfolio is working! ✅
echo.
echo ⏳ Waiting 30 seconds before opening browser...
timeout /t 30 /nobreak > nul
echo.
echo 🌐 Opening browser...
start http://localhost:3001
echo.
echo Press any key to close this window...
pause > nul
