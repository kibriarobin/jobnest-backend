import { z } from 'zod';

const createJobValidation = z.object({
  body: z
    .object({
      categoryId: z.string({ error: 'Category is required' }),
      title: z.string({ error: 'Title is required' }).min(3),
      description: z.string({ error: 'Description is required' }).min(20),
      requirements: z.array(z.string()).min(1, 'At least one requirement is needed'),
      location: z.string({ error: 'Location is required' }),
      type: z.enum(['REMOTE', 'ONSITE', 'HYBRID']),
      salaryMin: z
        .number({ error: 'Minimum salary is required' })
        .positive('Minimum salary must be greater than 0'),
      salaryMax: z
        .number({ error: 'Maximum salary is required' })
        .positive('Maximum salary must be greater than 0'),
      experienceLevel: z.string({ error: 'Experience level is required' }),
      vacancy: z.number().optional(),
      deadline: z.string({ error: 'Deadline is required' }),
    })
    .refine((data) => data.salaryMax >= data.salaryMin, {
      message: 'Maximum salary must be greater than or equal to minimum salary',
      path: ['salaryMax'],
    }),
});

const updateJobValidation = z.object({
  body: z.object({
    categoryId: z.string().optional(),
    title: z.string().min(3).optional(),
    description: z.string().min(20).optional(),
    requirements: z.array(z.string()).optional(),
    location: z.string().optional(),
    type: z.enum(['REMOTE', 'ONSITE', 'HYBRID']).optional(),
    salaryMin: z.number().positive().optional(),
    salaryMax: z.number().positive().optional(),
    experienceLevel: z.string().optional(),
    vacancy: z.number().optional(),
    deadline: z.string().optional(),
  }),
});

const changeStatusValidation = z.object({
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED', 'CLOSED']),
  }),
});

export const JobValidation = {
  createJobValidation,
  updateJobValidation,
  changeStatusValidation,
};