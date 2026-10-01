import { NextFunction, Request, Response } from 'express';

import { ProfilePrismaRepository } from '@/infrastructure/profile/profilePrismaRepository';
import { DeleteProfileUseCase } from '@/domain/profile/use-cases/deleteProfileUseCase';

export const deleteProfileController = async (
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

    const profileRepository = new ProfilePrismaRepository();

    const deleteProfileUseCase = new DeleteProfileUseCase(
      profileRepository,
    );

    const profile = await deleteProfileUseCase.executeDeleteProfile({userId:id});

    res.status(200).json({
      message: 'Profile deleted successfully',
      data: profile,
    });
  } catch (error: unknown) {
    next(error);
  }
};