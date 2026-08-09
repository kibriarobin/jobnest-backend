import httpStatus from 'http-status';
import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import { TCreateReview } from './review.interface';
import { ApplicationStatus } from '../../../generated/prisma/client';

const createReview = async (userId: string, payload: TCreateReview) => {
  const company = await prisma.company.findUnique({ where: { id: payload.companyId } });

  if (!company) {
    throw new AppError(httpStatus.NOT_FOUND, 'Company not found');
  }

  if (payload.rating < 1 || payload.rating > 5) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Rating must be between 1 and 5');
  }

  
  const eligibleApplication = await prisma.application.findFirst({
    where: {
      userId,
      job: { companyId: payload.companyId },
      status: {
        in: [
          ApplicationStatus.INTERVIEW,
          ApplicationStatus.HIRED,
          ApplicationStatus.REJECTED,
        ],
      },
    },
  });

  if (!eligibleApplication) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only review a company after completing an interview with them'
    );
  }

  const result = await prisma.companyReview.create({
    data: payload,
  });

  return result;
};

const getCompanyReviews = async (companyId: string) => {
  const reviews = await prisma.companyReview.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' },
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return {
    averageRating: Number(avgRating.toFixed(1)),
    totalReviews: reviews.length,
    reviews,
  };
};

const deleteReview = async (id: string) => {
  const review = await prisma.companyReview.findUnique({ where: { id } });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  await prisma.companyReview.delete({ where: { id } });

  return null;
};

export const ReviewService = {
  createReview,
  getCompanyReviews,
  deleteReview,
};