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
import { STORAGE_KEYS } from '../constants/storage';

const storeAuthSession = (data: Partial<AuthResponse>) => {
  if (typeof window === 'undefined') return;

  if (data?.token) {
    localStorage.setItem(STORAGE_KEYS.accessToken, data.token);
  }

  if (data?.refreshToken) {
    localStorage.setItem(STORAGE_KEYS.refreshToken, data.refreshToken);
  }

  if (data?.user) {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
  }
};

const clearAuthSession = () => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.user);
};

const normalizeAuthResult = (payload: any, fallbackMessage: string): ApiResponse<AuthResponse> => {
  const rawData = payload?.data ?? payload;
  const token = rawData?.token ?? rawData?.accessToken ?? payload?.token ?? payload?.accessToken;
  const refreshToken = rawData?.refreshToken ?? rawData?.refresh_token ?? payload?.refreshToken ?? payload?.refresh_token;
  const user = rawData?.user ?? payload?.user;
  const expiresIn = rawData?.expiresIn ?? payload?.expiresIn;

  const hasToken = typeof token === 'string' && token.length > 0;
  const declaredSuccess = typeof payload?.success === 'boolean' ? payload.success : undefined;
  const success = declaredSuccess !== undefined ? declaredSuccess && hasToken : hasToken;
  const message = payload?.message ?? (success ? 'Login successful' : fallbackMessage);

  const data: AuthResponse = {
    token: token ?? '',
    refreshToken: refreshToken ?? '',
    expiresIn,
    user,
    raw: rawData,
  };

  return {
    success,
    message,
    data,
    errors: payload?.errors,
  } as ApiResponse<AuthResponse>;
};

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
   * Login user with username/email and password
   */
  static async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const payload: any = {
        usernameOrEmail: data.usernameOrEmail || data.email || data.phone,
        password: data.password
      };

      if (!payload.usernameOrEmail) {
        throw new Error('Username, email or phone is required for login');
      }

      if (!payload.password) {
        throw new Error('Password is required for login');
      }

      const response = await api.post<ApiResponse<AuthResponse>>('/auth/signin', payload);
      const result = normalizeAuthResult(handleApiResponse(response), 'Login failed. Please try again.');

      if (result.success) {
        storeAuthSession(result.data);
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
      const result = normalizeAuthResult(handleApiResponse(response), 'OTP login failed. Please try again.');

      if (result.success) {
        storeAuthSession(result.data);
      }

      return result;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Register new user
   */
  static async register(data: RegisterRequest): Promise<ApiResponse<any>> {
    try {
      const response = await api.post<ApiResponse<any>>('/auth/signup', data);
      const result = handleApiResponse(response);
      
      // Registration doesn't return token - user needs to login after signup
      // Tokens are only stored after successful login
      
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

      clearAuthSession();

      return handleApiResponse(response);
    } catch (error) {
      clearAuthSession();

      throw new Error(handleApiError(error));
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<ApiResponse<AuthResponse>>(
        '/auth/refresh',
        { refreshToken }
      );
      
      const result = normalizeAuthResult(handleApiResponse(response), 'Token refresh failed. Please login again.');

      if (result.success) {
        storeAuthSession(result.data);
      } else {
        clearAuthSession();
      }
      
      return result;
    } catch (error) {
      clearAuthSession();

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
        storeAuthSession({ user: result.data });
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

  // ============================================================================
  // FIREBASE MOBILE AUTH ENDPOINTS
  // ============================================================================

  static async verifyFirebaseToken(idToken: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post<ApiResponse<any>>(
        '/auth/mobile/verify-firebase-token',
        { idToken }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async sendMobileOTP(mobileNumber: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post<ApiResponse<any>>(
        '/auth/mobile/send-otp',
        { mobileNumber }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // ============================================================================
  // PASSWORD RESET ENDPOINTS
  // ============================================================================

  static async initiatePasswordResetMobile(mobileNumber: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post<ApiResponse<any>>(
        '/auth/password-reset/initiate/mobile',
        { mobileNumber }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async initiatePasswordResetEmail(email: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post<ApiResponse<any>>(
        '/auth/password-reset/initiate/email',
        { email }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async verifyPasswordResetToken(token: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post<ApiResponse<any>>(
        '/auth/password-reset/verify/token',
        { token }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async verifyPasswordResetOTP(mobileNumber: string, otp: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post<ApiResponse<any>>(
        '/auth/password-reset/verify/otp',
        { mobileNumber, otp }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async resetPasswordWithToken(token: string, newPassword: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post<ApiResponse<any>>(
        '/auth/password-reset/reset/token',
        { token, newPassword }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async resetPasswordWithMobile(mobileNumber: string, newPassword: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post<ApiResponse<any>>(
        '/auth/password-reset/reset/mobile',
        { mobileNumber, newPassword }
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
    
    const token = localStorage.getItem(STORAGE_KEYS.accessToken);
    return !!token;
  }

  /**
   * Get stored user data
   */
  static getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    
  const userStr = localStorage.getItem(STORAGE_KEYS.user);
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
    
  return localStorage.getItem(STORAGE_KEYS.accessToken);
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
      
      clearAuthSession();
      
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // ============================================================================
  // USER ROLE MANAGEMENT ENDPOINTS (Admin Only)
  // ============================================================================

  /**
   * Add role to user (Admin only)
   * POST /auth/roles/{username}/add/{role}
   * 
   * Adds a specific role to a user account
   * 
   * @param username - The username of the user
   * @param role - The role to add (e.g., 'ADMIN', 'USER', 'MODERATOR')
   * @returns Success response
   */
  static async addRoleToUser(username: string, role: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post<ApiResponse<any>>(
        `/auth/roles/${username}/add/${role}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Remove role from user (Admin only)
   * POST /auth/roles/{username}/remove/{role}
   * 
   * Removes a specific role from a user account
   * 
   * @param username - The username of the user
   * @param role - The role to remove
   * @returns Success response
   */
  static async removeRoleFromUser(username: string, role: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post<ApiResponse<any>>(
        `/auth/roles/${username}/remove/${role}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user roles
   * GET /auth/users/{username}/roles
   * 
   * Retrieves all roles assigned to a specific user
   * 
   * @param username - The username of the user
   * @returns Array of role strings
   */
  static async getUserRoles(username: string): Promise<ApiResponse<string[]>> {
    try {
      const response = await api.get<ApiResponse<string[]>>(
        `/auth/users/${username}/roles`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // ============================================================================
  // UTILITY / TEST ENDPOINTS
  // ============================================================================

  /**
   * Test authentication endpoint
   * GET /auth/test
   * 
   * Public test endpoint to verify API is working
   */
  static async testAuth(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.get<ApiResponse<{ message: string }>>(
        '/auth/test'
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}