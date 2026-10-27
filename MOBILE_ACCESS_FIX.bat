@echo off
cls
color 0B
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  📱 FIX MOBILE ACCESS - COMPLETE SOLUTION                     ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo [STEP 1/6] Checking current IP address...
echo ═══════════════════════════════════════════════════════════════
ipconfig | findstr /C:"IPv4"
echo.

echo [STEP 2/6] Adding Windows Firewall rules...
echo ═══════════════════════════════════════════════════════════════
echo Creating rule for Backend (Port 5001)...
netsh advfirewall firewall delete rule name="Portfolio Backend" >nul 2>&1
netsh advfirewall firewall add rule name="Portfolio Backend" dir=in action=allow protocol=TCP localport=5001
echo ✅ Backend firewall rule added
echo.

echo Creating rule for Frontend (Port 3001)...
netsh advfirewall firewall delete rule name="Portfolio Frontend" >nul 2>&1
netsh advfirewall firewall add rule name="Portfolio Frontend" dir=in action=allow protocol=TCP localport=3001
echo ✅ Frontend firewall rule added
echo.

echo [STEP 3/6] Updating frontend .env for mobile access...
echo ═══════════════════════════════════════════════════════════════
cd frontend
echo # API URL - Use PC IP address to work on both localhost and mobile > .env
echo REACT_APP_API_URL=http://192.168.137.110:5001/api >> .env
cd ..
echo ✅ Frontend .env updated
echo.

echo [STEP 4/6] Killing old processes...
echo ═══════════════════════════════════════════════════════════════
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 >nul
echo ✅ Old processes killed
echo.

echo [STEP 5/6] Starting servers...
echo ═══════════════════════════════════════════════════════════════
echo Starting Backend...
cd backend
start /MIN cmd /c "title BACKEND-MOBILE && color 0A && node server.js"
cd ..
timeout /t 3 >nul
echo ✅ Backend started on port 5001
echo.

echo Starting Frontend...
cd frontend
start /MIN cmd /c "title FRONTEND-MOBILE && color 0B && set PORT=3001 && npm start"
cd ..
echo ✅ Frontend starting on port 3001
echo.

echo [STEP 6/6] Waiting for servers to fully start...
echo ═══════════════════════════════════════════════════════════════
echo Please wait 30-40 seconds for React to compile...
timeout /t 35 >nul
echo.

color 0A
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  ✅ MOBILE ACCESS CONFIGURED!                                 ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 📱 ACCESS FROM MOBILE:
echo.
echo   Website: http://192.168.137.110:3001
echo   Admin:   http://192.168.137.110:3001/admin/login
echo.
echo 💻 ACCESS FROM PC:
echo.
echo   Website: http://192.168.137.110:3001
echo   Or:      http://localhost:3001
echo   Admin:   http://192.168.137.110:3001/admin/login
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ Firewall rules: ADDED
echo ✅ Frontend .env: UPDATED (using IP address)
echo ✅ Backend: RUNNING
echo ✅ Frontend: COMPILING (wait a bit more if needed)
echo.
echo 📱 IMPORTANT - On your mobile phone:
echo.
echo 1. Connect to SAME WiFi as your PC
echo 2. Open browser
echo 3. Go to: http://192.168.137.110:3001
echo 4. If WiFi name is different, IP might be different
echo 5. Check PC WiFi settings to confirm
echo.
echo ⚠️  If mobile STILL can't connect:
echo.
echo 1. Make sure mobile is on SAME WiFi network
echo 2. Ping PC from mobile: ping 192.168.137.110
echo 3. Turn off VPN on mobile if enabled
echo 4. Check PC WiFi adapter (not Ethernet)
echo 5. Try restarting WiFi on both devices
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
pause
