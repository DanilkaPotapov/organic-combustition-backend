# Диаграмма классов ЛР3

Файл: `uml/lab3-class-diagram.drawio`.

Страница A4 — альбомная, фон белый, сетка отключена.

Диаграмма содержит:

- 4 будущие страницы frontend: Feed, Add, Grid, Login;
- домен `/api/organic_compounds` со всеми 7 методами;
- домен `/api/users` с 3 методами;
- сервисы, репозитории и MinIO;
- модели `OrganicCompound`, `OrganicCompoundLike`, `User`;
- таблицы `organic_compounds`, `organic_compound_likes`, `users`;
- зависимости страниц от API-доменов и backend-слоев от моделей/таблиц.
