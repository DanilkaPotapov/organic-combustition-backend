import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setup } from './setup';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  setup(app);
  await app.listen(process.env.PORT ?? 3004);
}
bootstrap();
