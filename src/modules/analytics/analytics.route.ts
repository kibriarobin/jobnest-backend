import express from 'express';
import auth from '../../middlewares/auth';
import { AnalyticsController } from './analytics.controller';

const router = express.Router();

router.get('/candidate-overview', auth('CANDIDATE'), AnalyticsController.getCandidateOverview);
router.get('/employer-overview', auth('EMPLOYER'), AnalyticsController.getEmployerOverview);
router.get('/admin-overview', auth('ADMIN'), AnalyticsController.getAdminOverview);

export const AnalyticsRoutes = router;