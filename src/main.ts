import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as hbs from 'hbs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const viewsPath = join(process.cwd(), 'views');
  const partialsPath = join(viewsPath, 'partials');

  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('hbs');

  hbs.registerPartial(
    'header',
    readFileSync(join(partialsPath, 'header.hbs'), 'utf8'),
  );

  hbs.registerPartial(
    'bottom-nav',
    readFileSync(join(partialsPath, 'bottom-nav.hbs'), 'utf8'),
  );

  app.useStaticAssets(join(process.cwd(), 'public'));

  await app.listen(process.env.PORT ?? 3000);
  console.log('Organic Analysis: http://localhost:3000/compounds/grid');
}

bootstrap();
