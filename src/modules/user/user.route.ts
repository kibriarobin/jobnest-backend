import express from 'express';
import auth from '../../middlewares/auth';
import { UserController } from './user.controller';

const router = express.Router();

router.get('/me', auth(), UserController.getMyProfile);
router.patch('/me', auth(), UserController.updateBasicInfo);

// Candidate only
router.patch(
  '/me/candidate-profile',
  auth('CANDIDATE'),
  UserController.updateCandidateProfile
);

// Employer only
router.patch(
  '/me/company-profile',
  auth('EMPLOYER'),
  UserController.updateCompanyProfile
);

// Admin only
router.get('/', auth('ADMIN'), UserController.getAllUsers);
router.patch('/:id/toggle-ban', auth('ADMIN'), UserController.toggleBanUser);

export const UserRoutes = router;