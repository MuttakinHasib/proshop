import express from 'express';
import {
  addOrderItems,
  getOrderById,
  getOrders,
  getUserOrders,
  stripePayment,
  updateOrderToDeliver,
  updateOrderToPaid,
} from '../controllers/orderController.js';

import { admin, protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/userOrders').get(protect, getUserOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/paid').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDeliver);
router.route('/payment').post(protect, stripePayment);

export default router;
