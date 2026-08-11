import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import passport from 'passport';

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

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_auth_failed' }),
  AuthController.googleCallback
);

router.post('/refresh-token', AuthController.refreshToken);

router.post('/logout', AuthController.logout);

export const AuthRoutes = router;