@echo off
echo ========================================
echo   Starting Frontend (waiting 10 seconds)
echo ========================================
echo.
echo Waiting for backend to start...
timeout /t 10 /nobreak

cd frontend

echo Installing Frontend Dependencies...
if exist node_modules (
    echo Dependencies already installed
) else (
    echo Installing... This may take a few minutes...
    call npm install
)
echo.

echo Starting Frontend...
echo Browser will open at: http://localhost:3000
echo.
call npm start
