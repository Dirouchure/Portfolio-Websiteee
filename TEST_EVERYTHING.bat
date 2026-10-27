@echo off
cls
color 0A
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  TESTING PORTFOLIO - ALL COMPONENTS                          ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo [1/4] Testing Database Connection...
cd backend
node test_db.js
cd ..

echo.
echo [2/4] Checking Backend Server...
echo Looking for process on port 5001...
netstat -ano | findstr :5001
echo.

echo [3/4] Checking Frontend Server...
echo Looking for process on port 3001...
netstat -ano | findstr :3001
echo.

echo [4/4] Testing API Endpoints...
echo Testing backend health endpoint...
curl http://localhost:5001/api/health
echo.
echo.

echo Testing profile endpoint...
curl http://localhost:5001/api/profile
echo.
echo.

echo ═══════════════════════════════════════════════════════════════
echo.
echo Tests complete! Check results above.
echo.
echo If servers not running:
echo - Backend: cd backend ; node server.js
echo - Frontend: cd frontend ; set PORT=3001 ; npm start
echo.
echo Or use: AUTO_START_PORTFOLIO.bat
echo.
pause
