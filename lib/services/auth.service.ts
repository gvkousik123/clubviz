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
import { UsersService } from './users.service';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const storeAuthSession = (data: any) => {
  if (typeof window === 'undefined') return;

  // Store the entire auth response as-is
  if (data) {
    // Extract token from different possible locations
    let tokenToStore = data.accessToken || data.token;

    // Store accessToken for API client interceptor
    if (tokenToStore) {
      localStorage.setItem(STORAGE_KEYS.accessToken, tokenToStore);
    }

    // Prepare the user data to store
    let userDataToStore = data;

    // If data has a 'user' property, merge it with other properties to preserve roles
    if (data.user && typeof data.user === 'object') {
      userDataToStore = {
        ...data,
        ...data.user,
        // Ensure token is always included
        accessToken: tokenToStore,
        token: tokenToStore,
      };
    } else if (!data.roles && data.token) {
      // If no roles in the response but we have a token, it might be in a nested structure
      // Just ensure we're storing what we have
      userDataToStore = {
        ...data,
        accessToken: tokenToStore,
      };
    }

    // Store the complete auth data
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userDataToStore));
  }
};

const clearAuthSession = () => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.user);
};

// ============================================================================
// AUTH SERVICE
// NOTE: Core auth methods now delegate to UsersService (https://clubwiz.in/users/)
// ============================================================================

export class AuthService {

