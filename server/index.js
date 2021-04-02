import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import 'colors';
import connectDB from './config/db.js';
import productRoutes from './routes/product.js';
import userRoutes from './routes/user.js';
import orderRoutes from './routes/order.js';
import uploadRoutes from './routes/upload.js';
import { errorHandler, notFound } from './middleware/error.js';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();

connectDB();

const app = express();

app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const port = process.env.PORT || 5000;

app.use(express.json());

// Routes

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

app.use(notFound);
app.use(errorHandler);

// app.use(express.static('/uploads'));

app.listen(port, () =>
  console.log(`Server running on port: ${port}`.yellow.bold)
);
