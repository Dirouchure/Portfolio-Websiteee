@echo off
echo ========================================
echo TESTING LOGIN SYSTEM
echo ========================================
echo.

cd backend
node test_login.js

echo.
echo Press any key to close...
pause > nul
