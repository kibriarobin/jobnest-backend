import { prisma } from '../../lib/prisma';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

// ---------- Candidate Overview ----------

const getCandidateOverview = async (userId: string) => {
  const totalApplications = await prisma.application.count({ where: { userId } });

  const applicationsByStatus = await prisma.application.groupBy({
    by: ['status'],
    where: { userId },
    _count: { status: true },
  });

  const savedJobsCount = await prisma.savedJob.count({ where: { userId } });

  const interviewCount = await prisma.application.count({
    where: { userId, status: { in: ['INTERVIEW', 'HIRED'] } },
  });

  return {
    totalApplications,
    savedJobsCount,
    interviewCount,
    applicationsByStatus: applicationsByStatus.map((item) => ({
      status: item.status,
      count: item._count.status,
    })),
  };
};

// ---------- Employer Overview ----------

const getEmployerOverview = async (userId: string) => {
  const company = await prisma.company.findUnique({ where: { userId } });

  if (!company) {
    throw new AppError(httpStatus.NOT_FOUND, 'Company profile not found');
  }

  const totalJobs = await prisma.job.count({
    where: { companyId: company.id, isDeleted: false },
  });

  const activeJobs = await prisma.job.count({
    where: { companyId: company.id, status: 'APPROVED', isDeleted: false },
  });

  const totalApplicants = await prisma.application.count({
    where: { job: { companyId: company.id } },
  });

  const hiredCount = await prisma.application.count({
    where: { job: { companyId: company.id }, status: 'HIRED' },
  });

  
  const applicationsPerJob = await prisma.job.findMany({
    where: { companyId: company.id, isDeleted: false },
    select: {
      title: true,
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  // Pie chart: candidate status distribution
  const applicantsByStatus = await prisma.application.groupBy({
    by: ['status'],
    where: { job: { companyId: company.id } },
    _count: { status: true },
  });


  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentApplications = await prisma.application.findMany({
    where: {
      job: { companyId: company.id },
      appliedAt: { gte: sevenDaysAgo },
    },
    select: { appliedAt: true },
  });

  const applicationsOverTime = groupByDate(recentApplications.map((a) => a.appliedAt));

  return {
    totalJobs,
    activeJobs,
    totalApplicants,
    hiredCount,
    applicationsPerJob: applicationsPerJob.map((job) => ({
      title: job.title,
      count: job._count.applications,
    })),
    applicantsByStatus: applicantsByStatus.map((item) => ({
      status: item.status,
      count: item._count.status,
    })),
    applicationsOverTime,
  };
};

// ---------- Admin Overview ----------

const getAdminOverview = async () => {
  const totalUsers = await prisma.user.count();
  const totalCandidates = await prisma.user.count({ where: { role: 'CANDIDATE' } });
  const totalEmployers = await prisma.user.count({ where: { role: 'EMPLOYER' } });
  const totalJobs = await prisma.job.count({ where: { isDeleted: false } });
  const pendingJobs = await prisma.job.count({ where: { status: 'PENDING', isDeleted: false } });
  const totalCompanies = await prisma.company.count();
  const verifiedCompanies = await prisma.company.count({ where: { isVerified: true } });
  const totalApplications = await prisma.application.count();

  // Pie chart: job status distribution
  const jobsByStatus = await prisma.job.groupBy({
    by: ['status'],
    where: { isDeleted: false },
    _count: { status: true },
  });

  // Bar chart: category
   const jobsByCategory = await prisma.category.findMany({
    select: {
      name: true,
      _count: { select: { jobs: { where: { isDeleted: false } } } },
    },
  });

  // Line chart: daily user growth
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentUsers = await prisma.user.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    select: { createdAt: true },
  });

  const userGrowth = groupByDate(recentUsers.map((u) => u.createdAt));

  return {
    totalUsers,
    totalCandidates,
    totalEmployers,
    totalJobs,
    pendingJobs,
    totalCompanies,
    verifiedCompanies,
    totalApplications,
    jobsByStatus: jobsByStatus.map((item) => ({
      status: item.status,
      count: item._count.status,
    })),
    jobsByCategory: jobsByCategory.map((cat) => ({
      category: cat.name,
      count: cat._count.jobs,
    })),
    userGrowth,
  };
};


const groupByDate = (dates: Date[]) => {
  const counts: Record<string, number> = {};

  dates.forEach((date) => {
    const key = date.toISOString().split('T')[0] as string;
    counts[key] = (counts[key] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const AnalyticsService = {
  getCandidateOverview,
  getEmployerOverview,
  getAdminOverview,
};