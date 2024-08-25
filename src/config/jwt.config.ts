import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ConfigType, registerAs } from '@nestjs/config';

import { env } from '../global/env';

const publicKey = readFileSync(
  join(__dirname, '..', '..', 'keys/public.pem'),
  'utf-8',
);
const privateKey = readFileSync(
  join(__dirname, '..', '..', 'keys/private.pem'),
  'utf-8',
);

export const jwtRegToken = 'jwt';

export const JwtConfig = registerAs(jwtRegToken, () => ({
  access: {
    publicKey,
    privateKey,
    expiresIn: env('JWT_ACCESS_TOKEN_EXPIRATION'),
  },
  refresh: {
    secret: env('JWT_REFRESH_TOKEN_SECRET'),
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
