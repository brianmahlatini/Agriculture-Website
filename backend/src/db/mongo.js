// MongoDB connection helpers support flexible content, impact stories, and lead capture.
import mongoose from 'mongoose';
import { env } from '../config/env.js';

export async function connectMongo() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 7000
  });
}

export function mongoStatus() {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] ?? 'unknown';
}
