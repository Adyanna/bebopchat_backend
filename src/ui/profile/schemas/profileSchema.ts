import { z } from 'zod';

export const ProfileSchema = z.object({
  photoUrl: z
    .string()
    .optional(),

  estadoCivil: z
    .number()
    .int('Civil status must be an integer')
    .optional(),

  genero: z
    .number()
    .int('Gender must be an integer')
    .optional(),

  estadoAnimo: z
    .number()
    .int('Mood must be an integer')
    .optional(),

  descripcion: z
    .string()
    .optional(),
});