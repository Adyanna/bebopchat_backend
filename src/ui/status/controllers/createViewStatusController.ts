import { NextFunction, Request, Response } from 'express';

import { PrismaEstadoRepository } from '@/infrastructure/status/prismaEstadoRepository';
import { CreateView } from '@/domain/status/use-cases/createViewUseCase';

export const createViewStatusController = async (
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
    const createView = new CreateView(estadoRepository);

    const view = await createView.execute({
      userId,
      estadoId,
    });

    if (!view) {
      res.status(404).json({
        error: 'Status not found',
      });
      return;
    }

    res.status(201).json({
      message: 'Estado viewed successfully',
      data: view,
    });
  } catch (error: unknown) {
    next(error);
  }
};