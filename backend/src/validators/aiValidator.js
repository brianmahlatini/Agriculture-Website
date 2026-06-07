// AI validators keep the chatbot request small, safe, and predictable.
import { z } from 'zod';

export const aiChatSchema = z.object({
  message: z.string().min(2).max(1200),
  context: z
    .object({
      role: z.enum(['ADMIN', 'USER']).optional(),
      page: z.string().max(80).optional()
    })
    .optional()
});

