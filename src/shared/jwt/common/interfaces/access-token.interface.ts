import type { ITokenBase } from '.';

export interface IAccessPayload {
  readonly id: number;
}

export interface IAccessToken extends IAccessPayload, ITokenBase {}
