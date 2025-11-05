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
   * Setup reCAPTCHA verifier following best practices from useful.md
   * @param containerId - The ID of the DOM element where reCAPTCHA will be rendered
   * @param size - 'invisible' or 'normal'
   */
  async setupRecaptcha(
    containerId: string = "recaptcha-container",
    size: "normal" | "invisible" = "invisible"  // Back to invisible as per best practices
  ): Promise<void> {
    try {
      // Clear existing verifier first
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }

      // Following pattern from useful.md adapted for Firebase v9+
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        containerId,
        {
          'size': size,
          'callback': (response: any) => {
            console.log("✅ reCAPTCHA solved", response);
            (window as any).recaptchaVerified = true;
          },
          'expired-callback': () => {
            console.log("⚠️ reCAPTCHA expired");
            (window as any).recaptchaVerified = false;
          },
          'error-callback': (error: any) => {
            console.error("❌ reCAPTCHA error:", error);
            (window as any).recaptchaVerified = false;
          }
        }
      );

      console.log("🔥 reCAPTCHA verifier created successfully");
    } catch (error) {
      console.error("❌ Error setting up reCAPTCHA:", error);
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          // Ignore cleanup errors
        }
        window.recaptchaVerifier = undefined;
      }
      throw error;
    }
  }

  /**
   * Send OTP to a phone number - Following pattern from useful.md
   * @param phoneNumber - Phone number in international format (e.g. +91xxxxxxxxxx)
   * @returns Promise<boolean>
   */
  async sendOTP(phoneNumber: string): Promise<boolean> {
    try {
      if (!phoneNumber.startsWith("+")) {
        throw new Error("Phone number must be in international format (e.g. +91xxxxxxxxxx)");
      }

      // Ensure reCAPTCHA is set up before sending OTP
      if (!window.recaptchaVerifier) {
        console.log("🔄 Setting up reCAPTCHA verifier...");
        await this.setupRecaptcha();
      }

      console.log("📱 Sending OTP to:", phoneNumber);

      // Following exact pattern from useful.md
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      
      // Store confirmation result for OTP verification
      window.confirmationResult = confirmationResult;
      
      console.log("✅ OTP sent successfully!");
      return true;
    } catch (error: any) {
      console.error("❌ Error sending OTP:", error);

      // Clean up reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }

      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Verify OTP entered by user
   * @param otp - 6-digit OTP
   * @returns Promise<User>
   */
  async verifyOTP(otp: string): Promise<User> {
    try {
      if (!window.confirmationResult) {
        throw new Error("No OTP session found. Please request OTP again.");
      }

      if (!/^\d{6}$/.test(otp)) {
        throw new Error("OTP must be 6 digits");
      }

      console.log("Verifying OTP:", otp);
      const result = await window.confirmationResult.confirm(otp);
      console.log("OTP verified successfully for user:", result.user.phoneNumber);

      return result.user;
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Auth state listener
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Sign out user
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
   * Get current logged-in user
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Clean up recaptcha verifier
   */
  cleanup(): void {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = undefined;
    }
    window.confirmationResult = undefined;
  }

  /**
   * Convert Firebase errors to friendly messages
   */
  private getErrorMessage(error: any): string {
    switch (error.code) {
      case "auth/invalid-phone-number":
        return "Invalid phone number format. Please use international format (e.g. +91xxxxxxxxxx)";
      case "auth/missing-phone-number":
        return "Phone number is required";
      case "auth/quota-exceeded":
        return "SMS quota exceeded. Please try again later";
      case "auth/user-disabled":
        return "This phone number has been disabled";
      case "auth/operation-not-allowed":
        return "Phone authentication is not enabled for this project";
      case "auth/invalid-verification-code":
        return "Invalid OTP code. Please check and try again";
      case "auth/invalid-verification-id":
        return "Invalid verification session. Please request OTP again";
      case "auth/code-expired":
        return "OTP code has expired. Please request a new one";
      case "auth/captcha-check-failed":
        return "reCAPTCHA verification failed. Please complete the reCAPTCHA and try again";
      case "auth/too-many-requests":
        return "Too many requests. Please wait before trying again";
      case "auth/app-not-verified":
        return "App verification failed. This usually means reCAPTCHA needs to be completed manually";
      case "auth/missing-app-credential":
        return "App credential missing. Please refresh the page and try again";
      case "auth/invalid-app-credential":
        return "Invalid app credential. Please complete reCAPTCHA verification";
      case "auth/app-not-authorized":
        return "App not authorized for phone authentication. Check Firebase console settings";
      default:
        // Check for app credential related errors in the message
        if (error.message?.includes('app credential') || 
            error.message?.includes('app-check') ||
            error.message?.includes('attestation')) {
          return "App verification failed. Please complete reCAPTCHA and try again";
        }
        return error.message || "An unexpected error occurred. Please try again";
    }
  }
}

// Export singleton instance
export const firebasePhoneAuth = FirebasePhoneAuth.getInstance();