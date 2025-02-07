// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;
export const SERVER_URL = import.meta.env.VITE_SERVER_URL;
export const HUGGINGFACE_API_URL = import.meta.env.VITE_HUGGINGFACE_API_URL;
export const HUGGINGFACE_TOKEN = import.meta.env.HUGGINGFACE_TOKEN;

// Domain Configuration
export const INSTITUTIONAL_EMAIL_DOMAIN = import.meta.env.VITE_INSTITUTIONAL_EMAIL_DOMAIN;

// Validation Patterns
export const EMAIL_PATTERN = new RegExp(`^[a-zA-Z0-9._%+-]+@${INSTITUTIONAL_EMAIL_DOMAIN}$`); 