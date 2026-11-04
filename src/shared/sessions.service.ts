import { Injectable, OnModuleDestroy, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import Redis from 'ioredis';
import { SessionUser } from './access';

@Injectable()
export class SessionsService implements OnModuleDestroy {
  private readonly redis: Redis;
  readonly ttl: number;
  constructor(config: ConfigService) {
    this.ttl = Number(config.get('SESSION_TTL_SECONDS', 3600));
    this.redis = new Redis({ host: config.get('REDIS_HOST', 'localhost'), port: Number(config.get('REDIS_PORT', 6380)), maxRetriesPerRequest: 1, connectTimeout: 2000 });
    this.redis.on('error', () => undefined);
  }
  private key(id: string) { return `session:${id}`; }
  async create(user: SessionUser): Promise<string> {
    const id = randomBytes(32).toString('hex');
    try { await this.redis.set(this.key(id), JSON.stringify(user), 'EX', this.ttl); }
    catch { throw new ServiceUnavailableException(); }
    return id;
  }
  async find(id?: string): Promise<SessionUser | null> {
    if (!id || !/^[a-f0-9]{64}$/.test(id)) return null;
    let value: string | null;
    try { value = await this.redis.get(this.key(id)); }
    catch { throw new ServiceUnavailableException(); }
    if (!value) return null;
    try { return JSON.parse(value) as SessionUser; } catch { return null; }
  }
  async remove(id?: string): Promise<void> {
    if (!id || !/^[a-f0-9]{64}$/.test(id)) return;
    try { await this.redis.del(this.key(id)); }
    catch { throw new ServiceUnavailableException(); }
  }
  onModuleDestroy() { this.redis.disconnect(); }
}
