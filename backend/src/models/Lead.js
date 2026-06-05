// Leads capture enterprise partnership inquiries submitted from the website.
import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    company: { type: String, required: true, trim: true },
    acreage: { type: String, required: true, trim: true },
    interest: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    source: { type: String, default: 'website' }
  },
  { timestamps: true }
);

export const Lead = mongoose.model('Lead', leadSchema);
