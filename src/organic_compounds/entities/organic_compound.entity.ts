import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrganicCompoundLike } from './organic_compound_like.entity';
import { OrganicCompoundUser } from './organic_compound_user.entity';

export enum OrganicCompoundStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  DELETED = 'deleted',
}

@Entity('organic_compounds')
export class OrganicCompound {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ name: 'short_description', type: 'varchar', length: 240, nullable: true })
  shortDescription: string | null;

  @Column({
    type: 'enum',
    enum: OrganicCompoundStatus,
    enumName: 'organic_compound_status',
    default: OrganicCompoundStatus.DRAFT,
  })
  status: OrganicCompoundStatus;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  @Column({ name: 'video_url', type: 'varchar', length: 500, nullable: true })
  videoUrl: string | null;

  @Column({ name: 'carbon_count', type: 'integer', nullable: true })
  carbonCount: number | null;

  @Column({ name: 'hydrogen_count', type: 'integer', nullable: true })
  hydrogenCount: number | null;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'creator_id', type: 'integer' })
  creatorId: number;

  @Column({ name: 'formed_at', type: 'timestamptz', nullable: true })
  formedAt: Date | null;

  @ManyToOne(() => OrganicCompoundUser, (user) => user.organicCompounds, {
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'creator_id' })
  creator: OrganicCompoundUser;

  @OneToMany(() => OrganicCompoundLike, (like) => like.organicCompound)
  likes: OrganicCompoundLike[];
}
