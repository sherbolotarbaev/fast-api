import { CookieSerializeOptions } from '@fastify/cookie';
import 'fastify';

declare module 'fastify' {
  interface FastifyReply {
    cookie(name: string, value: string, options?: CookieSerializeOptions): this;
    clearCookie(name: string, options?: CookieSerializeOptions): this;
  }

  interface FastifyRequest {
    user?: IUser;
  }
}
