import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { JobService } from './job.service';
import pick from '../../utils/pick';

const createJob = catchAsync(async (req, res) => {
  const result = await JobService.createJob(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Job posted successfully, pending admin approval',
    data: result,
  });
});

const getAllJobs = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'category',
    'location',
    'type',
    'minSalary',
    'maxSalary',
  ]);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await JobService.getAllJobs(filters, { page, limit });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jobs retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleJob = catchAsync(async (req, res) => {
  const result = await JobService.getSingleJob(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job retrieved successfully',
    data: result,
  });
});

const getMyJobs = catchAsync(async (req, res) => {
  const result = await JobService.getMyJobs(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your jobs retrieved successfully',
    data: result,
  });
});

const updateJob = catchAsync(async (req, res) => {
  const result = await JobService.updateJob(req.user!.id, req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job updated successfully',
    data: result,
  });
});

const deleteJob = catchAsync(async (req, res) => {
  await JobService.deleteJob(req.user!.id, req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job deleted successfully',
    data: null,
  });
});

const getAllJobsForAdmin = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await JobService.getAllJobsForAdmin({ page, limit });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All jobs retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const changeJobStatus = catchAsync(async (req, res) => {
  const result = await JobService.changeJobStatus(req.params.id as string, req.body.status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Job status changed to ${req.body.status}`,
    data: result,
  });
});

export const JobController = {
  createJob,
  getAllJobs,
  getSingleJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getAllJobsForAdmin,
  changeJobStatus,
};