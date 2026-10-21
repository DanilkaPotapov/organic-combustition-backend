# Порядок скриншотов ЛР3

Перед началом: `npm run db:reset`, `npm run minio:refresh`, `npm run start:dev`.

## Скриншоты 1–10 — Postman/Insomnia

1. Показать коллекцию из **10 сохраненных HTTP-методов**.
2. Выполнить `GET /api/organic_compounds?carbonCount=2` и показать фильтрацию.
3. Выполнить `POST /api/organic_compounds` с `name`, файлом `image` и файлом `video`.
4. Выполнить `GET /api/organic_compounds/draft` и показать одинаковые JSON-поля, включая `null` у еще не заполненных полей.
5. Выполнить `PUT /api/organic_compounds/{{draftId}}/publish` с `shortDescription`, `carbonCount`, `hydrogenCount`.
6. Выполнить сохраненный `GET feed` без ID: `/api/organic_compounds/feed`.
7. В том же сохраненном запросе `GET feed` временно поставить `/api/organic_compounds/feed/{{compoundId}}?next=true`, выполнить запрос и вернуть URL обратно. Это второй вызов одного HTTP-метода, а не одиннадцатый метод.
8. Выполнить `POST /api/organic_compounds/{{compoundId}}/like` с `{ "value": 1 }`.
9. Выполнить `DELETE /api/organic_compounds/{{compoundId}}` и получить `204`.
10. Выполнить `POST /api/users/register`.

Заглушки `/api/users/auth` и `/api/users/logout` остаются в коллекции и коде, но в официальном порядке показа преподавателя отдельно не перечислены.

## Скриншоты 11–13 — данные

11. В Adminer выполнить `SELECT * FROM organic_compounds ORDER BY id;`.
12. В Adminer выполнить `SELECT * FROM organic_compound_likes ORDER BY id;`.
13. В MinIO открыть bucket `organic-compounds` и показать загруженные POST-запросом файлы с латинскими именами.

## Скриншоты 14–15 — модели и сериализаторы

14. Показать `OrganicCompound`, `OrganicCompoundLike`, `User`.
15. Показать `organic_compound.serializer.ts` и объяснить одинаковый набор JSON-полей.

## Скриншоты 16–17 — singleton и README

16. Показать `src/shared/current_user.ts`, константу `CURRENT_USER_ID = 1` и вызовы `getCurrentUser()` в `OrganicCompoundsService`.
17. Показать README: таблицу 10 HTTP-методов и три таблицы БД.
