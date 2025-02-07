// Configuración del cliente
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  authApiUrl: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000/api/auth',
  serverUrl: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000',
  huggingfaceToken: import.meta.env.VITE_HUGGINGFACE_TOKEN,
  huggingfaceApiUrl: import.meta.env.VITE_HUGGINGFACE_API_URL,
  institutionalEmailDomain: import.meta.env.VITE_INSTITUTIONAL_EMAIL_DOMAIN,
  recommendations: {
    perPage: Number(import.meta.env.VITE_RECOMMENDATIONS_PER_PAGE || '10'),
    enableAI: import.meta.env.VITE_ENABLE_AI_RECOMMENDATIONS === 'true',
    defaultSources: ['FESC Library', 'Academic Databases', 'Online Courses', 'Research Papers'],
    cacheTime: 3600
  }
} as const;

// Constantes del cliente
export const constants = {
  AUTH_TOKEN_KEY: 'auth_token',
  USER_KEY: 'current_user',
  API_TIMEOUT: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
} as const; 