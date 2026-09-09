# MinIO в проекте

MinIO хранит реальные изображения и видео карточек локально как объектное хранилище. NestJS не хранит бинарные файлы в модели — только URL.

Пример для этанола:

```ts
imageUrl: 'http://localhost:9000/organic-media/ethanol.png'
videoUrl: 'http://localhost:9000/organic-media/ethanol.webm'
```

## Первый запуск реальных медиа

```bash
npm run media:download
npm run minio:refresh
```

После этого открой:

- консоль MinIO: `http://localhost:9001`
- логин: `minioadmin`
- пароль: `minioadmin`
- bucket: `organic-media`

Проверка файла:

`http://localhost:9000/organic-media/ethanol.png`

`http://localhost:9000/organic-media/ethanol.webm`

## Что сказать на защите

> Изображения и видео я не храню внутри NestJS. Реальные открытые медиа сначала скачиваются в папку media, затем импортируются в MinIO. В модели хранится URL объекта из bucket organic-media, а браузер отдельно получает файл по этому URL.
