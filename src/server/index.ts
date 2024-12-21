import express from 'express';
import cors from 'cors';
import { connectDB } from '../config/database';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import { errorHandler } from './middleware/errorHandler';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});