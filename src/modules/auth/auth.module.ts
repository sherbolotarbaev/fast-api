import { Module } from '@nestjs/common';
import { PassportModule, type IAuthModuleOptions } from '@nestjs/passport';

// import { jwtRegToken } from '~/config';
import { jwtRegToken } from '../../config'; // fix: vercel issue

import { AuthController } from './controllers';
import { AuthService } from './services';

const PassportOptions: IAuthModuleOptions = {
  defaultStrategy: jwtRegToken,
};

@Module({
  imports: [PassportModule.register(PassportOptions)],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
