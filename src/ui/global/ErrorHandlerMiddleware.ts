import type { NextFunction, Request, Response } from 'express';
import { BusinessConflictError } from '@/domain/errors/BusinessConflictError';
import { EntityNotFoundError } from '@/domain/errors/EntityNotFoundError';
import { ForbiddenError } from '@/domain/errors/ForbiddenError';
import { UnauthorizedError, AuthenticationError } from '@/domain/errors/UnauthorizedError';
import { ValidationError, InvalidOperationError } from '@/domain/errors/ValidationError';
import { ZodError } from 'zod';

export const errorHandlerMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //====================================================
  //ERRORES CONTROLADOS

  if (err instanceof EntityNotFoundError) {
    res.status(404).json({ error: err.message });
  } else if (err instanceof BusinessConflictError) {
    res.status(409).json({ error: err.message });
  } else if (err instanceof ForbiddenError) {
    res.status(403).json({ error: err.message });
  } else if (err instanceof UnauthorizedError || err instanceof AuthenticationError) {
    res.status(401).json({ error: err.message });
  } else if (err instanceof ValidationError || err instanceof InvalidOperationError) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof ZodError) {
    const validationErrors = err.issues.map((issue) => issue.message);
    res.status(400).json({ errors: validationErrors });
  } else {
    res.status(500).json({
      error: JSON.stringify(err instanceof Error ? err.message : 'Error interno del servidor'),
    });
    //next();
  }
};
