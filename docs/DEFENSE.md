# Защита ЛР3

## Что изменилось относительно ЛР2

ЛР2 использовала серверные Handlebars-страницы. В ЛР3 шаблоны убраны из рабочего приложения: NestJS возвращает REST JSON, а демонстрация выполняется только через Postman/Insomnia.

## Почему 10 HTTP-методов

В домене `organic_compounds` семь методов: список, лента, draft, POST создания, PUT публикации, DELETE soft delete, POST like. В домене `users` три POST: регистрация, заглушка auth, заглушка logout. Итого 10.

`feed` без ID и `feed/:id?next=true` — разные вызовы одного маршрута GET, поэтому количество методов не увеличивается.

## Предметные поля

После замечания преподавателя используются только два предметных поля:

- `carbon_count` — количество атомов C;
- `hydrogen_count` — количество атомов H.

Список фильтруется по `carbonCount`.

## REST

- коллекция: `/api/organic_compounds`;
- ресурс/действие публикации: `/api/organic_compounds/:id/publish`;
- удаление — `DELETE /api/organic_compounds/:id`;
- все адреса начинаются с `/api`.

## Статусы

Клиент не может передать `status` при создании или публикации. POST всегда создает `draft`. PUT `publish` разрешен только для своего `draft` и переводит его в `published`. DELETE переводит свою запись в `deleted`. Вернуть `published` обратно в `draft` нельзя.

## Системные поля

Клиент не передает `id`, `status`, `creatorId`, `createdAt`, `formedAt`. Они задаются БД или бизнес-логикой на backend.

## Singleton текущего пользователя

`getCurrentUser()` всегда возвращает объект с `id = 1`. В ЛР3 это заменяет авторизацию. В ЛР4 этот механизм будет заменен реальной сессией.

## MinIO

POST принимает два настоящих файла `image` и `video`. Backend генерирует латинские имена через UUID. В БД сохраняются только `image_file_name` и `video_file_name`, а байты уходят в bucket `organic-compounds`.

## Serializer

`serializeOrganicCompound()` формирует одинаковый JSON для list/feed/draft/create/publish/like. Пустые поля не исчезают, а равны `null`. Дополнительные признаки:

- `isOwner` — 1, если `creatorId` совпадает с текущим пользователем;
- `isLiked` — 1, если текущий пользователь поставил лайк;
- `likeCount` — число строк в `organic_compound_likes`.

## Soft delete

DELETE не выполняет физическое удаление. Меняется `status` на `deleted`. Такие записи не попадают в GET списка и ленты.
