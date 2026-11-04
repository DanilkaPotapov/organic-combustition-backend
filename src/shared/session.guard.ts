import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC, SessionRequest } from './access';
import { SessionsService } from './sessions.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly sessions: SessionsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<SessionRequest>();
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC, [context.getHandler(), context.getClass()]);
    request.user = await this.sessions.find(request.cookies?.sessionId);
    if (!isPublic && !request.user) throw new UnauthorizedException();
    return true;
  }
}
