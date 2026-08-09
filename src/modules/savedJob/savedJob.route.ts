import express from 'express';
import auth from '../../middlewares/auth';
import { SavedJobController } from './savedJob.controller';

const router = express.Router();

router.post('/', auth('CANDIDATE'), SavedJobController.saveJob);
router.delete('/:jobId', auth('CANDIDATE'), SavedJobController.unsaveJob);
router.get('/', auth('CANDIDATE'), SavedJobController.getMySavedJobs);

export const SavedJobRoutes = router;