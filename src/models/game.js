import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',           // 假设你有 User 模型
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    board: {
        type: [Number],        // Int8Array 转普通数组保存
        required: true
    },
    currentPlayer: {
        type: Number,          // 1 = 黑（玩家），2 = 白（AI）
        default: 1
    },
    status: {
        type: String,
        enum: ['active', 'finished'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
  }, {
    timestamps: true
})

gameSchema.index({ userId: 1, name: 1, updatedAt: -1 });

export default mongoose.model('Game', gameSchema);