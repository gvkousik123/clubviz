import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { STORAGE_KEYS } from './constants/storage';
import { ApiResponse } from './api-types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://clubwiz.in';
const API_TIMEOUT = 30000; // 30 seconds (increased for event creation/update operations)

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

    if (token && token !== 'null' && token !== 'undefined') {
      // Ensure the token doesn't already have the prefix (rare but possible with some libraries)
      const authValue = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = authValue;
    }

    // Log all requests for debugging (disabled in production)
    // console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
    //   headers: config.headers,
    //   data: config.data,
    //   hasToken: !!token,
    // });

    return config;
  },
  (error) => {
    // console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Helper function to handle JWT token expiration or unauthorized/forbidden access
const handleForcedLogout = (showToast = true) => {
  if (typeof window !== 'undefined') {
    // Clear profile cache
    try {
      const ProfileService = require('./services/profile.service').ProfileService;
      ProfileService.clearProfileCache();
    } catch (err) {
      // Fail silently
    }

    // Clear all auth-related localStorage
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.userDetails);
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem('userRoles');

    // Clear all clubviz- and user- prefixed keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('clubviz-') || key.startsWith('user-')) {
        localStorage.removeItem(key);
      }
    });

    if (showToast) {
      // Show toast via a custom event (picked up by the app)
      window.dispatchEvent(new CustomEvent('clubviz-force-logout', {
        detail: { message: 'Session expired. Please login again.' }
      }));
    }

    // Redirect to login
    window.location.href = '/auth/mobile';
  }
};

// Helper function to refresh the access token
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.refreshToken) : null;

  if (!refreshToken) {
    return null;
  }

  try {
    // Users service refresh endpoint
    const response = await axios.post(`${API_BASE_URL}/users/auth/refresh`, {
      refreshToken
    });

    const { accessToken } = response.data;
    if (accessToken) {
      localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
      // Also store new refresh token if returned
      if (response.data.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.refreshToken, response.data.refreshToken);
      }
      return accessToken;
    }
    return null;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return null;
  }
};

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log all successful responses for debugging (disabled in production)
    // console.log(`✅ API Response: ${response.status} ${response.config.url}`, {
    //   data: response.data,
    //   headers: response.headers,
    // });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 (Unauthorized) - try to refresh token first
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If token is already being refreshed, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Token refreshed successfully, retry the original request
          isRefreshing = false;
          processQueue(null, newToken);
          originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
          return apiClient(originalRequest);
        } else {
          // Failed to refresh token - force logout with toast
          isRefreshing = false;
          processQueue(error, null);
          handleForcedLogout(true);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh token failed - force logout with toast
        isRefreshing = false;
        processQueue(refreshError, null);
        handleForcedLogout(true);
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 (Forbidden) - try refresh first, then logout if still failing
    if (error.response?.status === 403 && !originalRequest._retryFor403) {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.refreshToken) : null;
      if (refreshToken) {
        originalRequest._retryFor403 = true;
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
            return apiClient(originalRequest);
          } else {
            // Refresh token exists but refresh failed - force logout with toast
            handleForcedLogout(true);
            return Promise.reject(error);
          }
        } catch (refreshError) {
          // Refresh failed - force logout with toast
          handleForcedLogout(true);
          return Promise.reject(refreshError);
        }
      } else {
        console.warn('403 Forbidden - No refresh token available');
        return Promise.reject(error);
      }
    }

    // Check for JWT token expiration in response - log it but don't force logout
    const errorMessage = error.response?.data?.error || error.response?.data?.message || '';
    if (
      errorMessage.toLowerCase().includes('jwt token is expired') ||
      errorMessage.toLowerCase().includes('jwt token expired') ||
      errorMessage.toLowerCase().includes('token is expired') ||
      errorMessage.toLowerCase().includes('invalid token')
    ) {
      console.warn('JWT token issue detected:', errorMessage);
      // Don't force logout - let the user continue browsing
      // Protected pages will handle authentication as needed
      return Promise.reject(error);
    }

    // Handle other HTTP errors
    if (error.response?.status >= 500) {
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
export const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> => {
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