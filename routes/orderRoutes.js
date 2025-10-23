import express from 'express';
import { createOrder, listOrders, riderAcceptOrder, adminAssignRider, updateOrderStatus } from '../controllers/orderController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, createOrder);
router.get('/', requireAuth, listOrders);
router.post('/accept', requireAuth, riderAcceptOrder); // rider accepts
router.put('/:orderId/assign', requireAuth, adminAssignRider); // admin assign rider
router.put('/:id/status', requireAuth, updateOrderStatus);

export default router;
