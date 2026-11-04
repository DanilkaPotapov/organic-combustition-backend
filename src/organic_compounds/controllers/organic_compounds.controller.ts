import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Public, CurrentUser, SessionUser } from '../../shared/access';
import { CreateOrganicCompoundDto } from '../dto/create_organic_compound.dto';
import { LikeOrganicCompoundDto } from '../dto/like_organic_compound.dto';
import { OrganicCompoundFiltersDto } from '../dto/organic_compound_filters.dto';
import { OrganicCompoundResponseDto, CreatedOrganicCompoundDto } from '../dto/organic_compound_response.dto';
import { PublishOrganicCompoundDto } from '../dto/publish_organic_compound.dto';
import { OrganicCompoundsService } from '../services/organic_compounds.service';
import { UploadedMediaFile } from '../services/minio.service';

@ApiTags('organic_compounds')
@ApiResponse({ status: 400, description: 'Неверные данные, без тела' })
@Controller('organic_compounds')
export class OrganicCompoundsController {
  constructor(private readonly service: OrganicCompoundsService) {}
  @Public() @Get()
  @ApiOperation({ summary: 'Список опубликованных соединений с фильтром' })
  @ApiOkResponse({ type: OrganicCompoundResponseDto, isArray: true })
  list(@Query() filters: OrganicCompoundFiltersDto, @CurrentUser() user: SessionUser | null) {
    return this.service.list(filters, user);
  }
  @Public() @Get(['feed', 'feed/:id'])
  @ApiOperation({ summary: 'Одна карточка ленты, по id или следующая', description: 'Без id — первая. /feed/{id}?next=true — следующая по кругу. Это варианты одного метода feed.' })
  @ApiQuery({ name: 'next', required: false, enum: ['true', 'false'] })
  @ApiOkResponse({ type: OrganicCompoundResponseDto })
  @ApiResponse({ status: 404, description: 'Карточка не найдена, без тела' })
  feed(@CurrentUser() user: SessionUser | null, @Param('id') id?: string, @Query('next') next?: string) {
    return this.service.feed(user, id, next);
  }
  @Get('draft') @ApiCookieAuth()
  @ApiOperation({ summary: 'Черновик текущего пользователя без id' })
  @ApiOkResponse({ type: OrganicCompoundResponseDto })
  @ApiResponse({ status: 401, description: 'Нужен вход, без тела' })
  @ApiResponse({ status: 404, description: 'Черновика нет, без тела' })
  draft(@CurrentUser() user: SessionUser) { return this.service.draft(user); }

  @Post() @ApiCookieAuth()
  @ApiOperation({ summary: 'Далее — создать черновик' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', additionalProperties: false, required: ['name', 'image', 'video'], properties: {
    name: { type: 'string', minLength: 1, maxLength: 120 },
    image: { type: 'string', format: 'binary', description: 'JPEG, PNG или WEBP до 20 МиБ' },
    video: { type: 'string', format: 'binary', description: 'WEBM или MP4 до 20 МиБ' },
  } } })
  @ApiCreatedResponse({ type: CreatedOrganicCompoundDto })
  @ApiResponse({ status: 401, description: 'Нужен вход, без тела' })
  @ApiResponse({ status: 409, description: 'Черновик уже существует, без тела' })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }], {
    storage: memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => {
      const allowed = (file.fieldname === 'image' && /^image\/(jpeg|png|webp)$/.test(file.mimetype)) ||
        (file.fieldname === 'video' && /^video\/(webm|mp4)$/.test(file.mimetype));
      callback(allowed ? null : new BadRequestException(), allowed);
    },
  }))
  create(@CurrentUser() user: SessionUser, @Body() dto: CreateOrganicCompoundDto,
    @UploadedFiles() files: { image?: UploadedMediaFile[]; video?: UploadedMediaFile[] }) {
    return this.service.create(user, dto, files?.image?.[0], files?.video?.[0]);
  }
  @Put(':id/publish') @ApiCookieAuth()
  @ApiOperation({ summary: 'Публикация своего черновика' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: OrganicCompoundResponseDto })
  @ApiResponse({ status: 401, description: 'Нужен вход, без тела' })
  @ApiResponse({ status: 403, description: 'Чужая карточка, без тела' })
  @ApiResponse({ status: 404, description: 'Карточки нет, без тела' })
  publish(@CurrentUser() user: SessionUser, @Param('id', ParseIntPipe) id: number, @Body() dto: PublishOrganicCompoundDto) {
    return this.service.publish(user, id, dto);
  }
  @Delete(':id') @HttpCode(200) @ApiCookieAuth()
  @ApiOperation({ summary: 'Логическое удаление своей карточки' })
  @ApiOkResponse({ description: 'Без тела' })
  @ApiResponse({ status: 401, description: 'Нужен вход, без тела' })
  @ApiResponse({ status: 403, description: 'Чужая карточка, без тела' })
  remove(@CurrentUser() user: SessionUser, @Param('id', ParseIntPipe) id: number) { return this.service.remove(user, id); }
  @Post(':id/like') @HttpCode(200) @ApiCookieAuth()
  @ApiOperation({ summary: 'Установить 1 или снять 0 лайк' })
  @ApiOkResponse({ type: OrganicCompoundResponseDto })
  @ApiResponse({ status: 401, description: 'Нужен вход, без тела' })
  like(@CurrentUser() user: SessionUser, @Param('id', ParseIntPipe) id: number, @Body() dto: LikeOrganicCompoundDto) {
    return this.service.like(user, id, dto);
  }
}
