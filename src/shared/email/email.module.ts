import { join } from 'node:path';

import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import type { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { HttpModule } from '@nestjs/axios';

// import type { ConfigKeyPaths } from '~/config';
import type { ConfigKeyPaths, IAppConfig, IMailerConfig } from '../../config'; // fix: vercel issue

import { EmailService } from './services';

const MailerOptions: MailerAsyncOptions = {
  useFactory: (configService: ConfigService<ConfigKeyPaths>) => ({
    transport: configService.get<IMailerConfig>('mailer'),
    defaults: {
      from: {
        name: configService.get<IAppConfig>('app').name,
        address: configService.get<IMailerConfig>('mailer').auth.user,
      },
    },
    template: {
      dir: join(__dirname, '..', '..', 'templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [MailerModule.forRootAsync(MailerOptions), HttpModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
