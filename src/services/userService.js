import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/index.js';
import AppError from '../utils/AppError.js';

class UserService {
  async register(userData) {
    const { email, username, password } = userData;

    if (await userRepository.findByEmail(email)) {
      throw new AppError('Email already exists', 409, 'EMAIL_DUPLICATE');
    }
    if (await userRepository.findByUsername(username)) {
      throw new AppError('Username already exists', 409, 'USERNAME_DUPLICATE');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return newUser;
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }
    await userRepository.updateLastLogin(user._id);
    user.lastLoginAt = new Date();

    return user;
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    return user;
  }

  async updateUser(id, updateData) {
    const forbiddenFields = ['password', 'role', 'googleId', 'wechatId', 'githubId'];
    forbiddenFields.forEach(field => delete updateData[field]);

    const updated = await userRepository.updateById(id, updateData);
    if (!updated) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    return updated;
  }
}

export const userService = new UserService();