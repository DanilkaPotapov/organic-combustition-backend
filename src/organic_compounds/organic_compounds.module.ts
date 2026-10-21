import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganicCompound } from './entities/organic_compound.entity';
import { OrganicCompoundLike } from './entities/organic_compound_like.entity';
import { OrganicCompoundUser } from './entities/organic_compound_user.entity';
import { OrganicCompoundsController } from './organic_compounds.controller';
import { OrganicCompoundsService } from './organic_compounds.service';
import { MinioService } from './services/minio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrganicCompound,
      OrganicCompoundLike,
      OrganicCompoundUser,
    ]),
  ],
  controllers: [OrganicCompoundsController],
  providers: [OrganicCompoundsService, MinioService],
})
export class OrganicCompoundsModule {}
