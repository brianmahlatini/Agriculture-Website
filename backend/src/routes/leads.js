// Lead routes validate incoming inquiries before handing them to the controller.
import { Router } from 'express';
import { createLead } from '../controllers/leadsController.js';
import { validateBody } from '../middleware/validateRequest.js';
import { leadSchema } from '../validators/leadValidator.js';

export const leadsRouter = Router();

leadsRouter.post('/', validateBody(leadSchema), createLead);
