import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { FastifyRequest } from 'fastify';

// import { TokenTypeEnum } from '~/shared/jwt/common/enums';
import { TokenTypeEnum } from '../../../../shared/jwt/common/enums'; // fix: vercel issue

// import { JwtService } from '~/shared/jwt/services';
import { JwtService } from '../../../../shared/jwt/services'; // fix: vercel issue

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const activate = await this.setHttpHeader(
      context.switchToHttp().getRequest<FastifyRequest>(),
      isPublic,
    );

    if (!activate) {
      throw new UnauthorizedException();
    }

    return activate;
  }

  private async setHttpHeader(
    request: FastifyRequest,
    isPublic: boolean,
  ): Promise<boolean> {
    const { session } = request.cookies;

    if (session === undefined || !session.length) {
      return isPublic;
    }

    const domain = this.extractDomain(request.hostname.split(':')[0]);

    try {
      const { id } = await this.jwtService.verifyToken(
        session,
        TokenTypeEnum.ACCESS,
        domain,
      );
      request.user = id;
      return true;
    } catch {
      return isPublic;
    }
  }

  private extractDomain(hostname: string): string {
    if (hostname === '127.0.0.1') return hostname;
    const parts = hostname.split('.').slice(-2);
    return parts.join('.');
  }
}
