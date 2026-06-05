// Request middleware groups security, CORS, parsing, and logging in one reusable app layer.
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from '../config/env.js';

export function registerRequestMiddleware(app) {
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}

