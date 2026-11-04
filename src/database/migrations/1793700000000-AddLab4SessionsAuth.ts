import { MigrationInterface, QueryRunner } from 'typeorm';
export class AddLab4SessionsAuth1793700000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE users ALTER COLUMN password_hash TYPE VARCHAR(255)");
    await queryRunner.query("ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'moderator'))");
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users DROP COLUMN role');
    await queryRunner.query('ALTER TABLE users ALTER COLUMN password_hash TYPE VARCHAR(64)');
  }
}
