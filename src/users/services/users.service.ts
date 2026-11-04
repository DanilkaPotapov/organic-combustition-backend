import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { createHash, timingSafeEqual } from 'crypto';
import { RegisterUserDto } from '../dto/register_user.dto';
import { LoginUserDto } from '../dto/login_user.dto';
import { UsersRepository } from '../repositories/users.repository';
import { serializeUser } from '../serializers/user.serializer';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}
  async register(dto: RegisterUserDto) {
    const name = dto.name.trim();
    const email = dto.email.trim().toLowerCase();
    if (!name || Buffer.byteLength(dto.password, 'utf8') > 72) throw new BadRequestException();
    const passwordHash = await hash(dto.password, 12);
    const user = await this.repository.register({ name, email, passwordHash, role: 'user' });
    if (!user) throw new ConflictException();
    return serializeUser(user);
  }
  async authenticate(dto: LoginUserDto) {
    const user = await this.repository.findByEmail(dto.email.trim().toLowerCase());
    if (!user) throw new UnauthorizedException();
    const legacy = /^[a-f0-9]{64}$/.test(user.passwordHash);
    const valid = legacy
      ? timingSafeEqual(Buffer.from(user.passwordHash, 'hex'), createHash('sha256').update(dto.password).digest())
      : await compare(dto.password, user.passwordHash);
    if (!valid || Buffer.byteLength(dto.password, 'utf8') > 72) throw new UnauthorizedException();
    if (legacy) {
      user.passwordHash = await hash(dto.password, 12);
      await this.repository.save(user);
    }
    return serializeUser(user);
  }
}
