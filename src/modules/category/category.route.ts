import express from 'express';
import auth from '../../middlewares/auth';
import { CategoryController } from './category.controller';

const router = express.Router();

router.get('/', CategoryController.getAllCategories);


router.post('/', auth('ADMIN'), CategoryController.createCategory);
router.patch('/:id', auth('ADMIN'), CategoryController.updateCategory);
router.delete('/:id', auth('ADMIN'), CategoryController.deleteCategory);

export const CategoryRoutes = router;