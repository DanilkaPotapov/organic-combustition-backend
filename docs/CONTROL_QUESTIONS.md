# Кратко к защите ЛР2

## PostgreSQL

Реляционная СУБД. В ЛР2 хранит пользователей, органические соединения и лайки.

```sql
SELECT * FROM organic_compounds;
```

Логическое удаление:

```sql
UPDATE organic_compounds
SET status = 'deleted'
WHERE id = 1;
```

## ORM

TypeORM связывает TypeScript-сущности с таблицами PostgreSQL:

- `OrganicCompound` → `organic_compounds`;
- `OrganicCompoundUser` → `organic_compound_users`;
- `OrganicCompoundLike` → `organic_compound_likes`.

## Миграции

Миграция фиксирует структуру БД и позволяет одинаково создать её на другом компьютере. В проекте используется `src/database/migrations/1790116800000-CreateOrganicCompoundsLab2Schema.ts`.

## NULLABLE

`NULLABLE` означает, что поле разрешено оставить пустым. В услуге до публикации могут быть пустыми `short_description`, `image_url`, `video_url`, `carbon_count`, `hydrogen_count`, `formed_at`.

## MinIO

MinIO хранит бинарные файлы. PostgreSQL хранит только URL. На странице добавления файл выбирается в Finder/Проводнике, NestJS загружает его в bucket `organic-compounds-media`.

## Логическое удаление

Запись не удаляется физически. Меняется `status` на `deleted`, после чего запросы интерфейса её не возвращают.
