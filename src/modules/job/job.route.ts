import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { JobValidation } from './job.validation';
import { JobController } from './job.controller';

const router = express.Router();

// Public routes
router.get('/', JobController.getAllJobs);
router.get('/:id', JobController.getSingleJob);

// Employer routes
router.post(
  '/',
  auth('EMPLOYER'),
  validateRequest(JobValidation.createJobValidation),
  JobController.createJob
);
router.get('/employer/my-jobs', auth('EMPLOYER'), JobController.getMyJobs);
router.patch(
  '/:id',
  auth('EMPLOYER'),
  validateRequest(JobValidation.updateJobValidation),
  JobController.updateJob
);
router.delete('/:id', auth('EMPLOYER'), JobController.deleteJob);

// Admin routes
router.get('/admin/all', auth('ADMIN'), JobController.getAllJobsForAdmin);
router.patch(
  '/admin/status/:id',
  auth('ADMIN'),
  validateRequest(JobValidation.changeStatusValidation),
  JobController.changeJobStatus
);

export const JobRoutes = router;