import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { RegisterUserDto } from '../dto/register_user.dto';
import { UserResponseDto } from '../dto/user_response.dto';
import { UsersRepository } from '../repositories/users.repository';
import { serializeUser } from '../serializers/user.serializer';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async register(dto: RegisterUserDto): Promise<UserResponseDto> {
    const name = dto.name?.trim();
    const email = dto.email?.trim().toLowerCase();
    const password = dto.password;

    if (!name || !email || !password || !email.includes('@')) {
      throw new BadRequestException();
    }

    if (await this.repository.findByEmail(email)) {
      throw new ConflictException();
    }

    const passwordHash = createHash('sha256').update(password).digest('hex');
    const user = this.repository.create({ name, email, passwordHash });
    return serializeUser(await this.repository.save(user));
  }
}
