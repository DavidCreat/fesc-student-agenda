import dotenv from 'dotenv';

dotenv.config();

export const serverConfig = {
  apiBaseUrl: process.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  huggingFaceToken: process.env.VITE_HUGGINGFACE_TOKEN,
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '24h',
} as const;

export const serverConstants = {
  AUTH_TOKEN_KEY: 'auth_token',
  USER_KEY: 'user',
  API_TIMEOUT: 15000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
} as const; 