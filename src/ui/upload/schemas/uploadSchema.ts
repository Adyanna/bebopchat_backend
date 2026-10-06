import { z } from 'zod';

export const uploadSchema = z.object({
  tipo: z.enum(['photos', 'multimedia', 'audio'], {
    message: "El tipo debe ser 'photos', 'multimedia' o 'audio'",
  }),
});

export const DeleteFileSchema = z.object({
  filePath: z.string().min(1, 'La ruta del archivo es requerida'),
});

export type DeleteFileDTO = z.infer<typeof DeleteFileSchema>;

export type UploadInput = z.infer<typeof uploadSchema>;