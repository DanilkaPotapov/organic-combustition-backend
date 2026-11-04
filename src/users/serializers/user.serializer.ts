import { UserResponseDto } from '../dto/user_response.dto';
import { User } from '../entities/user.entity';

export function serializeUser(user: User): UserResponseDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
