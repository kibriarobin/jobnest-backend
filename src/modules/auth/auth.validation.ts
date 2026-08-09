import { z } from 'zod';

const registerValidation = z.object({
  body: z
    .object({
      name: z.string({ error: 'Name is required' }).min(2),
      email: z.email({ error: 'Email is required' }),
      password: z
        .string({ error: 'Password is required' })
        .min(6, 'Password must be at least 6 characters'),
      role: z.enum(['CANDIDATE', 'EMPLOYER']),
      companyName: z.string().optional(),
    })
    .refine((data) => data.role !== 'EMPLOYER' || !!data.companyName, {
      message: 'Company name is required for employer registration',
      path: ['companyName'],
    }),
});

const loginValidation = z.object({
  body: z.object({
    email: z.email({ error: 'Email is required' }),
    password: z.string({ error: 'Password is required' }),
  }),
});

export const AuthValidation = {
  registerValidation,
  loginValidation,
};