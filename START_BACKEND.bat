@echo off
echo ========================================
echo   Starting Portfolio Backend Server
echo ========================================
echo.
echo Checking Node.js installation...
node --version
echo.

cd backend

echo Installing dependencies...
call npm install
echo.

echo Starting server...
echo Backend will run on: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.
call npm start
