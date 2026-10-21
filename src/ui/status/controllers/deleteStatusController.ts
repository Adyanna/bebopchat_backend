import { NextFunction, Request, Response } from 'express';

import { PrismaEstadoRepository } from '@/infrastructure/status/prismaEstadoRepository';
import { DeleteStatus } from '@/domain/status/use-cases/deleteStatusUseCase';

export const deleteStatusController = async (
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

    const estadoId = Number(req.params.estadoId);

    const estadoRepository = new PrismaEstadoRepository();
    const deleteEstado = new DeleteStatus(estadoRepository);

    const result = await deleteEstado.execute({
      estadoId,
      userId,
    });

    if (result.count === 0) {
      res.status(404).json({
        error: 'Status not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Status deleted successfully',
    });
  } catch (error: unknown) {
    next(error);
  }
};