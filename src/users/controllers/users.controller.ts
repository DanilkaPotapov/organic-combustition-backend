import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCookieAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CookieOptions, Request, Response } from 'express';
import { Public } from '../../shared/access';
import { SessionsService } from '../../shared/sessions.service';
import { RegisterUserDto } from '../dto/register_user.dto';
import { LoginUserDto } from '../dto/login_user.dto';
import { UserResponseDto } from '../dto/user_response.dto';
import { UsersService } from '../services/users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService, private readonly sessions: SessionsService, private readonly config: ConfigService) {}
  private cookieOptions(): CookieOptions {
    return { httpOnly: true, sameSite: 'lax', secure: this.config.get('COOKIE_SECURE') === 'true', path: '/' };
  }
  @Public() @Post('register')
  @ApiOperation({ summary: 'Регистрация' })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'Email занят, без тела' })
  register(@Body() dto: RegisterUserDto) { return this.service.register(dto); }

  @Public() @Post('auth') @HttpCode(200)
  @ApiOperation({ summary: 'Вход и создание сессии Redis' })
  @ApiOkResponse({ type: UserResponseDto, headers: { 'Set-Cookie': { schema: { type: 'string' }, description: 'sessionId; HttpOnly; SameSite=Lax' } } })
  @ApiResponse({ status: 401, description: 'Неверные данные, без тела' })
  async authenticate(@Body() dto: LoginUserDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const user = await this.service.authenticate(dto);
    await this.sessions.remove(request.cookies?.sessionId);
    const sessionId = await this.sessions.create(user);
    response.cookie('sessionId', sessionId, { ...this.cookieOptions(), maxAge: this.sessions.ttl * 1000 });
    return user;
  }

  @Public() @Post('logout') @HttpCode(200)
  @ApiCookieAuth() @ApiOperation({ summary: 'Выход и удаление сессии' })
  @ApiOkResponse({ description: 'Без тела, cookie очищена' })
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    await this.sessions.remove(request.cookies?.sessionId);
    response.clearCookie('sessionId', this.cookieOptions());
  }
}
