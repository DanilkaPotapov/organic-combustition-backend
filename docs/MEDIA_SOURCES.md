# Реальные медиа для карточек

Все медиа в этой версии проекта берутся из Wikimedia Commons или из файлов NASA/ESO, размещённых на Wikimedia Commons. Это не изображения и не видео, сгенерированные для проекта.

## Изображения

| Карточка | Файл | Источник | Лицензия / статус |
|---|---|---|---|
| Метан | `methane.png` | https://commons.wikimedia.org/wiki/File:Methane-3D-vdW.png | Public domain |
| Этан | `ethane.png` | https://commons.wikimedia.org/wiki/File:Ethane-3D-vdW.png | Public domain |
| Этен | `ethene.png` | https://commons.wikimedia.org/wiki/File:Ethylene-CRC-MW-3D-vdW.png | Public domain |
| Пропен | `propene.png` | https://commons.wikimedia.org/wiki/File:Propylene-GED-MW-3D-bs-17.png | Public domain |
| Метанол | `methanol.png` | https://commons.wikimedia.org/wiki/File:Methanol-3D-vdW.png | Public domain |
| Этанол | `ethanol.png` | https://commons.wikimedia.org/wiki/File:Ethanol-3D-vdW.png | Public domain |
| Пентан (draft) | `pentane.png` | https://commons.wikimedia.org/wiki/File:Pentane.png | CC BY-SA 3.0 / GFDL |

## Видео и анимации

| Карточка | Локальный файл | Что показывает | Источник |
|---|---|---|---|
| Метан | `methane.webm` | реакции с участием метана в атмосфере Титана | https://commons.wikimedia.org/wiki/File:A_Pathway_to_Protocells_on_Titan_%E2%80%93_Animations_(SVS20411_-_TitanProtoCell_Molecule_Shot).webm |
| Этан | `ethane.webm` | образование этана из метана в атмосфере Титана | https://commons.wikimedia.org/wiki/File:Titan_science_results_from_James_Webb_Space_Telescope-_animation_resource_page_(SVS20403_-_Webb_Titan_Shot3_h264_4k).webm |
| Этен | `ethene.webm` | радикальная полимеризация этена | https://commons.wikimedia.org/wiki/File:Radikalische_Polymerisation_Ethen.webm |
| Пропен | `propene.webm` | обнаружение пропена/пропилена на Титане | https://commons.wikimedia.org/wiki/File:NASA_-_Propylene_on_Titan_IN0SbMeOGIA.webm |
| Метанол | `methanol.webm` | визуализация системы TW Hydrae, где обнаружен метанол | https://commons.wikimedia.org/wiki/File:Artist%E2%80%99s_impression_of_the_disc_around_the_young_star_TW_Hydrae.webm |
| Этанол | `ethanol.webm` | лабораторный опыт горения этанола; реакция даёт CO₂ и H₂O | https://commons.wikimedia.org/wiki/File:15._Ослободување_на_големо_количество_енергија_при_согоровуање_етанол.webm |
| Пентан (draft) | `pentane.gif` | модель молекулы пентана | https://commons.wikimedia.org/wiki/File:Picoscopiy_image_of_pentane_molecule_and_animated_model.gif |

## Важно для защиты

Файлы после скачивания лежат в папке `media/`, затем Docker-контейнер `minio-init` копирует их в bucket `organic-media`. В модели NestJS хранятся только URL вида `http://localhost:9000/organic-media/ethanol.webm`.

Для медиа с лицензией CC BY / CC BY-SA сохраняй указание автора и источника. Учебный характер проекта сам по себе не отменяет требования лицензии; поэтому здесь специально выбраны открытые источники.
