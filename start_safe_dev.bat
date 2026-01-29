@echo off
REM ====================================================
REM UGDES SAFE STARTUP SCRIPT
REM Bypasses "Project root contains #" error in Vite
REM ====================================================

REM 1. Unmount Z: if it exists (cleanup previous run)
if exist Z:\ (
    echo [INFO] Unmounting existing Z: drive...
    subst /d Z:
)

REM 2. Mount current folder to Z:
echo [INFO] Mounting project to Virtual Drive Z:...
subst Z: "%~dp0."

if %errorlevel% neq 0 (
    echo [ERROR] Failed to mount Z: drive.
    echo Please check if Z: is already used by another device.
    pause
    exit /b
)

REM 3. Switch to Z: and run dev server
Z:
echo [INFO] Successfully mounted. Moving to frontend...
cd frontend

echo [INFO] Starting Vite Server...
echo [TIP]  Your app will run at http://localhost:5173
echo. 
call npm run dev

REM 4. Cleanup when user exits
echo.
echo [INFO] Server stopped. Unmounting Z:...
subst /d Z:
pause
