// Content controllers expose MongoDB-backed stories without leaking persistence details to routes.
import { getImpactStories } from '../services/contentService.js';

export async function listImpactStories(_req, res, next) {
  try {
    res.json({ stories: await getImpactStories() });
  } catch (error) {
    next(error);
  }
}

