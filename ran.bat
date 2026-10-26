@echo off
cd /d "%~dp0"
title PharmaTrace Platform Launcher
echo ======================================================================
echo Starting PharmaTrace Anti-Counterfeit Platform (Full Stack)
echo ======================================================================

echo [1/3] Launching Hardhat Blockchain Node on http://127.0.0.1:8545...
start "Hardhat EVM Node" cmd /k "cd /d "%~dp0pharma-trace-backend" && npx hardhat node"

timeout /t 3 /nobreak >nul

echo [2/3] Launching Backend API Server on http://localhost:3500...
start "PharmaTrace Backend" cmd /k "cd /d "%~dp0pharma-trace-backend" && npm run start:dev"

echo [3/3] Launching Frontend Web Interface on http://localhost:3001...
start "PharmaTrace Frontend" cmd /k "cd /d "%~dp0pharma-trace-frontend" && npm run dev -- -p 3001"

echo Waiting for services to initialize before opening Chrome...
timeout /t 6 /nobreak >nul

echo Opening PharmaTrace in Google Chrome...
start chrome http://localhost:3001 2>nul || start http://localhost:3001

echo ======================================================================
echo Blockchain Node:   http://127.0.0.1:8545
echo Backend API:       http://localhost:3500
echo Frontend Web App:  http://localhost:3001
echo Application launched in Google Chrome.
echo ======================================================================
