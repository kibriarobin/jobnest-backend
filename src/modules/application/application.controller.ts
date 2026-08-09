import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ApplicationService } from './application.service';

const applyToJob = catchAsync(async (req, res) => {
  const result = await ApplicationService.applyToJob(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Application submitted successfully',
    data: result,
  });
});

const getMyApplications = catchAsync(async (req, res) => {
  const result = await ApplicationService.getMyApplications(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your applications retrieved successfully',
    data: result,
  });
});

const getApplicationsForEmployer = catchAsync(async (req, res) => {
  const jobId = req.query.jobId as string | undefined;
  const result = await ApplicationService.getApplicationsForEmployer(req.user!.id, jobId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Applications retrieved successfully',
    data: result,
  });
});

const changeApplicationStatus = catchAsync(async (req, res) => {
  const result = await ApplicationService.changeApplicationStatus(
    req.user!.id,
    req.params.id as string,
    req.body.status
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Application status changed to ${req.body.status}`,
    data: result,
  });
});

const withdrawApplication = catchAsync(async (req, res) => {
  await ApplicationService.withdrawApplication(req.user!.id, req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Application withdrawn successfully',
    data: null,
  });
});

export const ApplicationController = {
  applyToJob,
  getMyApplications,
  getApplicationsForEmployer,
  changeApplicationStatus,
  withdrawApplication,
};