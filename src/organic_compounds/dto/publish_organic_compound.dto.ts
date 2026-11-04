import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';
export class PublishOrganicCompoundDto {
  @ApiProperty({ example: 'Алкан с четырьмя атомами углерода', minLength: 1, maxLength: 240 })
  @IsString() @MinLength(1) @MaxLength(240) shortDescription: string;
  @ApiProperty({ example: 4, minimum: 1 })
  @IsInt() @Min(1) carbonCount: number;
  @ApiProperty({ example: 10, minimum: 1 })
  @IsInt() @Min(1) hydrogenCount: number;
}
