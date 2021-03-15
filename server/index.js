import express from 'express';
import dotenv from 'dotenv';
import 'colors';
import connectDB from './config/db.js';
import productRoutes from './routes/product.js';
import { errorHandler, notFound } from './middlewares/error.js';

dotenv.config();

connectDB();

const app = express();

const port = process.env.PORT || 5000;

// Routes

app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running on port: ${port}`.yellow.bold)
);
