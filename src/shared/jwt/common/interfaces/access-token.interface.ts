import type { ITokenBase } from '.';

export interface IAccessPayload {
  id: number;
}

export interface IAccessToken extends IAccessPayload, ITokenBase {}
