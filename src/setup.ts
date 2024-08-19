import { ConfigService } from '@nestjs/config';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

import { ZodValidationPipe } from './common/pipes/zod.pipe';
import type { ConfigKeyPaths } from './config';

import fastifyCookie, { type FastifyCookieOptions } from '@fastify/cookie';

export function setup(app: NestFastifyApplication): NestFastifyApplication {
  const configService = app.get(ConfigService<ConfigKeyPaths>);
  const { cookieSecret } = configService.get('security', {
    infer: true,
  });
  const { frontBaseUrl, frontAuthUrl } = configService.get('app', {
    infer: true,
  });

  app.enableCors({
    origin: [frontBaseUrl, frontAuthUrl],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(new ZodValidationPipe());

  app.register(fastifyCookie, {
    secret: cookieSecret,
  } as FastifyCookieOptions);

  return app;
}
