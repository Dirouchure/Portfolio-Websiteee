@echo off
echo ========================================
echo   PORTFOLIO SETUP AND START
echo ========================================
echo.

echo Step 1: Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org
    echo Download the LTS version and install it.
    echo Then run this script again.
    pause
    exit
)
node --version
echo OK - Node.js is installed
echo.

echo Step 2: Checking MySQL...
netstat -an | find "3306" | find "LISTENING" >nul
if %errorlevel% neq 0 (
    echo WARNING: MySQL might not be running!
    echo Please:
    echo 1. Open XAMPP Control Panel
    echo 2. Click START next to MySQL
    echo 3. Wait for green "Running" status
    echo.
    pause
)
echo OK - MySQL is running
echo.

echo Step 3: Installing Backend Dependencies...
cd backend
if exist node_modules (
    echo Dependencies already installed
) else (
    echo Installing... This may take a few minutes...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit
    )
)
echo OK - Backend dependencies installed
echo.

echo Step 4: Testing Database Connection...
node test_connection.js
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Cannot connect to database!
    echo.
    echo Please check:
    echo 1. MySQL is running in XAMPP
    echo 2. Database 'portfolio_db' exists in phpMyAdmin
    echo 3. Import database\portfolio_db.sql if needed
    echo.
    pause
    cd ..
    exit
)
echo.

echo Step 5: Starting Backend Server...
echo Server will run on: http://localhost:5000
echo.
echo DO NOT CLOSE THIS WINDOW!
echo.
start "Portfolio Frontend" cmd /k "cd /d %~dp0 && call START_FRONTEND_DELAYED.bat"
echo.
echo Starting backend...
call npm start
