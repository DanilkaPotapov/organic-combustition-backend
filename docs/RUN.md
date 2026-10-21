# Быстрый запуск ЛР2

```bash
npm install
cp .env.example .env
docker compose up -d
npm run migration:run
```

Затем открыть Adminer: `http://localhost:8081`.

Параметры:

- System: PostgreSQL
- Server: postgres
- Username: organic_compounds_user
- Password: organic_compounds_pass
- Database: organic_compounds_lab2

В `SQL command` выполнить весь файл `scripts/adminer-seed.sql`.

Для демонстрационных медиа:

```bash
npm run media:download
npm run minio:refresh
```

После этого:

```bash
npm run start:dev
```

Открыть:

- `http://localhost:3000/organic_compounds/feed`
- `http://localhost:3000/organic_compounds/add`
- `http://localhost:3000/organic_compounds/grid`
- `http://localhost:3000/organic_compounds/grid?carbonCount=2`
- MinIO: `http://localhost:9001`, `minioadmin / minioadmin`

## Как показать выбор файлов

На `/organic_compounds/add` нажать кнопку выбора файла у поля «Фото соединения» и выбрать картинку в Finder/Проводнике. Ниже таким же способом выбрать видео. После `Далее` файлы уже находятся в MinIO, а их URL записаны в `organic_compounds.image_url` и `organic_compounds.video_url`.
