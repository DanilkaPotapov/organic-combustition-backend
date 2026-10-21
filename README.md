# ЛР3 — Organic Compounds REST API · Потапов Данил ИУ5-54Б

Тема №20: **«Определение формулы органического соединения по продуктам сгорания»**.

ЛР3 продолжает ЛР2, но интерфейс Handlebars больше не используется: лабораторная показывается только через Postman/Insomnia. Backend — NestJS, PostgreSQL, TypeORM, MinIO.

## Исправления после ЛР1/ЛР2

- предметные поля заменены на `carbon_count` и `hydrogen_count`;
- фильтр списка работает по `carbonCount`;
- основной домен, таблица и API называются `organic_compounds`;
- старые `formula`, `molar_mass`, `/formulas` удалены;
- убраны UNIQUE-ограничения из схемы;
- пароль появился в таблице `users` как `password_hash`;
- новые изображение и видео приходят настоящими файлами `multipart/form-data`;
- в БД сохраняются имена файлов, бинарные файлы хранятся в MinIO;
- все ответы с услугой имеют одинаковый набор полей, пустые значения возвращаются как `null`;
- приложение не формирует собственные поля `statusCode`/`message` в успешных ответах;
- исходники ЛР3 не содержат комментариев.

## Ровно 10 HTTP-методов

| № | Метод | URL | Назначение |
|---|---|---|---|
| 1 | GET | `/api/organic_compounds?carbonCount=2` | Список опубликованных услуг с фильтром по количеству C |
| 2 | GET | `/api/organic_compounds/feed/:id?` | Лента опубликованных услуг; `?next=true` открывает следующую |
| 3 | GET | `/api/organic_compounds/draft` | Черновик текущего пользователя без ID в URL |
| 4 | POST | `/api/organic_compounds` | Создание draft с файлами `image` и `video` |
| 5 | PUT | `/api/organic_compounds/:id/publish` | Публикация собственного draft |
| 6 | DELETE | `/api/organic_compounds/:id` | Soft delete собственной услуги |
| 7 | POST | `/api/organic_compounds/:id/like` | `value=1` ставит лайк, `value=0` снимает |
| 8 | POST | `/api/users/register` | Регистрация пользователя |
| 9 | POST | `/api/users/auth` | Заглушка аутентификации для ЛР4 |
| 10 | POST | `/api/users/logout` | Заглушка деавторизации для ЛР4 |

`GET /api/organic_compounds/feed` и `GET /api/organic_compounds/feed/2?next=true` — два варианта вызова **одного** HTTP-метода.

## Текущий пользователь

В ЛР3 авторизации еще нет. Создатель фиксирован через singleton-функцию:

`src/shared/current_user.ts`

Текущий пользователь всегда имеет `id = 1`. Эта функция вызывается в методах домена `organic_compounds`.

## Одинаковый JSON услуги

Каждый успешный ответ, содержащий услугу, использует один serializer и поля:

- `id`
- `name`
- `shortDescription`
- `status`
- `imageUrl`
- `videoUrl`
- `carbonCount`
- `hydrogenCount`
- `createdAt`
- `creatorId`
- `formedAt`
- `likeCount`
- `isOwner`
- `isLiked`

У draft поля, которые еще не заполнены, присутствуют со значением `null`.

## Таблицы

### `users`

| Поле | Тип | NULLABLE |
|---|---|---|
| `id` | SERIAL PK | нет |
| `name` | VARCHAR(120) | нет |
| `email` | VARCHAR(160) | нет |
| `password_hash` | VARCHAR(64) | нет |

### `organic_compounds`

| Поле | Тип | NULLABLE |
|---|---|---|
| `id` | SERIAL PK | нет |
| `name` | VARCHAR(120) | нет |
| `short_description` | VARCHAR(240) | да |
| `status` | `organic_compound_status` | нет |
| `image_file_name` | VARCHAR(255) | нет |
| `video_file_name` | VARCHAR(255) | нет |
| `carbon_count` | INTEGER | да |
| `hydrogen_count` | INTEGER | да |
| `created_at` | TIMESTAMPTZ | нет |
| `creator_id` | INTEGER FK | нет |
| `formed_at` | TIMESTAMPTZ | да |

### `organic_compound_likes`

| Поле | Тип | NULLABLE |
|---|---|---|
| `id` | SERIAL PK | нет |
| `user_id` | INTEGER FK | нет |
| `organic_compound_id` | INTEGER FK | нет |

Каскадного удаления нет. UNIQUE-ограничений нет. Один draft на пользователя обеспечивается бизнес-логикой сервиса.

## Быстрый запуск

```bash
npm install
npm run media:download
docker compose up -d
npm run migration:run
npm run db:seed
npm run minio:refresh
npm run start:dev
```

API: `http://localhost:3000/api`

Adminer: `http://localhost:8081`

MinIO Console: `http://localhost:9001`

MinIO login/password: `minioadmin` / `minioadmin`

PostgreSQL для Adminer:

- System: PostgreSQL
- Server: `postgres`
- Username: `organic_compounds_user`
- Password: `organic_compounds_pass`
- Database: `organic_compounds_lab3`

## Postman

Импортируй:

`postman/Organic_Compounds_Lab3.postman_collection.json`

Для POST создания услуги выбери файлы из:

- `postman/files/organic_compound.png`
- `postman/files/organic_compound.webm`

После POST коллекция сама записывает `draftId`, после PUT публикации — `compoundId`.

## Важная последовательность показа

Сначала выполни `npm run db:reset`, затем импортируй Postman collection. После этого выполняй запросы по порядку из `docs/SCREENSHOT_ORDER.md`.
