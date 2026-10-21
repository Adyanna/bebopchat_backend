import { NextFunction, Request, Response } from 'express';

import { PrismaEstadoRepository } from '@/infrastructure/status/prismaEstadoRepository';
import { GetMyStatus } from '@/domain/status/use-cases/getMyStatusUseCase';

export const getMyStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        error: 'User not authenticated',
      });
      return;
    }

    const estadoRepository = new PrismaEstadoRepository();
    const getMyEstados = new GetMyStatus(estadoRepository);

    const estados = await getMyEstados.execute(userId);

    res.status(200).json({
      message: 'Estados retrieved successfully',
      data: estados,
    });
  } catch (error: unknown) {
    next(error);
  }
};