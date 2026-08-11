import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import config from '../../config';
import { generateToken, verifyToken } from '../../utils/generateToken';
import { TLoginUser, TRegisterUser } from './auth.interface';
import { Prisma } from '../../../generated/prisma/client';

const registerUser = async (payload: TRegisterUser) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, 'User already exists with this email');
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const user = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: payload.role,
      },
    });

    if (payload.role === 'CANDIDATE') {
      await tx.candidateProfile.create({
        data: { userId: user.id },
      });
    }

    if (payload.role === 'EMPLOYER') {
      await tx.company.create({
        data: {
          userId: user.id,
          name: payload.companyName as string,
        },
      });
    }

    return user;
  });

  const jwtPayload = { userId: result.id, email: result.email, role: result.role };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  const refreshToken = generateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
    },
  };
};

const loginUser = async (payload: TLoginUser) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'No user found with this email');
  }

  if (user.isBanned) {
    throw new AppError(httpStatus.FORBIDDEN, 'This account has been banned');
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }

  const jwtPayload = { userId: user.id, email: user.email, role: user.role };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  const refreshToken = generateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const generateTokensForUser = (user: { id: string; email: string; role: string }) => {
  const jwtPayload = { userId: user.id, email: user.email, role: user.role };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  const refreshToken = generateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return { accessToken, refreshToken };
};

const refreshToken = async (token: string) => {
  let decoded;
  try {
    decoded = verifyToken(token, config.jwt_refresh_secret as string);
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired refresh token');
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User no longer exists');
  }

  const jwtPayload = { userId: user.id, email: user.email, role: user.role };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return { accessToken };
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshToken,
  generateTokensForUser,
};