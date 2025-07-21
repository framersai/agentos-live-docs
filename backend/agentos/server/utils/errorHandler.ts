// agentos/server/utils/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { GMIError } from '../../../utils/errors';
import { logger } from './logger';

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error('Express error handler:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  if (error instanceof GMIError) {
    res.status(error.httpStatusCode || 500).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        component: error.component,
        ...(process.env.NODE_ENV === 'development' && { 
          stack: error.stack 
        }),
      },
    });
    return;
  }

  // Handle other specific error types
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
      },
    });
    return;
  }

  if (error.name === 'UnauthorizedError') {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
    return;
  }

  // Generic error response
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An internal server error occurred' 
        : error.message,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: error.stack 
      }),
    },
  });
}