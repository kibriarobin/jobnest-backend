import { ErrorRequestHandler } from 'express';
import config from '../config';
import { Prisma } from '../../generated/prisma/client';
import { ZodError } from 'zod';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';

  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.issues.map((issue) => issue.message).join(', ');
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 409;
      message = `Duplicate value for field: ${err.meta?.target}`;
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Requested record not found';
    }
  } else if (/not found/i.test(message)) {
    statusCode = 404;
  } else if (/unauthorized|invalid.*token|jwt/i.test(message)) {
    statusCode = 401;
  } else if (/forbidden|not permitted|banned/i.test(message)) {
    statusCode = 403;
  } else if (/already exists|duplicate/i.test(message)) {
    statusCode = 409;
  } else if (/validation|required|invalid/i.test(message)) {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: config.node_env === 'development' ? err : undefined,
    stack: config.node_env === 'development' ? err.stack : undefined,
  });
};

export default globalErrorHandler;