import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreateOrganicCompoundDto } from '../dto/create_organic_compound.dto';
import { LikeOrganicCompoundDto } from '../dto/like_organic_compound.dto';
import { OrganicCompoundFiltersDto } from '../dto/organic_compound_filters.dto';
import { PublishOrganicCompoundDto } from '../dto/publish_organic_compound.dto';
import { OrganicCompoundsService } from '../services/organic_compounds.service';
import { UploadedMediaFile } from '../services/minio.service';


@Controller('organic_compounds')
export class OrganicCompoundsController {
  constructor(private readonly service: OrganicCompoundsService) {}

  @Get()
  list(@Query() filters: OrganicCompoundFiltersDto) {
    return this.service.list(filters);
  }

  @Get('feed/:id?')
  feed(@Param('id') id?: string, @Query('next') next?: string) {
    return this.service.feed(id, next);
  }

  @Get('draft')
  draft() {
    return this.service.draft();
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: { fileSize: 20 * 1024 * 1024 },
        fileFilter: (_request, file, callback) => {
          const imageAllowed =
            file.fieldname === 'image' &&
            /^image\/(jpeg|png|webp)$/.test(file.mimetype);
          const videoAllowed =
            file.fieldname === 'video' &&
            /^video\/(webm|mp4)$/.test(file.mimetype);
          const allowed = imageAllowed || videoAllowed;
          callback(allowed ? null : new BadRequestException(), allowed);
        },
      },
    ),
  )
  create(
    @Body() dto: CreateOrganicCompoundDto,
    @UploadedFiles()
    files: {
      image?: UploadedMediaFile[];
      video?: UploadedMediaFile[];
    },
  ) {
    return this.service.create(dto, files?.image?.[0], files?.video?.[0]);
  }

  @Put(':id/publish')
  publish(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PublishOrganicCompoundDto,
  ) {
    return this.service.publish(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post(':id/like')
  @HttpCode(200)
  like(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: LikeOrganicCompoundDto,
  ) {
    return this.service.like(id, dto);
  }
}
