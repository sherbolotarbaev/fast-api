import { type Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// import { JwtService } from '~/shared/jwt/services';
import { JwtService } from '../../../shared/jwt/services'; // fix: vercel issue
// import { PrismaService } from '~/shared/database/services';
import { PrismaService } from '../../../shared/database/services'; // fix: vercel issue
// import { LocationService } from '~/shared/location/services';
import { LocationService } from '../../../shared/location/services'; // fix: vercel issue
// import { TokenTypeEnum } from '~/shared/jwt/common/enums';
import { TokenTypeEnum } from '../../../shared/jwt/common/enums'; // fix: vercel issue
// import { IRefreshToken } from '~/shared/jwt/common/interfaces';
import { IRefreshToken } from '../../../shared/jwt/common/interfaces'; // fix: vercel issue
// import { EmailService } from '~/shared/email/services';
import { EmailService } from '../../../shared/email/services'; // fix: vercel issue
// import { UserService } from '~/modules/user/services';
import { UserService } from '../../user/services'; // fix: vercel issue

// import { ErrorEnum } from '~/constants/error.constant';
import { ErrorEnum } from '../../../constants/error.constant'; // fix: vercel issue
// import { IUserAgent } from '~/utils/user-agent/interfaces';
import { IUserAgent } from '../../../utils/user-agent/interfaces'; // fix: vercel issue

import { compare, hash } from 'bcrypt';
import moment from 'moment';
// import { isDev } from '~/global/env';
import { isDev } from '../../../global/env'; // fix: vercel issue
// import { isNull, isUndefined } from '~/utils/validation';
import { isNull, isUndefined } from '../../../utils/validation';

import { SignInDto, SignUpDto } from '../dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly locationService: LocationService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  public async signUp(
    { name, surname, email, password }: SignUpDto,
    domain?: string,
  ) {
    let user: IUser;
    try {
      user = await this.userService.createUser({
        name,
        surname,
        email,
        password: await hash(password, 7),
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ConflictException(ErrorEnum.USER_EXISTS);
      }
      throw new NotImplementedException(ErrorEnum.SIGN_UP_FAILED);
    }

    const confirmationToken = await this.jwtService.generateToken(
      user,
      TokenTypeEnum.CONFIRMATION,
      domain,
    );
    this.emailService.sendConfirmationEmail({
      name: user.name,
      email: user.email,
      confirmationToken,
    });

    const [accessToken, refreshToken] =
      await this.jwtService.generateAuthTokens(user, domain);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  public async signIn(
    { email, password }: SignInDto,
    domain: string | undefined,
  ) {
    const user = await this.verifyUserByEmail(email);

    const comparedPassword = await compare(password, user.password);
    if (!comparedPassword) {
      throw new UnauthorizedException(ErrorEnum.INVALID_CREDENTIALS);
    }

    if (!user.isVerified) {
      const confirmationToken = await this.jwtService.generateToken(
        user,
        TokenTypeEnum.CONFIRMATION,
        domain,
      );
      this.emailService.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        confirmationToken,
      });
      throw new ForbiddenException(
        'Please confirm your email, a new email has been sent.',
      );
    }

    const [accessToken, refreshToken] =
      await this.jwtService.generateAuthTokens(user, domain);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  public async refreshTokenAccess(refreshToken: string, domain?: string) {
    const { id, version, tokenId } =
      await this.jwtService.verifyToken<IRefreshToken>(
        refreshToken,
        TokenTypeEnum.REFRESH,
        domain,
      );

    console.log({
      id,
      tokenId,
      version,
    });
  }

  public async getMe(
    userId: number,
    ip: string,
    userAgent: IUserAgent,
  ): Promise<IUser> {
    const user = await this.userService.findById(userId);
    delete user.password;

    if (!isDev) {
      user.metaData = await this.setMetaData(
        user.id,
        `${userAgent.ua} / ${userAgent.os.name} (${userAgent.os.version})`,
        ip,
      );
    }

    return user;
  }

  private async verifyUserByEmail(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(ErrorEnum.USER_NOT_FOUND);
    }

    if (!user.isActive) {
      throw new ForbiddenException(ErrorEnum.USER_DEACTIVATED);
    }

    return user;
  }

  private async checkIfTokenIsBlacklisted(
    userId: number,
    tokenId: string,
  ): Promise<void> {
    const time = await this.cacheManager.get<number>(
      `blacklist:${userId}:${tokenId}`,
    );

    if (!isUndefined(time) && !isNull(time)) {
      throw new UnauthorizedException(ErrorEnum.TOKEN_INVALID);
    }
  }

  private async blacklistToken(
    userId: number,
    tokenId: string,
    exp: number,
  ): Promise<void> {
    const now = moment().unix();
    const ttl = (exp - now) * 1000;

    if (ttl > 0) {
      await this.cacheManager.set(`blacklist:${userId}:${tokenId}`, now, ttl);
    }
  }

  private async setMetaData(
    userId: number,
    device: string,
    ip: string,
  ): Promise<IUserMetaData> {
    const { city, country, region, timezone } =
      await this.locationService.getLocation({ ip });

    return this.prisma.userMetaData.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        ip,
        city,
        country,
        region,
        timezone,
        lastSeen: new Date(),
        device,
      },
      update: {
        ip,
        city,
        country,
        region,
        timezone,
        lastSeen: new Date(),
        device,
      },
    });
  }
}
