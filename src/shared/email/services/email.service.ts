import { type Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  Logger,
  NotImplementedException,
} from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// import { TooManyRequestsException } from '~/common/exceptions/too-many-requests.exception';
import { TooManyRequestsException } from '../../../common/exceptions/too-many-requests.exception'; // fix: vercel issue
// import {
//   AppConfig,
//   type IAppConfig,
//   type ISecurityConfig,
//   SecurityConfig,
// } from '~/config';
import {
  AppConfig,
  type IAppConfig,
  type ISecurityConfig,
  SecurityConfig,
} from '../../../config'; // fix: vercel issue
import type {
  IHunterResponse,
  IVerificationCodeLimit,
} from '../common/interfaces';

// import { ErrorEnum } from '~/constants/error.constant';
import moment from 'moment';
import { ErrorEnum } from '../../../constants/error.constant'; // fix: vercel issue

import {
  SendConfirmationEmailDto,
  SendEmailDto,
  SendVerificationCodeDto,
  VerifyEmailDto,
} from '../dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private readonly baseUrl: string;
  private readonly hunterApiKey: string;

  constructor(
    @Inject(SecurityConfig.KEY)
    private readonly securityConfig: ISecurityConfig,
    @Inject(AppConfig.KEY) private readonly appConfig: IAppConfig,
    private readonly httpService: HttpService,
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.baseUrl = this.appConfig.baseUrl;
    this.hunterApiKey = this.securityConfig.hunterApiKey;
  }

  public async verifyEmail({ email }: VerifyEmailDto): Promise<boolean> {
    try {
      const {
        data: { data },
      } = await firstValueFrom(
        this.httpService.get<IHunterResponse>(
          `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${this.hunterApiKey}`,
        ),
      );

      return (
        data.status === 'valid' &&
        data.regexp === true &&
        data.result === 'deliverable'
      );
    } catch (error) {
      this.logger.error('Failed to verify email:', error);
      throw new NotImplementedException(ErrorEnum.EMAIL_VERIFICATION_FAILED);
    }
  }

  public async sendEmail({ email, subject, content, type }: SendEmailDto) {
    this.logger.log(`Sending email to ${email}...`);
    if (type === 'text') {
      return this.mailerService.sendMail({
        to: email,
        subject,
        text: content,
      });
    } else {
      return this.mailerService.sendMail({
        to: email,
        subject,
        html: content,
      });
    }
  }

  public async checkVerificationCodeLimit(email: string): Promise<{
    hasLimit: boolean;
    timeRemaining: number;
  }> {
    const userInfo = await this.cacheManager.get<IVerificationCodeLimit>(email);
    const currentTime = moment().unix();

    if (!userInfo || userInfo.expiry < currentTime) {
      await this.cacheManager.set(email, {
        count: 1,
        expiry: moment().add(5, 'minute').unix(),
      });

      return { hasLimit: false, timeRemaining: 0 };
    }

    const timeRemaining = userInfo.expiry - currentTime;

    if (userInfo.count >= 3) {
      return { hasLimit: true, timeRemaining };
    }

    await this.cacheManager.set(email, {
      count: userInfo.count + 1,
      expiry: userInfo.expiry,
    });

    return { hasLimit: false, timeRemaining };
  }

  public async sendVerificationCode({
    email,
    code,
  }: SendVerificationCodeDto): Promise<{
    email: string;
    code: string;
  }> {
    const subject = 'Verification Code (Sign in)';
    const template = './verification-code';

    const { hasLimit, timeRemaining } = await this.checkVerificationCodeLimit(
      email,
    );

    if (hasLimit && timeRemaining > 0) {
      const minutesRemaining = Math.ceil(timeRemaining / 60);
      const minuteText = minutesRemaining === 1 ? 'minute' : 'minutes';

      throw new TooManyRequestsException(
        `Please try again in ${minutesRemaining} ${minuteText}.`,
        timeRemaining,
      );
    }

    try {
      this.logger.log(`Sending verification email to ${email}...`);
      await this.mailerService.sendMail({
        to: email,
        subject,
        template,
        context: {
          code,
        },
      });
    } catch (error) {
      this.logger.error('Failed to send verification code:', error);
      throw new NotImplementedException(
        ErrorEnum.VERIFICATION_CODE_SEND_FAILED,
      );
    }

    return {
      email,
      code,
    };
  }

  public async sendConfirmationEmail({
    name,
    email,
    confirmationToken,
  }: SendConfirmationEmailDto) {
    const subject = 'Confirm your email';
    const template = './confirmation-email.hbs';
    const link = `${this.baseUrl}/confirm/${confirmationToken}`;

    try {
      this.logger.log(`Sending confirmation email to ${email}...`);
      await this.mailerService.sendMail({
        to: email,
        subject,
        template,
        context: {
          name,
          link,
        },
      });
    } catch (error) {
      this.logger.error('Failed to send confirmation email:', error);
      throw new NotImplementedException(
        ErrorEnum.CONFIRMATION_EMAIL_SEND_FAILED,
      );
    }
  }
}
