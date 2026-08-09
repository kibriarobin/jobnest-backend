import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req, res) => {
  const result = await ReviewService.createReview(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review submitted successfully',
    data: result,
  });
});

const getCompanyReviews = catchAsync(async (req, res) => {
  const result = await ReviewService.getCompanyReviews(req.params.companyId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  await ReviewService.deleteReview(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully',
    data: null,
  });
});

export const ReviewController = {
  createReview,
  getCompanyReviews,
  deleteReview,
};