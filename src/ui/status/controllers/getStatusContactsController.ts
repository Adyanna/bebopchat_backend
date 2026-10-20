import { NextFunction, Request, Response } from 'express';

import { PrismaEstadoRepository } from '@/infrastructure/status/prismaEstadoRepository';
import { GetStatusContacts } from '@/domain/status/use-cases/getStatusContactsUseCase';

export const getStatusContactosController = async (
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
    const getEstadosContactos = new GetStatusContacts(estadoRepository);

    const estados = await getEstadosContactos.execute(userId);

    res.status(200).json({
      message: 'Contact statuses retrieved successfully',
      data: estados,
    });
  } catch (error: unknown) {
    next(error);
  }
};