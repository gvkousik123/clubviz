import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { STORAGE_KEYS } from './constants/storage';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://clubwiz.in/api';
const API_TIMEOUT = 15000; // 15 seconds

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get auth token from localStorage or your preferred storage
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.accessToken) : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log all requests for debugging
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      headers: config.headers,
      data: config.data,
      hasToken: !!token,
    });

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log all successful responses for debugging
    console.log(`✅ API Response: ${response.status} ${response.config.url}`, {
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    // Log all errors for debugging
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Handle common HTTP errors - no automatic redirects
    if (error.response?.status === 401) {
      // Unauthorized - clear token but don't redirect
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.accessToken);
        console.warn('Token expired - user should re-authenticate');
      }
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    } else if (error.response?.status >= 500) {
      // Server errors
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  // GET request
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },

  // POST request
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },

  // PUT request
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },

  // PATCH request
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },

  // DELETE request
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },
};

// Utility functions for handling responses
export const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default apiClient;