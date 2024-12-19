import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRE: z.string().default('24h'),
  HUGGINGFACE_TOKEN: z.string().min(1),
});

// Validate environment variables
const validateEnv = () => {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI: process.env.MONGODB_URI,
      JWT_SECRET: process.env.JWT_SECRET,
      JWT_EXPIRE: process.env.JWT_EXPIRE,
      HUGGINGFACE_TOKEN: process.env.HUGGINGFACE_TOKEN,
    });
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    process.exit(1);
  }
};

// Validate environment variables before exporting config
const env = validateEnv();

export const config = {
  env: env.NODE_ENV,
  mongoUri: env.MONGODB_URI,
  jwtSecret: env.JWT_SECRET,
  jwtExpire: env.JWT_EXPIRE,
  huggingFaceToken: env.HUGGINGFACE_TOKEN,
  isProduction: env.NODE_ENV === 'production',
};