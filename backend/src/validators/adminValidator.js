// Admin validators protect user-management actions from unsafe role or status changes.
import { z } from 'zod';

export const adminUserUpdateSchema = z
  .object({
    role: z.enum(['ADMIN', 'USER']).optional(),
    status: z.enum(['ACTIVE', 'SUSPENDED']).optional()
  })
  .refine((payload) => payload.role || payload.status, {
    message: 'Role or status is required'
  });

