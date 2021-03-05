import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const app = express();

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(port, () =>
  console.log(`Server running on port: ${port}`.yellow.bold)
);
