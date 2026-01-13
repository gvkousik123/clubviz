import { api, handleApiResponse, handleApiError } from '../api-client';
import { ApiResponse } from '../api-types';
import axios from 'axios';

// ============================================================================
// OTP STATUS CODES & MESSAGES
// ============================================================================

const OTP_STATUS_CODES = {
  OTP_SENT: 101,
  OTP_INVALID: 102,
  OTP_EXPIRED: 103,
  EMAIL_NOT_FOUND: 104,
  MOBILE_NOT_FOUND: 105,
  SUCCESS: 100,
} as const;

const OTP_STATUS_MESSAGES = {
  OTP_SENT: 'OTP sent successfully to your email and mobile.',
  OTP_INVALID: 'Invalid OTP. Please try again.',
  OTP_EXPIRED: 'OTP has expired. Please request a new one.',
  EMAIL_NOT_FOUND: 'The provided email address is not registered.',
  MOBILE_NOT_FOUND: 'The provided mobile number is not registered.',
  OTP_VERIFIED: 'OTP verified successfully!',
  SUCCESS: 'Success',
} as const;

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
   * Send OTP using backend endpoint
   * POST /notification/api/otp/send
   * Body: { email, mobile }
   * 
   * Status Codes:
   * 101 - OTP sent successfully
   * 104 - Email not found
   * 105 - Mobile not found
   */
  static async sendOtp(
    email: string,
    mobile: string
  ): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(
        "https://clubwiz.in/notification/api/otp/send",
        null, // 🚫 No request body
        {
          params: {
            email: email.trim().toLowerCase(),
            mobile: mobile.replace(/\D/g, "").slice(-10)
          },
          headers: {
            Authorization: undefined // 🔥 VERY IMPORTANT
          }
        }
      );

      const result = handleApiResponse(response);
      const statusCode = result.returnCode || result.code;

      if (statusCode === OTP_STATUS_CODES.OTP_SENT) {
        return {
          ...result,
          success: true,
          message: OTP_STATUS_MESSAGES.OTP_SENT
        };
      }

      if (statusCode === OTP_STATUS_CODES.EMAIL_NOT_FOUND) {
        throw new Error(OTP_STATUS_MESSAGES.EMAIL_NOT_FOUND);
      }

      if (statusCode === OTP_STATUS_CODES.MOBILE_NOT_FOUND) {
        throw new Error(OTP_STATUS_MESSAGES.MOBILE_NOT_FOUND);
      }

      return {
        ...result,
        success: true
      };

    } catch (error) {
      console.error("❌ Send OTP error:", error);
      throw new Error(handleApiError(error));
    }
  }
  /**
   * Validate OTP using backend endpoint
   * POST /notification/api/otp/validate
   * Body: { email, otp }
   * 
   * Status Codes:
   * 100 - OTP verified successfully
   * 102 - Invalid OTP
   * 103 - OTP expired
   * 104 - Email not found
   */
  static async validateOtp(email: string, otp: string): Promise<ApiResponse<any>> {
    try {
      console.log(`📡 Calling validateOtp for ${email} with OTP ${otp}`);
      const response = await api.post(`https://clubwiz.in/notification/api/otp/validate`, null, {
        params: {
          email: email.trim().toLowerCase(),
          otp: parseInt(otp, 10)
        }
      });
      const result = handleApiResponse(response);

      // Handle different status codes
      const statusCode = result.returnCode || result.code;

      if (statusCode === OTP_STATUS_CODES.SUCCESS || statusCode === 100) {
        console.log('✅ OTP verified successfully:', OTP_STATUS_MESSAGES.OTP_VERIFIED);
        return { ...result, success: true, message: OTP_STATUS_MESSAGES.OTP_VERIFIED };
      } else if (statusCode === OTP_STATUS_CODES.OTP_INVALID) {
        throw new Error(OTP_STATUS_MESSAGES.OTP_INVALID);
      } else if (statusCode === OTP_STATUS_CODES.OTP_EXPIRED) {
        throw new Error(OTP_STATUS_MESSAGES.OTP_EXPIRED);
      } else if (statusCode === OTP_STATUS_CODES.EMAIL_NOT_FOUND) {
        throw new Error(OTP_STATUS_MESSAGES.EMAIL_NOT_FOUND);
      }

      return result;
    } catch (error) {
      console.error('❌ Validate OTP error:', error);
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