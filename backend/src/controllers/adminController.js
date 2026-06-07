// Admin controllers aggregate platform-wide visibility for the Agricore command dashboard.
import { Booking } from '../models/Booking.js';
import { Lead } from '../models/Lead.js';
import { User } from '../models/User.js';
import { getOperationsOverview } from '../services/operationsService.js';

function serializeUser(user) {
  return {
    id: user._id?.toString() ?? user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    company: user.company,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export async function getAdminOverview(_req, res, next) {
  try {
    const [userCount, leadCount, bookingCount, activeBookings, cancelledBookings, recentLeads, usersResult, operations] =
      await Promise.all([
        User.countDocuments(),
        Lead.countDocuments(),
        Booking.countDocuments(),
        Booking.countDocuments({ status: { $in: ['REQUESTED', 'CONFIRMED', 'IN_PROGRESS'] } }),
        Booking.countDocuments({ status: 'CANCELLED' }),
        Lead.find().sort({ createdAt: -1 }).limit(8).lean(),
        User.find().select('-passwordHash').sort({ createdAt: -1 }).limit(12).lean(),
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
      users: usersResult.map(serializeUser),
      operations
    });
  } catch (error) {
    next(error);
  }
}

export async function listUsers(_req, res, next) {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }).lean();
    res.json({ users: users.map(serializeUser) });
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

export async function updateUser(req, res, next) {
  try {
    const target = await User.findById(req.params.id);

    if (!target) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (target.id === req.user.id && req.validatedBody.status === 'SUSPENDED') {
      res.status(409).json({ error: 'Admins cannot suspend their own active session' });
      return;
    }

    if (target.role === 'ADMIN' && req.validatedBody.role === 'USER') {
      const adminCount = await User.countDocuments({ role: 'ADMIN', status: 'ACTIVE' });

      if (adminCount <= 1) {
        res.status(409).json({ error: 'At least one active admin is required' });
        return;
      }
    }

    if (req.validatedBody.role) {
      target.role = req.validatedBody.role;
    }

    if (req.validatedBody.status) {
      target.status = req.validatedBody.status;
    }

    await target.save();
    res.json({ user: serializeUser(target) });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const target = await User.findById(req.params.id);

    if (!target) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (target.id === req.user.id) {
      res.status(409).json({ error: 'Admins cannot delete their own account' });
      return;
    }

    if (target.role === 'ADMIN') {
      const adminCount = await User.countDocuments({ role: 'ADMIN', status: 'ACTIVE' });

      if (adminCount <= 1) {
        res.status(409).json({ error: 'At least one active admin is required' });
        return;
      }
    }

    await Promise.all([
      Booking.deleteMany({ user: target.id }),
      User.deleteOne({ _id: target.id })
    ]);

    res.json({ status: 'deleted' });
  } catch (error) {
    next(error);
  }
}
