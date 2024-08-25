import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { AuthUser } from '../common/decorators';
// import { Ip } from '~/decorators/ip.decorator';
import { Ip } from '../../../common/decorators/ip.decorator'; // fix: vercel issue
// import { UserAgent } from '~/common/decorators/user-agent.decorator';
import { UserAgent } from '../../../common/decorators/user-agent.decorator'; // fix: vercel issue
// import { IUserAgent } from '~/utils/user-agent/interfaces';
import { IUserAgent } from '../../../utils/user-agent/interfaces'; // fix: vercel issue

import { AuthService } from '../services';

@Controller()
export class AccountController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(
    @AuthUser() userId: number,
    @Ip() ip: string,
    @UserAgent() userAgent: IUserAgent,
  ) {
    return this.authService.getMe(userId, ip, userAgent);
  }
}
