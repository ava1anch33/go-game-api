import express from 'express';
import { gameController } from '../controllers/index.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.post('/create-new-game', gameController.createNewGame)
router.post('/ai-thinking', gameController.aiThinking)
router.post('/end-game', gameController.endGame)

export default router;