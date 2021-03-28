import Stripe from 'stripe';
import { v4 as uuid } from 'uuid';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

const secretKey = process.env.STRIPE_SECRET;

const stripe = new Stripe(
  `sk_test_51IZiatGtB6p6nHNadpInK46iOYnMTFnmIvM0E4rXaYd6NorelcsNW8JGjdkTzHLXPfu9SCgphsF0Q77YFiDjbMPP00XD1BDUuV`
);
// const stripe = new Stripe(secretKey); //! same problem with this

export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items found');
    return;
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export const stripePayment = asyncHandler(async (req, res) => {
  const { amount, token } = req.body;
  const idempotencyKey = uuid();
  const payment = await stripe.charges.create(
    {
      source: token.id,
      amount: amount,
      currency: 'usd',
      receipt_email: token.email,
      description: `Total price ${amount}`,
    },
    { idempotencyKey }
  );

  if (payment) {
    res.json({
      id: payment.id,
      status: payment.status,
      email_address: payment.receipt_email,
    });
  } else {
    res.status(400);
    throw new Error('Something went wrong');
  }
});

export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});
