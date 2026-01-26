import express from 'express';
import { publicController, userController } from '../controllers/index.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

for (const [key, value] of Object.entries(publicController)) {
    router.post(`/${key}`, value)
}

router.use(protect);
router.post('/logout', userController.logout)

export default router;