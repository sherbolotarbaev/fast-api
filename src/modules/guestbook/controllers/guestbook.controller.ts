import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';

import { GetGuestbookMessagesDto } from '../dto';
import { GuestbookService } from '../services';

@Controller('guestbook')
export class GuestbookController {
  constructor(private readonly guestbookService: GuestbookService) {}

  @Get('messages')
  @HttpCode(HttpStatus.OK)
  public async getGuestbookMessages(
    @Query() queryDto: GetGuestbookMessagesDto,
  ) {
    return this.guestbookService.getGuestbookMessages(queryDto);
  }
}
