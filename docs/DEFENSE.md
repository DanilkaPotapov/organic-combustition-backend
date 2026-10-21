# Что показать на защите

1. ER-диаграмму `uml/organic_compounds-lab2.drawio`: белый A4 landscape, без сетки, `password` есть, UNIQUE нет, `NULLABLE` написано только у необязательных полей.
2. Adminer и таблицы `organic_compounds`, `organic_compound_users`, `organic_compound_likes`.
3. Поля по теме `carbon_count` и `hydrogen_count`.
4. `/organic_compounds/grid?carbonCount=2`: фильтр по одному предметному полю и сохранение значения в input.
5. `/organic_compounds/add`: выбор фото и видео через Finder/Проводник.
6. После `Далее` показать тот же `image_url` на странице черновика и затем на опубликованной карточке.
7. MinIO Console, bucket `organic-compounds-media`, загруженные файлы с латинскими сгенерированными именами.
8. Локальный `/assets/default-organic-compound.svg` как fallback не из MinIO.
9. Логическое удаление: кнопка cyan, затем `SELECT` в БД показывает `status='deleted'`, а карточка пропадает из интерфейса.
10. Код `OrganicCompoundsService`: один draft проверяется запросом в сервисе, без UNIQUE индекса.
