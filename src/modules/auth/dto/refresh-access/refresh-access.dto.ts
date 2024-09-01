import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const RefreshAccessSchema = z.object(
  {
    refreshToken: z.string({
      required_error: 'Refresh token is required and cannot be empty.',
      message: 'Refresh token must be a string.',
    }),
  },
  {
    required_error: 'Request body is required and cannot be empty.',
  },
);

export class RefreshAccessDto extends createZodDto(RefreshAccessSchema) {}
