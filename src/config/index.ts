import { AppConfig, IAppConfig, appRegToken } from './app.config';

import { IJwtConfig, JwtConfig, jwtRegToken } from './jwt.config';

import {
  ISecurityConfig,
  SecurityConfig,
  securityRegToken,
} from './security.config';

import { IRedisConfig, RedisConfig, redisRegToken } from './redis.config';

import { IMailerConfig, MailerConfig, mailerRegToken } from './mailer.config';

export * from './app.config';
export * from './jwt.config';
export * from './mailer.config';
export * from './redis.config';
export * from './security.config';

export interface AllConfigType {
  [appRegToken]: IAppConfig;
  [jwtRegToken]: IJwtConfig;
  [securityRegToken]: ISecurityConfig;
  [redisRegToken]: IRedisConfig;
  [mailerRegToken]: IMailerConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default {
  AppConfig,
  JwtConfig,
  SecurityConfig,
  MailerConfig,
  RedisConfig,
};
