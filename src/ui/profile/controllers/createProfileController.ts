import { NextFunction, Request, Response } from 'express';

import { SignupPrismaRepository } from '@/infrastructure/authentication/signupPrismaRepository';
import { ProfilePrismaRepository } from '@/infrastructure/profile/profilePrismaRepository';
import { CreateProfileUseCase } from '@/domain/profile/use-cases/createProfileUseCase';


import { ProfileSchema } from '../schemas/profileSchema';

export const createProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.userId;

    if (!id) {
      res.status(401).json({
        error: 'User not authenticated',
      });
      return;
    }
    const data = ProfileSchema.parse(req.body);

    const profileRepository = new ProfilePrismaRepository();
    const authRepository = new SignupPrismaRepository();

    const createProfileUseCase = new CreateProfileUseCase(
      profileRepository,
      authRepository,
    );

    console.log("ID CONTROLLER: ",id)

    const profile = await createProfileUseCase.executeCreateProfile({id,...data});

    res.status(201).json({
      message: 'Profile created successfully',
      data: profile,
    });
  } catch (error: unknown) {
    next(error);
  }
};