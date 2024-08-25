import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { setCookie } from '~/utils/cookie';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(({ user, accessToken, refreshToken }) => {
        const request = context.switchToHttp().getRequest<FastifyRequest>();
        const response = context.switchToHttp().getResponse<FastifyReply>();

        setCookie(request, response, 'session', accessToken);
        setCookie(request, response, 'session_refresh', refreshToken);

        delete user.password;
        delete user.isVerified;
        delete user.isActive;
        delete user.metaData;
        delete user.photo;
        delete user.createdAt;
        delete user.updatedAt;

        return response.status(200).send(user);
      }),
    );
  }
}
