import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { EmptyHttpErrorFilter } from './shared/empty_http_error.filter';

export function setup(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalFilters(new EmptyHttpErrorFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  const config = new DocumentBuilder().setTitle('Органические соединения — ЛР4')
    .setDescription('Потапов Данил ИУ5-54Б. Выполните POST /api/users/auth: браузер сохранит HttpOnly cookie. В Postman используйте cookie sessionId. В JSON нет статуса и сообщений об ошибках.')
    .setVersion('4.0').addCookieAuth('sessionId').build();
  const document = SwaggerModule.createDocument(app, config);
  const feedById = document.paths['/api/organic_compounds/feed/{id}']?.get;
  if (feedById) feedById.operationId = 'OrganicCompoundsController_feedById';
  SwaggerModule.setup('api', app, document, { swaggerOptions: { withCredentials: true } });
  return document;
}
