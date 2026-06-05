// Server startup verifies database connectivity before accepting API traffic.
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectMongo } from './db/mongo.js';
import { pool } from './db/postgres.js';

async function start() {
  await connectMongo();
  await pool.query('SELECT 1');

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`Agricore API listening on ${env.port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

start().catch((error) => {
  console.error('Failed to start Agricore API', error);
  process.exit(1);
});
