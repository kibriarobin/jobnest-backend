import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import { verifyToken } from '../utils/generateToken';
import config from '../config';
import { Role } from '../../generated/prisma/client';
import { prisma } from '../lib/prisma';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

const auth = (...allowedRoles: Role[]) => {
  return catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const token =
        req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken; 

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }

      const decoded = verifyToken(token, config.jwt_access_secret as string);

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User no longer exists');
      }

      if (user.isBanned) {
        throw new AppError(httpStatus.FORBIDDEN, 'This account has been banned');
      }

      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          'You are not permitted to access this route'
        );
      }

      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      next();
    }
  );
};

export default auth;