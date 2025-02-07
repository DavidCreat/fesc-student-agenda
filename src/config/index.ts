// Validate required environment variables
const requiredEnvVars = [
  'VITE_MONGODB_URI',
  'VITE_JWT_SECRET',
  'VITE_HUGGINGFACE_TOKEN',
  'VITE_HUGGINGFACE_API_URL',
  'VITE_INSTITUTIONAL_EMAIL_DOMAIN'
];

requiredEnvVars.forEach(envVar => {
  if (!import.meta.env[envVar]) {
    throw new Error(`Required environment variable not found: ${envVar}`);
  }
});

// Configuración de la aplicación
export const config = {
  env: import.meta.env.MODE || 'development',
  port: parseInt(import.meta.env.PORT || '5000', 10),
  mongoUri: import.meta.env.VITE_MONGODB_URI!,
  jwtSecret: import.meta.env.VITE_JWT_SECRET!,
  jwtExpire: import.meta.env.VITE_JWT_EXPIRE || '24h',
  corsOrigin: import.meta.env.VITE_CORS_ORIGIN || 'http://localhost:5173',
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  authApiUrl: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000/api/auth',
  serverUrl: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000',
  huggingfaceToken: import.meta.env.VITE_HUGGINGFACE_TOKEN!,
  huggingfaceApiUrl: import.meta.env.VITE_HUGGINGFACE_API_URL!,
  institutionalEmailDomain: import.meta.env.VITE_INSTITUTIONAL_EMAIL_DOMAIN!,
  recommendations: {
    perPage: parseInt(import.meta.env.VITE_RECOMMENDATIONS_PER_PAGE || '10', 10),
    enableAI: import.meta.env.VITE_ENABLE_AI_RECOMMENDATIONS === 'true',
    defaultSources: JSON.parse(import.meta.env.VITE_DEFAULT_RECOMMENDATION_SOURCES || '[]'),
    cacheTime: parseInt(import.meta.env.VITE_RECOMMENDATION_CACHE_TIME || '3600', 10)
  },
  root: new URL('.', import.meta.url).pathname
} as const;

// Rutas base
export const paths = {
  root: new URL('.', import.meta.url).pathname,
  src: new URL('../', import.meta.url).pathname,
  public: new URL('../../public/', import.meta.url).pathname,
  assets: new URL('../assets/', import.meta.url).pathname
} as const;

// Constantes de la aplicación
export const constants = {
  AUTH_TOKEN_KEY: 'auth_token',
  USER_KEY: 'current_user',
  API_TIMEOUT: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  MONGODB_NAME: import.meta.env.VITE_MONGODB_DB_NAME || 'fesc_agenda'
} as const;