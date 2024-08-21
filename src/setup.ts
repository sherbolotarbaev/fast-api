import { ConfigService } from '@nestjs/config';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

import { ZodValidationPipe } from './common/pipes/zod.pipe';
import { appRegToken, securityRegToken, type ConfigKeyPaths } from './config';

import fastifyCookie, { type FastifyCookieOptions } from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import fastifyHelmet from '@fastify/helmet';

export async function setup(
  app: NestFastifyApplication,
): Promise<NestFastifyApplication> {
  const configService = app.get(ConfigService<ConfigKeyPaths>);
  const { cookieSecret } = configService.get(securityRegToken, {
    infer: true,
  });
  const { frontBaseUrl, frontAuthUrl } = configService.get(appRegToken, {
    infer: true,
  });

  await app.register<FastifyCookieOptions>(fastifyCookie, {
    secret: cookieSecret,
  });

  await app.register(fastifyHelmet);

  await app.register(fastifyCsrfProtection, { cookieOpts: { signed: true } });

  await app.register(fastifyCors, {
    origin: [frontBaseUrl, frontAuthUrl],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(new ZodValidationPipe());

  return app;
}
