import { Global, Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

import { JwtService } from './services';

@Global()
@Module({
  imports: [NestJwtModule],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
