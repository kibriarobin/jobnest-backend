import httpStatus from 'http-status';
import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import { TCreateJob, TJobFilters } from './job.interface';
import { JobStatus, Prisma } from '../../../generated/prisma/client';

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
};

const getAllJobs = async (
  filters: TJobFilters,
  pagination: { page: number; limit: number }
) => {
  const { searchTerm, category, location, type, minSalary, maxSalary } = filters;
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.JobWhereInput[] = [
    { status: JobStatus.APPROVED },
    { isDeleted: false },
  ];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  if (category) {
    andConditions.push({ categoryId: category });
  }

  if (location) {
    andConditions.push({ location: { contains: location, mode: 'insensitive' } });
  }

  if (type) {
    andConditions.push({ type: type as any });
  }

  if (minSalary) {
    andConditions.push({ salaryMin: { gte: Number(minSalary) } });
  }

  if (maxSalary) {
    andConditions.push({ salaryMax: { lte: Number(maxSalary) } });
  }

  const whereConditions: Prisma.JobWhereInput = { AND: andConditions };

  const jobs = await prisma.job.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      company: { select: { name: true, logo: true } },
      category: { select: { name: true } },
    },
  });

  const total = await prisma.job.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: jobs,
  };
};

const getSingleJob = async (id: string) => {
  const job = await prisma.job.findUnique({
    where: { id, isDeleted: false },
    include: {
      company: true,
      category: true,
    },
  });

  if (!job) {
    throw new AppError(httpStatus.NOT_FOUND, 'Job not found');
  }

  const relatedJobs = await prisma.job.findMany({
    where: {
      categoryId: job.categoryId,
      id: { not: job.id },
      status: JobStatus.APPROVED,
      isDeleted: false,
    },
    take: 4,
    include: { company: { select: { name: true, logo: true } } },
  });

  return { ...job, relatedJobs };
};

const getMyJobs = async (userId: string) => {
  const company = await prisma.company.findUnique({ where: { userId } });

  if (!company) {
    throw new AppError(httpStatus.NOT_FOUND, 'Company profile not found');
  }

  const jobs = await prisma.job.findMany({
    where: { companyId: company.id, isDeleted: false },
    orderBy: { createdAt: 'desc' },
    include: { category: { select: { name: true } } },
  });

  return jobs;
};

const updateJob = async (userId: string, jobId: string, payload: Partial<TCreateJob>) => {
  const company = await prisma.company.findUnique({ where: { userId } });

  if (!company) {
    throw new AppError(httpStatus.NOT_FOUND, 'Company profile not found');
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job || job.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Job not found');
  }

  if (job.companyId !== company.id) {
    throw new AppError(httpStatus.FORBIDDEN, 'You can only edit your own job posts');
  }

  const updateData: any = { ...payload };
  if (payload.deadline) {
    updateData.deadline = new Date(payload.deadline);
  }

  const updatedJob = await prisma.job.update({
    where: { id: jobId },
    data: updateData,
  });

  return updatedJob;
};

const deleteJob = async (userId: string, jobId: string) => {
  const company = await prisma.company.findUnique({ where: { userId } });

  if (!company) {
    throw new AppError(httpStatus.NOT_FOUND, 'Company profile not found');
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job || job.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Job not found');
  }

  if (job.companyId !== company.id) {
    throw new AppError(httpStatus.FORBIDDEN, 'You can only delete your own job posts');
  }

  const result = await prisma.job.update({
    where: { id: jobId },
    data: { isDeleted: true },
  });

  return result;
};


const getAllJobsForAdmin = async (pagination: { page: number; limit: number }) => {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  const jobs = await prisma.job.findMany({
    where: { isDeleted: false },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      company: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

  const total = await prisma.job.count({ where: { isDeleted: false } });

  return { meta: { page, limit, total }, data: jobs };
};

const changeJobStatus = async (jobId: string, status: JobStatus) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job || job.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Job not found');
  }

  const result = await prisma.job.update({
    where: { id: jobId },
    data: { status },
  });

  return result;
};

export const JobService = {
  createJob,
  getAllJobs,
  getSingleJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getAllJobsForAdmin,
  changeJobStatus,
};