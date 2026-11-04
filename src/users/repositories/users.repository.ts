import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.users.findOne({ where: { email } });
  }

  async register(data: Partial<User>) {
    return this.users.manager.transaction(async (manager) => {
      await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [data.email]);
      const users = manager.getRepository(User);
      if (await users.findOne({ where: { email: data.email } })) return null;
      return users.save(users.create(data));
    });
  }

  create(data: Partial<User>) {
    return this.users.create(data);
  }

  save(user: User) {
    return this.users.save(user);
  }
}
