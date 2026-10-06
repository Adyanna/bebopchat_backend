import { NextFunction, Request, Response } from 'express';

import { StorageLocalRepository } from '@/infrastructure/upload/storageLocalRepository';
import { UploadFileUseCase } from '@/domain/upload/use-case/uploadFileUseCase';
import { uploadSchema } from '../schemas/uploadSchema';

export const uploadFileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      res.status(400).json({
        error: 'No file provided',
      });
      return;
    }

    // Validamos el body con Zod
    const { tipo } = uploadSchema.parse(req.body);

    const storageRepository = new StorageLocalRepository();
    const uploadFileUseCase = new UploadFileUseCase(storageRepository);

    // Mapeamos los datos limpios al Caso de Uso
    const url = await uploadFileUseCase.executeUploadFile({
      buffer: req.file.buffer,
      originalname: req.file.originalname,
      tipo,
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      data: { url },
    });
  } catch (error: unknown) {
    next(error);
  }
};