import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrganicCompoundsLab3Schema1791417600000
  implements MigrationInterface
{
  name = 'CreateOrganicCompoundsLab3Schema1791417600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE organic_compound_status AS ENUM ('draft', 'published', 'deleted')
    `);

    await queryRunner.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(160) NOT NULL,
        password_hash VARCHAR(64) NOT NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE organic_compounds (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        short_description VARCHAR(240),
        status organic_compound_status NOT NULL DEFAULT 'draft',
        image_file_name VARCHAR(255) NOT NULL,
        video_file_name VARCHAR(255) NOT NULL,
        carbon_count INTEGER,
        hydrogen_count INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        creator_id INTEGER NOT NULL,
        formed_at TIMESTAMPTZ,
        CONSTRAINT fk_organic_compounds_creator
          FOREIGN KEY (creator_id)
          REFERENCES users(id)
          ON DELETE RESTRICT
          ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE organic_compound_likes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        organic_compound_id INTEGER NOT NULL,
        CONSTRAINT fk_organic_compound_likes_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE RESTRICT
          ON UPDATE NO ACTION,
        CONSTRAINT fk_organic_compound_likes_compound
          FOREIGN KEY (organic_compound_id)
          REFERENCES organic_compounds(id)
          ON DELETE RESTRICT
          ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS organic_compound_likes');
    await queryRunner.query('DROP TABLE IF EXISTS organic_compounds');
    await queryRunner.query('DROP TABLE IF EXISTS users');
    await queryRunner.query('DROP TYPE IF EXISTS organic_compound_status');
  }
}
