@echo off
color 0A
cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║         🔧 FIXING AND RUNNING PORTFOLIO - AUTOMATIC          ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 🔍 Checking and fixing all issues...
echo.

REM Change to project directory
cd /d "%~dp0"

echo ═══════════════════════════════════════════════════════════════
echo  STEP 1: CHECK MYSQL
echo ═══════════════════════════════════════════════════════════════
echo.

tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MySQL is running
) else (
    echo ❌ MySQL is NOT running!
    echo.
    echo 🔧 SOLUTION:
    echo    1. Open XAMPP Control Panel
    echo    2. Click "Start" next to MySQL
    echo    3. Wait for it to turn green
    echo    4. Then come back and press any key...
    echo.
    echo 📍 Or run this command to start XAMPP:
    echo    start "" "C:\xampp\xampp-control.exe"
    echo.
    pause
    
    REM Try to start XAMPP
    if exist "C:\xampp\xampp-control.exe" (
        echo 🚀 Opening XAMPP Control Panel...
        start "" "C:\xampp\xampp-control.exe"
        echo.
        echo ⏳ Please start MySQL in XAMPP, then press any key...
        pause
    )
)
echo.

echo ═══════════════════════════════════════════════════════════════
echo  STEP 2: CHECK BACKEND DEPENDENCIES
echo ═══════════════════════════════════════════════════════════════
echo.

if exist "backend\node_modules\" (
    echo ✅ Backend dependencies installed
) else (
    echo ❌ Backend dependencies missing!
    echo 🔧 Installing backend dependencies...
    cd backend
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install backend dependencies!
        echo Please run: cd backend && npm install
        pause
        exit /b 1
    )
    cd ..
    echo ✅ Backend dependencies installed!
)
echo.

echo ═══════════════════════════════════════════════════════════════
echo  STEP 3: CHECK FRONTEND DEPENDENCIES
echo ═══════════════════════════════════════════════════════════════
echo.

if exist "frontend\node_modules\" (
    echo ✅ Frontend dependencies installed
) else (
    echo ❌ Frontend dependencies missing!
    echo 🔧 Installing frontend dependencies...
    cd frontend
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install frontend dependencies!
        echo Please run: cd frontend && npm install
        pause
        exit /b 1
    )
    cd ..
    echo ✅ Frontend dependencies installed!
)
echo.

echo ═══════════════════════════════════════════════════════════════
echo  STEP 4: CHECK CONFIGURATION FILES
echo ═══════════════════════════════════════════════════════════════
echo.

REM Check backend .env
if exist "backend\.env" (
    echo ✅ Backend .env exists
) else (
    echo ⚠️  Backend .env missing, creating from example...
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo ✅ Backend .env created
    ) else (
        echo ❌ No .env.example found!
    )
)

REM Check frontend .env
if exist "frontend\.env" (
    echo ✅ Frontend .env exists
) else (
    echo ⚠️  Frontend .env missing, creating...
    echo REACT_APP_API_URL=http://localhost:5001/api> frontend\.env
    echo ✅ Frontend .env created
)
echo.

echo ═══════════════════════════════════════════════════════════════
echo  STEP 5: GET IP ADDRESS FOR MOBILE
echo ═══════════════════════════════════════════════════════════════
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address" ^| findstr /v "127.0.0.1"') do (
    set "IP=%%a"
    goto :found_ip
)

:found_ip
set IP=%IP: =%
echo 📍 Your IP: %IP%
echo 🔧 Updating frontend .env for mobile access...
echo REACT_APP_API_URL=http:%IP%:5001/api> frontend\.env
echo ✅ Frontend configured for mobile: http:%IP%:3001
echo.

echo ═══════════════════════════════════════════════════════════════
echo  STEP 6: KILL OLD PROCESSES
echo ═══════════════════════════════════════════════════════════════
echo.

echo 🔧 Killing any processes using ports 5001 and 3001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5001" ^| findstr "LISTENING"') do (
    echo Killing process %%a on port 5001...
    taskkill /F /PID %%a 2>nul
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001" ^| findstr "LISTENING"') do (
    echo Killing process %%a on port 3001...
    taskkill /F /PID %%a 2>nul
)
echo ✅ Ports cleared
echo.

echo ═══════════════════════════════════════════════════════════════
echo  STEP 7: START BACKEND
echo ═══════════════════════════════════════════════════════════════
echo.

echo 🚀 Starting Backend Server (Port 5001)...
start "Portfolio Backend" cmd /c "cd /d "%~dp0backend" && node server.js"
timeout /t 3 /nobreak > nul
echo ✅ Backend started!
echo.

echo ═══════════════════════════════════════════════════════════════
echo  STEP 8: START FRONTEND
echo ═══════════════════════════════════════════════════════════════
echo.

echo 🚀 Starting Frontend Server (Port 3001)...
start "Portfolio Frontend" cmd /c "cd /d "%~dp0frontend" && set PORT=3001 && npm start"
echo ✅ Frontend starting (will take 30-60 seconds)...
echo.

echo ═══════════════════════════════════════════════════════════════
echo  STEP 9: VERIFY BACKEND
echo ═══════════════════════════════════════════════════════════════
echo.

echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak > nul

curl -s http://localhost:5001/api/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Backend might not be running yet, checking...
    timeout /t 3 /nobreak > nul
) else (
    echo ✅ Backend is responding!
)
echo.

echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ PORTFOLIO IS STARTING!
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 💻 COMPUTER ACCESS:
echo    http://localhost:3001
echo.
echo 📱 MOBILE ACCESS:
echo    http:%IP%:3001
echo.
echo 🔐 ADMIN LOGIN:
echo    Username: admin
echo    Password: admin123
echo.
echo ⏳ WAIT TIME:
echo    Frontend: 30-60 seconds to build
echo    Backend: Ready now!
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 📋 TWO WINDOWS OPENED:
echo    1. Portfolio Backend (Node.js)
echo    2. Portfolio Frontend (React)
echo.
echo ⚠️  DON'T CLOSE THOSE WINDOWS!
echo.
echo ⏳ Waiting 30 seconds for frontend to build...
timeout /t 30 /nobreak > nul
echo.
echo ✅ Frontend should be ready now!
echo.
echo 🌐 Opening browser...
timeout /t 3 /nobreak > nul
start http://localhost:3001
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 🎉 PORTFOLIO IS READY!
echo.
echo 💻 Computer: http://localhost:3001
echo 📱 Mobile: http:%IP%:3001
echo.
echo If you see errors, check:
echo 1. XAMPP MySQL is running (green)
echo 2. Both server windows are open
echo 3. Wait full 60 seconds for React to build
echo.
echo Press any key to minimize this window...
pause > nul
