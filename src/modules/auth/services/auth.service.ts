import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

// import { JwtService } from '~/shared/jwt/services';
import { JwtService } from '../../../shared/jwt/services'; // fix: vercel issue
// import { PrismaService } from '~/shared/database/services';
import { PrismaService } from '../../../shared/database/services'; // fix: vercel issue
// import { LocationService } from '~/shared/location/services';
import { LocationService } from '../../../shared/location/services'; // fix: vercel issue
// import { UserService } from '~/modules/user/services';
import { UserService } from '../../user/services'; // fix: vercel issue

// import { ErrorEnum } from '~/constants/error.constant';
import { ErrorEnum } from '../../../constants/error.constant'; // fix: vercel issue
// import { IUserAgent } from '~/utils/user-agent/interfaces';
import { IUserAgent } from '../../../utils/user-agent/interfaces'; // fix: vercel issue

import { compare } from 'bcrypt';
// import { isDev } from '~/global/env';
import { isDev } from '../../../global/env'; // fix: vercel issue

import { SignInDto } from '../dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly locationService: LocationService,
  ) {}

  public async signIn(
    { email, password }: SignInDto,
    domain: string | undefined,
  ) {
    const user = await this.verifyUserByEmail(email);

    const comparedPassword = await compare(password, user.password);
    if (!comparedPassword) {
      throw new UnauthorizedException(ErrorEnum.INVALID_CREDENTIALS);
    }

    const [accessToken, refreshToken] =
      await this.jwtService.generateAuthTokens(user, undefined, domain);

    return {
      user,
      accessToken,
      refreshToken,
    };
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
    return user;
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
