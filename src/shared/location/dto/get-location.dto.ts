import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const GetLocationSchema = z.object({
  ip: z.string({
    message: 'IP must be a string.',
    required_error: 'IP cannot be empty.',
  }),
});

export class GetLocationDto extends createZodDto(GetLocationSchema) {}
