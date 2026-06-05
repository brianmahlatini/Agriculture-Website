// PostgreSQL pool helpers support structured farm-site and crop forecast operations.
import pg from 'pg';
import { env } from '../config/env.js';

export const pool = new pg.Pool({
  ...env.postgres,
  max: 12,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 7000
});

export async function query(text, params) {
  return pool.query(text, params);
}

export async function postgresStatus() {
  try {
    await query('SELECT 1');
    return 'connected';
  } catch (error) {
    return 'unavailable';
  }
}
