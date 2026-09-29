@echo off
echo ===================================================
echo   Gujarat Police CCTV Intelligence Platform
echo   Starting Backend (port 8001) + Frontend (port 5173)
echo ===================================================

cd /d "%~dp0"

echo [1/2] Starting FastAPI Backend on port 8001...
start "CCTV Backend" cmd /k "python -m uvicorn src.api.app:app --host 0.0.0.0 --port 8001 --reload"

echo [2/2] Starting React Frontend on port 5173...
cd frontend
start "CCTV Frontend" cmd /k "npx vite --host 0.0.0.0 --port 5173"

echo.
echo ===================================================
echo   Platform URLs:
echo   - Frontend: http://localhost:5173/
echo   - Backend:  http://localhost:8001/
echo   - API Docs: http://localhost:8001/docs
echo ===================================================
echo.
pause
