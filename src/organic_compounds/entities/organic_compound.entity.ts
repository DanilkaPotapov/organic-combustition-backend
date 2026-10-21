import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrganicCompoundLike } from './organic_compound_like.entity';

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

  @Column({ name: 'image_file_name', type: 'varchar', length: 255 })
  imageFileName: string;

  @Column({ name: 'video_file_name', type: 'varchar', length: 255 })
  videoFileName: string;

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

  @ManyToOne(() => User, (user) => user.organicCompounds, {
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => OrganicCompoundLike, (like) => like.organicCompound)
  likes: OrganicCompoundLike[];
}
