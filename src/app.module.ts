import { Module } from '@nestjs/common';
import { OrganicAnalysisModule } from './organic-analysis/organic-analysis.module';

@Module({
  imports: [OrganicAnalysisModule],
})
export class AppModule {}
