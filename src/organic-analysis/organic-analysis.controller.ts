import { Controller, Get, Param, Query, Render } from '@nestjs/common';
import { ORGANIC_COMPOUNDS } from './organic-analysis.data';

@Controller('compounds')
export class OrganicAnalysisController {
  // GET №1 — ЛЕНТА.
  // /compounds/feed/3
  // /compounds/feed/3?next=true — следующая опубликованная карточка.
  // /compounds/feed — первая опубликованная карточка (для нижней панели).
  @Get('feed/:id?')
  @Render('feed')
  getFeed(@Param('id') id?: string, @Query('next') next?: string) {
    const published = ORGANIC_COMPOUNDS.filter(
      (compound) => compound.status === 'published',
    );

    let index = id
      ? published.findIndex((compound) => compound.id === Number(id))
      : 0;

    if (index < 0) {
      index = 0;
    }

    if (next === 'true' && published.length > 0) {
      index = (index + 1) % published.length;
    }

    const compound = published[index];

    return {
      title: compound ? `${compound.name} — ${compound.formula}` : 'Лента',
      compound: compound
        ? { ...compound, likeCount: compound.likes.length }
        : null,
      activeFeed: true,
    };
  }

  // GET №2 — ДОБАВЛЕНИЕ/ЧЕРНОВИК.
  // В ЛР1 поля редактируются только визуально в браузере, без сохранения.
  @Get('draft')
  @Render('draft')
  getDraft() {
    const draft = ORGANIC_COMPOUNDS.find(
      (compound) => compound.status === 'draft',
    );

    return {
      title: 'Добавление соединения',
      draft: draft ? { ...draft, likeCount: draft.likes.length } : null,
      activeDraft: true,
    };
  }

  // GET №3 — ПЛИТКА + серверная фильтрация по молярной массе.
  // /compounds/grid?maxMass=46.07
  @Get('grid')
  @Render('grid')
  getGrid(@Query('maxMass') maxMass?: string) {
    const numericMaxMass = Number(maxMass);
    const hasFilter = Boolean(maxMass?.trim()) && Number.isFinite(numericMaxMass);

    let compounds = ORGANIC_COMPOUNDS.filter(
      (compound) => compound.status === 'published',
    );

    if (hasFilter) {
      compounds = compounds.filter(
        (compound) => compound.molarMass <= numericMaxMass,
      );
    }

    return {
      title: 'Плитка соединений',
      compounds: compounds.map((compound) => ({
        ...compound,
        likeCount: compound.likes.length,
      })),
      maxMass: maxMass ?? '',
      foundCount: compounds.length,
      activeGrid: true,
    };
  }
}
