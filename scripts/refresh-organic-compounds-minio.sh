#!/bin/bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

docker compose up -d organic-compounds-minio
docker compose rm -sf organic-compounds-media-init >/dev/null 2>&1 || true
docker compose up -d --force-recreate organic-compounds-media-init
sleep 2
docker compose logs organic-compounds-media-init --tail=30 || true

echo "MinIO console: http://localhost:9001"
echo "Bucket: organic-compounds-media"
