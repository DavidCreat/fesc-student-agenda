/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NODE_ENV: string
  readonly PORT: string
  readonly FRONTEND_URL: string
  readonly MONGODB_URI: string
  readonly MONGODB_DB_NAME: string
  readonly JWT_SECRET: string
  readonly JWT_EXPIRE: string
  readonly CORS_ORIGIN: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_AUTH_API_URL: string
  readonly VITE_SERVER_URL: string
  readonly VITE_HUGGINGFACE_TOKEN: string
  readonly VITE_HUGGINGFACE_API_URL: string
  readonly VITE_INSTITUTIONAL_EMAIL_DOMAIN: string
  readonly VITE_RECOMMENDATIONS_PER_PAGE: string
  readonly VITE_ENABLE_AI_RECOMMENDATIONS: string
  readonly VITE_DEFAULT_RECOMMENDATION_SOURCES: string
  readonly VITE_RECOMMENDATION_CACHE_TIME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
