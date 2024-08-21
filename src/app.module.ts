import { Module } from '@nestjs/common';

import { ConfigModule, type ConfigModuleOptions } from '@nestjs/config';

import { AppController } from './app.controller';

import config from './config';

import { AuthModule, GuestbookModule } from './modules';
import { DatabaseModule } from './shared/database';
import { JwtModule } from './shared/jwt';
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
    DatabaseModule,
    JwtModule,
    RedisModule,
    AuthModule,
    GuestbookModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
