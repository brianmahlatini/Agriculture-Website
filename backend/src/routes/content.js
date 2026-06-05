// Content routes expose MongoDB-backed marketing and impact resources.
import { Router } from 'express';
import { listImpactStories } from '../controllers/contentController.js';

export const contentRouter = Router();

contentRouter.get('/impact', listImpactStories);
