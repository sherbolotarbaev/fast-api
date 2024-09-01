import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

enum ContentType {
  TEXT = 'text',
  HTML = 'html',
}

const SendEmailSchema = z.object({
  email: z
    .string({ required_error: 'Email is required and cannot be empty.' })
    .email({ message: 'Invalid email.' }),

  content: z.string({
    required_error: 'Content is required cannot be empty.',
    message: 'Content must be a string.',
  }),

  subject: z
    .string({
      message: 'Subject must be a string.',
    })
    .optional(),

  type: z
    .enum([ContentType.TEXT, ContentType.HTML], {
      message: 'Type must be either TEXT or HTML.',
    })
    .optional(),
});

export class SendEmailDto extends createZodDto(SendEmailSchema) {}
