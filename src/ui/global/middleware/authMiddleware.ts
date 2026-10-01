import { Request, Response, NextFunction } from 'express';
import { SecurityService } from '@/infrastructure/global/SecurityService';
import { UnauthorizedError } from '@/domain/errors/UnauthorizedError';

export const authenticationMiddleware =
  (req: Request, res: Response, next: NextFunction) => {
    console.log("MIDLEWARE");
    const token = req.headers.authorization;
    console.log("token: ",token);
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }
    const securityService = new SecurityService();
    const isValid = securityService.verifyjwt(token.replace('Bearer ', ''));

    req.userId = isValid?.userId; //llenamos el id 
    console.log("ID: ",isValid?.userId);
    if (!isValid) {
      console.log("NO VALIDO")
      throw new UnauthorizedError('Invalid token');
    }
    console.log("NEXT")
    next();
  };
