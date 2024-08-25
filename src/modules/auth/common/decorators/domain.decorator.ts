import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

// import { extractDomain } from '~/utils/cookie';
import { extractDomain } from '../../../../utils/cookie'; // fix: vercel issue

export const Domain = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>();
  return extractDomain(request.hostname.split(':')[0]);
});
