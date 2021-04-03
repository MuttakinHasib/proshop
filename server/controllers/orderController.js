import Stripe from 'stripe';
import { v4 as uuid } from 'uuid';
import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';
import Order from '../models/Order.js';
import { orderTables } from '../utils/document.js';
import { google } from 'googleapis';

// const secretKey = process.env.STRIPE_SECRET;

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
const REFRESH_TOKEN =
  '1//045Xbdlx9LJPHCgYIARAAGAQSNwF-L9Ir81ICmH-GYACwheeXLUfLHwRkETjFRLdwf87iCQ05VrxCktIdvAAIERccaQo76C0qz28';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

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
    }).populate('user', 'name email');

    const createdOrder = await order.save();

    // const accessToken = await oAuth2Client.getAccessToken();
    // console.log(accessToken);
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: process.env.GOOGLE_ACCESS_TOKEN,
        expires: 1262565265693626444515 * 600000,
      },
    });

    await transporter.sendMail({
      from: `"ProShop" < ${process.env.MAIL_USER}>`, // sender address
      to: `${req?.user?.name}< ${req?.user?.email}>`, // list of receivers
      subject: `Proshop - Order No# ${createdOrder._id}`, // Subject line
      text:
        'Thank you for your interest in Proshop products. Your order has been received and will be processed once payment has been confirmed.', // plain text body
      html: `
        <div style='margin-bottom: 10px;'>
          <h4>Thank you for your interest in Proshop products. . Your order has been received and will be processed once payment has been confirmed.</h4>
        </div>
        ${orderTables(createdOrder, req)}
      `,
    });

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
      amount,
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
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();

    const accessToken = await oAuth2Client.getAccessToken();

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: process.env.GOOGLE_ACCESS_TOKEN,
        expires: 1262565265693626444515 * 600000,
      },
    });

    await transporter.sendMail({
      from: `"ProShop" < ${process.env.MAIL_USER}`, // sender address
      to: `"${updatedOrder?.user?.name}" < ${updatedOrder?.user?.email}>`, // list of receivers
      subject: `Payment Received - Order No# ${updatedOrder._id} & Transaction ID ${updatedOrder.paymentResult.id}`, // Subject line
      text: `We received your payment at ${updatedOrder.paidAt}`, // plain text body
      html: `
        <div style='margin-bottom: 10px;'>
          <h2>We received your payment at ${updatedOrder.paidAt}</h2>
          <h4>Payment Information</h4>
          <p>Card Type: ${updatedOrder.paymentMethod}</p>
          <p>Transaction Type: Purchase</p>
          <p>Gateway Currency: USD</p>
          <p><b>Total Amount:</b> $${updatedOrder.totalPrice}</p>
        </div>
        ${orderTables(updatedOrder, req)}
      `,
    });

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// Order Delivered

export const updateOrderToDeliver = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    const accessToken = await oAuth2Client.getAccessToken();

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: process.env.GOOGLE_ACCESS_TOKEN,
        expires: 1262565265693626444515 * 600000,
      },
    });

    await transporter.sendMail({
      from: `"ProShop" < ${process.env.MAIL_USER}`, // sender address
      to: `"${updatedOrder.user.name}" < ${updatedOrder.user.email}>`, // list of receivers
      subject: `ProShop || Order Delivered - Order No# ${updatedOrder._id} & Transaction ID ${updatedOrder.paymentResult.id}`, // Subject line
      text: 'Your order has been delivered.', // plain text body
      html: `
        <div style='margin-bottom: 10px;'>
          <h2>Your order has been delivered at ${updatedOrder.deliveredAt}</h2>
        </div>
        ${orderTables(updatedOrder)}
      `,
    });

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

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');

  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});
