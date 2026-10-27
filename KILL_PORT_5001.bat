@echo off
cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  KILL PROCESS ON PORT 5001                                   ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo Finding process using port 5001...
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5001') do (
    echo Found process: %%a
    echo Killing it...
    taskkill /F /PID %%a
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ Port 5001 should be free now!
echo.
echo Now start backend:
echo   cd backend
echo   node server.js
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
pause
