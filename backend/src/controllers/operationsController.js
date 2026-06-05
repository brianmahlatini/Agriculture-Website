// Operations controllers expose PostgreSQL-backed farm and forecast views to the frontend.
import { getOperationsOverview } from '../services/operationsService.js';

export async function getOverview(_req, res, next) {
  try {
    res.json(await getOperationsOverview());
  } catch (error) {
    next(error);
  }
}

