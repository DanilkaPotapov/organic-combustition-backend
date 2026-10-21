import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganicCompoundsController } from './controllers/organic_compounds.controller';
import { OrganicCompound } from './entities/organic_compound.entity';
import { OrganicCompoundLike } from './entities/organic_compound_like.entity';
import { OrganicCompoundsRepository } from './repositories/organic_compounds.repository';
import { MinioService } from './services/minio.service';
import { OrganicCompoundsService } from './services/organic_compounds.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrganicCompound, OrganicCompoundLike])],
  controllers: [OrganicCompoundsController],
  providers: [OrganicCompoundsService, OrganicCompoundsRepository, MinioService],
})
export class OrganicCompoundsModule {}
