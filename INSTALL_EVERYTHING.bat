@echo off
cls
color 0B

echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  📦 INSTALLING ALL PACKAGES                                   ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo This will install ALL missing packages.
echo This might take 3-5 minutes.
echo.
echo Press any key to start installation...
pause >nul

cls

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 1/2: INSTALLING BACKEND PACKAGES
echo ═══════════════════════════════════════════════════════════════
echo.

cd backend

if exist "node_modules" (
    echo Backend packages already installed, skipping...
) else (
    echo Installing backend packages...
    echo This will take 2-3 minutes...
    echo.
    call npm install
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✅ Backend packages installed successfully!
    ) else (
        echo.
        echo ❌ Failed to install backend packages!
        echo.
        pause
        exit /b 1
    )
)

cd ..

echo.
echo ═══════════════════════════════════════════════════════════════
echo   STEP 2/2: INSTALLING FRONTEND PACKAGES
echo ═══════════════════════════════════════════════════════════════
echo.

cd frontend

if exist "node_modules" (
    echo Frontend packages already installed, skipping...
) else (
    echo Installing frontend packages...
    echo This will take 2-3 minutes...
    echo.
    call npm install
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✅ Frontend packages installed successfully!
    ) else (
        echo.
        echo ❌ Failed to install frontend packages!
        echo.
        pause
        exit /b 1
    )
)

cd ..

cls

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  ✅ ALL PACKAGES INSTALLED!                                   ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo Backend: ✅ Installed
echo Frontend: ✅ Installed
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo NOW YOU CAN START YOUR PORTFOLIO!
echo.
echo Next step: Double-click SIMPLE_START.bat
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

pause
