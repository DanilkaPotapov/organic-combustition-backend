import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  OrganicCompound,
  OrganicCompoundStatus,
} from './entities/organic_compound.entity';
import { OrganicCompoundLike } from './entities/organic_compound_like.entity';
import { OrganicCompoundUser } from './entities/organic_compound_user.entity';
import { MinioService, UploadedMediaFile } from './services/minio.service';

const CURRENT_USER_ID = 1;

@Injectable()
export class OrganicCompoundsService {
  constructor(
    @InjectRepository(OrganicCompound)
    private readonly organicCompoundsRepository: Repository<OrganicCompound>,
    @InjectRepository(OrganicCompoundUser)
    private readonly usersRepository: Repository<OrganicCompoundUser>,
    @InjectRepository(OrganicCompoundLike)
    private readonly likesRepository: Repository<OrganicCompoundLike>,
    private readonly dataSource: DataSource,
    private readonly minioService: MinioService,
  ) {}

  async getFeedCard(id?: string, next?: string) {
    const numericId = id ? Number(id) : undefined;

    let query = this.organicCompoundsRepository
      .createQueryBuilder('organicCompound')
      .where('organicCompound.status = :status', {
        status: OrganicCompoundStatus.PUBLISHED,
      })
      .loadRelationCountAndMap('organicCompound.likeCount', 'organicCompound.likes')
      .orderBy('organicCompound.id', 'ASC')
      .limit(1);

    if (numericId && Number.isFinite(numericId)) {
      query = next === 'true'
        ? query.andWhere('organicCompound.id > :id', { id: numericId })
        : query.andWhere('organicCompound.id = :id', { id: numericId });
    }

    let organicCompound = await query.getOne();

    if (!organicCompound && numericId && next === 'true') {
      organicCompound = await this.organicCompoundsRepository
        .createQueryBuilder('organicCompound')
        .where('organicCompound.status = :status', {
          status: OrganicCompoundStatus.PUBLISHED,
        })
        .loadRelationCountAndMap('organicCompound.likeCount', 'organicCompound.likes')
        .orderBy('organicCompound.id', 'ASC')
        .limit(1)
        .getOne();
    }

    return organicCompound ? this.toViewModel(organicCompound) : null;
  }

  async getGrid(carbonCount?: string) {
    const query = this.organicCompoundsRepository
      .createQueryBuilder('organicCompound')
      .where('organicCompound.status = :status', {
        status: OrganicCompoundStatus.PUBLISHED,
      })
      .loadRelationCountAndMap('organicCompound.likeCount', 'organicCompound.likes')
      .orderBy('organicCompound.id', 'ASC');

    const normalizedCarbonCount = this.normalizeCarbonCount(carbonCount);
    if (normalizedCarbonCount !== null) {
      query.andWhere('organicCompound.carbonCount = :carbonCount', {
        carbonCount: normalizedCarbonCount,
      });
    }

    const organicCompounds = await query.getMany();
    const totalCount = await this.organicCompoundsRepository.count({
      where: { status: OrganicCompoundStatus.PUBLISHED },
    });

    return {
      organicCompounds: organicCompounds.map((item) => this.toViewModel(item)),
      totalCount,
      carbonCount: normalizedCarbonCount ?? '',
    };
  }

  async getDraftForCurrentUser() {
    const draft = await this.organicCompoundsRepository.findOne({
      where: {
        creatorId: CURRENT_USER_ID,
        status: OrganicCompoundStatus.DRAFT,
      },
    });
    return draft ? this.toViewModel(draft) : null;
  }

  async createDraft(
    name: string,
    imageFile?: UploadedMediaFile,
    videoFile?: UploadedMediaFile,
  ) {
    const cleanName = name?.trim();
    if (!cleanName) {
      throw new BadRequestException('Введите название');
    }
    if (!imageFile || !videoFile) {
      throw new BadRequestException('Выберите фото и видео');
    }

    const existingDraft = await this.organicCompoundsRepository.findOne({
      where: {
        creatorId: CURRENT_USER_ID,
        status: OrganicCompoundStatus.DRAFT,
      },
    });
    if (existingDraft) {
      return existingDraft;
    }

    const userCount = await this.usersRepository.count({
      where: { id: CURRENT_USER_ID },
    });
    if (userCount === 0) {
      throw new BadRequestException('В БД нет пользователя id=1');
    }

    const [imageUrl, videoUrl] = await Promise.all([
      this.minioService.uploadImage(imageFile),
      this.minioService.uploadVideo(videoFile),
    ]);

    const draft = this.organicCompoundsRepository.create({
      name: cleanName,
      shortDescription: null,
      status: OrganicCompoundStatus.DRAFT,
      imageUrl,
      videoUrl,
      carbonCount: null,
      hydrogenCount: null,
      creatorId: CURRENT_USER_ID,
      formedAt: null,
    });

    return this.organicCompoundsRepository.save(draft);
  }

  async publishDraft(
    shortDescription: string,
    carbonCountValue: string,
    hydrogenCountValue: string,
  ) {
    const draft = await this.organicCompoundsRepository.findOne({
      where: {
        creatorId: CURRENT_USER_ID,
        status: OrganicCompoundStatus.DRAFT,
      },
    });
    if (!draft) {
      throw new BadRequestException('Черновик не найден');
    }

    const description = shortDescription?.trim();
    const carbonCount = Number(carbonCountValue);
    const hydrogenCount = Number(hydrogenCountValue);

    if (
      !description ||
      !Number.isInteger(carbonCount) ||
      carbonCount <= 0 ||
      !Number.isInteger(hydrogenCount) ||
      hydrogenCount <= 0
    ) {
      throw new BadRequestException('Заполните описание и количество атомов C и H');
    }

    draft.shortDescription = description;
    draft.carbonCount = carbonCount;
    draft.hydrogenCount = hydrogenCount;
    draft.status = OrganicCompoundStatus.PUBLISHED;
    draft.formedAt = new Date();

    return this.organicCompoundsRepository.save(draft);
  }

  async deleteOrganicCompoundWithSql(id: number) {
    if (!Number.isFinite(id)) {
      return;
    }

    await this.dataSource.query(
      `UPDATE organic_compounds
       SET status = $1
       WHERE id = $2 AND status = $3
       RETURNING id`,
      [OrganicCompoundStatus.DELETED, id, OrganicCompoundStatus.PUBLISHED],
    );
  }

  private normalizeCarbonCount(value?: string) {
    if (value === undefined || value.trim() === '') {
      return null;
    }
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 30) {
      return null;
    }
    return parsed;
  }

  private toViewModel(organicCompound: OrganicCompound) {
    const compound = organicCompound as OrganicCompound & { likeCount?: number };
    return {
      ...compound,
      likeCount: compound.likeCount ?? 0,
      displayFormula: this.buildFormula(compound.carbonCount, compound.hydrogenCount),
    };
  }

  private buildFormula(carbonCount: number | null, hydrogenCount: number | null) {
    if (carbonCount === null || hydrogenCount === null) {
      return '—';
    }
    const carbon = carbonCount === 1 ? 'C' : `C${carbonCount}`;
    const hydrogen = hydrogenCount === 1 ? 'H' : `H${hydrogenCount}`;
    return `${carbon}${hydrogen}`;
  }
}
