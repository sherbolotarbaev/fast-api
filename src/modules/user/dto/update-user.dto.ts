import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const UpdateUserSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required and cannot be empty.',
      message: 'Name must be a string.',
    })
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(64, { message: 'Name cannot be longer than 64 characters.' })
    .optional(),

  surname: z
    .string({
      required_error: 'Surname is required and cannot be empty.',
      message: 'Surname must be a string.',
    })
    .min(2, { message: 'Surname must be at least 2 characters long.' })
    .max(64, { message: 'Surname cannot be longer than 64 characters.' })
    .optional(),

  email: z
    .string({ required_error: 'Email is required and cannot be empty.' })
    .email({ message: 'Invalid email.' })
    .optional(),

  photo: z.string({ message: 'Photo must be a string.' }).optional(),
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
