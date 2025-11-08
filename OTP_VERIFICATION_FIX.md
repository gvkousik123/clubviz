# OTP Verification Error Fix

## Issue Identified

When users verified their OTP, the application crashed with:
```
❌ OTP verification process failed: Error: Unexpected verification response
```

## Root Cause

The backend `/auth/mobile/verify-firebase-token` endpoint returns different response structures:

### For Existing Users:
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {
      "id": "...",
      "phoneNumber": "+91...",
      "isVerified": true
    }
  }
}
```

### For New Users (Not Yet Registered):
```json
{
  "success": true,
  "data": {
    "mobileNumber": "+91..."
  }
}
```

The frontend code was expecting all successful responses to have a `user` object and `accessToken`, but new users only got `mobileNumber` back, causing the "Unexpected verification response" error.

## Solution Applied

### 1. Updated Type Definition (`lib/services/mobile-auth.service.ts`)

Changed `FirebaseTokenResponse` interface to be flexible:
```typescript
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
}
```

### 2. Updated Verification Logic (`app/auth/otp/page.tsx`)

Added intelligent response parsing:
```typescript
if (tokenVerificationResult.success) {
  // Check if response contains user data (existing user) or just mobile number (new user)
  if (tokenVerificationResult.data?.user && tokenVerificationResult.data?.accessToken) {
    // EXISTING USER → Login and redirect to /home
    // Store tokens and user data
  } else if (tokenVerificationResult.data?.mobileNumber) {
    // NEW USER → Redirect to /auth/details for registration
    // Store temporary Firebase token for registration completion
  }
}
```

## Flow After Fix

1. **OTP Verification** → Firebase validates code
2. **Token Verification** → Backend checks user status
   - **Existing User**: Sends `user` + `accessToken` → Direct login to home
   - **New User**: Sends only `mobileNumber` → Redirect to registration form
3. **Registration** → User fills details, calls `/auth/mobile/complete-registration`

## Files Modified

- `lib/services/mobile-auth.service.ts` - Updated type definitions
- `app/auth/otp/page.tsx` - Enhanced response handling logic

## Testing

Now when users verify OTP:
- ✅ Existing users are logged in directly
- ✅ New users are redirected to complete registration
- ✅ Mobile number is preserved throughout the flow
