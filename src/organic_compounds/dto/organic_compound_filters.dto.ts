import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class OrganicCompoundFiltersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  carbonCount?: number;
}
