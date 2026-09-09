# Hotfix 500 — missing Handlebars partials

В исходном архиве V3 шаблоны `feed.hbs`, `draft.hbs`, `grid.hbs` использовали `{{> header}}` и `{{> bottom-nav}}`, но папка `views/partials` не попала в ZIP. Из-за этого Express/Handlebars возвращал HTTP 500 при рендеринге страниц.

Исправлено в V3.1:
- добавлен `views/partials/header.hbs`;
- добавлен `views/partials/bottom-nav.hbs`.

После замены проекта достаточно:

```bash
npm install
docker compose up -d
npm run start:dev
```

Проверка:
- http://localhost:3000/compounds/feed
- http://localhost:3000/compounds/draft
- http://localhost:3000/compounds/grid
