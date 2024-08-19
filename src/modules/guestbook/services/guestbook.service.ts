import { type Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';

// import { PrismaService } from '~/shared/database/services';
import { PrismaService } from '../../../shared/database/services'; // fix: vercel issue

import {
  GetGuestbookMessagesDto,
  GetGuestbookMessagesResponseModel,
} from '../dto';

@Injectable()
export class GuestbookService {
  private GuestBookMessageInclude: Prisma.GuestBookMessageInclude = {
    author: {
      select: {
        name: true,
        email: true,
        photo: true,
        isVerified: true,
      },
    },
    likes: {
      select: {
        userId: true,
      },
    },
  };

  private readonly logger = new Logger(GuestbookService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.cacheManager.del('messages');
  }

  async getGuestbookMessages({
    take,
  }: GetGuestbookMessagesDto): Promise<GetGuestbookMessagesResponseModel> {
    const cachedMessages: {
      items: IGuestBookMessage[];
      totalCount: number;
    } = await this.cacheManager.get('messages');

    if (cachedMessages) {
      this.logger.log('Returning cached messages...');
      return {
        totalCount: cachedMessages.totalCount,
        count: cachedMessages.items.length,
        items: cachedMessages.items,
      };
    }

    try {
      const [totalCount, items] = await Promise.all([
        this.prisma.guestBookMessage.count(),
        this.prisma.guestBookMessage.findMany({
          take,
          orderBy: { createdAt: 'desc' },
          include: this.GuestBookMessageInclude,
        }),
      ]);

      this.logger.log('Caching messages...');
      await Promise.all([
        this.cacheManager.del('messages'),
        this.cacheManager.set('messages', {
          items,
          totalCount,
        }),
      ]);

      return {
        totalCount,
        count: items.length,
        items,
      };
    } catch (error) {
      this.logger.error('Failed to get guestbook messages:', error);
      throw new InternalServerErrorException(
        'Failed to get guestbook messages.',
      );
    }
  }
}
