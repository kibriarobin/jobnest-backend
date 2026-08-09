import httpStatus from 'http-status';
import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';

const saveJob = async (userId: string, jobId: string) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job || job.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Job not found');
  }

  const existing = await prisma.savedJob.findUnique({
    where: { jobId_userId: { jobId, userId } },
  });

  if (existing) {
    throw new AppError(httpStatus.CONFLICT, 'Job already saved');
  }

  const result = await prisma.savedJob.create({
    data: { jobId, userId },
  });

  return result;
};

const unsaveJob = async (userId: string, jobId: string) => {
  const existing = await prisma.savedJob.findUnique({
    where: { jobId_userId: { jobId, userId } },
  });

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'This job is not in your saved list');
  }

  await prisma.savedJob.delete({
    where: { jobId_userId: { jobId, userId } },
  });

  return null;
};

const getMySavedJobs = async (userId: string) => {
  const result = await prisma.savedJob.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      job: {
        include: {
          company: { select: { name: true, logo: true } },
          category: { select: { name: true } },
        },
      },
    },
  });

  return result;
};

export const SavedJobService = {
  saveJob,
  unsaveJob,
  getMySavedJobs,
};