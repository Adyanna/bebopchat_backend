import { Request, Response, NextFunction } from 'express';
import { SecurityService } from '@/infrastructure/global/SecurityService';
import { UnauthorizedError } from '@/domain/errors/UnauthorizedError';

export const authenticationMiddleware =
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }
    const securityService = new SecurityService();
    const isValid = securityService.verifyjwt(token.replace('Bearer ', ''));

    req.userId = isValid?.userId;
    if (!isValid) {
      throw new UnauthorizedError('Invalid token');
    }
    next();
  };
