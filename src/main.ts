import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

import { fastifyApp } from './common/adapters/fastify.adapter';
import type { ConfigKeyPaths } from './config';

import { AppModule } from './app.module';

import { setup } from './setup';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyApp,
  );

  const configService = app.get(ConfigService<ConfigKeyPaths>);
  const { port, name } = configService.get('app', { infer: true });

  const logger = new Logger(name);

  setup(app);

  try {
    await app.listen(port, '0.0.0.0');
    const url = await app.getUrl();
    logger.log(`🦖 server is running on ${url}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}
bootstrap();
