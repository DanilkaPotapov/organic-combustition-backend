# ЛР4 — Органические соединения

Потапов Данил, ИУ5-54Б. Тема №20: **Определение формулы органического соединения по продуктам сгорания**.

ЛР4 завершает API справочника соединений: NestJS 10, TypeORM 0.3, PostgreSQL 17, MinIO, Redis 7, cookie-сессии и Swagger. Расчёт молекулярной формулы в эту работу не входит. Расчёт аппаратных требований по заданию курса начинается в ЛР5.

## Первый запуск на Mac

Открой Docker Desktop. В Терминале перейди в распакованную папку Potapov_LR4 и выполни:

```bash
bash scripts/start.sh
```

Скрипт создаёт .env только при отсутствии, устанавливает зависимости из package-lock.json, запускает контейнеры, ждёт PostgreSQL и Redis, настраивает MinIO, применяет миграции и добавляет демонстрационные данные без TRUNCATE. Затем запускает NestJS. Нужны Node.js 20+ и npm. Команда не удаляет данные других лабораторных.

После первого успешного запуска:

```bash
docker compose up -d
npm run start:dev
```

| Компонент | Адрес |
|---|---|
| Swagger | http://localhost:3004/api |
| OpenAPI JSON | http://localhost:3004/api-json |
| Список | http://localhost:3004/api/organic_compounds |
| Adminer | http://localhost:8082 |
| MinIO Console | http://localhost:9011 |
| MinIO S3 | http://localhost:9010 |
| PostgreSQL | localhost:5434 |
| Redis | localhost:6380 |

Adminer: PostgreSQL, сервер `postgres`, БД `organic_compounds_lab4`, пользователь `organic_compounds_user`, пароль `organic_compounds_pass`. MinIO: `minioadmin` / `minioadmin`.

В Compose нет фиксированных container_name. Данные ЛР4 находятся в отдельных томах проекта `potapov-lab4`; порты отличаются от ЛР3. Если порт всё же занят, измени проброс и соответствующий параметр .env.

## Вход

В Swagger открой POST /api/users/auth → Try it out:

```json
{"email":"potapov@example.local","password":"Potapov123!"}
```

Второй автор: `student2@example.local`, пароль тот же. POST /api/users/register принимает name, email, password; регистрация сама по себе не создаёт сессию.

После входа браузер автоматически хранит HttpOnly cookie `sessionId` и отправляет её на этот же сервер. В Swagger не нужно вручную вводить Cookie через Authorize: браузер запрещает выставлять этот заголовок из JavaScript. Используется cookie, установленная методом auth. В DevTools → Application → Cookies можно увидеть значение.

В Postman импортируй `postman/Organic_Compounds_Lab4.postman_collection.json`. Переменная baseUrl уже задана как `http://localhost:3004/api`. Запрос auth сохраняет sessionId в переменную коллекции. У защищённых запросов стоит `Cookie: sessionId={{sessionId}}`. Для демонстрации гостя выключи этот заголовок и очисти Cookies для localhost, иначе Postman может отправить cookie автоматически.

## Методы веб сервиса

| № | Метод и путь | Вход | Успех | Доступ |
|---|---|---|---|---|
| 1 | GET /api/organic_compounds | query carbonCount?: integer ≥ 1 | 200 Compound[] | Все |
| 2 | GET /api/organic_compounds/feed[/{id}] | path id?; query next?: true/false | 200 Compound | Все |
| 3 | GET /api/organic_compounds/draft | без id | 200 Compound | Вход |
| 4 | POST /api/organic_compounds | multipart name, image, video | 201 {id} | Вход |
| 5 | PUT /api/organic_compounds/{id}/publish | JSON shortDescription, carbonCount, hydrogenCount | 200 Compound | Владелец |
| 6 | DELETE /api/organic_compounds/{id} | path id | 200, без тела | Владелец |
| 7 | POST /api/organic_compounds/{id}/like | JSON value: 0 или 1 | 200 Compound | Вход |
| 8 | POST /api/users/register | JSON name, email, password | 201 User | Все |
| 9 | POST /api/users/auth | JSON email, password | 200 User; Set-Cookie | Все |
| 10 | POST /api/users/logout | Cookie, если есть | 200, без тела | Все |

`feed` и `feed/{id}` — два адреса одного обработчика. Поэтому Swagger показывает 11 операций для 10 методов доменов. Без id лента возвращает первую опубликованную карточку; с id — указанную; `?next=true` — следующую по кругу. SQL выбирает только одну карточку через LIMIT 1.

