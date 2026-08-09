import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const getMyProfile = catchAsync(async (req, res) => {
  const result = await UserService.getMyProfile(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const updateBasicInfo = catchAsync(async (req, res) => {
  const result = await UserService.updateBasicInfo(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

const updateCandidateProfile = catchAsync(async (req, res) => {
  const result = await UserService.updateCandidateProfile(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Candidate profile updated successfully',
    data: result,
  });
});

const updateCompanyProfile = catchAsync(async (req, res) => {
  const result = await UserService.updateCompanyProfile(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company profile updated successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await UserService.getAllUsers({ page, limit });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const toggleBanUser = catchAsync(async (req, res) => {
  const result = await UserService.toggleBanUser(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User ${result.isBanned ? 'banned' : 'unbanned'} successfully`,
    data: result,
  });
});

export const UserController = {
  getMyProfile,
  updateBasicInfo,
  updateCandidateProfile,
  updateCompanyProfile,
  getAllUsers,
  toggleBanUser,
};