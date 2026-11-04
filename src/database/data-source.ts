import 'dotenv/config';
import { DataSource } from 'typeorm';
import { OrganicCompound } from '../organic_compounds/entities/organic_compound.entity';
import { OrganicCompoundLike } from '../organic_compounds/entities/organic_compound_like.entity';
import { User } from '../users/entities/user.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5434),
  username: process.env.DB_USERNAME || 'organic_compounds_user',
  password: process.env.DB_PASSWORD || 'organic_compounds_pass',
  database: process.env.DB_DATABASE || 'organic_compounds_lab4',
  entities: [OrganicCompound, OrganicCompoundLike, User],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
