import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrganicCompound } from '../../organic_compounds/entities/organic_compound.entity';
import { OrganicCompoundLike } from '../../organic_compounds/entities/organic_compound_like.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 160 })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 64 })
  passwordHash: string;

  @OneToMany(() => OrganicCompound, (compound) => compound.creator)
  organicCompounds: OrganicCompound[];

  @OneToMany(() => OrganicCompoundLike, (like) => like.user)
  likes: OrganicCompoundLike[];
}
