// Auth controllers expose registration, login, and current-user profile endpoints.
import { getUserProfile, loginUser, registerUser } from '../services/authService.js';

export async function register(req, res, next) {
  try {
    const result = await registerUser(req.validatedBody);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    res.json(await loginUser(req.validatedBody));
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    res.json({ user: await getUserProfile(req.user.id) });
  } catch (error) {
    next(error);
  }
}

