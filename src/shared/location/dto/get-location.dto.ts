import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const GetLocationSchema = z.object({
  ip: z.string({
    required_error: 'IP is required cannot be empty.',
    message: 'IP must be a string.',
  }),
});

export class GetLocationDto extends createZodDto(GetLocationSchema) {}
