import mongoose from 'mongoose';
import { config, constants } from './index.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      dbName: constants.MONGODB_NAME,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 50
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    if (conn.connection.db) {
      console.log(`Database: ${conn.connection.db.databaseName}`);
    }

    // Manejar eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    // Manejar señales de terminación
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export { connectDB };