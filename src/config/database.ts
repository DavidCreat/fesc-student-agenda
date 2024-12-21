import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!, {
      retryWrites: true,
      w: 'majority',
      dbName: 'fesc_agenda'
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    if (conn.connection.db) {
      console.log(`📦 Database: ${conn.connection.db.databaseName}`);
    }
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error occurred');
    process.exit(1);
  }
};