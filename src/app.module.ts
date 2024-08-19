import { Module } from '@nestjs/common';

import { ConfigModule, type ConfigModuleOptions } from '@nestjs/config';

import { AppController } from './app.controller';

import config from './config';

import { GuestbookModule } from './modules';
import { DatabaseModule } from './shared/database/database.module';
import { RedisModule } from './shared/redis';

const ConfigOptions: ConfigModuleOptions = {
  isGlobal: true,
  expandVariables: true,
  envFilePath: '.env',
  load: [...Object.values(config)],
};

@Module({
  imports: [
    ConfigModule.forRoot(ConfigOptions),
    RedisModule,
    DatabaseModule,
    GuestbookModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
