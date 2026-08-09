import httpStatus from 'http-status';
import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';

const createCategory = async (payload: { name: string; icon?: string }) => {
  const existing = await prisma.category.findUnique({
    where: { name: payload.name },
  });

  if (existing) {
    throw new AppError(httpStatus.CONFLICT, 'Category already exists');
  }

  const result = await prisma.category.create({ data: payload });
  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { jobs: true } },
    },
  });

  return result;
};

const updateCategory = async (id: string, payload: { name?: string; icon?: string }) => {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  const result = await prisma.category.update({ where: { id }, data: payload });
  return result;
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { jobs: true } } },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  if (category._count.jobs > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete category with existing jobs. Reassign or delete those jobs first.'
    );
  }

  const result = await prisma.category.delete({ where: { id } });
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};