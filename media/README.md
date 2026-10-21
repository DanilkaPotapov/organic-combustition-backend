# Media

`npm run media:download` скачивает демонстрационные изображения и видео в эту папку. `npm run minio:refresh` загружает их в bucket `organic-compounds-media`.

Фото/видео, выбранные на странице `/organic_compounds/add`, загружаются в MinIO непосредственно через NestJS и получают сгенерированные латинские имена.
