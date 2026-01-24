import express from 'express';
import { userController } from '../controllers/index.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.post('/user', userController.getUserInfo)
router.put('/user', userController.updateUserInfo)

export default router;