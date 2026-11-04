import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
export class LikeOrganicCompoundDto {
  @ApiProperty({ enum: [0, 1], example: 1 })
  @IsIn([0, 1]) value: 0 | 1;
}
