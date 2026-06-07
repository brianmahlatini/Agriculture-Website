// Bookings represent user requests for Agricore consultations, site visits, and farm services.
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    service: { type: String, required: true, trim: true },
    farmName: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    hectares: { type: Number, required: true, min: 1 },
    preferredDate: { type: Date, required: true },
    notes: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['REQUESTED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'REQUESTED',
      index: true
    },
    cancellationReason: { type: String, trim: true },
    adminNotes: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

export const Booking = mongoose.model('Booking', bookingSchema);

