// Booking validators protect user and admin booking workflows from malformed data.
import { z } from 'zod';

export const bookingSchema = z.object({
  service: z.string().min(3).max(140),
  farmName: z.string().min(2).max(140),
  region: z.string().min(2).max(140),
  hectares: z.coerce.number().int().min(1).max(1000000),
  preferredDate: z.coerce.date(),
  notes: z.string().max(1000).optional().default('')
});

export const cancelBookingSchema = z.object({
  reason: z.string().min(5).max(500)
});

export const adminBookingStatusSchema = z.object({
  status: z.enum(['REQUESTED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  adminNotes: z.string().max(1000).optional().default('')
});

