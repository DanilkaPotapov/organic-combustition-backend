import { Module } from '@nestjs/common';
import { OrganicAnalysisController } from './organic-analysis.controller';

@Module({
  controllers: [OrganicAnalysisController],
})
export class OrganicAnalysisModule {}
