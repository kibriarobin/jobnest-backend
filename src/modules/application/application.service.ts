import httpStatus from 'http-status';
import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import { TCreateApplication } from './application.interface';
import { ApplicationStatus, JobStatus } from '../../../generated/prisma/client';

const applyToJob = async (userId: string, payload: TCreateApplication) => {
  const job = await prisma.job.findUnique({ where: { id: payload.jobId } });

  if (!job || job.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Job not found');
  }

  if (job.status !== JobStatus.APPROVED) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You cannot apply to a job that is not approved');
  }

  if (job.deadline < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Application deadline has passed');
  }

  const existingApplication = await prisma.application.findUnique({
    where: { jobId_userId: { jobId: payload.jobId, userId } },
  });

  if (existingApplication) {
    throw new AppError(httpStatus.CONFLICT, 'You have already applied to this job');
  }

  const result = await prisma.application.create({
    data: {
      jobId: payload.jobId,
      userId,
      resumeUrl: payload.resumeUrl,
      coverLetter: payload.coverLetter,
    },
  });

  return result;
};

const getMyApplications = async (userId: string) => {
  const result = await prisma.application.findMany({
    where: { userId },
    orderBy: { appliedAt: 'desc' },
    include: {
      job: {
        select: {
          title: true,
          location: true,
          type: true,
          salaryMin: true,
          salaryMax: true,
          deadline: true,
          company: { select: { name: true, logo: true } },
        },
      },
    },
  });

  return result;
};

const getApplicationsForEmployer = async (userId: string, jobId?: string) => {
  const company = await prisma.company.findUnique({ where: { userId } });

  if (!company) {
    throw new AppError(httpStatus.NOT_FOUND, 'Company profile not found');
  }

  const result = await prisma.application.findMany({
    where: {
      job: { companyId: company.id },
      ...(jobId ? { jobId } : {}),
    },
    orderBy: { appliedAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true, profilePhoto: true } },
      job: { select: { id: true, title: true } },
    },
  });

  return result;
};

const changeApplicationStatus = async (
  userId: string,
  applicationId: string,
  status: ApplicationStatus
) => {
  const company = await prisma.company.findUnique({ where: { userId } });

  if (!company) {
    throw new AppError(httpStatus.NOT_FOUND, 'Company profile not found');
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });

  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
  }

  if (application.job.companyId !== company.id) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only manage applications for your own job posts'
    );
  }

  const result = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });

  return result;
};

const withdrawApplication = async (userId: string, applicationId: string) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
  }

  if (application.userId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You can only withdraw your own application');
  }

  if (application.status === ApplicationStatus.HIRED) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cannot withdraw an accepted application');
  }

  await prisma.application.delete({ where: { id: applicationId } });

  return null;
};

export const ApplicationService = {
  applyToJob,
  getMyApplications,
  getApplicationsForEmployer,
  changeApplicationStatus,
  withdrawApplication,
};