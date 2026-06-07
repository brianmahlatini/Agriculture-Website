// Booking routes give users self-service booking creation, listing, and cancellation.
import { Router } from 'express';
import {
  cancelMyBooking,
  createBooking,
  listMyBookings
} from '../controllers/bookingsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateRequest.js';
import { bookingSchema, cancelBookingSchema } from '../validators/bookingValidator.js';

export const bookingsRouter = Router();

bookingsRouter.use(requireAuth);
bookingsRouter.get('/', listMyBookings);
bookingsRouter.post('/', validateBody(bookingSchema), createBooking);
bookingsRouter.patch('/:id/cancel', validateBody(cancelBookingSchema), cancelMyBooking);

