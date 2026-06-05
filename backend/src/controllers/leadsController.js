// Lead controllers handle enterprise inquiry creation after schema validation has succeeded.
import { Lead } from '../models/Lead.js';

export async function createLead(req, res, next) {
  try {
    const lead = await Lead.create(req.validatedBody);

    res.status(201).json({
      id: lead.id,
      status: 'received',
      message: 'Agricore partnership request received.'
    });
  } catch (error) {
    next(error);
  }
}

