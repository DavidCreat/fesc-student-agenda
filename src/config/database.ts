import mongoose from 'mongoose';
import { config } from './env';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      retryWrites: true,
      w: 'majority',
      dbName: 'fesc_agenda'
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.db.databaseName}`);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error occurred');
    process.exit(1);
  }
};