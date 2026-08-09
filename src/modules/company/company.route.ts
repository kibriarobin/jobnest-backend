import express from 'express';
import auth from '../../middlewares/auth';
import { CompanyController } from './company.controller';

const router = express.Router();

router.get('/admin/all', auth('ADMIN'), CompanyController.getAllCompaniesForAdmin);
router.patch('/admin/:id/verify', auth('ADMIN'), CompanyController.toggleVerifyCompany);

router.get('/:id', CompanyController.getSingleCompany);

export const CompanyRoutes = router;