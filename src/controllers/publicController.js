import jwt from 'jsonwebtoken';
import { userService } from '../services/index.js';
import AppError from '../utils/AppError.js';
import { successResponse } from '../utils/index.js';

async function handleToken(user, res) {
  const accessToken = user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  successResponse(res, {
    accessToken
  });
}

const register = async (req, res, next) => {
  try {
    const user = await userService.register(req.body);
    await handleToken(user, res)
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await userService.login(req.body);
    await handleToken(user, res)
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new AppError('No refresh token', 401);
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await userService.findById(decoded.id);

    if (!user) throw new AppError('User not found', 404);

    // check refresh token still in DB
    const tokenExists = user.refreshTokens.some(t => t.token === refreshToken && t.expiresAt > new Date());
    if (!tokenExists) throw new AppError('Invalid or expired refresh token', 401);

    // generate new refresh token
    await user.invalidateRefreshToken(refreshToken);
    const newRefreshToken = await user.generateRefreshToken();

    // set new cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const newAccessToken = user.generateAccessToken();
    successResponse(res, { accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

export default { 
  'register': register, 
  'login': login,
  'refresh': refreshToken
};