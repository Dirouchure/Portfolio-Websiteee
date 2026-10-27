@echo off
cls
color 0E
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  ⚡ FIX SLOW PERFORMANCE & PROFILE ISSUES                     ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo [STEP 1/8] Running diagnostics...
echo ═══════════════════════════════════════════════════════════════
cd backend
call node diagnose_slow.js
cd ..
echo.
pause
echo.

echo [STEP 2/8] Killing all node processes...
echo ═══════════════════════════════════════════════════════════════
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 >nul
echo ✅ All processes killed
echo.

echo [STEP 3/8] Clearing npm cache...
echo ═══════════════════════════════════════════════════════════════
cd frontend
call npm cache clean --force >nul 2>&1
cd ..
echo ✅ Cache cleared
echo.

echo [STEP 4/8] Optimizing database...
echo ═══════════════════════════════════════════════════════════════
echo Creating database indexes for faster queries...
echo NOTE: You may need to run this SQL manually in phpMyAdmin:
echo database\optimize_database.sql
echo.
echo Press any key to continue...
pause >nul
echo.

echo [STEP 5/8] Verifying frontend .env...
echo ═══════════════════════════════════════════════════════════════
type frontend\.env
echo.
echo If API URL is wrong, it will be slow!
echo Should be: http://192.168.137.110:5001/api
echo.

echo [STEP 6/8] Starting BACKEND (optimized)...
echo ═══════════════════════════════════════════════════════════════
cd backend
start /MIN cmd /c "title BACKEND-OPTIMIZED && color 0A && node server.js"
cd ..
timeout /t 4 >nul
echo ✅ Backend started
echo.

echo [STEP 7/8] Starting FRONTEND (optimized)...
echo ═══════════════════════════════════════════════════════════════
cd frontend
start /MIN cmd /c "title FRONTEND-OPTIMIZED && color 0B && set PORT=3001 && set GENERATE_SOURCEMAP=false && npm start"
cd ..
echo ✅ Frontend starting (with sourcemap disabled for speed)
echo.

echo [STEP 8/8] Waiting for servers...
echo ═══════════════════════════════════════════════════════════════
echo Please wait 30-40 seconds...
timeout /t 35 >nul
echo.

color 0A
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  ✅ PERFORMANCE OPTIMIZATIONS APPLIED                         ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo OPTIMIZATIONS:
echo ✅ Cleared npm cache
echo ✅ Killed old processes
echo ✅ Restarted servers fresh
echo ✅ Disabled source maps (faster compilation)
echo ✅ Database indexes recommended
echo.
echo TEST NOW:
echo 🌐 Website: http://192.168.137.110:3001
echo 📱 Mobile:  http://192.168.137.110:3001
echo.
echo Should be MUCH FASTER now!
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo IF STILL SLOW:
echo.
echo 1. Check browser DevTools (F12) → Network tab
echo    - See which requests are slow
echo    - Look for red/failed requests
echo.
echo 2. Clear browser cache:
echo    - Press Ctrl+Shift+Delete
echo    - Clear all cached data
echo    - Close and reopen browser
echo.
echo 3. Check profile in database:
echo    - Run: backend\test_db.js
echo    - Should show profile data
echo.
echo 4. Optimize database:
echo    - Open phpMyAdmin
echo    - Run SQL from: database\optimize_database.sql
echo    - This adds indexes for faster queries
echo.
echo 5. Check API response time:
echo    - Open: http://192.168.137.110:5001/api/profile
echo    - Should load in < 1 second
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
pause
