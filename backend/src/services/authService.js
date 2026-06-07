// Auth service owns password hashing, first-admin role assignment, and JWT creation.
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    company: user.company,
    role: user.role,
    status: user.status
  };
}

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
}

export async function registerUser(payload) {
  const existingUser = await User.findOne({
    $or: [{ email: payload.email.toLowerCase() }, { username: payload.username }]
  });

  if (existingUser) {
    const error = new Error('Username or email is already registered');
    error.status = 409;
    throw error;
  }

  const userCount = await User.estimatedDocumentCount();
  const role = userCount === 0 ? 'ADMIN' : 'USER';
  const passwordHash = await bcrypt.hash(payload.password, 12);

  const user = await User.create({
    username: payload.username,
    email: payload.email,
    passwordHash,
    fullName: payload.fullName,
    company: payload.company,
    role
  });

  return {
    token: signToken(user),
    user: publicUser(user)
  };
}

export async function loginUser(payload) {
  const user = await User.findOne({
    $or: [{ email: payload.identifier.toLowerCase() }, { username: payload.identifier }]
  });

  if (!user || user.status !== 'ACTIVE') {
    const error = new Error('Invalid login credentials');
    error.status = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash);

  if (!passwordMatches) {
    const error = new Error('Invalid login credentials');
    error.status = 401;
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save();

  return {
    token: signToken(user),
    user: publicUser(user)
  };
}

export async function getUserProfile(userId) {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User account not found');
    error.status = 404;
    throw error;
  }

  return publicUser(user);
}

export { publicUser };

