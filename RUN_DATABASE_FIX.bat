@echo off
color 0A
cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║         🔧 FIXING PROFILE AND ADMIN IN DATABASE              ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 🔍 Checking MySQL...
echo.

REM Check if MySQL is running
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MySQL is running
) else (
    echo ❌ MySQL is NOT running!
    echo.
    echo Please start MySQL in XAMPP first:
    echo 1. Open XAMPP Control Panel
    echo 2. Click "Start" next to MySQL
    echo 3. Wait for it to turn green
    echo 4. Then run this script again
    echo.
    if exist "C:\xampp\xampp-control.exe" (
        echo Opening XAMPP for you...
        start "" "C:\xampp\xampp-control.exe"
    )
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo  RUNNING DATABASE FIX
echo ═══════════════════════════════════════════════════════════════
echo.

REM Find MySQL path
set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe

if not exist "%MYSQL_PATH%" (
    echo ❌ MySQL not found at: %MYSQL_PATH%
    echo Please check your XAMPP installation
    pause
    exit /b 1
)

echo 🔧 Executing SQL fix...
echo.

REM Run the SQL file
"%MYSQL_PATH%" -u root < "%~dp0database\FIX_PROFILE_AND_ADMIN.sql"

if errorlevel 1 (
    echo.
    echo ❌ Error running SQL script!
    echo.
    echo Troubleshooting:
    echo 1. Make sure MySQL is running in XAMPP
    echo 2. Make sure portfolio_db database exists
    echo 3. Try running the SQL manually in phpMyAdmin
    echo.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo  ✅ DATABASE FIXED!
echo ═══════════════════════════════════════════════════════════════
echo.
echo WHAT WAS FIXED:
echo ✅ Admin user created/updated
echo ✅ Profile data created/updated
echo ✅ Sample data added (skills, projects, education)
echo.
echo ═══════════════════════════════════════════════════════════════
echo  🔐 ADMIN LOGIN CREDENTIALS
echo ═══════════════════════════════════════════════════════════════
echo.
echo Username: admin
echo Password: admin123
echo.
echo Admin URL: http://localhost:3001/admin/login
echo.
echo ═══════════════════════════════════════════════════════════════
echo  📱 YOUR PORTFOLIO
echo ═══════════════════════════════════════════════════════════════
echo.
echo Profile Name: Diro Uchure
echo Title: Full Stack Web Developer
echo Email: dirouchure@gmail.com
echo Phone: +251940672637
echo.
echo Home Page: http://localhost:3001
echo.
echo ═══════════════════════════════════════════════════════════════
echo  ⚠️ IMPORTANT - RESTART SERVERS
echo ═══════════════════════════════════════════════════════════════
echo.
echo For changes to take effect, restart your portfolio:
echo.
echo Option 1: Close backend and frontend windows, then run:
echo          AUTO_START_PORTFOLIO.bat
echo.
echo Option 2: Just refresh your browser (Ctrl + F5)
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 🎉 All done! Your profile and admin should now work!
echo.
echo Test now:
echo 1. Open: http://localhost:3001
echo 2. Check profile appears (Diro Uchure)
echo 3. Go to: http://localhost:3001/admin/login
echo 4. Login with: admin / admin123
echo.
echo Press any key to exit...
pause > nul
