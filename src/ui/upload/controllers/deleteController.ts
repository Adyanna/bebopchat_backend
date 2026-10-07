import { NextFunction, Request, Response } from 'express';
import { StorageLocalRepository } from '@/infrastructure/upload/storageLocalRepository';
import { DeleteFileUseCase } from '@/domain/upload/use-case/deleteFileUseCase';
import { DeleteFileSchema } from '../schemas/uploadSchema';

export const deleteFileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log(req.body)
    const { filePath } = DeleteFileSchema.parse(req.body);

    if (!filePath || typeof filePath !== 'string') {
      res.status(400).json({
        error: 'Se requiere la propiedad filePath en el cuerpo de la petición',
      });
      return;
    }

    const storageRepository = new StorageLocalRepository();
    const deleteFileUseCase = new DeleteFileUseCase(storageRepository);

    const isDeleted = await deleteFileUseCase.execute(filePath);

    if (!isDeleted) {
      res.status(404).json({
        error: 'El archivo no existe o ya fue eliminado',
      });
      return;
    }

    res.status(200).json({
      message: 'Archivo eliminado correctamente',
    });
  } catch (error: unknown) {
    next(error);
  }
};