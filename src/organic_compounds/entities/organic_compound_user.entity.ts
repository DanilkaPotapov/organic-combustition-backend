import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrganicCompound } from './organic_compound.entity';
import { OrganicCompoundLike } from './organic_compound_like.entity';

@Entity('organic_compound_users')
export class OrganicCompoundUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 160 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => OrganicCompound, (organicCompound) => organicCompound.creator)
  organicCompounds: OrganicCompound[];

  @OneToMany(() => OrganicCompoundLike, (like) => like.user)
  likes: OrganicCompoundLike[];
}
