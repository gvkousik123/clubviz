import { api, handleApiResponse, handleApiError } from '../api-client';
import {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  OTPRequest,
  OTPVerifyRequest,
  AuthResponse,
  User,
} from '../api-types';

export class AuthService {
  /**
   * Send OTP for login/register/forgot password
   */
  static async sendOTP(data: OTPRequest): Promise<ApiResponse<{ otpSent: boolean; message: string }>> {
    try {
      const response = await api.post<ApiResponse<{ otpSent: boolean; message: string }>>(
        '/auth/send-otp',
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Verify OTP
   */
  static async verifyOTP(data: OTPVerifyRequest): Promise<ApiResponse<{ verified: boolean; token?: string }>> {
    try {
      const response = await api.post<ApiResponse<{ verified: boolean; token?: string }>>(
        '/auth/verify-otp',
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Login user with phone and password
   */
  static async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
      const result = handleApiResponse(response);
      
      // Store token in localStorage
      if (result.success && result.data.token) {
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('refresh_token', result.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }
      
      return result;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Login user with OTP
   */
  static async loginWithOTP(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login-otp', data);
      const result = handleApiResponse(response);
      
      // Store token in localStorage
      if (result.success && result.data.token) {
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('refresh_token', result.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }
      
      return result;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Register new user
   */
  static async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const { age, ...rest } = data;
      const payload = {
        ...rest,
        age: Number(age),
      };

      const response = await api.post<ApiResponse<AuthResponse>>('/auth/signup', payload);
      const result = handleApiResponse(response);
      
      // Store token in localStorage
      if (result.success && result.data.token) {
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('refresh_token', result.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }
      
      return result;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>('/auth/logout');
      
      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      return handleApiResponse(response);
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<ApiResponse<{ token: string; refreshToken: string; expiresIn: number }>> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<ApiResponse<{ token: string; refreshToken: string; expiresIn: number }>>(
        '/auth/refresh',
        { refreshToken }
      );
      
      const result = handleApiResponse(response);
      
      // Update tokens in localStorage
      if (result.success) {
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('refresh_token', result.data.refreshToken);
      }
      
      return result;
    } catch (error) {
      // If refresh fails, clear all tokens
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/me');
      const result = handleApiResponse(response);
      
      // Update user in localStorage
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.data));
      }
      
      return result;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.put<ApiResponse<{ message: string }>>(
        '/auth/update-password',
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Forgot password - send reset OTP
   */
  static async forgotPassword(phone: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>(
        '/auth/forgot-password',
        { phone }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Reset password with OTP
   */
  static async resetPassword(data: { phone: string; otp: string; newPassword: string }): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>(
        '/auth/reset-password',
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  /**
   * Get stored user data
   */
  static getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Get stored auth token
   */
  static getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    return localStorage.getItem('auth_token');
  }

  /**
   * Verify phone number exists
   */
  static async checkPhoneExists(phone: string): Promise<ApiResponse<{ exists: boolean }>> {
    try {
      const response = await api.post<ApiResponse<{ exists: boolean }>>(
        '/auth/check-phone',
        { phone }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete user account
   */
  static async deleteAccount(password: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.delete<ApiResponse<{ message: string }>>(
        '/auth/delete-account',
        { data: { password } }
      );
      
      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}