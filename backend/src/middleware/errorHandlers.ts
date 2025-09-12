import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
  });

  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details || err.message,
    });
  }

  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }

  if (err.code === 'ENOENT') {
    return res.status(404).json({
      error: 'Resource not found',
    });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'File too large',
      message: 'The uploaded file exceeds the maximum allowed size',
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.method} ${req.path} was not found`,
  });
};