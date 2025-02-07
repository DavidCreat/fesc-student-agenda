const getEnvVar = (key: string, defaultValue?: string): string => {
  if (typeof window === 'undefined') {
    return defaultValue || '';
  }
  return (import.meta.env[key] as string) || defaultValue || '';
};

export const clientConfig = {
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:5000/api'),
  huggingFaceToken: getEnvVar('VITE_HUGGINGFACE_TOKEN'),
  authApiUrl: `${getEnvVar('VITE_API_BASE_URL', 'http://localhost:5000/api')}/auth`,
  serverUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:5000/api').replace('/api', ''),
  recommendations: {
    perPage: Number(getEnvVar('VITE_RECOMMENDATIONS_PER_PAGE', '10')),
    enableAI: getEnvVar('VITE_ENABLE_AI_RECOMMENDATIONS', 'true') === 'true',
    defaultSources: ['FESC Library', 'Academic Databases', 'Online Courses', 'Research Papers'],
    cacheTime: 3600
  }
} as const;

export const clientConstants = {
  AUTH_TOKEN_KEY: 'auth_token',
  USER_KEY: 'user',
  API_TIMEOUT: 15000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
} as const; 