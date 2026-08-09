import express from 'express';
import auth from '../../middlewares/auth';
import { ApplicationController } from './application.controller';

const router = express.Router();

// Candidate routes
router.post('/', auth('CANDIDATE'), ApplicationController.applyToJob);
router.get('/my-applications', auth('CANDIDATE'), ApplicationController.getMyApplications);
router.delete('/:id', auth('CANDIDATE'), ApplicationController.withdrawApplication);

// Employer routes
router.get('/employer', auth('EMPLOYER'), ApplicationController.getApplicationsForEmployer);
router.patch('/:id/status', auth('EMPLOYER'), ApplicationController.changeApplicationStatus);

export const ApplicationRoutes = router;