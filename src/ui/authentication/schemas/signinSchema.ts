import { z } from 'zod';

export const signinSchema = z.object({
  phone: z
    .string()
    .regex(/^\d{10,15}$/, 'The phone provided is incorrect'),

  password: z
    .string()
    .min(1, 'Password is required'),
});