import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
export class LoginUserDto {
  @ApiProperty({ example: 'potapov@example.local', maxLength: 160 })
  @IsEmail() @MaxLength(160) email: string;
  @ApiProperty({ example: 'Potapov123!', minLength: 6, maxLength: 72 })
  @IsString() @MinLength(6) @MaxLength(72) password: string;
}
