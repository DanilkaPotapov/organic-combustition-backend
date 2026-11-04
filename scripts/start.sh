set -euo pipefail
cd "$(dirname "$0")/.."
if [ ! -f .env ]; then cp .env.example .env; fi
npm ci
docker compose up -d --wait postgres redis minio adminer
docker compose run --rm minio-init
npm run migration:run
npm run db:seed
npm run start:dev
