# Порядок показа и 19 скриншотов ЛР1

Ниже порядок, максимально близкий к текущему описанию ЛР1 в репозитории курса.

| № | Что должно быть на скриншоте |
|---:|---|
| 1 | `topics.md`: тема №20 целиком |
| 2 | Pixso: макет `01 Лента` |
| 3 | Pixso: макет `02 Добавление` |
| 4 | Pixso: макет `03 Плитка` |
| 5 | Приложение: `/compounds/feed/3`, видно сходство с макетом |
| 6 | Приложение: `/compounds/draft`, видно сходство с макетом |
| 7 | Приложение: `/compounds/grid`, видно сходство с макетом |
| 8 | Публичный прототип `https://modernanalytical.com/` |
| 9 | Начало `public/style.css`: URL прототипа, список адаптированных приемов и 3 HEX-цвета |
| 10 | DevTools Network: GET `/compounds/feed/3?next=true`, объяснить ID и `next` |
| 11 | DevTools Network: GET `/compounds/draft`, показать страницу черновика |
| 12 | DevTools Network: GET `/compounds/grid?maxMass=46.07`, видно сохраненное значение фильтра |
| 13 | Network → Response для плитки: HTML с `data-image-url` и `data-video-url` MinIO |
| 14 | `organic-analysis.data.ts`: `imageUrl` и `videoUrl` в единственной коллекции |
| 15 | `views/feed.hbs`: `poster`, `<source>` и `<img>` используют MinIO URL |
| 16 | `views/draft.hbs`: изображение и поля URL используют данные черновика |
| 17 | `views/grid.hbs`: изображение и `data-*` URL для каждой карточки |
| 18 | `organic-analysis.controller.ts`: три декоратора `@Get` и маршруты |
| 19 | Там же: серверная фильтрация `molarMass`, `likes.length`, статусы `published/draft/deleted` |

## Дополнительно показать, даже если это не отдельный номер

- MinIO Console `http://localhost:9001`, bucket `organic-media`;
- GitHub backend-репозиторий и отдельную ветку `lab1-modern-analytical`;
- `uml/lab1-diagrams.drawio`;
- Word-документацию;
- конспекты прошедших лекций;
- письменные ответы на контрольные вопросы.

## Имена файлов скриншотов

В папке `screenshots/` удобно сохранить так:

```text
01-topic.png
02-pixso-feed.png
03-pixso-draft.png
04-pixso-grid.png
05-app-feed.png
06-app-draft.png
07-app-grid.png
08-prototype.png
09-css-prototype.png
10-network-feed.png
11-network-draft.png
12-network-grid-filter.png
13-response-minio.png
14-model-media-urls.png
15-template-feed.png
16-template-draft.png
17-template-grid.png
18-controller-routes.png
19-controller-filter.png
```
