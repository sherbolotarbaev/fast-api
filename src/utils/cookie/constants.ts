import type { CookieSerializeOptions } from '@fastify/cookie';

// import { isDev } from '~/global/env';
import { isDev } from '../../global/env'; // fix: vercel issue

export const DEFAULT_COOKIE_OPTIONS: Partial<CookieSerializeOptions> = {
  httpOnly: true,
  signed: false,
  secure: !isDev,
  domain: !isDev ? '.sherbolotarbaev.co' : 'localhost',
  sameSite: !isDev ? 'none' : 'lax',
  path: '/',
};

export const COOKIE_CONFIG = {
  session: {
    key: 'session',
    opts: {
      maxAge: 60 * 60 * 1000, // 1h
    },
  },
  session_refresh: {
    key: 'session_refresh',
    opts: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    },
  },
};
