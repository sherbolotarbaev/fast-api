import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const SignInSchema = z.object(
  {
    email: z
      .string({ required_error: 'Email is required and cannot be empty.' })
      .email({ message: 'Invalid email.' }),
    password: z
      .password({
        required_error: 'Password is required and cannot be empty.',
      })
      .min(8, {
        message: 'Password must be at least 8 characters long.',
      }),
  },
  {
    required_error: 'Request body is required and cannot be empty.',
  },
);

export class SignInDto extends createZodDto(SignInSchema) {}
