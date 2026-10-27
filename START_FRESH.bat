@echo off
cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  START FRESH - KILL PORT 5001 AND RESTART                    ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo [1/4] Killing all Node.js processes...
echo.
taskkill /F /IM node.exe /T 2>nul
if %errorlevel% == 0 (
    echo ✅ Killed old Node processes
) else (
    echo ⚠️  No Node processes found
)

timeout /t 2 >nul

echo.
echo [2/4] Verifying port 5001 is free...
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5001 2^>nul') do (
    echo Found lingering process on 5001: %%a
    taskkill /F /PID %%a 2>nul
)

timeout /t 2 >nul

echo.
echo [3/4] Starting Backend on port 5001...
echo.

cd backend
start cmd /k "title BACKEND-PORT-5001 && color 0A && echo. && echo ═══════════════════════════════════════════ && echo   BACKEND SERVER - PORT 5001 && echo ═══════════════════════════════════════════ && echo. && echo Starting... && echo. && node server.js"

echo Waiting for backend to start...
timeout /t 5 >nul

echo.
echo [4/4] Starting Frontend on port 3001...
echo.

cd ..\frontend
start cmd /k "title FRONTEND-PORT-3001 && color 0B && echo. && echo ═══════════════════════════════════════════ && echo   FRONTEND APP - PORT 3001 && echo ═══════════════════════════════════════════ && echo. && echo Starting... && echo. && set PORT=3001 && npm start"

cd ..

echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ BOTH SERVERS STARTING!
echo.
echo Two windows opened:
echo   🟢 GREEN = Backend (port 5001)
echo   🔵 BLUE = Frontend (port 3001)
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo WAIT 30-60 SECONDS, THEN CHECK:
echo.
echo 1. GREEN window should show:
echo    "Server running on port 5001"
echo    "✅ Database connected successfully!"
echo.
echo 2. BLUE window should show:
echo    "Compiled successfully!"
echo    "Local: http://localhost:3001"
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo THEN TEST:
echo.
echo 1. Backend: http://localhost:5001/api/health
echo    Should show: {"status": "OK"}
echo.
echo 2. Website: http://localhost:3001
echo    Should show: Your portfolio
echo.
echo 3. Login: http://localhost:3001/admin/login
echo    Username: admin
echo    Password: admin123
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo IF GREEN WINDOW SHOWS ERROR:
echo    Take screenshot and tell me what it says!
echo.
echo IF BLUE WINDOW SHOWS ERROR:
echo    Take screenshot and tell me what it says!
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
pause
