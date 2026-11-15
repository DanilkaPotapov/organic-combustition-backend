#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
docker compose exec -T redis redis-cli --eval /dev/stdin < scripts/active_users.lua
