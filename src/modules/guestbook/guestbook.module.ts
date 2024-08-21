import { Module } from '@nestjs/common';

import { GuestbookController } from './controllers';
import { GuestbookService } from './services';

@Module({
  providers: [GuestbookService],
  controllers: [GuestbookController],
})
export class GuestbookModule {}
