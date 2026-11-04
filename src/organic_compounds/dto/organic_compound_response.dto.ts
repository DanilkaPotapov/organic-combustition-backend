import { ApiProperty } from '@nestjs/swagger';
export class CreatedOrganicCompoundDto { @ApiProperty() id: number; }
export class OrganicCompoundResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiProperty({ type: String, nullable: true }) shortDescription: string | null;
  @ApiProperty({ type: String, nullable: true }) imageUrl: string | null;
  @ApiProperty({ type: String, nullable: true }) videoUrl: string | null;
  @ApiProperty({ type: Number, nullable: true }) carbonCount: number | null;
  @ApiProperty({ type: Number, nullable: true }) hydrogenCount: number | null;
  @ApiProperty() likeCount: number;
  @ApiProperty({ enum: [0, 1] }) isOwner: 0 | 1;
  @ApiProperty({ enum: [0, 1] }) isLiked: 0 | 1;
}
