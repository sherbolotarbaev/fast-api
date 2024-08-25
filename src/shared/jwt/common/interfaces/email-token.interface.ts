import type { IAccessPayload, ITokenBase } from '.';

export interface IEmailPayload extends IAccessPayload {
  readonly version: number;
}

export interface IEmailToken extends IEmailPayload, ITokenBase {}
