import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CompanyService } from './company.service';

const getAllCompaniesForAdmin = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await CompanyService.getAllCompaniesForAdmin({ page, limit });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Companies retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCompany = catchAsync(async (req, res) => {
  const result = await CompanyService.getSingleCompany(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company retrieved successfully',
    data: result,
  });
});

const toggleVerifyCompany = catchAsync(async (req, res) => {
  const result = await CompanyService.toggleVerifyCompany(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Company ${result.isVerified ? 'verified' : 'unverified'} successfully`,
    data: result,
  });
});

export const CompanyController = {
  getAllCompaniesForAdmin,
  getSingleCompany,
  toggleVerifyCompany,
};