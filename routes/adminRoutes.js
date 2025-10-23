import express from 'express';
import { adminStats } from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.get('/stats', requireAuth, requireRole('admin'), adminStats);

export default router;
