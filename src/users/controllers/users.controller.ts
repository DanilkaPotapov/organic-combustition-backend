import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterUserDto } from '../dto/register_user.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post('register')
  register(@Body() dto: RegisterUserDto) {
    return this.service.register(dto);
  }

  @Post('auth')
  @HttpCode(204)
  authenticate() {}

  @Post('logout')
  @HttpCode(204)
  logout() {}
}
