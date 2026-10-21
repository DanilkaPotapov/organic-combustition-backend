import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { getCurrentUser } from '../../shared/current_user';
import { CreateOrganicCompoundDto } from '../dto/create_organic_compound.dto';
import { LikeOrganicCompoundDto } from '../dto/like_organic_compound.dto';
import { OrganicCompoundFiltersDto } from '../dto/organic_compound_filters.dto';
import { OrganicCompoundResponseDto } from '../dto/organic_compound_response.dto';
import { PublishOrganicCompoundDto } from '../dto/publish_organic_compound.dto';
import {
  OrganicCompound,
  OrganicCompoundStatus,
} from '../entities/organic_compound.entity';
import { OrganicCompoundsRepository } from '../repositories/organic_compounds.repository';
import { serializeOrganicCompound } from '../serializers/organic_compound.serializer';
import { MinioService, UploadedMediaFile } from './minio.service';

@Injectable()
export class OrganicCompoundsService {
  constructor(
    private readonly repository: OrganicCompoundsRepository,
    private readonly minio: MinioService,
  ) {}

  async list(
    filters: OrganicCompoundFiltersDto,
  ): Promise<OrganicCompoundResponseDto[]> {
    const currentUser = getCurrentUser();
    const carbonCount = filters.carbonCount;
    const compounds = await this.repository.findPublished(carbonCount);
    const likedIds = await this.repository.likedIdsByUser(
      currentUser.id,
      compounds.map((compound) => compound.id),
    );

    return compounds.map((compound) =>
      this.serialize(compound, currentUser.id, likedIds.has(compound.id)),
    );
  }

  async feed(id?: string, next?: string): Promise<OrganicCompoundResponseDto> {
    const currentUser = getCurrentUser();
    const numericId = id === undefined ? undefined : Number(id);

    if (id !== undefined && (!Number.isInteger(numericId) || numericId < 1)) {
      throw new BadRequestException();
    }

    const compound = await this.repository.findFeed(
      numericId,
      next === 'true',
    );

    if (!compound) {
      throw new NotFoundException();
    }

    const likedIds = await this.repository.likedIdsByUser(currentUser.id, [
      compound.id,
    ]);

    return this.serialize(compound, currentUser.id, likedIds.has(compound.id));
  }

  async draft(): Promise<OrganicCompoundResponseDto> {
    const currentUser = getCurrentUser();
    const compound = await this.repository.findDraftByCreatorId(currentUser.id);

    if (!compound) {
      throw new NotFoundException();
    }

    const likedIds = await this.repository.likedIdsByUser(currentUser.id, [
      compound.id,
    ]);

    return this.serialize(compound, currentUser.id, likedIds.has(compound.id));
  }

  async create(
    dto: CreateOrganicCompoundDto,
    image: UploadedMediaFile | undefined,
    video: UploadedMediaFile | undefined,
  ): Promise<OrganicCompoundResponseDto> {
    const currentUser = getCurrentUser();
    const name = dto.name?.trim();

    if (!name || !image || !video) {
      throw new BadRequestException();
    }

    const existingDraft = await this.repository.findDraftByCreatorId(
      currentUser.id,
    );

    if (existingDraft) {
      throw new ConflictException();
    }

    const imageFileName = this.generatedFileName('image', image.originalname);
    const videoFileName = this.generatedFileName('video', video.originalname);

    await this.minio.upload(image, imageFileName);
    await this.minio.upload(video, videoFileName);

    const compound = this.repository.create({
      name,
      shortDescription: null,
      status: OrganicCompoundStatus.DRAFT,
      imageFileName,
      videoFileName,
      carbonCount: null,
      hydrogenCount: null,
      creatorId: currentUser.id,
      formedAt: null,
    });

    const saved = await this.repository.save(compound);
    return this.serialize(saved, currentUser.id, false);
  }

  async publish(
    id: number,
    dto: PublishOrganicCompoundDto,
  ): Promise<OrganicCompoundResponseDto> {
    const currentUser = getCurrentUser();
    const compound = await this.repository.findById(id);

    if (!compound || compound.status === OrganicCompoundStatus.DELETED) {
      throw new NotFoundException();
    }

    if (compound.creatorId !== currentUser.id) {
      throw new ForbiddenException();
    }

    if (compound.status !== OrganicCompoundStatus.DRAFT) {
      throw new ConflictException();
    }

    const shortDescription = dto.shortDescription?.trim();
    const carbonCount = dto.carbonCount;
    const hydrogenCount = dto.hydrogenCount;

    if (!shortDescription) {
      throw new BadRequestException();
    }

    compound.shortDescription = shortDescription;
    compound.carbonCount = carbonCount;
    compound.hydrogenCount = hydrogenCount;
    compound.status = OrganicCompoundStatus.PUBLISHED;
    compound.formedAt = new Date();

    const saved = await this.repository.save(compound);
    return this.serialize(saved, currentUser.id, false);
  }

  async remove(id: number): Promise<void> {
    const currentUser = getCurrentUser();
    const compound = await this.repository.findById(id);

    if (!compound || compound.status === OrganicCompoundStatus.DELETED) {
      throw new NotFoundException();
    }

    if (compound.creatorId !== currentUser.id) {
      throw new ForbiddenException();
    }

    compound.status = OrganicCompoundStatus.DELETED;
    await this.repository.save(compound);
  }

  async like(
    id: number,
    dto: LikeOrganicCompoundDto,
  ): Promise<OrganicCompoundResponseDto> {
    const currentUser = getCurrentUser();
    const compound = await this.repository.findById(id);

    if (!compound || compound.status !== OrganicCompoundStatus.PUBLISHED) {
      throw new NotFoundException();
    }

    const value = dto.value;
    await this.repository.setLike(currentUser.id, id, value);
    const updated = await this.repository.findById(id);

    if (!updated) {
      throw new NotFoundException();
    }

    return this.serialize(updated, currentUser.id, value === 1);
  }

  private serialize(
    compound: OrganicCompound,
    currentUserId: number,
    isLiked: boolean,
  ) {
    return serializeOrganicCompound(
      compound,
      currentUserId,
      isLiked,
      this.minio.publicUrl(compound.imageFileName),
      this.minio.publicUrl(compound.videoFileName),
    );
  }

  private generatedFileName(prefix: string, originalName: string) {
    const sourceExtension = extname(originalName).toLowerCase();
    const extension = sourceExtension.replace(/[^a-z0-9.]/g, '') || '.bin';
    return `organic-compound-${prefix}-${randomUUID()}${extension}`;
  }
}
