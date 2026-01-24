import express from 'express'
import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'

const router = express.Router();

router.use('/', authRoutes);
router.use('/', userRoutes);

export default router;