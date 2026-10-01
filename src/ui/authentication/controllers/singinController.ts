import { NextFunction, Request, Response } from 'express';
import { SecurityService } from '@/infrastructure/global/SecurityService';
import { signupPrismaRepository } from '@/infrastructure/authentication/signupPrismaRepository';
import { SigninUseCase } from '@/domain/authentication/use-cases/signinUseCase';
import { signinSchema } from '../schemas/signinSchema';

export const signinController = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const data = signinSchema.parse(req.body);
    const segurityService = new SecurityService();
    const userRepository = new signupPrismaRepository();
    const LoginUser = new SigninUseCase(userRepository, segurityService);
    const resp = await LoginUser.executeToken(data);

    res.status(200).json({ token: resp });
  } catch (error: unknown) {
    next(error);
  }
};
