import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const SendCConfirmationEmailSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required and cannot be empty.',
      message: 'Name must be a string.',
    })
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(64, { message: 'Name cannot be longer than 64 characters.' }),

  email: z
    .string({ required_error: 'Email is required cannot be empty.' })
    .email({ message: 'Invalid email.' }),

  confirmationToken: z.string({
    required_error: 'Confirmation token is required cannot be empty.',
    message: 'Confirmation token must be a string.',
  }),
});

export class SendConfirmationEmailDto extends createZodDto(
  SendCConfirmationEmailSchema,
) {}
