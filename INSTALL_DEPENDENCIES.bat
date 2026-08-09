@echo off
echo ========================================
echo   INSTALLING ALL DEPENDENCIES
echo ========================================
echo.

echo Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not installed!
    echo Install from: https://nodejs.org
    pause
    exit
)
echo.

echo [1/2] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit
)
echo OK - Backend dependencies installed
cd ..
echo.

echo [2/2] Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit
)
echo OK - Frontend dependencies installed
cd ..
echo.

echo ========================================
echo   ALL DEPENDENCIES INSTALLED!
echo ========================================
echo.
echo Now you can run: SETUP_AND_START.bat
echo.
pause
