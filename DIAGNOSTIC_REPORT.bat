@echo off
cls
color 0E

echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  🔍 COMPREHENSIVE DIAGNOSTIC REPORT                           ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo Generating full diagnostic report...
echo This will save to: DIAGNOSTIC_REPORT.txt
echo.
pause

cls

(
echo ═══════════════════════════════════════════════════════════════
echo   DIRO PORTFOLIO - DIAGNOSTIC REPORT
echo   Date: %date% %time%
echo ═══════════════════════════════════════════════════════════════
echo.
echo.

echo [1/15] CHECKING NODE.JS
echo ═══════════════════════════════════════════════════════════════
node --version 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Status: INSTALLED
) else (
    echo Status: NOT INSTALLED
    echo ERROR: Node.js is not installed!
    echo Solution: Download from https://nodejs.org
)
echo.
echo.

echo [2/15] CHECKING NPM
echo ═══════════════════════════════════════════════════════════════
npm --version 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Status: INSTALLED
) else (
    echo Status: NOT INSTALLED
)
echo.
echo.

echo [3/15] CHECKING MYSQL PORT 3306
echo ═══════════════════════════════════════════════════════════════
netstat -an | findstr ":3306" 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Status: MYSQL IS RUNNING
) else (
    echo Status: MYSQL IS NOT RUNNING
    echo ERROR: MySQL is not running on port 3306
    echo Solution: Start XAMPP MySQL
)
echo.
echo.

echo [4/15] CHECKING PORT 5001 (BACKEND)
echo ═══════════════════════════════════════════════════════════════
netstat -an | findstr ":5001" 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Status: PORT 5001 IS IN USE
    echo Note: This is OK if backend is already running
) else (
    echo Status: PORT 5001 IS FREE
)
echo.
echo.

echo [5/15] CHECKING PORT 3001 (FRONTEND)
echo ═══════════════════════════════════════════════════════════════
netstat -an | findstr ":3001" 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Status: PORT 3001 IS IN USE
    echo Note: This is OK if frontend is already running
) else (
    echo Status: PORT 3001 IS FREE
)
echo.
echo.

echo [6/15] CHECKING BACKEND FILES
echo ═══════════════════════════════════════════════════════════════
if exist "backend\server.js" (
    echo ✅ backend\server.js EXISTS
) else (
    echo ❌ backend\server.js MISSING
)
if exist "backend\package.json" (
    echo ✅ backend\package.json EXISTS
) else (
    echo ❌ backend\package.json MISSING
)
if exist "backend\.env" (
    echo ✅ backend\.env EXISTS
) else (
    echo ❌ backend\.env MISSING
)
if exist "backend\node_modules" (
    echo ✅ backend\node_modules EXISTS
) else (
    echo ❌ backend\node_modules MISSING
    echo ERROR: Backend packages not installed
    echo Solution: cd backend ^&^& npm install
)
echo.
echo.

echo [7/15] CHECKING FRONTEND FILES
echo ═══════════════════════════════════════════════════════════════
if exist "frontend\src\App.js" (
    echo ✅ frontend\src\App.js EXISTS
) else (
    echo ❌ frontend\src\App.js MISSING
)
if exist "frontend\package.json" (
    echo ✅ frontend\package.json EXISTS
) else (
    echo ❌ frontend\package.json MISSING
)
if exist "frontend\.env" (
    echo ✅ frontend\.env EXISTS
) else (
    echo ❌ frontend\.env MISSING
)
if exist "frontend\node_modules" (
    echo ✅ frontend\node_modules EXISTS
) else (
    echo ❌ frontend\node_modules MISSING
    echo ERROR: Frontend packages not installed
    echo Solution: cd frontend ^&^& npm install
)
echo.
echo.

echo [8/15] CHECKING DATABASE FILES
echo ═══════════════════════════════════════════════════════════════
if exist "database\portfolio_db.sql" (
    echo ✅ database\portfolio_db.sql EXISTS
) else (
    echo ❌ database\portfolio_db.sql MISSING
)
echo.
echo.

echo [9/15] READING BACKEND .ENV FILE
echo ═══════════════════════════════════════════════════════════════
type backend\.env 2>&1
echo.
echo.

echo [10/15] READING FRONTEND .ENV FILE
echo ═══════════════════════════════════════════════════════════════
type frontend\.env 2>&1
echo.
echo.

echo [11/15] CHECKING RUNNING NODE PROCESSES
echo ═══════════════════════════════════════════════════════════════
tasklist | findstr "node.exe" 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Status: NODE PROCESSES ARE RUNNING
) else (
    echo Status: NO NODE PROCESSES RUNNING
)
echo.
echo.

echo [12/15] TESTING BACKEND CONNECTION (IF RUNNING)
echo ═══════════════════════════════════════════════════════════════
curl http://localhost:5001/api/health 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Status: BACKEND IS RESPONDING
) else (
    echo Status: BACKEND IS NOT RESPONDING
    echo Note: This is normal if backend is not running yet
)
echo.
echo.

echo [13/15] TESTING FRONTEND CONNECTION (IF RUNNING)
echo ═══════════════════════════════════════════════════════════════
curl http://localhost:3001 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Status: FRONTEND IS RESPONDING
) else (
    echo Status: FRONTEND IS NOT RESPONDING
    echo Note: This is normal if frontend is not running yet
)
echo.
echo.

echo [14/15] CHECKING BACKEND PACKAGE.JSON
echo ═══════════════════════════════════════════════════════════════
type backend\package.json 2>&1
echo.
echo.

echo [15/15] CHECKING FRONTEND PACKAGE.JSON
echo ═══════════════════════════════════════════════════════════════
type frontend\package.json 2>&1
echo.
echo.

echo ═══════════════════════════════════════════════════════════════
echo   DIAGNOSTIC REPORT COMPLETE
echo ═══════════════════════════════════════════════════════════════
echo.
echo Report saved to: DIAGNOSTIC_REPORT.txt
echo.
echo Next steps:
echo 1. Read this report
echo 2. Look for any ❌ errors
echo 3. Share the report with me
echo 4. I will fix the specific errors
echo.

) > DIAGNOSTIC_REPORT.txt

type DIAGNOSTIC_REPORT.txt

echo.
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ REPORT SAVED!
echo.
echo File: DIAGNOSTIC_REPORT.txt
echo.
echo Please:
echo 1. Open DIAGNOSTIC_REPORT.txt
echo 2. Read it
echo 3. Copy and paste the errors here
echo 4. I will fix them!
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

pause
notepad DIAGNOSTIC_REPORT.txt
