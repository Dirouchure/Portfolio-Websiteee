@echo off
echo ========================================
echo VERIFYING ADMIN USER
echo ========================================
echo.

cd backend
node verify_admin.js

echo.
echo Press any key to close...
pause > nul
