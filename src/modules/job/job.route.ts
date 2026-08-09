import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { JobValidation } from './job.validation';
import { JobController } from './job.controller';


const router = express.Router();

router.post(
  '/',
  auth('EMPLOYER'),
  validateRequest(JobValidation.createJobValidation),
  JobController.createJob
);



export const JobRoutes = router;