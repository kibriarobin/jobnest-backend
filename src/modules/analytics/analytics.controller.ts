import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AnalyticsService } from './analytics.service';

const getCandidateOverview = catchAsync(async (req, res) => {
  const result = await AnalyticsService.getCandidateOverview(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Candidate overview retrieved successfully',
    data: result,
  });
});

const getEmployerOverview = catchAsync(async (req, res) => {
  const result = await AnalyticsService.getEmployerOverview(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employer overview retrieved successfully',
    data: result,
  });
});

const getAdminOverview = catchAsync(async (req, res) => {
  const result = await AnalyticsService.getAdminOverview();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin overview retrieved successfully',
    data: result,
  });
});

const getPublicStats = catchAsync(async (req, res) => {
  const result = await AnalyticsService.getPublicStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Public stats retrieved successfully',
    data: result,
  });
});

export const AnalyticsController = {
  getCandidateOverview,
  getEmployerOverview,
  getAdminOverview,
  getPublicStats
};