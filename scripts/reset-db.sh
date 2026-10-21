#!/bin/bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"
docker compose down -v
docker compose up -d postgres adminer minio minio-init
until docker exec potapov-organic-compounds-postgres pg_isready -U organic_compounds_user -d organic_compounds_lab3 >/dev/null 2>&1; do sleep 1; done
npm run migration:run
npm run db:seed
