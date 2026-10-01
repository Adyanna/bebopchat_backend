import { NextFunction, Request, Response } from 'express';

import { ProfilePrismaRepository } from '@/infrastructure/profile/profilePrismaRepository';
import { ViewProfileUseCase } from '@/domain/profile/use-cases/viewProfileUseCase';

export const viewProfileController = async (
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
    console.log("CONTROLADOR: ",id)
    const profileRepository = new ProfilePrismaRepository();

    const viewProfileUseCase = new ViewProfileUseCase(
      profileRepository,
    );

    const profile = await viewProfileUseCase.executeViewProfile(id);

    res.status(200).json({
      message: 'Profile retrieved successfully',
      data: profile,
    });
  } catch (error: unknown) {
    next(error);
  }
};