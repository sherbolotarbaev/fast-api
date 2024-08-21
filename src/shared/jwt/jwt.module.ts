import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JwtModule as NestJwtModule,
  type JwtModuleAsyncOptions,
} from '@nestjs/jwt';

// import { jwtRegToken, type ConfigKeyPaths, type IJwtConfig } from '~/config';
import {
  jwtRegToken,
  type ConfigKeyPaths,
  type IJwtConfig,
} from '../../config'; // fix: vercel issue

import { JwtService } from './services';

const JwtOptions: JwtModuleAsyncOptions = {
  useFactory: async (configService: ConfigService<ConfigKeyPaths>) => {
    const jwtConfig = configService.get<IJwtConfig>(jwtRegToken);
    return {
      secret: jwtConfig.secret,
      signOptions: jwtConfig.signOptions,
    };
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [NestJwtModule.registerAsync(JwtOptions)],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
