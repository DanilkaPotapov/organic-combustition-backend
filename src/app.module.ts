import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganicCompoundsModule } from './organic_compounds/organic_compounds.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get<string>('DB_PORT', '5433')),
        username: config.get<string>('DB_USERNAME', 'organic_compounds_user'),
        password: config.get<string>('DB_PASSWORD', 'organic_compounds_pass'),
        database: config.get<string>('DB_DATABASE', 'organic_compounds_lab2'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    OrganicCompoundsModule,
  ],
})
export class AppModule {}
