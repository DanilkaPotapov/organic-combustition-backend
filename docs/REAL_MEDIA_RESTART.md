# Как обновить реальные медиа и перезапустить проект

## Первый раз

Из корня проекта:

```bash
npm install
npm run media:download
npm run minio:refresh
npm run start:dev
```

Затем открой:

- http://localhost:3000/compounds/grid
- http://localhost:3000/compounds/feed
- http://localhost:9001

MinIO: `minioadmin` / `minioadmin`.

## Если поменял только фото/видео

NestJS переустанавливать не нужно.

1. Останови NestJS (`Ctrl+C`).
2. При необходимости повторно скачай медиа:

```bash
npm run media:download
```

3. Полностью пересоздай MinIO, чтобы старые объекты точно исчезли:

```bash
npm run minio:refresh
```

4. Запусти NestJS:

```bash
npm run start:dev
```

5. В браузере сделай жёсткое обновление: `Cmd+Shift+R`.

## Проверка

```bash
ls -lh media
```

Должны быть реальные PNG/WEBM.

Проверка напрямую через MinIO:

- http://localhost:9000/organic-media/ethanol.png
- http://localhost:9000/organic-media/ethanol.webm
- http://localhost:9000/organic-media/propene.webm

Если браузер показывает старую картинку, используй `Cmd+Shift+R` или открой DevTools → Network → Disable cache и обнови страницу.
