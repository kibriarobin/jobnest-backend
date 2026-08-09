import httpStatus from 'http-status';
import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import {
  TUpdateBasicInfo,
  TUpdateCandidateProfile,
  TUpdateCompanyProfile,
} from './user.interface';

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePhoto: true,
      isVerified: true,
      createdAt: true,
      candidateProfile: true,
      company: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

const updateBasicInfo = async (userId: string, payload: TUpdateBasicInfo) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: payload,
  });

  return result;
};

const updateCandidateProfile = async (userId: string, payload: TUpdateCandidateProfile) => {
  const existingProfile = await prisma.candidateProfile.findUnique({
    where: { userId },
  });

  if (!existingProfile) {
    throw new AppError(httpStatus.NOT_FOUND, 'Candidate profile not found');
  }

  const result = await prisma.candidateProfile.update({
    where: { userId },
    data: payload,
  });

  return result;
};

const updateCompanyProfile = async (userId: string, payload: TUpdateCompanyProfile) => {
  const existingCompany = await prisma.company.findUnique({
    where: { userId },
  });

  if (!existingCompany) {
    throw new AppError(httpStatus.NOT_FOUND, 'Company profile not found');
  }

  const result = await prisma.company.update({
    where: { userId },
    data: payload,
  });

  return result;
};

// ---------- Admin only ----------

const getAllUsers = async (pagination: { page: number; limit: number }) => {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  const users = await prisma.user.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      isVerified: true,
      createdAt: true,
    },
  });

  const total = await prisma.user.count();

  return { meta: { page, limit, total }, data: users };
};

const toggleBanUser = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.role === 'ADMIN') {
    throw new AppError(httpStatus.FORBIDDEN, 'Cannot ban an admin account');
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: { isBanned: !user.isBanned },
  });

  return result;
};

export const UserService = {
  getMyProfile,
  updateBasicInfo,
  updateCandidateProfile,
  updateCompanyProfile,
  getAllUsers,
  toggleBanUser,
};