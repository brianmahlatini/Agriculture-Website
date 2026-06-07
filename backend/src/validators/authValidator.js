// Auth validators define registration and login contracts for the public API.
import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3).max(40).regex(/^[a-zA-Z0-9_.-]+$/, {
    message: 'Username can use letters, numbers, dots, dashes, and underscores only'
  }),
  email: z.string().email().max(180),
  password: z.string().min(8).max(120),
  fullName: z.string().min(2).max(140),
  company: z.string().min(2).max(180)
});

export const loginSchema = z.object({
  identifier: z.string().min(3).max(180),
  password: z.string().min(8).max(120)
});

