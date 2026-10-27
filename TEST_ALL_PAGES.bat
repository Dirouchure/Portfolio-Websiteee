@echo off
color 0A
cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║         🔍 TESTING ALL PAGES AND ENDPOINTS                   ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo ═══════════════════════════════════════════════════════════════
echo  TESTING BACKEND ENDPOINTS
echo ═══════════════════════════════════════════════════════════════
echo.

echo Testing: /api/health
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:5001/api/health' -UseBasicParsing; if ($r.StatusCode -eq 200) { Write-Host '✅ Health endpoint OK' -ForegroundColor Green } } catch { Write-Host '❌ Health endpoint FAILED' -ForegroundColor Red }"

echo.
echo Testing: /api/profile
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:5001/api/profile' -UseBasicParsing; if ($r.StatusCode -eq 200) { Write-Host '✅ Profile endpoint OK' -ForegroundColor Green; $json = $r.Content | ConvertFrom-Json; Write-Host '   Name:' $json.full_name; Write-Host '   Title:' $json.title } else { Write-Host '❌ Profile endpoint returned:' $r.StatusCode -ForegroundColor Red } } catch { Write-Host '❌ Profile endpoint FAILED:' $_.Exception.Message -ForegroundColor Red }"

echo.
echo Testing: /api/skills
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:5001/api/skills' -UseBasicParsing; if ($r.StatusCode -eq 200) { $json = $r.Content | ConvertFrom-Json; Write-Host '✅ Skills endpoint OK (' $json.Count 'skills)' -ForegroundColor Green } } catch { Write-Host '❌ Skills endpoint FAILED' -ForegroundColor Red }"

echo.
echo Testing: /api/projects
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:5001/api/projects' -UseBasicParsing; if ($r.StatusCode -eq 200) { $json = $r.Content | ConvertFrom-Json; Write-Host '✅ Projects endpoint OK (' $json.Count 'projects)' -ForegroundColor Green } } catch { Write-Host '❌ Projects endpoint FAILED' -ForegroundColor Red }"

echo.
echo Testing: /api/education
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:5001/api/education' -UseBasicParsing; if ($r.StatusCode -eq 200) { $json = $r.Content | ConvertFrom-Json; Write-Host '✅ Education endpoint OK (' $json.Count 'items)' -ForegroundColor Green } } catch { Write-Host '❌ Education endpoint FAILED' -ForegroundColor Red }"

echo.
echo Testing: /api/certificates
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:5001/api/certificates' -UseBasicParsing; if ($r.StatusCode -eq 200) { $json = $r.Content | ConvertFrom-Json; Write-Host '✅ Certificates endpoint OK (' $json.Count 'certificates)' -ForegroundColor Green } } catch { Write-Host '❌ Certificates endpoint FAILED' -ForegroundColor Red }"

echo.
echo Testing: /api/stats
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:5001/api/stats' -UseBasicParsing; if ($r.StatusCode -eq 200) { Write-Host '✅ Stats endpoint OK' -ForegroundColor Green } } catch { Write-Host '❌ Stats endpoint FAILED' -ForegroundColor Red }"

echo.
echo ═══════════════════════════════════════════════════════════════
echo  SUMMARY
echo ═══════════════════════════════════════════════════════════════
echo.
echo If all tests show ✅, your backend is working perfectly!
echo.
echo Next, test frontend pages:
echo 1. Home: http://localhost:3001
echo 2. About: http://localhost:3001/about
echo 3. Skills: http://localhost:3001/skills
echo 4. Projects: http://localhost:3001/projects
echo 5. Education: http://localhost:3001/education
echo 6. Certificates: http://localhost:3001/certificates
echo 7. Contact: http://localhost:3001/contact
echo 8. Admin: http://localhost:3001/admin/login
echo.
echo Press any key to open Home page in browser...
pause > nul
start http://localhost:3001
