import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const GetGuestbookMessagesSchema = z.object({
  take: z.coerce
    .number({ message: 'Query parameter `take` must be a number.' })
    .optional(),
});

export class GetGuestbookMessagesDto extends createZodDto(
  GetGuestbookMessagesSchema,
) {}
