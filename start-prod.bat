@echo off
title WashSlot - Local Production Server
color 0A
echo ===================================================================
echo               WashSlot - Local Production Server                   
echo ===================================================================
echo.
cd /d "%~dp0"

echo Building optimized bundle...
call npm run build

echo.
echo Starting standalone local server at http://localhost:3000...
start "" "http://localhost:3000"
node server.js
pause
