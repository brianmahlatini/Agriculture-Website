// AI routes provide a public chatbot endpoint backed by the server-side OpenAI API key.
import { Router } from 'express';
import { chat } from '../controllers/aiController.js';
import { validateBody } from '../middleware/validateRequest.js';
import { aiChatSchema } from '../validators/aiValidator.js';

export const aiRouter = Router();

aiRouter.post('/chat', validateBody(aiChatSchema), chat);

