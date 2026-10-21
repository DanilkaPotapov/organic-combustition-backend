import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Redirect,
  Render,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { OrganicCompoundsService } from './organic_compounds.service';
import { UploadedMediaFile } from './services/minio.service';

@Controller('organic_compounds')
export class OrganicCompoundsController {
  constructor(private readonly organicCompoundsService: OrganicCompoundsService) {}

  @Get('feed/:id?')
  @Render('organic-feed')
  async getFeed(@Param('id') id?: string, @Query('next') next?: string) {
    const organicCompound = await this.organicCompoundsService.getFeedCard(id, next);

    if (id && !organicCompound) {
      throw new NotFoundException();
    }

    return {
      title: organicCompound ? organicCompound.name : 'Лента соединений',
      organicCompound,
      activeFeed: true,
    };
  }

  @Get('add')
  @Render('organic-add')
  async getAdd() {
    const draft = await this.organicCompoundsService.getDraftForCurrentUser();

    return {
      title: draft ? 'Публикация соединения' : 'Добавление соединения',
      draft,
      activeAdd: true,
    };
  }

  @Get('grid')
  @Render('organic-grid')
  async getGrid(@Query('carbonCount') carbonCount?: string) {
    const result = await this.organicCompoundsService.getGrid(carbonCount);

    return {
      title: 'Плитка соединений',
      ...result,
      foundCount: result.organicCompounds.length,
      activeGrid: true,
    };
  }

  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
      ],
      {
        limits: {
          fileSize: 50 * 1024 * 1024,
          files: 2,
        },
      },
    ),
  )
  @Redirect('/organic_compounds/add', 302)
  async createOrganicCompoundDraft(
    @Body('name') name: string,
    @UploadedFiles()
    files: {
      image?: UploadedMediaFile[];
      video?: UploadedMediaFile[];
    },
  ) {
    await this.organicCompoundsService.createDraft(
      name,
      files?.image?.[0],
      files?.video?.[0],
    );
  }

  @Post('publish')
  @Redirect('/organic_compounds/grid', 302)
  async publishOrganicCompound(
    @Body('shortDescription') shortDescription: string,
    @Body('carbonCount') carbonCount: string,
    @Body('hydrogenCount') hydrogenCount: string,
  ) {
    const published = await this.organicCompoundsService.publishDraft(
      shortDescription,
      carbonCount,
      hydrogenCount,
    );

    return { url: `/organic_compounds/feed/${published.id}` };
  }

  @Post('delete')
  @Redirect('/organic_compounds/grid', 302)
  async deleteOrganicCompound(@Body('organicCompoundId') organicCompoundId: string) {
    await this.organicCompoundsService.deleteOrganicCompoundWithSql(
      Number(organicCompoundId),
    );
  }
}
