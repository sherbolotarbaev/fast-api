import type { IEmailPayload, ITokenBase } from '.';

export interface IRefreshPayload extends IEmailPayload {
  readonly tokenId: string;
}

export interface IRefreshToken extends IRefreshPayload, ITokenBase {}
