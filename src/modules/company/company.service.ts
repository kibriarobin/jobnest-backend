import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import { Prisma } from "../../../generated/prisma/client";

const getAllCompaniesPublic = async (params: {
  page: number;
  limit: number;
  searchTerm?: string;
}) => {
  const { page, limit, searchTerm } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.CompanyWhereInput = searchTerm
    ? { name: { contains: searchTerm, mode: "insensitive" } }
    : {};

  const companies = await prisma.company.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      logo: true,
      description: true,
      website: true,
      isVerified: true,
      _count: {
        select: { jobs: { where: { isDeleted: false, status: "APPROVED" } } },
      },
    },
  });

  const total = await prisma.company.count({ where });

  return { meta: { page, limit, total }, data: companies };
};

const getAllCompaniesForAdmin = async (pagination: {
  page: number;
  limit: number;
}) => {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  const companies = await prisma.company.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true, isBanned: true, createdAt: true } },
      _count: { select: { jobs: true, reviews: true } },
    },
  });

  const total = await prisma.company.count();

  return { meta: { page, limit, total }, data: companies };
};

const getSingleCompany = async (id: string) => {
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      jobs: {
        where: { isDeleted: false, status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, status: true, createdAt: true },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { jobs: true, reviews: true } },
    },
  });

  if (!company) {
    throw new AppError(httpStatus.NOT_FOUND, "Company not found");
  }

  return company;
};

const toggleVerifyCompany = async (id: string) => {
  const company = await prisma.company.findUnique({ where: { id } });

  if (!company) {
    throw new AppError(httpStatus.NOT_FOUND, "Company not found");
  }

  const result = await prisma.company.update({
    where: { id },
    data: { isVerified: !company.isVerified },
  });

  return result;
};

export const CompanyService = {
  getAllCompaniesForAdmin,
  getSingleCompany,
  toggleVerifyCompany,
  getAllCompaniesPublic,
};
