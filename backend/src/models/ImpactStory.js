// Impact stories are flexible MongoDB documents used for regional sustainability content.
import mongoose from 'mongoose';

const impactStorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    metric: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export const ImpactStory = mongoose.model('ImpactStory', impactStorySchema);
