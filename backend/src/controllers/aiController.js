// AI controller exposes Agricore's enterprise support assistant.
import { answerAgricoreQuestion } from '../services/aiService.js';

export async function chat(req, res, next) {
  try {
    res.json(await answerAgricoreQuestion(req.validatedBody));
  } catch (error) {
    next(error);
  }
}

