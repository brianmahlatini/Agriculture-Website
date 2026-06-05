// Schema validation middleware keeps route handlers clean and returns actionable client errors.
import { z } from 'zod';

export function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          issues: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message
          }))
        });
        return;
      }

      next(error);
    }
  };
}

