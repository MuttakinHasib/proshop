import Stripe from 'stripe';
import { v4 as uuid } from 'uuid';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

const secret = process.env.STRIPE_SECRET;
const stripe = new Stripe(
  'sk_test_51IZiatGtB6p6nHNadpInK46iOYnMTFnmIvM0E4rXaYd6NorelcsNW8JGjdkTzHLXPfu9SCgphsF0Q77YFiDjbMPP00XD1BDUuV'
);

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
  console.log(req.body);
  const { amount, shippingAddress, token } = req.body;

  // const customer = await stripe.customers.create({
  //   email: token.email,
  //   source: token.id,
  // });

  const idempotencyKey = uuid();

  const payment = await stripe.charges.create(
    {
      source: token.id,
      amount: amount * 100,
      currency: 'usd',
      receipt_email: token.email,
      description: `Total price ${amount * 100}`,
    },
    { idempotencyKey }
  );

  // console.log(payment);

  if (payment) {
    res.json(payment);
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
    // order.paymentResult = {
    //   id: req.body.id;
    //   status: req.body.status
    // }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});
