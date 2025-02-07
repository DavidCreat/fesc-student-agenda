import axios, { AxiosError, AxiosInstance } from 'axios';
import { clientConfig, clientConstants } from '../config/client-config.js';

class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: clientConfig.apiBaseUrl,
      timeout: clientConstants.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(clientConstants.AUTH_TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem(clientConstants.AUTH_TOKEN_KEY);
          localStorage.removeItem(clientConstants.USER_KEY);
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

export const apiService = ApiService.getInstance();
export const api = apiService.getAxiosInstance();