**Compound** всегда содержит ровно 10 ключей: id, name, shortDescription, imageUrl, videoUrl, carbonCount, hydrogenCount, likeCount, isOwner, isLiked. Незаполненные поля — null. isOwner/isLiked — числа 0/1, у гостя оба равны 0. Статус, даты и creatorId нужны серверу и БД, в ответ не включаются.

**User**: id, name, email, role. Пароль и хеш отсутствуют. В Redis хранится этот же объект пользователя, ключ `session:<случайный идентификатор>`, TTL 3600 секунд. В cookie находится только идентификатор, а не пользователь. Logout удаляет ключ Redis и cookie. Истёкшая или неверная сессия даёт гостевой доступ к публичным GET; защищённые методы отвечают 401. Владелец карточки определяется сервером по сессии.

Ошибки возвращаются с пустым телом: 400 — неверное тело/лишние поля; 401 — нет входа; 403 — чужая карточка; 404 — нет записи; 409 — занятый email, второй черновик или повторная публикация. Ограничение файла — 20 МиБ, превышение даёт 413. При недоступности хранилища — 503. JSON со status/statusCode/message не формируется.

На «Далее» передаются ровно name, image, video; ответ — только {id}. При публикации — ровно shortDescription (1–240 символов), carbonCount и hydrogenCount (целые ≥ 1), id передаётся в URL. Файлы: JPEG/PNG/WEBP и MP4/WEBM. Имена UUID на латинице; файл — в MinIO, имя — в PostgreSQL.

## Таблицы и Redis

| Таблица | Поля |
|---|---|
| users | id SERIAL PK; name VARCHAR(120); email VARCHAR(160); password_hash VARCHAR(255); role VARCHAR(20), по умолчанию user |
| organic_compounds | id SERIAL PK; name VARCHAR(120); short_description VARCHAR(240) NULLABLE; status ENUM draft/published/deleted; image_file_name VARCHAR(255); video_file_name VARCHAR(255); carbon_count INTEGER NULLABLE; hydrogen_count INTEGER NULLABLE; created_at TIMESTAMPTZ; creator_id INTEGER FK users; formed_at TIMESTAMPTZ NULLABLE |
| organic_compound_likes | id SERIAL PK; user_id INTEGER FK users; organic_compound_id INTEGER FK organic_compounds |

Все поля без NULLABLE обязательны. Логическое удаление меняет status на deleted. У пользователя максимум один draft. Повторный лайк не увеличивает счётчик. Дополнительные UNIQUE не добавлены. Проверка email выполняется в транзакции с advisory lock. Пароли bcrypt, cost 12. Для импортированных пользователей ЛР3 поддержан SHA-256 с переходом на bcrypt после успешного входа; seed не перезаписывает существующие учётные записи и пароли.

## Файлы

- `src/shared`: cookie, SessionGuard, Redis SessionsService, пустые ответы ошибок.
- `src/users`: регистрация, аутентификация, выход; DTO и сериализация.
- `src/organic_compounds`: семь методов предметного домена; TypeORM, MinIO.
- `src/database/migrations`: исходная схема ЛР3 и расширение для ЛР4; synchronize=false.
- `docs`: РПЗ, ТЗ, порядок защиты и результаты проверки.
- `uml`: один проект StarUML и один Draw.io, каждый с тремя диаграммами; SVG и PNG для РПЗ.
- `postman`: десять сохранённых запросов и два реальных локальных файла для отправки.

## Проверка

```bash
npm run build
npm run test:isolated
```

Изолированная проверка запускает NestJS, настоящие контроллеры, DTO и сервисы с pg-mem и заменами Redis/MinIO. Проверяет миграции, Swagger, пароли, права двух пользователей, структуру JSON, ленту, лайки и выход. Она не заменяет проверку Docker, S3 и реального PostgreSQL.

После запуска контейнеров и миграций можно выполнить `npm run test:e2e`: та же проверка использует настоящие PostgreSQL, Redis и MinIO. Создаются два тестовых пользователя, одна карточка и файлы; карточка в конце логически удаляется. Делай реальные скриншоты по `docs/Порядок_защиты.md`.

## Источники задания

- https://github.com/iu5git/Web#лабораторная-4
- https://github.com/iu5git/Web/tree/main/tutorials/lab4-nest
- https://github.com/iu5git/Web/blob/main/topics.md — тема 20

Требования сверены с коммитом курса abf8ff4d0d4487f1b47cf698afbf7182d9bdf024. TypeORM оставлен по отдельному указанию преподавателя от 14.10.2026, Sequelize не используется. Расчёт аппаратных требований отнесён к ЛР5 в README курса.
