import { join } from 'node:path';

import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import type { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { HttpModule } from '@nestjs/axios';

// import {
//   appRegToken,
//   mailerRegToken,
//   type ConfigKeyPaths,
//   type IAppConfig,
//   type IMailerConfig,
// } from '~/config';
import {
  appRegToken,
  mailerRegToken,
  type ConfigKeyPaths,
  type IAppConfig,
  type IMailerConfig,
} from '../../config'; // fix: vercel issue

import { EmailService } from './services';

const MailerOptions: MailerAsyncOptions = {
  useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
    const appConfig = configService.get<IAppConfig>(appRegToken);
    const mailerConfig = configService.get<IMailerConfig>(mailerRegToken);
    return {
      transport: mailerConfig,
      defaults: {
        from: {
          name: appConfig.name,
          address: mailerConfig.auth.user,
        },
      },
      template: {
        dir: join(__dirname, '..', '..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [MailerModule.forRootAsync(MailerOptions), HttpModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
