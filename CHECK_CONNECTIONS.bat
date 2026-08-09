@echo off
echo ========================================
echo   CHECKING ALL CONNECTIONS
echo ========================================
echo.

echo [1/4] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not installed!
    echo Install from: https://nodejs.org
    pause
    exit
)
echo OK - Node.js is installed
echo.

echo [2/4] Checking MySQL (XAMPP)...
netstat -an | find "3306" | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo OK - MySQL is running on port 3306
) else (
    echo WARNING: MySQL might not be running!
    echo Please start MySQL in XAMPP Control Panel
)
echo.

echo [3/4] Testing Backend Database Connection...
cd backend
call npm install --silent
node test_connection.js
cd ..
echo.

echo [4/4] Checking Frontend Configuration...
echo Frontend API URL should be: http://localhost:5000/api
findstr "localhost:5000" frontend\src\config\api.js >nul
if %errorlevel% equ 0 (
    echo OK - Frontend configured to connect to backend
) else (
    echo WARNING: Frontend API URL might be wrong
)
echo.

echo ========================================
echo   CONNECTION CHECK COMPLETE
echo ========================================
echo.
echo Next Steps:
echo 1. If all OK: Run START_BACKEND.bat
echo 2. Then run START_FRONTEND.bat
echo 3. Login at: http://localhost:3000/admin/login
echo.
pause
