// Express application composition: request middleware, API routes, and final error handlers.
import express from 'express';
import { getApiIndex } from './controllers/apiController.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import { registerRequestMiddleware } from './middleware/requestMiddleware.js';
import { adminRouter } from './routes/admin.js';
import { aiRouter } from './routes/ai.js';
import { authRouter } from './routes/auth.js';
import { bookingsRouter } from './routes/bookings.js';
import { contentRouter } from './routes/content.js';
import { healthRouter } from './routes/health.js';
import { leadsRouter } from './routes/leads.js';
import { operationsRouter } from './routes/operations.js';

export function createApp() {
  const app = express();

  registerRequestMiddleware(app);

  app.get('/api', getApiIndex);

  app.use('/api/health', healthRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/bookings', bookingsRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/operations', operationsRouter);
  app.use('/api/content', contentRouter);
  app.use('/api/leads', leadsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
