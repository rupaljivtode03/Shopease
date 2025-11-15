@echo off
echo Starting Shopease Application...
echo.

echo Starting Backend Server...
cd backend
start cmd /k "python app.py"
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
cd ..\frontend
start cmd /k "python -m http.server 8000"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo Application Started!
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:8000
echo.
echo Press any key to open browser...
pause >nul
start http://localhost:8000

