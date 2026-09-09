# Запуск проекта

## Что установить

- Node.js 20 или 22 LTS;
- Docker Desktop;
- Git.

Проверка:

```bash
node -v
npm -v
docker --version
docker compose version
git --version
```

## Первый запуск

В терминале перейди в папку проекта и выполни:

```bash
npm install
```

Далее запусти MinIO:

```bash
docker compose up -d
```

Проверь контейнеры:

```bash
docker compose ps
```

Запусти NestJS:

```bash
npm run start:dev
```

Открой:

```text
http://localhost:3000/compounds/feed
http://localhost:3000/compounds/draft
http://localhost:3000/compounds/grid
```

Для проверки фильтра:

```text
http://localhost:3000/compounds/grid?maxMass=46.07
```

Для проверки `next=true`:

```text
http://localhost:3000/compounds/feed/3?next=true
```

## MinIO

Console:

```text
http://localhost:9001
```

Учетные данные:

```text
minioadmin
minioadmin
```

В bucket `organic-media` должны появиться `.png` и `.webm`.

## Если медиа не открываются

Сначала проверь `docker compose ps`. Затем открой напрямую:

```text
http://localhost:9000/organic-media/ethanol.png
http://localhost:9000/organic-media/ethanol.webm
```

Если bucket пустой, пересоздай контейнеры:

```bash
docker compose down
docker compose up -d
```

## Остановка

NestJS: `Ctrl+C`.

MinIO:

```bash
docker compose down
```
