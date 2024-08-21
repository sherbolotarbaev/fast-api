import { ConfigType, registerAs } from '@nestjs/config';

import { env } from '../global/env';

export const jwtRegToken = 'jwt';

export const JwtConfig = registerAs(jwtRegToken, () => ({
  secret: env('JWT_SECRET'),
  signOptions: {
    expiresIn: env('JWT_EXPIRATION'),
  },
  access: {
    publicKey: env('JWT_ACCESS_TOKEN_PUBLIC_KEY'),
    privateKey: env('JWT_ACCESS_TOKEN_PRIVATE_KEY'),
    expiresIn: env('JWT_ACCESS_TOKEN_EXPIRATION'),
  },
  refresh: {
    secret: env('JWT_REFRESH_TOKEN_PRIVATE_KEY'),
    expiresIn: env('JWT_REFRESH_TOKEN_EXPIRATION'),
  },
  confirmation: {
    secret: env('JWT_CONFIRMATION_SECRET'),
    expiresIn: env('JWT_CONFIRMATION_EXPIRATION'),
  },
  resetPassword: {
    secret: env('JWT_RESET_PASS_SECRET'),
    expiresIn: env('JWT_RESET_PASS_EXPIRATION'),
  },
}));

export type IJwtConfig = ConfigType<typeof JwtConfig>;