  // --------------------------------------------------------------------------
  // 1. SIGN IN (Login with Email/Username & Password)
  // Endpoint: POST /auth/signin (Users Service - https://clubwiz.in/users/)
  // --------------------------------------------------------------------------
  static async signIn(usernameOrEmail: string, password: string): Promise<any> {
    try {
      const result = await UsersService.signIn({
        usernameOrEmail,
        password
      });

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Login successful'
        };
      }
      throw new Error(result.error || 'Login failed');
    } catch (error: any) {
      const errorMessage = error.message || handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  // --------------------------------------------------------------------------
  // 2. SIGN UP (Register new user)
  // Endpoint: POST /auth/signup (Users Service - https://clubwiz.in/users/)
  // --------------------------------------------------------------------------
  static async signUp(fullName: string, email: string, password: string, phoneNumber: string): Promise<any> {
    try {
      const result = await UsersService.signUp({
        fullName,
        email,
        password,
        mobileNumber: phoneNumber
      });

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: result.message || 'User registered successfully!'
        };
      }
      throw new Error(result.error || 'Registration failed');
    } catch (error: any) {
      const errorMessage = error.message || handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  // --------------------------------------------------------------------------
  // Endpoint: POST /auth/refresh (Users Service - https://clubwiz.in/users/)
  // --------------------------------------------------------------------------
  static async refreshToken(refreshToken: string): Promise<any> {
    try {
      const result = await UsersService.refreshToken(refreshToken);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Token refreshed successfully'
        };
      }
      throw new Error(result.error || 'Token refresh failed');
    } catch (error: any) {
      const errorMessage = error.message || handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  // --------------------------------------------------------------------------
  // 4. LOGOUT
  // Endpoint: POST /auth/logout (Users Service - https://clubwiz.in/users/)
  // --------------------------------------------------------------------------
  static async logout(): Promise<any> {
    try {
      const result = await UsersService.logout();

      return {
        success: true,
        data: result,
        message: result.message || 'User logged out successfully!'
      };
    } catch (error: any) {
      // Clear session even if API call fails
      clearAuthSession();
      const errorMessage = error.message || handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  // --------------------------------------------------------------------------
  // 5. GET USER ROLES
  // Endpoint: GET /auth/users/{username}/roles (Users Service - https://clubwiz.in/users/)
  // --------------------------------------------------------------------------
  static async getUserRoles(username: string): Promise<any> {
    try {
      const result = await UsersService.getUserRoles(username);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Roles fetched successfully'
        };
      }
      throw new Error(result.error || 'Failed to fetch roles');
    } catch (error: any) {
      const errorMessage = error.message || handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  // --------------------------------------------------------------------------
  // 6. GET ACTIVE SESSIONS
  // Endpoint: GET /auth/sessions (Users Service - https://clubwiz.in/users/)
  // --------------------------------------------------------------------------
  static async getActiveSessions(): Promise<any> {
    try {
      const result = await UsersService.getActiveSessions();

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Sessions fetched successfully'
        };
      }
      throw new Error(result.error || 'Failed to fetch sessions');
    } catch (error: any) {
      const errorMessage = error.message || handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  // --------------------------------------------------------------------------
  // 7. REVOKE ALL SESSIONS (Logout from all devices) - MOVED TO BOTTOM
  // 8. REVOKE SESSION BY ID - MOVED TO BOTTOM
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // LEGACY/BACKWARD COMPATIBILITY METHODS
  // --------------------------------------------------------------------------

  /**
   * @deprecated Use signIn instead
   */
  static async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const usernameOrEmail = data.usernameOrEmail || data.email || data.phone || '';
      const password = data.password || '';

      const result = await this.signIn(usernameOrEmail, password);

      return {
        success: result.success,
        message: result.message,
        data: {
          token: result.data?.accessToken || '',
          refreshToken: result.data?.refreshToken || '',
          expiresIn: result.data?.expiresIn,
          user: result.data?.user,
          raw: result.data
        }
      } as ApiResponse<AuthResponse>;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * @deprecated Use signUp instead
   */
  static async register(data: RegisterRequest): Promise<ApiResponse<any>> {
    try {
      const result = await this.signUp(
        data.fullName,
        data.email,
        data.password,
        data.phoneNumber
      );

      return {
        success: result.success,
        message: result.message,
        data: result.data
      } as ApiResponse<any>;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // OTP methods - keeping as is since they're not in the API documentation
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

  static async loginWithOTP(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login-otp', data);
      const result = handleApiResponse(response);

      if (result) {
        storeAuthSession(result);
      }

      return {
        success: true,
        message: 'OTP login successful',
        data: result as any
      } as ApiResponse<AuthResponse>;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // --------------------------------------------------------------------------
  // UTILITY METHODS
  // --------------------------------------------------------------------------

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;

    // First check direct token storage
    let token = localStorage.getItem(STORAGE_KEYS.accessToken);

    // If no direct token, check user data object
    if (!token) {
      try {
        const userStr = localStorage.getItem(STORAGE_KEYS.user);
        if (userStr) {
          const userData = JSON.parse(userStr);
          token = userData.accessToken;
        }
      } catch (error) {
        console.error('Error parsing user data for auth check:', error);
      }
    }

    console.log('🔍 AuthService.isAuthenticated check:', !!token);
    return !!token;
  }

  /**
   * Get stored auth token
   */
  static getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;

    return localStorage.getItem(STORAGE_KEYS.accessToken);
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
   * Get user roles from stored auth data
   */
  static getUserRolesFromStorage(): string[] {
    const user: any = this.getStoredUser();
    return user?.roles || [];
  }

  /**
   * Check if user has specific role
   */
  static hasRole(role: string): boolean {
    const roles = this.getUserRolesFromStorage();
    return roles.includes(role);
  }

  /**
   * Get the highest priority route based on user roles
   */
  static getRouteBasedOnRoles(): string {
    const roles = this.getUserRolesFromStorage();

    // Priority order: SUPERADMIN > ADMIN > USER
    if (roles.includes('ROLE_SUPERADMIN')) {
      return '/superadmin';
    }

    if (roles.includes('ROLE_ADMIN')) {
      return '/admin';
    }

    if (roles.includes('ROLE_USER')) {
      return '/home';
    }

    // Default fallback
    return '/home';
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
  // Uses Users Service - https://clubwiz.in/users/
  // ============================================================================

  /**
   * Add role to user (Admin only)
   * POST /auth/roles/{username}/add/{role} (Users Service)
   * 
   * Adds a specific role to a user account
   * 
   * @param username - The username of the user
   * @param role - The role to add (e.g., 'ADMIN', 'USER', 'MODERATOR')
   * @returns Success response
   */
  static async addRoleToUser(username: string, role: string): Promise<ApiResponse<any>> {
    try {
      const result = await UsersService.addRoleToUser(username, role);
      return {
        success: result.success,
        message: result.message,
        data: null
      } as ApiResponse<any>;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : handleApiError(error));
    }
  }

  /**
   * Remove role from user (Admin only)
   * POST /auth/roles/{username}/remove/{role} (Users Service)
   * 
   * Removes a specific role from a user account
   * 
   * @param username - The username of the user
   * @param role - The role to remove
   * @returns Success response
   */
  static async removeRoleFromUser(username: string, role: string): Promise<ApiResponse<any>> {
    try {
      const result = await UsersService.removeRoleFromUser(username, role);
      return {
        success: result.success,
        message: result.message,
        data: null
      } as ApiResponse<any>;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : handleApiError(error));
    }
  }

  // ============================================================================
  // UTILITY / TEST ENDPOINTS
  // ============================================================================

  /**
   * Test authentication endpoint
   * GET /auth/test-auth (Users Service)
   * 
   * Public test endpoint to verify API is working
   */
  static async testAuth(): Promise<ApiResponse<{ message: string }>> {
    try {
      const result = await UsersService.testAuth();
      return {
        success: result.success,
        message: result.message || 'Authenticated',
        data: result.data as any
      } as ApiResponse<{ message: string }>;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : handleApiError(error));
    }
  }

  // ============================================================================
  // ROLE MANAGEMENT (Using Users Service)
  // ============================================================================

  /**
   * Add role to user
   * POST /auth/roles/{username}/add/{role} (Users Service)
   */
  static async addUserRole(username: string, role: string): Promise<ApiResponse<void>> {
    try {
      const result = await UsersService.addRoleToUser(username, role);
      return {
        success: result.success,
        message: result.message,
        data: undefined
      } as ApiResponse<void>;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : handleApiError(error));
    }
  }

  /**
   * Remove role from user
   * POST /auth/roles/{username}/remove/{role} (Users Service)
   */
  static async removeUserRole(username: string, role: string): Promise<ApiResponse<void>> {
    try {
      const result = await UsersService.removeRoleFromUser(username, role);
      return {
        success: result.success,
        message: result.message,
        data: undefined
      } as ApiResponse<void>;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : handleApiError(error));
    }
  }

  // ============================================================================
  // GOOGLE AUTHENTICATION
  // ============================================================================

  /**
   * Google Sign-In
   * POST /auth/google
   */
  static async googleSignIn(idToken: string): Promise<any> {
    try {
      const response = await api.post('/auth/google', { idToken });
      const result = handleApiResponse(response);

      if (result.success && result.data) {
        storeAuthSession(result.data);
      }

      return result;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // ============================================================================
  // ENHANCED SESSION MANAGEMENT (Using Users Service)
  // ============================================================================

  /**
   * Revoke all sessions (logout from all devices)
   * DELETE /auth/sessions (Users Service)
   */
  static async revokeAllSessions(): Promise<ApiResponse<void>> {
    try {
      const result = await UsersService.logoutFromAllDevices();
      return {
        success: result.success,
        message: result.message,
        data: undefined
      } as ApiResponse<void>;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : handleApiError(error));
    }
  }

  /**
   * Revoke specific session by ID  
   * DELETE /auth/sessions/{id} (Users Service)
   */
  static async revokeSessionById(sessionId: string): Promise<ApiResponse<void>> {
    try {
      const result = await UsersService.revokeSession(sessionId);
      return {
        success: result.success,
        message: result.message,
        data: undefined
      } as ApiResponse<void>;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : handleApiError(error));
    }
  }

  /**
   * Get CORS origins
   * GET /auth/cors-origins
   */
  static async getCorsOrigins(): Promise<ApiResponse<string[]>> {
    try {
      const response = await api.get<ApiResponse<string[]>>('/auth/cors-origins');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // --------------------------------------------------------------------------
  // GOOGLE AUTHENTICATION
  // --------------------------------------------------------------------------

}