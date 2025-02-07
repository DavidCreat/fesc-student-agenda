/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_AUTH_API_URL: string
  readonly VITE_SERVER_URL: string
  readonly VITE_HUGGINGFACE_API_URL: string
  readonly HUGGINGFACE_TOKEN: string
  readonly VITE_INSTITUTIONAL_EMAIL_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
