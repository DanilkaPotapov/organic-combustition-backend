import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { readFileSync } from 'fs';
import * as hbs from 'hbs';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const viewsPath = join(process.cwd(), 'views');
  const partialsPath = join(viewsPath, 'partials');

  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('hbs');

  hbs.registerPartial(
    'organic-header',
    readFileSync(join(partialsPath, 'organic-header.hbs'), 'utf8'),
  );
  hbs.registerPartial(
    'organic-bottom-nav',
    readFileSync(join(partialsPath, 'organic-bottom-nav.hbs'), 'utf8'),
  );

  app.useStaticAssets(join(process.cwd(), 'public'));

  await app.listen(process.env.PORT ?? 3000);
  console.log('Lab 2: http://localhost:3000/organic_compounds/grid');
}

bootstrap();
