import { BadRequestException } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import type { ZodError } from 'nestjs-zod/z';

export const ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    const messages = error.issues.map((issue) => issue.message);
    return new BadRequestException(messages);
  },
});
