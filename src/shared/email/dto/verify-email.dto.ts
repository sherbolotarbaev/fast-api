import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const VerifyEmailSchema = z.object({
  email: z
    .string({ required_error: 'Email cannot be empty.' })
    .email({ message: 'Invalid email.' }),
});

export class VerifyEmailDto extends createZodDto(VerifyEmailSchema) {}
