import { api, handleApiResponse, handleApiError } from '../api-client';
import { ApiResponse } from '../api-types';
import axios from 'axios';

// ============================================================================
// MOBILE AUTH SERVICE TYPES
// ============================================================================

export interface FirebaseTokenRequest {
  token: string;
}

export interface FirebaseTokenResponse {
  // For existing users (successful login)
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    phoneNumber: string;
    isVerified: boolean;
  };
  // For new users (user not found - only mobile number returned)
  mobileNumber?: string;
  // Flag to indicate if user exists
  existingUser?: boolean;
}

export interface CompleteRegistrationRequest {
  mobileNumber: string;
  fullName: string;
  email: string;
}

export interface CompleteRegistrationResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    isVerified: boolean;
  };
}

export interface SendOTPRequest {
  phoneNumber: string;
}

export interface SendOTPResponse {
  message: string;
  sessionId: string;
  expiryTime: string;
}

// ============================================================================
// MOBILE AUTH SERVICE
// ============================================================================

/**
 * Mobile Authentication Service
 * Handles Firebase-based mobile authentication and OTP operations
 */
export class MobileAuthService {

  // ============================================================================
  // FIREBASE AUTHENTICATION
  // ============================================================================

  /**
   * Verify Firebase token and authenticate user
   * POST /auth/mobile/verify-firebase-token
   */
  static async verifyFirebaseToken(firebaseToken: string): Promise<ApiResponse<FirebaseTokenResponse>> {
    try {
      // Use the standard API client with correct base URL
      const response = await api.post<ApiResponse<FirebaseTokenResponse>>(
        '/auth/mobile/verify-firebase-token',
        { idToken: firebaseToken }
      );

      const result = handleApiResponse(response);

      // Store auth session if verification successful
      if (result.success && result.data) {
        // Store the access token for API client interceptor
        if (result.data.accessToken) {
          localStorage.setItem('clubviz-accessToken', result.data.accessToken);
        }

        // Store complete auth data
        localStorage.setItem('clubviz-user', JSON.stringify(result.data));
      }

      return result;
    } catch (error) {
      console.error('Firebase token verification error:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Complete registration for new users after mobile verification
   * POST /auth/mobile/complete-registration
   */
  static async completeRegistration(data: CompleteRegistrationRequest): Promise<ApiResponse<CompleteRegistrationResponse>> {
    try {
      const response = await api.post<ApiResponse<CompleteRegistrationResponse>>(
        '/auth/mobile/complete-registration',
        data
      );

      const result = handleApiResponse(response);

      // Store auth session if registration successful
      if (result.success && result.data) {
        // Store the access token for API client interceptor
        if (result.data.accessToken) {
          localStorage.setItem('clubviz-accessToken', result.data.accessToken);
        }

        // Store complete auth data
        localStorage.setItem('clubviz-user', JSON.stringify(result.data));
      }

      return result;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // ============================================================================
  // OTP OPERATIONS
  // ============================================================================

  /**
   * Send OTP to mobile number
   * POST /auth/password-reset/initiate/mobile
   */
  static async sendMobileOTP(mobileNumber: string): Promise<ApiResponse<SendOTPResponse>> {
    try {
      const response = await api.post<ApiResponse<SendOTPResponse>>(
        '/auth/password-reset/initiate/mobile',
        { mobileNumber }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Send OTP to email
   * POST /auth/password-reset/initiate/email
   */
  static async sendEmailOTP(email: string): Promise<ApiResponse<SendOTPResponse>> {
    try {
      const response = await api.post<ApiResponse<SendOTPResponse>>(
        '/auth/password-reset/initiate/email',
        { email }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Verify OTP for password reset
   * POST /auth/password-reset/verify/token
   */
  static async verifyPasswordResetToken(token: string, otp: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post<ApiResponse<any>>(
        '/auth/password-reset/verify/token',
        { token, otp }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Complete password reset with OTP
   * POST /auth/password-reset/reset/mobile
   */
  static async resetPasswordWithOTP(mobileNumber: string, otp: string, newPassword: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post<ApiResponse<any>>(
        '/auth/password-reset/reset/mobile',
        { mobileNumber, otp, newPassword }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Validate phone number format
   */
  static isValidPhoneNumber(phoneNumber: string): boolean {
    // Basic validation for international phone numbers
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber.replace(/\s+/g, ''));
  }

  /**
   * Format phone number for display
   */
  static formatPhoneNumber(phoneNumber: string): string {
    // Remove non-digit characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');

    // Add + if not present and not empty
    if (cleaned && !cleaned.startsWith('+')) {
      return '+' + cleaned;
    }

    return cleaned;
  }

  /**
   * Clear mobile auth session
   */
  static clearMobileAuthSession(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('firebaseToken');
  }
}