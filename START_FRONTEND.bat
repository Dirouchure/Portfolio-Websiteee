@echo off
echo ========================================
echo   Starting Portfolio Frontend
echo ========================================
echo.
echo Checking Node.js installation...
node --version
echo.

cd frontend

echo Installing dependencies...
call npm install
echo.

echo Starting frontend...
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
call npm start
