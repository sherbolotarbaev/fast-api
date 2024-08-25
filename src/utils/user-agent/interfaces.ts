export interface IUserAgent {
  readonly isBot: boolean;
  readonly ua: string;
  readonly browser: {
    readonly name?: string;
    readonly version?: string;
    readonly major?: string;
  };
  readonly device: {
    readonly model?: string;
    readonly type?: string;
    readonly vendor?: string;
  };
  readonly engine: {
    readonly name?: string;
    readonly version?: string;
  };
  readonly os: {
    readonly name?: string;
    readonly version?: string;
  };
  readonly cpu: {
    readonly architecture?: string;
  };
}
