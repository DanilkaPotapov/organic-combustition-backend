# Запуск ЛР3

## Первый запуск

```bash
npm install
npm run media:download
npm run db:reset
npm run minio:refresh
npm run start:dev
```

## Повторный запуск

```bash
docker compose up -d
npm run start:dev
```

## Полный чистый сброс БД

```bash
npm run db:reset
```

После сброса у пользователя `id=1` нет draft, поэтому `POST /api/organic_compounds` можно демонстрировать с чистого состояния.
