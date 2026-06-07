// Admin routes expose full-system oversight to ADMIN accounts only.
import { Router } from 'express';
import { getAdminOverview, listLeads, listUsers } from '../controllers/adminController.js';
import { listAllBookings, updateBookingStatus } from '../controllers/bookingsController.js';
import { requireAdmin, requireAuth } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateRequest.js';
import { adminBookingStatusSchema } from '../validators/bookingValidator.js';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);
adminRouter.get('/overview', getAdminOverview);
adminRouter.get('/users', listUsers);
adminRouter.get('/leads', listLeads);
adminRouter.get('/bookings', listAllBookings);
adminRouter.patch('/bookings/:id/status', validateBody(adminBookingStatusSchema), updateBookingStatus);

