@echo off
title WashSlot - Bengaluru Hyperlocal Auto Wash Platform
color 0B
echo ===================================================================
echo               WashSlot - Bengaluru Bay Booking Platform            
echo ===================================================================
echo.
cd /d "%~dp0"

echo [1/2] Checking dependencies...
if not exist "node_modules" (
    echo node_modules not found. Running npm install...
    call npm install
    if %errorlevel% neq 0 (
        echo Error installing dependencies.
        pause
        exit /b %errorlevel%
    )
) else (
    echo Dependencies verified.
)

echo.
echo [2/2] Starting Vite local development server...
echo.
echo -------------------------------------------------------------------
echo  Local App URL:  http://localhost:5173
echo  Customer View:  http://localhost:5173/
echo  Vendor Mode:    http://localhost:5173/vendor
echo -------------------------------------------------------------------
echo.
echo Opening browser in 2 seconds...
timeout /t 2 /nobreak >nul
start "" "http://localhost:5173"

call npm run dev
pause
