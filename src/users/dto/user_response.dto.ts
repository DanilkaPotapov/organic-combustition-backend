import { ApiProperty } from '@nestjs/swagger';
export class UserResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty({ enum: ['user', 'moderator'] }) role: 'user' | 'moderator';
}
