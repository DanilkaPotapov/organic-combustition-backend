import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrganicCompound } from './organic_compound.entity';
import { OrganicCompoundUser } from './organic_compound_user.entity';

@Entity('organic_compound_likes')
export class OrganicCompoundLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @Column({ name: 'organic_compound_id', type: 'integer' })
  organicCompoundId: number;

  @ManyToOne(() => OrganicCompoundUser, (user) => user.likes, {
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id' })
  user: OrganicCompoundUser;

  @ManyToOne(() => OrganicCompound, (organicCompound) => organicCompound.likes, {
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'organic_compound_id' })
  organicCompound: OrganicCompound;
}
