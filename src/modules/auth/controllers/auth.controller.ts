import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { Domain, Public } from '../common/decorators';
import { SessionInterceptor } from '../common/interceptors';

import { RefreshAccessDto, SignInDto, SignUpDto } from '../dto';
import { AuthService } from '../services';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @UseInterceptors(SessionInterceptor)
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() dto: SignUpDto, @Domain() domain: string | undefined) {
    return this.authService.signUp(dto, domain);
  }

  @Public()
  @Post('sign-in')
  @UseInterceptors(SessionInterceptor)
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto, @Domain() domain: string | undefined) {
    return this.authService.signIn(dto, domain);
  }

  @Public()
  @Post('refresh-access')
  @HttpCode(HttpStatus.OK)
  async refreshAccess(
    @Body() refreshAccessDto: RefreshAccessDto,
    @Domain() domain: string | undefined,
  ) {
    return this.authService.refreshTokenAccess(
      refreshAccessDto.refreshToken,
      domain,
    );
  }
}
