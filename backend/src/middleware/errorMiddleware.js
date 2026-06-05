// Error middleware keeps 404 and exception responses consistent across every route.
import { env } from '../config/env.js';

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Route not found' });
}

export function errorHandler(error, _req, res, _next) {
  const status = error.status ?? 500;

  res.status(status).json({
    error: status === 500 ? 'Internal server error' : error.message,
    trace: env.nodeEnv === 'production' ? undefined : error.stack
  });
}

