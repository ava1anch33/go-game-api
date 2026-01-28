import express from 'express';
import { analystController } from '../controllers/index.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.post(
    '/game-analyst', 
    analystController.givenGameAnalyst
)

export default router;