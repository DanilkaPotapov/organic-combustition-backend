import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
export class RegisterUserDto {
  @ApiProperty({ example: 'Потапов Данил', maxLength: 120 })
  @IsString() @MinLength(1) @MaxLength(120) name: string;
  @ApiProperty({ example: 'new@example.local', maxLength: 160 })
  @IsEmail() @MaxLength(160) email: string;
  @ApiProperty({ example: 'Potapov123!', minLength: 6, maxLength: 72 })
  @IsString() @MinLength(6) @MaxLength(72) password: string;
}
