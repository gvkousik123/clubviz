import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  onAuthStateChanged,
  User,
  signOut
} from "firebase/auth";
import { auth } from "./config";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export class FirebasePhoneAuth {
  private static instance: FirebasePhoneAuth;

  static getInstance(): FirebasePhoneAuth {
    if (!FirebasePhoneAuth.instance) {
      FirebasePhoneAuth.instance = new FirebasePhoneAuth();
    }
    return FirebasePhoneAuth.instance;
  }

  /**
   * Setup reCAPTCHA verifier
   * @param containerId - The ID of the DOM element where reCAPTCHA will be rendered
   * @param size - 'invisible' or 'normal'
   */
  setupRecaptcha(containerId: string = 'recaptcha-container', size:  'normal' ): void {
    try {
      // Clear existing verifier
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }

      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: size,
        callback: (response: any) => {
          console.log("reCAPTCHA verified", response);
        },
        'expired-callback': () => {
          console.log("reCAPTCHA expired");
        }
      });

      console.log("reCAPTCHA setup complete");
    } catch (error) {
      console.error("Error setting up reCAPTCHA:", error);
      throw error;
    }
  }

  /**
   * Send OTP to phone number
   * @param phoneNumber - Phone number in international format (e.g., +91xxxxxxxxxx)
   * @returns Promise<boolean> - Success status
   */
  async sendOTP(phoneNumber: string): Promise<boolean> {
    try {
      if (!phoneNumber.startsWith('+')) {
        throw new Error('Phone number must be in international format (e.g., +91xxxxxxxxxx)');
      }

      if (!window.recaptchaVerifier) {
        this.setupRecaptcha();
      }

      const appVerifier = window.recaptchaVerifier;
      
      console.log("Sending OTP to:", phoneNumber);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      
      window.confirmationResult = confirmationResult;
      
      console.log("OTP sent successfully");
      return true;
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
      
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Verify OTP entered by user
   * @param otp - 6-digit OTP code
   * @returns Promise<User> - Firebase user object
   */
  async verifyOTP(otp: string): Promise<User> {
    try {
      if (!window.confirmationResult) {
        throw new Error('No OTP session found. Please request OTP again.');
      }

      // Validate OTP format
      if (!/^\d{6}$/.test(otp)) {
        throw new Error('OTP must be 6 digits');
      }

      console.log("Verifying OTP:", otp);
      const result = await window.confirmationResult.confirm(otp);
      
      console.log("OTP verified successfully, user:", result.user.phoneNumber);
      return result.user;
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Set up auth state listener
   * @param callback - Function to call when auth state changes
   * @returns Function to unsubscribe from auth state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Clean up reCAPTCHA verifier
   */
  cleanup(): void {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = undefined;
    }
    window.confirmationResult = undefined;
  }

  /**
   * Convert Firebase error codes to user-friendly messages
   */
  private getErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/invalid-phone-number':
        return 'Invalid phone number format. Please use international format (e.g., +91xxxxxxxxxx)';
      case 'auth/missing-phone-number':
        return 'Phone number is required';
      case 'auth/quota-exceeded':
        return 'SMS quota exceeded. Please try again later';
      case 'auth/user-disabled':
        return 'This phone number has been disabled';
      case 'auth/operation-not-allowed':
        return 'Phone authentication is not enabled for this project';
      case 'auth/invalid-verification-code':
        return 'Invalid OTP code. Please check and try again';
      case 'auth/invalid-verification-id':
        return 'Invalid verification session. Please request OTP again';
      case 'auth/code-expired':
        return 'OTP code has expired. Please request a new one';
      case 'auth/captcha-check-failed':
        return 'reCAPTCHA verification failed. Please try again';
      case 'auth/too-many-requests':
        return 'Too many requests. Please wait before trying again';
      default:
        return error.message || 'An unexpected error occurred. Please try again';
    }
  }
}

// Export singleton instance
export const firebasePhoneAuth = FirebasePhoneAuth.getInstance();