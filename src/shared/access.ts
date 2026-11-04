import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Request } from 'express';

export interface SessionUser { id: number; name: string; email: string; role: 'user' | 'moderator'; }
export interface SessionRequest extends Request { user: SessionUser | null; }
export const PUBLIC = 'public';
export const Public = () => SetMetadata(PUBLIC, true);
export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) =>
  context.switchToHttp().getRequest<SessionRequest>().user,
);
