// Auth middleware verifies JWTs and provides role guards for admin-only APIs.
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization ?? '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.sub).select('-passwordHash');

    if (!user || user.status !== 'ACTIVE') {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Authentication required' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  next();
}

