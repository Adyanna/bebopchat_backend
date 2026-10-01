import { z } from 'zod';

export const signUpSchema = z.object({
  phone: z
    .string()
    .regex(/^\d{10,15}$/, 'The phone provided is incorrect'),

  fullname: z
    .string()
    .min(1, 'Fullname is required'),

  password: z
    .string()
    .min(8, 'Password must have at least 8 characters')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/\d/, 'Password must contain a number')
    .regex(
      /[@$!%*?&.#_-]/,
      'Password must contain a special character',
    ),
});