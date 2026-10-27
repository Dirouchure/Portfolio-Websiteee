@echo off
color 0B
cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║         🔍 CHECKING PROFILE DATA IN DATABASE                 ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo ═══════════════════════════════════════════════════════════════
echo  DATABASE PROFILE DATA
echo ═══════════════════════════════════════════════════════════════
echo.

"C:\xampp\mysql\bin\mysql.exe" -u root -e "USE portfolio_db; SELECT full_name, title, email, phone, location FROM profile;"

echo.
echo ═══════════════════════════════════════════════════════════════
echo  TESTING BACKEND API
echo ═══════════════════════════════════════════════════════════════
echo.

echo Testing http://localhost:5001/api/profile
echo.

powershell -Command "$ErrorActionPreference='Stop'; try { $response = Invoke-RestMethod -Uri 'http://localhost:5001/api/profile' -Method Get; Write-Host 'SUCCESS! Backend is returning profile:' -ForegroundColor Green; Write-Host ''; Write-Host 'Name:' $response.full_name -ForegroundColor Cyan; Write-Host 'Title:' $response.title -ForegroundColor Cyan; Write-Host 'Email:' $response.email -ForegroundColor Cyan; Write-Host 'Phone:' $response.phone -ForegroundColor Cyan; Write-Host 'Location:' $response.location -ForegroundColor Cyan; Write-Host ''; Write-Host 'Backend API is working correctly!' -ForegroundColor Green } catch { Write-Host 'ERROR! Backend is not responding!' -ForegroundColor Red; Write-Host 'Error:' $_.Exception.Message -ForegroundColor Red }"

echo.
echo ═══════════════════════════════════════════════════════════════
echo  CHECKING FRONTEND CONFIGURATION
echo ═══════════════════════════════════════════════════════════════
echo.

echo Current API URL in frontend/.env:
type frontend\.env

echo.
echo ═══════════════════════════════════════════════════════════════
echo  ADMIN CREDENTIALS
echo ═══════════════════════════════════════════════════════════════
echo.

"C:\xampp\mysql\bin\mysql.exe" -u root -e "USE portfolio_db; SELECT username, email FROM admin;"

echo.
echo ═══════════════════════════════════════════════════════════════
echo  SUMMARY
echo ═══════════════════════════════════════════════════════════════
echo.
echo If you see profile data above, the database is working!
echo If backend test shows SUCCESS, the API is working!
echo.
echo Now check your browser:
echo 1. Press Ctrl + Shift + R (hard refresh)
echo 2. Open http://localhost:3001
echo 3. Profile should appear!
echo.
echo Press any key to exit...
pause > nul
