// Lead validation defines the public contract for partnership inquiry submissions.
import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  company: z.string().min(2).max(180),
  acreage: z.string().min(1).max(80),
  interest: z.string().min(2).max(120),
  message: z.string().min(10).max(1200)
});

