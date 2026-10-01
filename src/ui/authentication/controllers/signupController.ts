import { NextFunction, Request, Response } from 'express';
import {signUpSchema} from '../schemas/signupSchema'
import { SecurityService } from '@/infrastructure/global/SecurityService';
import { SignUpUseCase } from '@/domain/authentication/use-cases/signupUseCase';
import { signupPrismaRepository } from '@/infrastructure/authentication/signupPrismaRepository';

export const signupAuthController = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const data = signUpSchema.parse(req.body);
    const segurityService = new SecurityService();
    const prismaUseRepository = new signupPrismaRepository();
    const signUpUseCase = new SignUpUseCase(prismaUseRepository, segurityService);
    await signUpUseCase.executeUser(data);
    res.status(201).json({ message: 'User create succesfully' });
  } catch (error: unknown) {
    next(error);
  }
};
