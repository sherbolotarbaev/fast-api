import { z } from 'nestjs-zod/z';
// import { GuestBookMessageSchema } from '~/types/schema';
import { GuestBookMessageSchema } from '../../../../types/schema'; // fix: vercel issue

const GetGuestbookMessagesResponseSchema = z.object({
  totalCount: z.number(),
  count: z.number(),
  items: z.array(GuestBookMessageSchema),
});

export type GetGuestbookMessagesResponseModel = z.infer<
  typeof GetGuestbookMessagesResponseSchema
>;
