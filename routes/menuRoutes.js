import express from 'express';
import { listMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menuController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', listMenu);
router.post('/', requireAuth, requireRole('admin'), createMenuItem);
router.put('/:id', requireAuth, requireRole('admin'), updateMenuItem);
router.delete('/:id', requireAuth, requireRole('admin'), deleteMenuItem);

export default router;
