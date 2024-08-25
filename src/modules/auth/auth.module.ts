import { Module } from '@nestjs/common';
import { PassportModule, type IAuthModuleOptions } from '@nestjs/passport';

// import { jwtRegToken } from '~/config';
import { jwtRegToken } from '../../config'; // fix: vercel issue

import { UserModule } from '../user/user.module';

import { AccountController, AuthController } from './controllers';
import { AuthService } from './services';

const PassportOptions: IAuthModuleOptions = {
  defaultStrategy: jwtRegToken,
};

@Module({
  imports: [PassportModule.register(PassportOptions), UserModule],
  providers: [AuthService],
  controllers: [AuthController, AccountController],
})
export class AuthModule {}
