import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidation.registerValidation),
  AuthController.register
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidation),
  AuthController.login
);

router.post('/refresh-token', AuthController.refreshToken);

router.post('/logout', AuthController.logout);

export const AuthRoutes = router;