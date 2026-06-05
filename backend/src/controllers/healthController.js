// Health checks report service status plus database connectivity for container orchestration.
import { mongoStatus } from '../db/mongo.js';
import { postgresStatus } from '../db/postgres.js';

export async function getHealth(_req, res) {
  res.json({
    service: 'agricore-api',
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    dependencies: {
      mongo: mongoStatus(),
      postgres: await postgresStatus()
    }
  });
}

