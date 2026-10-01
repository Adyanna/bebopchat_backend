import { NextFunction, Request, Response } from 'express';

import { ProfilePrismaRepository } from '@/infrastructure/profile/profilePrismaRepository';
import { UpdateProfileUseCase } from '@/domain/profile/use-cases/updateProfileUseCase';

import { ProfileSchema } from '../schemas/profileSchema';

export const updateProfileController = async (
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

    const updateProfileUseCase = new UpdateProfileUseCase(
      profileRepository,
    );

    const profile = await updateProfileUseCase.executeUpdateProfile({
      id,
      ...data,
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      data: profile,
    });
  } catch (error: unknown) {
    next(error);
  }
};