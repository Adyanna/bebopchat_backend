import { NextFunction, Request, Response } from 'express';
import { HealthUseCase } from '@/domain/health/useCase/healthUseCase';
import { HealthPrismaRepository } from '@/infrastructure/health/HealthPrismaRepository';

export const HealthController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const healthRepository = new HealthPrismaRepository();
    const healthUseCase = new HealthUseCase(healthRepository);

    const response = await healthUseCase.execute();

    res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};