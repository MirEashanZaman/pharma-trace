@echo off
setlocal EnableDelayedExpansion

set TARGET_REVISION=%~1
if "%TARGET_REVISION%"=="" set TARGET_REVISION=HEAD~1

echo [Rollback] Initiating rollback to target revision: %TARGET_REVISION%

git fetch --all --tags
git checkout %TARGET_REVISION%
git submodule update --init --recursive

echo [Rollback] Rebuilding and restarting container cluster...
docker compose down --remove-orphans
docker compose up -d --build

echo [Rollback] Awaiting service health check...
timeout /t 5 /nobreak >nul

curl -s -f http://localhost/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [Rollback] Cluster successfully restored and verified healthy at %TARGET_REVISION%.
    exit /b 0
) else (
    echo [Rollback Error] Health check failed after rollback. Inspecting logs...
    docker compose logs --tail=50
    exit /b 1
)

