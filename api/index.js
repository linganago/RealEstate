import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js'; // 👈 new import

dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const app = express();
app.use(express.json());

// Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter); // 👈 register auth route

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
