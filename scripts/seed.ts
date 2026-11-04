import 'dotenv/config';
import { hash } from 'bcryptjs';
import { readFileSync } from 'fs';
import { join } from 'path';
import dataSource from '../src/database/data-source';
import { User } from '../src/users/entities/user.entity';
import { OrganicCompound, OrganicCompoundStatus } from '../src/organic_compounds/entities/organic_compound.entity';
import { MinioService } from '../src/organic_compounds/services/minio.service';
import { ConfigService } from '@nestjs/config';

async function seed() {
  await dataSource.initialize();
  try {
    const users = dataSource.getRepository(User);
    const compounds = dataSource.getRepository(OrganicCompound);
    const media = new MinioService(new ConfigService());
    for (const [name, type] of [['organic_compound.png', 'image/png'], ['organic_compound.webm', 'video/webm']]) {
      const buffer = readFileSync(join(__dirname, '..', 'postman', 'files', name));
      await media.upload({ fieldname: type.startsWith('image') ? 'image' : 'video', originalname: name, mimetype: type, size: buffer.length, buffer }, name);
    }
    for (const [name, email] of [['Потапов Данил', 'potapov@example.local'], ['Второй автор', 'student2@example.local']]) {
      if (!await users.findOne({ where: { email } })) await users.save(users.create({ name, email, passwordHash: await hash('Potapov123!', 12), role: 'user' }));
    }
    const authors = await users.find({ order: { id: 'ASC' } });
    const data: [string, number, number][] = [['Метан',1,4],['Этан',2,6],['Этен',2,4],['Пропен',3,6],['Метанол',1,4],['Этанол',2,6]];
    for (const [i, [name, carbonCount, hydrogenCount]] of data.entries()) {
      if (await compounds.findOne({ where: { name } })) continue;
      await compounds.save(compounds.create({ name, carbonCount, hydrogenCount, shortDescription: `${name}: атомов C — ${carbonCount}, H — ${hydrogenCount}.`, status: OrganicCompoundStatus.PUBLISHED, imageFileName: 'organic_compound.png', videoFileName: 'organic_compound.webm', creatorId: authors[i % 2].id, formedAt: new Date() }));
    }
    console.log('Демо-данные добавлены. potapov@example.local / student2@example.local, пароль Potapov123!');
  } finally { await dataSource.destroy(); }
}
seed().catch((error) => { console.error(error); process.exitCode = 1; });
