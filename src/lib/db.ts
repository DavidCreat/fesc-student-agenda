import mongoose from 'mongoose';
import { config } from '../config';

export async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
}