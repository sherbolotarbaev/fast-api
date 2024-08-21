import { Module } from '@nestjs/common';

import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

// import {
//   redisRegToken,
//   type ConfigKeyPaths,
//   type IRedisConfig,
// } from '~/config';
import {
  redisRegToken,
  type ConfigKeyPaths,
  type IRedisConfig,
} from '../../config'; // fix: vercel issue

import * as redisStore from 'cache-manager-redis-store';

const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async (configService: ConfigService<ConfigKeyPaths>) => {
    const redisConfig = configService.get<IRedisConfig>(redisRegToken);
    return {
      ...redisConfig,
      store: redisStore,
      no_ready_check: true,
    };
  },
  inject: [ConfigService],
};

@Module({
  imports: [CacheModule.registerAsync(RedisOptions)],
  controllers: [],
  providers: [],
})
export class RedisModule {}
