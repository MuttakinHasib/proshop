import express from 'express';
import dotenv from 'dotenv';
import 'colors';
import connectDB from './config/db.js';
import productRoutes from './routes/product.js';
import userRoutes from './routes/user.js';
import orderRoutes from './routes/order.js';
import { errorHandler, notFound } from './middleware/error.js';

dotenv.config();

connectDB();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

// Routes

console.log(typeof process.env.STRIPE_SECRET);

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running on port: ${port}`.yellow.bold)
);
