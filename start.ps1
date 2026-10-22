# WashSlot PowerShell Launcher
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "          WashSlot - Bengaluru Bay Booking Platform               " -ForegroundColor Cyan
Write-Host "===================================================================" -ForegroundColor Cyan

Set-Location -Path $PSScriptRoot

if (-not (Test-Path "node_modules")) {
    Write-Host "`n[1/2] Installing dependencies with npm..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "`n[1/2] Dependencies found." -ForegroundColor Green
}

Write-Host "`n[2/2] Starting Vite local development server..." -ForegroundColor Yellow
Write-Host "-------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host " Local App URL:  http://localhost:5173" -ForegroundColor Green
Write-Host " Customer View:  http://localhost:5173/" -ForegroundColor White
Write-Host " Vendor Mode:    http://localhost:5173/vendor" -ForegroundColor White
Write-Host "-------------------------------------------------------------------`n" -ForegroundColor DarkGray

Start-Process "http://localhost:5173"
npm run dev
