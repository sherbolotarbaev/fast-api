import type { CookieSerializeOptions } from '@fastify/cookie';

import { isDev } from '~/global/env';

export const DEFAULT_COOKIE_OPTIONS: Partial<CookieSerializeOptions> = {
  httpOnly: true,
  signed: true,
  secure: !isDev,
  domain: !isDev ? '.sherbolotarbaev.co' : 'localhost',
  sameSite: !isDev ? 'none' : 'lax',
  path: '/',
};

export const COOKIE_CONFIG = {
  session: {
    key: 'session',
    opts: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  },
};
