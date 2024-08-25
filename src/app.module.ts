import { Module } from '@nestjs/common';
import { ConfigModule, type ConfigModuleOptions } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import config from './config';

import { AuthModule, GuestbookModule } from './modules';
import { DatabaseModule } from './shared/database';
import { EmailModule } from './shared/email';
import { JwtModule } from './shared/jwt';
import { LocationModule } from './shared/location';
import { RedisModule } from './shared/redis';

import { AuthGuard } from './modules/auth/common/guards';

import { AppController } from './app.controller';

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
    EmailModule,
    JwtModule,
    LocationModule,
    RedisModule,
    AuthModule,
    GuestbookModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
