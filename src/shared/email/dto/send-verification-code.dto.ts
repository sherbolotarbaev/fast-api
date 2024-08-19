import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const SendVerificationCodeSchema = z.object({
  email: z
    .string({ required_error: 'Email cannot be empty.' })
    .email({ message: 'Invalid email.' }),
  code: z.string({
    message: 'Code must be a string.',
    required_error: 'Code cannot be empty.',
  }),
});

export class SendVerificationCodeDto extends createZodDto(
  SendVerificationCodeSchema,
) {}
