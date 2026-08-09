@echo off
echo ========================================
echo CHECKING PORTFOLIO WEBSITE - ALL FILES
echo ========================================
echo.

cd backend
node check_all_systems.js

echo.
echo Press any key to close...
pause > nul
