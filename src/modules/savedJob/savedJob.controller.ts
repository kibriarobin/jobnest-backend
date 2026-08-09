import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SavedJobService } from './savedJob.service';

const saveJob = catchAsync(async (req, res) => {
  const result = await SavedJobService.saveJob(req.user!.id, req.body.jobId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Job saved successfully',
    data: result,
  });
});

const unsaveJob = catchAsync(async (req, res) => {
  await SavedJobService.unsaveJob(req.user!.id, req.params.jobId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job removed from saved list',
    data: null,
  });
});

const getMySavedJobs = catchAsync(async (req, res) => {
  const result = await SavedJobService.getMySavedJobs(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Saved jobs retrieved successfully',
    data: result,
  });
});

export const SavedJobController = {
  saveJob,
  unsaveJob,
  getMySavedJobs,
};