# START HERE · V3 Compact

Главное отличие: плитка и добавление теперь помещаются на один портретный экран; в плитке 6 компактных карточек.

# START HERE — ЛР1, тема 20

Проект: **определение формулы органического соединения по продуктам сгорания**.
Стек ЛР1: **NestJS + Handlebars + CSS + MinIO + Docker Compose**.
Прототип стиля: **Modern Analytical Sciences** — https://modernanalytical.com/

## 1. Что открыть сначала

1. Установи Node.js 20/22, Git и Docker Desktop.
2. Открой терминал в корне проекта.
3. Выполни:

```bash
npm install
docker compose up -d
npm run start:dev
```

4. Открой в браузере:

- Лента: http://localhost:3000/compounds/feed
- Лента с ID: http://localhost:3000/compounds/feed/3
- Следующая карточка: http://localhost:3000/compounds/feed/3?next=true
- Добавление/черновик: http://localhost:3000/compounds/draft
- Плитка: http://localhost:3000/compounds/grid
- Плитка с фильтром: http://localhost:3000/compounds/grid?maxMass=46.07
- MinIO Console: http://localhost:9001 — `minioadmin` / `minioadmin`

## 2. Что показать преподавателю

Порядок строго расписан в `docs/PROTECTION_CHECKLIST.md`.
Перед защитой прочитай `docs/DEFENSE_SCRIPT.md` и `docs/CONTROL_QUESTIONS.md`.

## 3. Pixso

Импортируй в Pixso три файла:

- `design/01-feed.svg`
- `design/02-draft.svg`
- `design/03-grid.svg`

Общий обзор: `design/pixso-board.svg`.
Подробности: `docs/PIXSO_GUIDE.md`.

## 4. Git

Создай отдельную ветку ЛР1, например `lab1-modern-analytical`.
Команды лежат в `docs/GIT_GUIDE.md`.

## 5. Главное для защиты

В ЛР1 **одна модель-коллекция** `ORGANIC_COMPOUNDS`, **три GET-обработчика**, **нет БД**, **нет JavaScript**.
`likes` — массив ID пользователей; число лайков вычисляется как `likes.length` в контроллере.
Изображения и видео лежат в MinIO, а в модели хранятся два отдельных URL-поля.

## V3.1 hotfix
Если ранее V3 возвращал `500 Internal server error`, причиной были отсутствующие Handlebars partials `header` и `bottom-nav`. В этой версии они уже добавлены в `views/partials/`.

---

## V3.3 — реальные фото и видео

Перед первым запуском этой версии обязательно выполни:

```bash
npm run media:download
npm run minio:refresh
```

Старые сгенерированные медиа удалены. Скрипт скачивает открытые материалы по конкретным соединениям из Wikimedia Commons. Список источников: `docs/MEDIA_SOURCES.md`.
