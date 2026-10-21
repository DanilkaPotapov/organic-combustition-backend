import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrganicCompound } from './organic_compound.entity';

@Entity('organic_compound_likes')
export class OrganicCompoundLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @Column({ name: 'organic_compound_id', type: 'integer' })
  organicCompoundId: number;

  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => OrganicCompound, (compound) => compound.likes, {
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'organic_compound_id' })
  organicCompound: OrganicCompound;
}
