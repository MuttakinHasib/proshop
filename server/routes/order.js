import express from 'express';
import {
  addOrderItems,
  getOrderById,
  stripePayment,
  updateOrderToPaid,
} from '../controllers/orderController.js';

import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/paid').get(protect, updateOrderToPaid);
router.route('/payment').post(stripePayment);

export default router;
