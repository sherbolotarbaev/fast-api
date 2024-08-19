import { UserRole } from '@prisma/client';
import { z } from 'nestjs-zod/z';

export const UserMetaDataSchema = z.object({
  ip: z.string(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
  lastSeen: z.date(),
  device: z.string().optional(),
});

export const UserSchema = z.object({
  id: z.number(),
  role: z.nativeEnum(UserRole),
  email: z.string().email(),
  name: z.string(),
  surname: z.string(),
  photo: z.string().optional(),
  isActive: z.boolean(),
  isVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  metaData: UserMetaDataSchema,
});

export const SessionSchema = z.object({
  id: z.string(),
  sid: z.string(),
  data: z.string(),
  expiresAt: z.date(),
});

export const GuestBookMessageAuthorSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  photo: z.string(),
  isVerified: z.boolean(),
});

export const GuestBookMessageSchema = z.object({
  id: z.number(),
  message: z.string(),
  isEdited: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  author: GuestBookMessageAuthorSchema,
});

export const ViewSchema = z.object({
  slug: z.string(),
  count: z.number(),
  likesCount: z.number(),
});

export const LikeSchema = z.object({
  userId: z.number(),
  slug: z.string(),
});

export const EmailOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
  expiresAt: z.date(),
  createdAt: z.date(),
});
