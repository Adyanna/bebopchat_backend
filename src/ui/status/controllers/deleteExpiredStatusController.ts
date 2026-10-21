import { NextFunction, Request, Response } from 'express';

import { PrismaEstadoRepository } from '@/infrastructure/status/prismaEstadoRepository';
import { DeleteExpiredStatus } from '@/domain/status/use-cases/deleteExpiredStatusUseCase';

export const deleteExpiredStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const estadoRepository = new PrismaEstadoRepository();
    const deleteExpiredEstados = new DeleteExpiredStatus(estadoRepository);

    const result = await deleteExpiredEstados.execute();

    res.status(200).json({
      message: 'Expired estados deactivated successfully',
      data: {
        count: result.count,
      },
    });
  } catch (error: unknown) {
    next(error);
  }
};