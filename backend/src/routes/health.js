// Health routes stay thin and delegate response logic to controllers.
import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';

export const healthRouter = Router();

healthRouter.get('/', getHealth);
