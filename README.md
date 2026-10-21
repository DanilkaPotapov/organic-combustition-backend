# ЛР2 — Organic Compounds

Тема: определение формулы органического соединения по продуктам сгорания.

Исправленная версия ЛР2 на NestJS + PostgreSQL + TypeORM + MinIO.

## Что исправлено по замечаниям

- предметные поля услуги: `carbon_count` и `hydrogen_count`;
- фильтрация только по `carbon_count`;
- код, URL, таблица и файлы приведены к имени `organic_compounds`;
- фото и видео выбираются через Finder/Проводник на странице добавления;
- фото и видео загружаются в MinIO и сохраняются в БД как URL;
- одно и то же фото показывается у черновика и после публикации;
- локальный placeholder используется как изображение/видео по умолчанию и не хранится в MinIO;
- кнопка удаления выполнена в той же cyan-стилистике;
- в `organic_compound_users` добавлено поле `password`;
- UNIQUE-ограничения убраны;
- правило одного draft у пользователя проверяется в сервисе;
- в ER помечены только nullable-поля, лист белый, без сетки, A4 landscape.

## Маршруты

- `GET /organic_compounds/feed/:id?`
- `GET /organic_compounds/add`
- `GET /organic_compounds/grid?carbonCount=2`
- `POST /organic_compounds/create`
- `POST /organic_compounds/publish`
- `POST /organic_compounds/delete`

## Запуск

Смотри `START_HERE.md`.
