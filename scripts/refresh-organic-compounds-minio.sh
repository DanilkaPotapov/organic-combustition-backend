#!/bin/bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"
docker compose up -d minio
docker compose rm -sf minio-init >/dev/null 2>&1 || true
docker compose up -d --force-recreate minio-init
sleep 2
docker compose logs minio-init --tail=30 || true
