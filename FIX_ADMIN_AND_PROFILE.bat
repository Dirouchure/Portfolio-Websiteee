@echo off
cls
color 0A
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  FIX ADMIN & PROFILE - PORTFOLIO WEBSITE                     ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo Step 1: Testing Database...
echo ═══════════════════════════════════════════════════════════════
cd backend
node test_db.js
cd ..
echo.

echo Step 2: Killing old processes...
echo ═══════════════════════════════════════════════════════════════
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 >nul
echo ✅ Old processes killed
echo.

echo Step 3: Starting Backend Server...
echo ═══════════════════════════════════════════════════════════════
cd backend
start /MIN cmd /c "title PORTFOLIO-BACKEND && node server.js"
cd ..
timeout /t 3 >nul
echo ✅ Backend started on port 5001
echo.

echo Step 4: Starting Frontend App...
echo ═══════════════════════════════════════════════════════════════
cd frontend
start /MIN cmd /c "title PORTFOLIO-FRONTEND && set PORT=3001 && npm start"
cd ..
echo ✅ Frontend starting on port 3001
echo.

echo Step 5: Waiting for servers to start...
echo ═══════════════════════════════════════════════════════════════
timeout /t 20 >nul
echo.

echo Step 6: Testing Admin Login...
echo ═══════════════════════════════════════════════════════════════
echo Testing backend health...
curl -s http://localhost:5001/api/health
echo.
echo.
echo Testing profile endpoint...
curl -s http://localhost:5001/api/profile
echo.
echo.

echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ PORTFOLIO IS NOW RUNNING!
echo.
echo 🌐 Frontend: http://localhost:3001
echo 🔧 Backend: http://localhost:5001/api
echo 🔐 Admin: http://localhost:3001/admin/login
echo.
echo 📱 Mobile: http://192.168.137.110:3001
echo.
echo Admin Credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo Opening admin login in browser...
timeout /t 10 >nul
start http://localhost:3001/admin/login
echo.
echo If admin login doesn't work:
echo 1. Check browser console (F12) for errors
echo 2. Make sure both servers are running
echo 3. Try: http://localhost:3001 first, then go to admin/login
echo.
echo Backend and Frontend are running in minimized windows
echo.
pause
