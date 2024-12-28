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
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from both HTTP and HTTPS
    if (!origin || origin.startsWith('http://') || origin.startsWith('https://')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

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