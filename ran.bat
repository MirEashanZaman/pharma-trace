@echo off
cd /d "%~dp0"
title PharmaTrace Platform Launcher
echo ======================================================================
echo Starting PharmaTrace Anti-Counterfeit Platform (Full Stack)
echo ======================================================================

echo [1/2] Launching Backend API Server on http://localhost:3000...
start "PharmaTrace Backend" cmd /k "cd /d "%~dp0pharma-trace-backend" && npm run start:dev"

echo [2/2] Launching Frontend Web Interface on http://localhost:3001...
start "PharmaTrace Frontend" cmd /k "cd /d "%~dp0pharma-trace-frontend" && npm run dev -- -p 3001"

echo ======================================================================
echo Backend API:       http://localhost:3000
echo Frontend Web App:  http://localhost:3001
echo ======================================================================
