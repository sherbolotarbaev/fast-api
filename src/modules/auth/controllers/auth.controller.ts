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

import { SignInDto } from '../dto';
import { AuthService } from '../services';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  @UseInterceptors(SessionInterceptor)
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto, @Domain() domain: string | undefined) {
    return this.authService.signIn(dto, domain);
  }
}
