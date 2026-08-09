import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { JobService } from "./job.service";

const createJob = catchAsync(async (req, res) => {
  const result = await JobService.createJob(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Job posted successfully, pending admin approval',
    data: result,
  });
});

export const JobController = {
  createJob,
};