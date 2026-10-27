@echo off
cls
color 0C
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  ⚡ EMERGENCY FIX - FIXING ADMIN & SPEED NOW                  ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo [STEP 1/7] Killing ALL node processes...
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 >nul
echo ✅ All node processes killed
echo.

echo [STEP 2/7] Clearing npm cache...
cd frontend
call npm cache clean --force >nul 2>&1
cd ..
echo ✅ Cache cleared
echo.

echo [STEP 3/7] Testing database connection...
cd backend
node test_db.js
cd ..
echo.

echo [STEP 4/7] Starting BACKEND server (Port 5001)...
cd backend
start /MIN cmd /c "title BACKEND-SERVER && color 0A && node server.js"
cd ..
timeout /t 4 >nul
echo ✅ Backend started
echo.

echo [STEP 5/7] Starting FRONTEND app (Port 3001)...
cd frontend
start /MIN cmd /c "title FRONTEND-APP && color 0B && set PORT=3001 && npm start"
cd ..
echo ✅ Frontend starting...
echo.

echo [STEP 6/7] Waiting for servers to fully start...
echo Please wait 30-40 seconds for React to compile...
timeout /t 35 >nul
echo.

echo [STEP 7/7] Testing connections...
echo.
echo Testing Backend API:
curl -s http://localhost:5001/api/health
echo.
echo.
echo Testing Profile Endpoint:
curl -s http://localhost:5001/api/profile
echo.
echo.

color 0A
echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ SERVERS ARE RUNNING!
echo.
echo 🌐 Website:  http://localhost:3001
echo 🔐 Admin:    http://localhost:3001/admin/login
echo 🔧 Backend:  http://localhost:5001
echo.
echo Admin Login:
echo   Username: admin
echo   Password: admin123
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo FIXES APPLIED:
echo ✅ Fixed frontend .env to use localhost (not mobile IP)
echo ✅ Removed slow stats API calls from About page
echo ✅ Cleaned npm cache
echo ✅ Restarted all servers fresh
echo.
echo Pages should load FAST now!
echo.
echo Opening website in 10 seconds...
timeout /t 10 >nul
start http://localhost:3001
echo.
echo Opening admin login in 3 seconds...
timeout /t 3 >nul
start http://localhost:3001/admin/login
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo ⚡ If admin STILL doesn't work:
echo.
echo 1. Press F12 in browser (Developer Tools)
echo 2. Go to "Console" tab
echo 3. Tell me what ERROR you see (red text)
echo.
echo ⚡ If pages STILL slow:
echo.
echo 1. Press Ctrl+Shift+Delete in browser
echo 2. Clear "Cached images and files"
echo 3. Clear "Cookies and site data"
echo 4. Close browser completely
echo 5. Open again and go to http://localhost:3001
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
pause
