// Environment configuration normalizes process variables into typed application settings.
import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 8080),
  mongoUri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/agricore',
  postgres: {
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    database: process.env.POSTGRES_DB ?? 'agricore',
    user: process.env.POSTGRES_USER ?? 'agricore',
    password: process.env.POSTGRES_PASSWORD ?? 'agricore_password'
  },
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173'
};
