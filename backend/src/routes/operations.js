// Operations routes expose PostgreSQL-backed farm and forecast data.
import { Router } from 'express';
import { getOverview } from '../controllers/operationsController.js';

export const operationsRouter = Router();

operationsRouter.get('/overview', getOverview);
