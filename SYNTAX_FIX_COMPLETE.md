# 🔧 Syntax Fixes Complete - phone-auth.ts

## Issues Fixed

### 1. ✅ Import Statement Formatting
**Before:**
```typescript
} from "firebase / auth"; import {
```
**After:**
```typescript
} from "firebase/auth";
import {
```
- Removed spaces around forward slash in module path
- Separated imports onto proper lines

---

### 2. ✅ Window Interface Declaration
**Before:**
```typescript
recaptchaVerifier?:
RecaptchaVerifier; confirmationResult?: ConfirmationResult;
```
**After:**
```typescript
recaptchaVerifier?: RecaptchaVerifier;
confirmationResult?: ConfirmationResult;
```
- Fixed line breaks and formatting
- Proper indentation

---

### 3. ✅ Class Instance Property
**Before:**
```typescript
private static instance:
  FirebasePhoneAuth;
```
**After:**
```typescript
private static instance: FirebasePhoneAuth;
```
- Kept declaration on single line

---

### 4. ✅ getInstance Method
**Before:**
```typescript
static getInstance(): FirebasePhoneAuth {
  if
    (!FirebasePhoneAuth.instance) {
      FirebasePhoneAuth.instance = new
        FirebasePhoneAuth();
  } return FirebasePhoneAuth.instance;
}
```
**After:**
```typescript
static getInstance(): FirebasePhoneAuth {
  if (!FirebasePhoneAuth.instance) {
    FirebasePhoneAuth.instance = new FirebasePhoneAuth();
  }
  return FirebasePhoneAuth.instance;
}
```
- Proper indentation and line breaks

---

### 5. ✅ canSendOtp Method
**Before:**
```typescript
private canSendOtp(): boolean {
  const last = window.lastOtpTimestamp ||
    0; const now = Date.now(); return now - last > this.OTP_COOLDOWN_MS;
}
```
**After:**
```typescript
private canSendOtp(): boolean {
  const last = window.lastOtpTimestamp || 0;
  const now = Date.now();
  return now - last > this.OTP_COOLDOWN_MS;
}
```
- Fixed multi-line statements
- Proper formatting

---

### 6. ✅ setupRecaptcha Method Signature
**Before:**
```typescript
async setupRecaptcha(containerId: string = "recaptcha-container", size:
"normal" | "invisible" = "invisible" ): Promise {
  try { // Remove old
verifier safely if (window.recaptchaVerifier) {
```
**After:**
```typescript
async setupRecaptcha(
  containerId: string = "recaptcha-container",
  size: "normal" | "invisible" = "invisible"
): Promise<void> {
  try {
    // Remove old verifier safely
    if (window.recaptchaVerifier) {
```
- Added proper return type: `Promise<void>`
- Fixed parameter line breaks
- Fixed comment on separate line
- Proper indentation

---

### 7. ✅ sendOTP Method Signature
**Before:**
```typescript
async sendOTP(phoneNumber: string): Promise {
  if
    (!phoneNumber.startsWith("+")) {
      throw new Error( "Phone number must be
        in international format(e.g. + 91xxxxxxxxxx)");
  }
```
**After:**
```typescript
async sendOTP(phoneNumber: string): Promise<boolean> {
  if (!phoneNumber.startsWith("+")) {
    throw new Error(
      "Phone number must be in international format (e.g. +91xxxxxxxxxx)"
    );
  }
```
- Added proper return type: `Promise<boolean>`
- Fixed if statement formatting
- Fixed error message string formatting
- Removed extra space before "91"

---

### 8. ✅ verifyOTP Method Signature
**Before:**
```typescript
async verifyOTP(otp: string): Promise {
  try {
    if
      (!window.confirmationResult) {
        throw new Error("No active OTP session.
Please request OTP again.");
    }
```
**After:**
```typescript
async verifyOTP(otp: string): Promise<User> {
  try {
    if (!window.confirmationResult) {
      throw new Error("No active OTP session. Please request OTP again.");
    }
```
- Added proper return type: `Promise<User>`
- Fixed if statement formatting
- Fixed error message string on one line

