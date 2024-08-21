import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JsonWebTokenError,
  JwtService as NestJwtService,
  TokenExpiredError,
  type JwtSignOptions,
  type JwtVerifyOptions,
} from '@nestjs/jwt';

// import { jwtRegToken, type IJwtConfig } from '~/config';
import { jwtRegToken, type IJwtConfig } from '../../../config'; // fix: vercel issue

// import { isDev } from '~/global/env';
import { isDev } from '../../../global/env';
// import { ErrorEnum } from '~/constants/error.constant';
import { ErrorEnum } from '../../../constants/error.constant'; // fix: vercel issue

import { TokenTypeEnum } from '../common/enums';
import {
  IAccessPayload,
  IAccessToken,
  IEmailPayload,
  IEmailToken,
  IRefreshPayload,
  IRefreshToken,
} from '../common/interfaces';

@Injectable()
export class JwtService {
  private readonly logger = new Logger(JwtService.name);

  private readonly jwtConfig: IJwtConfig;
  private readonly domain: string;
  private readonly issuer: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly nestJwtService: NestJwtService,
  ) {
    this.jwtConfig = this.configService.get<IJwtConfig>(jwtRegToken);
    this.domain = !isDev ? '.sherbolotarbaev.co' : 'localhost';
    this.issuer = '399393939';
  }

  private async generateTokenAsync(
    payload: IAccessPayload | IEmailPayload | IRefreshPayload,
    options: JwtSignOptions,
  ): Promise<string> {
    return this.nestJwtService.signAsync(payload, options);
  }

  private async verifyTokenAsync<T>(
    token: string,
    options: JwtVerifyOptions,
  ): Promise<T> {
    return this.nestJwtService.verify(token, options) as T;
  }

  private async throwBadRequest<
    T extends IAccessToken | IRefreshToken | IEmailToken,
  >(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new BadRequestException(ErrorEnum.TOKEN_EXPIRED);
      }
      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException(ErrorEnum.TOKEN_INVALID);
      }
      throw new InternalServerErrorException(error);
    }
  }

  public async generateToken(
    user: IUser,
    tokenType: TokenTypeEnum,
    tokenId?: string,
  ): Promise<string> {
    const jwtOptions: JwtSignOptions = {
      issuer: this.issuer,
      subject: user.email,
      audience: this.domain,
      algorithm: 'HS256',
    };

    switch (tokenType) {
      case TokenTypeEnum.ACCESS:
        const { privateKey, expiresIn: accessTokenExpiration } =
          this.jwtConfig.access;

        try {
          return await this.generateTokenAsync(
            { id: user.id },
            {
              ...jwtOptions,
              privateKey,
              expiresIn: accessTokenExpiration,
              algorithm: 'RS256',
            },
          );
        } catch (error) {
          this.logger.error(error);
          throw new InternalServerErrorException(error);
        }

      case TokenTypeEnum.REFRESH:
        const { secret: refreshSecret, expiresIn: refreshTokenExpiration } =
          this.jwtConfig.refresh;

        try {
          return await this.generateTokenAsync(
            { id: user.id, tokenId: tokenId ?? '' },
            {
              ...jwtOptions,
              secret: refreshSecret,
              expiresIn: refreshTokenExpiration,
            },
          );
        } catch (error) {
          this.logger.error(error);
          throw new InternalServerErrorException(error);
        }

      case TokenTypeEnum.CONFIRMATION:
      case TokenTypeEnum.RESET_PASSWORD:
        const { secret, expiresIn } = this.jwtConfig[tokenType];

        try {
          return await this.generateTokenAsync(
            { id: user.id },
            {
              ...jwtOptions,
              secret,
              expiresIn,
            },
          );
        } catch (error) {
          this.logger.error(error);
          throw new InternalServerErrorException(error);
        }
    }
  }

  public async verifyToken<
    T extends IAccessToken | IRefreshToken | IEmailToken,
  >(token: string, tokenType: TokenTypeEnum): Promise<T> {
    const jwtOptions: JwtVerifyOptions = {
      issuer: this.issuer,
      audience: new RegExp(this.domain),
    };

    switch (tokenType) {
      case TokenTypeEnum.ACCESS:
        const { publicKey, expiresIn: accessTokenExpiration } =
          this.jwtConfig.access;

        try {
          return this.throwBadRequest(
            this.verifyTokenAsync(token, {
              ...jwtOptions,
              secret: publicKey,
              maxAge: accessTokenExpiration,
              algorithms: ['RS256'],
            }),
          );
        } catch (error) {
          this.logger.error(error);
          throw new InternalServerErrorException(error);
        }

      case TokenTypeEnum.REFRESH:
      case TokenTypeEnum.CONFIRMATION:
      case TokenTypeEnum.RESET_PASSWORD:
        const { secret, expiresIn } = this.jwtConfig[tokenType];

        try {
          return this.throwBadRequest(
            this.verifyTokenAsync(token, {
              ...jwtOptions,
              secret,
              maxAge: expiresIn,
              algorithms: ['HS256'],
            }),
          );
        } catch (error) {
          this.logger.error(error);
          throw new InternalServerErrorException(error);
        }
    }
  }

  public async generateAuthTokens(
    user: IUser,
    tokenId?: string,
  ): Promise<[string, string]> {
    return Promise.all([
      this.generateToken(user, TokenTypeEnum.ACCESS, tokenId),
      this.generateToken(user, TokenTypeEnum.REFRESH, tokenId),
    ]);
  }
}
