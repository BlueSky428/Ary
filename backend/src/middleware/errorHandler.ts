/**
 * Error Handling Middleware
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Log error
  logger.error('API Error', {
    error: message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Don't expose internal errors in production
  const errorMessage =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal server error'
      : message;

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

