import type { CookieSerializeOptions } from '@fastify/cookie';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { COOKIE_CONFIG, DEFAULT_COOKIE_OPTIONS } from './constants';

export const extractDomain = (hostname: string): string => {
  if (hostname === '127.0.0.1') return hostname;
  const parts = hostname.split('.').slice(-2);
  return parts.join('.');
};

const mergeOptions = (
  request: FastifyRequest,
  customOptions: Partial<CookieSerializeOptions> = {},
): CookieSerializeOptions => {
  const domain = extractDomain(request.hostname.split(':')[0]);
  return { ...DEFAULT_COOKIE_OPTIONS, domain, ...customOptions };
};

export const setCookie = (
  request: FastifyRequest,
  response: FastifyReply,
  key: keyof typeof COOKIE_CONFIG,
  value: string | undefined,
  customOptions: Partial<CookieSerializeOptions> = {},
): FastifyReply => {
  const { opts, key: cookieKey } = COOKIE_CONFIG[key];
  const options = mergeOptions(request, { ...opts, ...customOptions });

  if (value === undefined) {
    return response.clearCookie(cookieKey, options);
  }

  return response.cookie(cookieKey, value, options);
};

export const setRawCookie = (
  response: FastifyReply,
  setCookieValue: string,
): FastifyReply => {
  let setCookie = response.getHeader('Set-Cookie');

  if (!setCookie) {
    response.header('Set-Cookie', setCookieValue);
    return response;
  }

  if (typeof setCookie === 'string') {
    setCookie = [setCookie];
  }

  if (typeof setCookie !== 'number') {
    setCookie.push(setCookieValue);
  }

  response.removeHeader('Set-Cookie');
  response.header('Set-Cookie', setCookie);
  return response;
};
