@echo off
cls
color 0A
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║              🔍 YOUR COMPUTER'S IP ADDRESS                    ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo.
echo 📍 Finding your IP address...
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    goto :found
)

:found
echo ✅ YOUR LOCAL IP ADDRESS:
echo.
echo     %IP%
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 📱 USE THIS URL ON YOUR MOBILE:
echo.
echo     http:%IP%:3001
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 📋 INSTRUCTIONS:
echo.
echo 1. Make sure your phone is on the SAME WiFi
echo 2. Open browser on your phone
echo 3. Type the URL above
echo 4. Enjoy your portfolio! 🎉
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo.

ipconfig | findstr /i "IPv4"

echo.
echo.
echo Press any key to close...
pause > nul
