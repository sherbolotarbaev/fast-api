import { ConfigType, registerAs } from '@nestjs/config';

import { env, envNumber } from '../global/env';

export const redisRegToken = 'redis';

export const RedisConfig = registerAs(redisRegToken, () => ({
  host: env('REDIS_HOST'),
  port: envNumber('REDIS_PORT', 6379),
  username: env('REDIS_USER'),
  password: env('REDIS_PASS'),
}));

export type IRedisConfig = ConfigType<typeof RedisConfig>;
