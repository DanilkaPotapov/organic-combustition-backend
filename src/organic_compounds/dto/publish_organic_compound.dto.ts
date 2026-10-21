import { Type } from 'class-transformer';
import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class PublishOrganicCompoundDto {
  @IsString()
  @MinLength(1)
  @MaxLength(240)
  shortDescription: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  carbonCount: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  hydrogenCount: number;
}
