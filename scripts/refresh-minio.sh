#!/bin/bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Remove a container left by an older version of the lab if it still exists.
docker rm -f organic-analysis-minio >/dev/null 2>&1 || true

# Recreate MinIO storage so there are no old generated media objects in the bucket.
docker compose down -v --remove-orphans >/dev/null 2>&1 || true
docker compose up -d

echo ""
echo "MinIO restarted. Waiting for media import..."
sleep 4
docker compose logs minio-init --tail=30 || true

echo ""
echo "MinIO console: http://localhost:9001"
echo "Public media example: http://localhost:9000/organic-media/ethanol.png"
