import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

// import { userAgent } from '~/utils/user-agent';
import { userAgent } from '../../utils/user-agent'; // fix: vercel issue

export const UserAgent = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    return userAgent(request);
  },
);
