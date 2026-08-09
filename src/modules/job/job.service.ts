import httpStatus from 'http-status';
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { TCreateJob } from './job.interface';

const createJob = async (userId: string, payload: TCreateJob) => {
  const company = await prisma.company.findUnique({ where: { userId } });

  if (!company) {
    throw new AppError(httpStatus.NOT_FOUND, 'Company profile not found for this employer');
  }

  const job = await prisma.job.create({
    data: {
      ...payload,
      deadline: new Date(payload.deadline),
      companyId: company.id,
    },
  });

  return job;
}

export const JobService = {
  createJob,
};