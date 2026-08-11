import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';
import config from '../../config';

const register = catchAsync(async (req, res) => {
  const result = await AuthService.registerUser(req.body);

  res.cookie('accessToken', result.accessToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: config.node_env === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });

  res.cookie('refreshToken', result.refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: config.node_env === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully',
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: { id: result.user.id, name: result.user.name, role: result.user.role }
    },
  });
});

const login = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);

  res.cookie('accessToken', result.accessToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: config.node_env === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });

  res.cookie('refreshToken', result.refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: config.node_env === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged in successfully',
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: { id: result.user.id, name: result.user.name, role: result.user.role }
    },
  });
});

const googleCallback = catchAsync(async (req, res) => {
  const user = req.user as { id: string; email: string; role: string; name: string };

  const { accessToken, refreshToken } = AuthService.generateTokensForUser(user);

  res.cookie('accessToken', accessToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: config.node_env === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: config.node_env === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.redirect(`${config.client_url}/candidate-dashboard`);
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  res.cookie('accessToken', result.accessToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: config.node_env === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token generated successfully',
    data: result,
  });
});

const logout = catchAsync(async (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
});

export const AuthController = {
  register,
  login,
  refreshToken,
  logout,
  googleCallback
};