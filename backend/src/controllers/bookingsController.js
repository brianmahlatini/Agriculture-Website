// Booking controllers support user self-service and admin operations visibility.
import { Booking } from '../models/Booking.js';

function bookingQueryForUser(user) {
  return Booking.find({ user: user.id }).sort({ createdAt: -1 }).lean();
}

export async function listMyBookings(req, res, next) {
  try {
    res.json({ bookings: await bookingQueryForUser(req.user) });
  } catch (error) {
    next(error);
  }
}

export async function createBooking(req, res, next) {
  try {
    const booking = await Booking.create({
      ...req.validatedBody,
      user: req.user.id
    });

    res.status(201).json({ booking });
  } catch (error) {
    next(error);
  }
}

export async function cancelMyBooking(req, res, next) {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    if (['COMPLETED', 'CANCELLED'].includes(booking.status)) {
      res.status(409).json({ error: 'Booking can no longer be cancelled' });
      return;
    }

    booking.status = 'CANCELLED';
    booking.cancellationReason = req.validatedBody.reason;
    await booking.save();

    res.json({ booking });
  } catch (error) {
    next(error);
  }
}

export async function listAllBookings(_req, res, next) {
  try {
    const bookings = await Booking.find()
      .populate('user', 'username email fullName company role')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
}

export async function updateBookingStatus(req, res, next) {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: req.validatedBody.status,
        adminNotes: req.validatedBody.adminNotes
      },
      { new: true }
    ).populate('user', 'username email fullName company role');

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.json({ booking });
  } catch (error) {
    next(error);
  }
}

