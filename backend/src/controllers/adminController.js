// Admin controllers aggregate platform-wide visibility for the Agricore command dashboard.
import { Booking } from '../models/Booking.js';
import { Lead } from '../models/Lead.js';
import { User } from '../models/User.js';
import { getOperationsOverview } from '../services/operationsService.js';

export async function getAdminOverview(_req, res, next) {
  try {
    const [userCount, leadCount, bookingCount, activeBookings, cancelledBookings, recentLeads, users, operations] =
      await Promise.all([
        User.countDocuments(),
        Lead.countDocuments(),
        Booking.countDocuments(),
        Booking.countDocuments({ status: { $in: ['REQUESTED', 'CONFIRMED', 'IN_PROGRESS'] } }),
        Booking.countDocuments({ status: 'CANCELLED' }),
        Lead.find().sort({ createdAt: -1 }).limit(8).lean(),
        User.find().select('-passwordHash').sort({ createdAt: -1 }).limit(10).lean(),
        getOperationsOverview()
      ]);

    const statusBreakdown = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      metrics: {
        users: userCount,
        leads: leadCount,
        bookings: bookingCount,
        activeBookings,
        cancelledBookings,
        managedHectares: operations.metrics.totalHectares,
        projectedYield: operations.metrics.projectedYield
      },
      statusBreakdown,
      recentLeads,
      users,
      operations
    });
  } catch (error) {
    next(error);
  }
}

export async function listUsers(_req, res, next) {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }).lean();
    res.json({ users });
  } catch (error) {
    next(error);
  }
}

export async function listLeads(_req, res, next) {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).lean();
    res.json({ leads });
  } catch (error) {
    next(error);
  }
}

