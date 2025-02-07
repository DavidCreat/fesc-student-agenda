/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_HUGGINGFACE_TOKEN: string
  readonly VITE_MODE: 'development' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 