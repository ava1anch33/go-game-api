import AppError from '../utils/AppError.js';
import jwt from 'jsonwebtoken';

const VALID_API_KEY = process.env.API_KEY;

if (!VALID_API_KEY) {
  throw new Error('API_KEY environment variable is required');
}

export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['api-key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API Key is required',
      code: 'API_KEY_MISSING'
    });
  }

  if (apiKey !== VALID_API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API Key',
      code: 'API_KEY_INVALID'
    });
  }
  
  req.apiKey = apiKey;
  next();
};

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized, no token', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // { id, role, email }
    next();
  } catch (err) {
    return next(new AppError('Token invalid or expired', 401));
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('No permission', 403));
    }
    next();
  };
};