import express from 'express'
import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'
import gameRoutes from './gameRoutes.js'
import analystRoutes from './analystRoutes.js'

const router = express.Router();

router.use('/', authRoutes);
router.use('/', userRoutes);
router.use('/', gameRoutes);
router.use('/', analystRoutes);

export default router;