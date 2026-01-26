
import { User } from '../models/index.js';

class UserRepository {
  async findById(id) {
    return User.findById(id).select('-password');
  }

  async findByEmail(email) {
    return User.findOne({ email }).select('+password');
  }

  async findByGoogleId(googleId) {
    return User.findOne({ googleId });
  }

  async create(userData) {
    const user = new User(userData);
    return user.save();
  }

  async updateById(id, updateData) {
    return User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
  }

  async updateLastLogin(id) {
    return User.findByIdAndUpdate(
      id,
      { $set: { lastLoginAt: new Date() } },
      { new: true }
    );
  }

  async deleteById(id) {
    return User.findByIdAndDelete(id);
  }

  async clearRefreshTokens(userId) {
    await User.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] }
    });
  }
}

export const userRepository = new UserRepository();