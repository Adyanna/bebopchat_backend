import { Socket } from 'socket.io';
import { SecurityService } from '@/infrastructure/global/SecurityService';

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('No token provided'));
  }

  const securityService = new SecurityService();
  const isValid = securityService.verifyjwt(token);

  if (!isValid) {
    return next(new Error('Invalid token'));
  }

  socket.data.userId = isValid.userId;

  next();
};