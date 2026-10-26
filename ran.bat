@echo off
cd /d "%~dp0"
title PharmaTrace Platform
echo ===================================================
echo Starting PharmaTrace Platform
echo ===================================================
echo Launching Backend API on port 3000...
start "PharmaTrace Backend" cmd /k "cd /d "%~dp0pharma-trace-backend" && npm run start:dev"

echo Launching Frontend Web App on port 3001...
start "PharmaTrace Frontend" cmd /k "cd /d "%~dp0pharma-trace-frontend" && npm run dev -- -p 3001"

echo Both services launched in separate windows.