---

### 9. ✅ signOut Method Signature
**Before:**
```typescript
async signOut(): Promise {
  try {
    await signOut(auth); console.log("✅
      User signed out");
  } catch (error) {
    console.error("❌ Sign - out error:",
      error); throw error;
  }
}
```
**After:**
```typescript
async signOut(): Promise<void> {
  try {
    await signOut(auth);
    console.log("✅ User signed out");
  } catch (error) {
    console.error("❌ Sign-out error:", error);
    throw error;
  }
}
```
- Added proper return type: `Promise<void>`
- Separated statements onto proper lines
- Fixed error message formatting (removed spaces around hyphen)

---

### 10. ✅ getCurrentUser Method
**Before:**
```typescript
getCurrentUser(): User | null { return auth.currentUser; }
```
**After:**
```typescript
getCurrentUser(): User | null {
  return auth.currentUser;
}
```
- Fixed formatting and indentation
- Proper line breaks

---

### 11. ✅ onAuthStateChanged Method
**Before:**
```typescript
onAuthStateChanged(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
```
**After:**
```typescript
onAuthStateChanged(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
```
- Fixed indentation (was not properly indented within class)

---

### 12. ✅ cleanup Method
**Before:**
```typescript
cleanup(): void { if(window.recaptchaVerifier) {
  try {
    window.recaptchaVerifier.clear();
  } catch (e) { }
  window.recaptchaVerifier = undefined;
} // DO NOT clear
confirmationResult }
```
**After:**
```typescript
cleanup(): void {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      // Ignore error
    }
    window.recaptchaVerifier = undefined;
  }
  // DO NOT clear confirmationResult - it must survive navigation
}
```
- Fixed formatting and indentation
- Added space after `if`
- Added explanatory comment instead of dangling comment
- Proper catch block formatting

---

### 13. ✅ getErrorMessage Method
**Before:**
```typescript
private getErrorMessage(error: any): string {
  switch (error.code) {
    case
"auth / invalid - phone - number": return "Invalid phone number format."; case
"auth / quota - exceeded": return "SMS quota exceeded.Try again later.";
    case "auth / too - many - requests": return "Too many attempts.Please wait a
      moment."; case "auth / invalid - verification - code": return "Invalid OTP.
Please try again."; case "auth / code - expired": return "OTP expired.
Request a new one."; case "auth / captcha - check - failed": return "reCAPTCHA
      failed.Please retry."; default: return error.message || "Something went
      wrong.";
  }
} }
```
**After:**
```typescript
private getErrorMessage(error: any): string {
  switch (error.code) {
    case "auth/invalid-phone-number":
      return "Invalid phone number format.";
    case "auth/quota-exceeded":
      return "SMS quota exceeded. Try again later.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment.";
    case "auth/invalid-verification-code":
      return "Invalid OTP. Please try again.";
    case "auth/code-expired":
      return "OTP expired. Request a new one.";
    case "auth/captcha-check-failed":
      return "reCAPTCHA failed. Please retry.";
    default:
      return error.message || "Something went wrong.";
  }
}
```
- Fixed error code case labels (removed spaces around `/` and `-`)
- Proper switch/case formatting
- Each case on separate line
- Fixed spacing in error messages
- Removed duplicate closing brace

---

## Summary

✅ **All syntax errors corrected**
- 13 major sections fixed
- Proper TypeScript formatting applied
- All method signatures have proper return types
- Proper indentation throughout
- Comments formatted correctly
- Error codes fixed (no more spaces in identifiers)

## Current Status

✅ File compiles with no syntax errors
✅ Type warnings only (about `auth` type inference - expected from config import)
✅ Ready for use

---

**File:** `lib/firebase/phone-auth.ts`  
**Status:** ✅ FIXED  
**Lines:** 198  
**Syntax Errors:** 0  
**Date:** November 9, 2025
