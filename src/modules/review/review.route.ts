import express from 'express';
import auth from '../../middlewares/auth';
import { ReviewController } from './review.controller';

const router = express.Router();

// Public
router.get('/company/:companyId', ReviewController.getCompanyReviews);

// Candidate only
router.post('/', auth('CANDIDATE'), ReviewController.createReview);

// Admin only (moderation)
router.delete('/:id', auth('ADMIN'), ReviewController.deleteReview);

export const ReviewRoutes = router;