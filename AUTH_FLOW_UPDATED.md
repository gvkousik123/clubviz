# Updated Authentication Flow - Using existingUser Flag

## Overview
The authentication flow now properly handles both existing and new users by checking the `existingUser` flag from the backend's token verification response.

## Complete Flow

### 1. Mobile Entry (`/auth/mobile`)
- User enters phone number
- OTP is sent via Firebase

### 2. OTP Verification (`/auth/otp`)
- User enters 6-digit OTP
- **Firebase verifies** the OTP (Firebase SDK)
- **Get ID Token** from Firebase user
- **Backend Verification** via `POST /auth/mobile/verify-firebase-token`
  
#### Response Handling:
```javascript
{
  "success": true,
  "data": {
    "existingUser": true/false,  // ← KEY FLAG
    "accessToken": "...",
    "refreshToken": "...",
    "user": {...}  // Present if existingUser: true
  }
}
```

#### Decision Logic:
- **If `existingUser: true`**
  - User is already registered
  - Store access token and user data
  - Redirect to `/home` (direct login)
  
- **If `existingUser: false`**
  - User is new (Firebase verified but not registered in backend)
  - Store temporary Firebase token
  - Store phone number
  - Redirect to `/auth/details` (registration form)

### 3. Registration Form (`/auth/details`) - NEW USERS ONLY
- Display form for full name and email
- User fills in their details
- When submitted, calls `POST /auth/mobile/complete-registration`

#### Request:
```json
{
  "mobileNumber": "+91...",
  "fullName": "John Doe",
  "email": "john@example.com"
}
```

#### Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {
      "id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+91...",
      "isVerified": true
    }
  }
}
```

#### On Success:
- Store access token and refresh token
- Store user data
- Clear temporary storage (tempFirebaseToken, tempPhoneNumber)
- Redirect to `/location/allow`

### 4. Location Permission (`/location/allow`)
- Standard onboarding flow continues

## Files Modified

### 1. `lib/services/mobile-auth.service.ts`
- Updated `FirebaseTokenResponse` interface to include `existingUser` flag

### 2. `app/auth/otp/page.tsx`
- Updated verification logic to check `existingUser` flag
- If true → Direct login
- If false → Redirect to registration

### 3. `app/auth/details/page.tsx`
- Already calls `MobileAuthService.completeRegistration()`
- Properly stores tokens and user data

## Type Definition
```typescript
export interface FirebaseTokenResponse {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    phoneNumber: string;
    isVerified: boolean;
  };
  mobileNumber?: string;
  existingUser?: boolean;  // ← New flag
}
```

## Key Points

✅ **Firebase OTP verification** always succeeds for valid phone numbers
✅ **Backend determines** if user is registered via `existingUser` flag
✅ **New users** see registration form
✅ **Existing users** get direct login
✅ **Phone number** is preserved throughout entire flow
✅ **Tokens** are properly stored and managed

## Testing Checklist

- [ ] Existing user: Phone verified → Direct login → Home
- [ ] New user: Phone verified → Registration form → Enter details → API success → Location page
- [ ] New user: Phone verified → Registration form → Submit → Tokens stored correctly
- [ ] Mobile number present in complete-registration request
- [ ] Temporary storage cleaned up after registration
