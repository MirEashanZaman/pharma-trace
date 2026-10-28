#!/usr/bin/env bash
set -euo pipefail

TARGET_REVISION="${1:-HEAD~1}"

echo "[Rollback] Initiating rollback to target revision: ${TARGET_REVISION}"

git fetch --all --tags
git checkout "${TARGET_REVISION}"
git submodule update --init --recursive

echo "[Rollback] Rebuilding and restarting container cluster..."
docker compose down --remove-orphans
docker compose up -d --build

echo "[Rollback] Awaiting service health check..."
MAX_ATTEMPTS=15
ATTEMPT=0
HEALTH_OK=false

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health || true)
    if [ "$HTTP_STATUS" = "200" ]; then
        HEALTH_OK=true
        break
    fi
    sleep 2
done

if [ "$HEALTH_OK" = "true" ]; then
    echo "[Rollback] Cluster successfully restored and verified healthy at ${TARGET_REVISION}."
    exit 0
else
    echo "[Rollback Error] Health check failed after rollback. Inspecting logs..."
    docker compose logs --tail=50
    exit 1
fi

