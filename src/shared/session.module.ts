import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SessionsService } from './sessions.service';
import { SessionGuard } from './session.guard';
@Global()
@Module({ providers: [SessionsService, { provide: APP_GUARD, useClass: SessionGuard }], exports: [SessionsService] })
export class SessionModule {}
