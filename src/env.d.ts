/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_HUGGINGFACE_TOKEN: string
  readonly VITE_RECOMMENDATIONS_PER_PAGE?: string
  readonly VITE_ENABLE_AI_RECOMMENDATIONS?: string
  // más variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 