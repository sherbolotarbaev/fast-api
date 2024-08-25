import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const SendVerificationCodeSchema = z.object({
  email: z
    .string({ required_error: 'Email is required cannot be empty.' })
    .email({ message: 'Invalid email.' }),
  code: z.string({
    required_error: 'Code is required cannot be empty.',
    message: 'Code must be a string.',
  }),
});

export class SendVerificationCodeDto extends createZodDto(
  SendVerificationCodeSchema,
) {}
