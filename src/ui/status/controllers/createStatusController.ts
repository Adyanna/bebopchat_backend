import { NextFunction, Request, Response } from 'express';

import { PrismaEstadoRepository } from '@/infrastructure/status/prismaEstadoRepository';
import { CreateStatus } from '@/domain/status/use-cases/createStatusUseCase';

export const createStatusController = async (
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
    const createEstado = new CreateStatus(estadoRepository);

    const estado = await createEstado.execute({
      userId,
      content: req.body.content,
      type: req.body.type,
    });

    res.status(201).json({
      message: 'Estado created successfully',
      data: estado,
    });
  } catch (error: unknown) {
    next(error);
  }
};