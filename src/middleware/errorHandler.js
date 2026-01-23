import AppError from '../utils/AppError.js';

const sendErrorResponse = (res, err) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  const response = {
    success: false,
    error: err.message || 'Something went wrong',
    code: err.code || 'UNKNOWN_ERROR',
  };

  if (!isProduction) {
    response.stack = err.stack;
    response.details = err.details;
  }

  if (err.name === 'ValidationError') {
    response.code = 'VALIDATION_ERROR';
    response.details = Object.values(err.errors).map(e => e.message);
  }

  if (err.name === 'CastError') {
    response.code = 'INVALID_ID';
    response.error = 'Invalid ID format';
  }

  if (err.code === 11000) {
    response.code = 'DUPLICATE_KEY';
    response.error = 'Duplicate entry';
  }

  res.status(statusCode).json(response);
};

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return sendErrorResponse(res, err);
  }

  const appErr = new AppError(
    err.message || 'Internal Server Error',
    err.statusCode || 500,
    err.code || 'INTERNAL_SERVER_ERROR'
  );

  console.error('Unhandled Error:', err);
  sendErrorResponse(res, appErr);
};