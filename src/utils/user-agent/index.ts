import type { IncomingHttpHeaders } from 'http';
import UAParser from 'ua-parser-js';

import type { UserAgent } from './interfaces';

export function isBot(input: string): boolean {
  return /Googlebot|Mediapartners-Google|AdsBot-Google|googleweblight|Storebot-Google|Google-PageRenderer|Google-InspectionTool|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|LinkedInBot|bitlybot|tumblr|vkShare|quora link preview|facebookexternalhit|facebookcatalog|Twitterbot|applebot|redditbot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|ia_archiver/i.test(
    input,
  );
}

export function userAgentFromString(input: string | undefined): UserAgent {
  const parser = new UAParser(input);
  const parsedResult = parser.getResult();

  return {
    isBot: input === undefined ? false : isBot(input),
    ua: input || '',
    browser: parsedResult.browser,
    device: parsedResult.device,
    engine: parsedResult.engine,
    os: parsedResult.os,
    cpu: parsedResult.cpu,
  };
}

export function userAgent({
  headers,
}: {
  headers: IncomingHttpHeaders;
}): UserAgent {
  return userAgentFromString(headers['user-agent'] || undefined);
}
