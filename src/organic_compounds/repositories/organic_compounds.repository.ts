import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  OrganicCompound,
  OrganicCompoundStatus,
} from '../entities/organic_compound.entity';
import { OrganicCompoundLike } from '../entities/organic_compound_like.entity';

@Injectable()
export class OrganicCompoundsRepository {
  constructor(
    @InjectRepository(OrganicCompound)
    private readonly compounds: Repository<OrganicCompound>,
    @InjectRepository(OrganicCompoundLike)
    private readonly likes: Repository<OrganicCompoundLike>,
  ) {}

  async findPublished(carbonCount?: number) {
    let query = this.compounds
      .createQueryBuilder('organic_compound')
      .where('organic_compound.status = :status', {
        status: OrganicCompoundStatus.PUBLISHED,
      })
      .loadRelationCountAndMap(
        'organic_compound.likeCount',
        'organic_compound.likes',
      )
      .orderBy('organic_compound.id', 'ASC');

    if (carbonCount !== undefined) {
      query = query.andWhere('organic_compound.carbonCount = :carbonCount', {
        carbonCount,
      });
    }

    return query.getMany();
  }

  async findFeed(id?: number, next = false) {
    let query = this.compounds
      .createQueryBuilder('organic_compound')
      .where('organic_compound.status = :status', {
        status: OrganicCompoundStatus.PUBLISHED,
      })
      .loadRelationCountAndMap(
        'organic_compound.likeCount',
        'organic_compound.likes',
      )
      .orderBy('organic_compound.id', 'ASC')
      .limit(1);

    if (id !== undefined) {
      query = next
        ? query.andWhere('organic_compound.id > :id', { id })
        : query.andWhere('organic_compound.id = :id', { id });
    }

    let compound = await query.getOne();

    if (!compound && id !== undefined && next) {
      compound = await this.compounds
        .createQueryBuilder('organic_compound')
        .where('organic_compound.status = :status', {
          status: OrganicCompoundStatus.PUBLISHED,
        })
        .loadRelationCountAndMap(
          'organic_compound.likeCount',
          'organic_compound.likes',
        )
        .orderBy('organic_compound.id', 'ASC')
        .limit(1)
        .getOne();
    }

    return compound;
  }

  findDraftByCreatorId(creatorId: number) {
    return this.compounds
      .createQueryBuilder('organic_compound')
      .where('organic_compound.creatorId = :creatorId', { creatorId })
      .andWhere('organic_compound.status = :status', {
        status: OrganicCompoundStatus.DRAFT,
      })
      .loadRelationCountAndMap(
        'organic_compound.likeCount',
        'organic_compound.likes',
      )
      .orderBy('organic_compound.id', 'DESC')
      .getOne();
  }

  findById(id: number) {
    return this.compounds
      .createQueryBuilder('organic_compound')
      .where('organic_compound.id = :id', { id })
      .loadRelationCountAndMap(
        'organic_compound.likeCount',
        'organic_compound.likes',
      )
      .getOne();
  }

  create(data: Partial<OrganicCompound>) {
    return this.compounds.create(data);
  }

  save(compound: OrganicCompound) {
    return this.compounds.save(compound);
  }

  async likedIdsByUser(userId: number, organicCompoundIds: number[]) {
    if (organicCompoundIds.length === 0) {
      return new Set<number>();
    }

    const rows = await this.likes.find({
      where: {
        userId,
        organicCompoundId: In(organicCompoundIds),
      },
      select: {
        organicCompoundId: true,
      },
    });

    return new Set(rows.map((row) => row.organicCompoundId));
  }

  async setLike(userId: number, organicCompoundId: number, value: 0 | 1) {
    const existing = await this.likes.find({
      where: { userId, organicCompoundId },
    });

    if (value === 1 && existing.length === 0) {
      await this.likes.save(
        this.likes.create({ userId, organicCompoundId }),
      );
    }

    if (value === 0 && existing.length > 0) {
      await this.likes.remove(existing);
    }
  }
}
