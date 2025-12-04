# JWT Token Management Guide

## Overview
After OTP verification, your app receives a JWT token from the backend that needs to be stored and used for authenticated API requests.

## Backend Response Structure
```json
{
  "returnCode": 100,
  "returnMessage": "OTP verified successfully!",
  "transactionId": null,
  "jwtToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkZXYuc3Rrc2NAZ21haWwuY29tIiwiaXNzIjoiY2x1Yndpei1hdXRoIiwiaWF0IjoxNzY0Njc4OTI2LCJleHAiOjE3NjQ2ODA3MjZ9.yRWgONh6r1BZ4ClxLqCdnWDzW21TFWI0K4ncIFRgQrM"
}
```

## Token Storage
The JWT token is automatically stored in `localStorage` under the key: `clubviz-accessToken`

## Usage Methods

### 1. Using JWTService (Recommended - Server/Client Safe)
Best for any context - works on server and client.

```typescript
import { JWTService } from '@/lib/services/jwt.service';

// Store a token
JWTService.storeToken(token);

// Get the stored token
const token = JWTService.getToken();

// Check if user is authenticated
if (JWTService.isAuthenticated()) {
  console.log('User is logged in');
}

// Get decoded token data
const tokenData = JWTService.getCurrentTokenData();
console.log('User email:', tokenData.sub);

// Get Authorization header for API calls
const headers = JWTService.getAuthHeaders();
// Usage: { 'Authorization': 'Bearer eyJ...', 'Content-Type': 'application/json' }

// Check token expiration
if (JWTService.isTokenExpired()) {
  // Token expired - redirect to login
}

// Get time remaining until expiration
const secondsLeft = JWTService.getTokenTimeRemaining();

// Remember user session
JWTService.rememberUser({
  email: 'user@example.com',
  userId: '12345',
  role: 'user'
});

// Get remembered user
const userData = JWTService.getRememberedUser();

// Clear session (logout)
JWTService.clearSession();
```

### 2. Using useJWTToken Hook (Client-Only)
Best for React components - automatically syncs state.

```typescript
import { useJWTToken } from '@/hooks/use-jwt-token';

export function MyComponent() {
  const {
    token,              // Current token string
    decodedToken,       // Decoded token data (payload)
    isLoading,          // Loading state
    saveToken,          // Save new token
    clearToken,         // Remove token
    isTokenValid,       // Check if valid
    getUserEmail,       // Get user email from token
    getTokenExpiration, // Get expiration date
    getIssuer,          // Get token issuer
    isAuthenticated,    // User is logged in and token is valid
  } = useJWTToken();

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return <div>Welcome, {getUserEmail()}!</div>;
  }

  return <div>Please log in</div>;
}
```

### 3. Handling OTP Response
In the OTP verification page, use the service to handle the response:

```typescript
import { JWTService } from '@/lib/services/jwt.service';

const response = await MobileAuthService.validateOtp(email, otp);

// Automatically store token and remember user
const success = JWTService.handleOTPValidationResponse({
  returnCode: response.returnCode,
  returnMessage: response.returnMessage,
  transactionId: response.transactionId,
  jwtToken: response.jwtToken,
  email: email,
});

if (success) {
  // Token is stored and user is remembered
  router.push('/home');
}
```

## Token Structure (JWT Payload)
The decoded token contains:
```json
{
  "sub": "dev.stksa@gmail.com",      // Subject (user email)
  "iss": "clubviz-auth",              // Issuer
  "iat": 1764678926,                  // Issued at (timestamp)
  "exp": 1764680726                   // Expiration (timestamp)
}
```

## API Request Example
Using JWT token for authenticated API calls:

```typescript
import { JWTService } from '@/lib/services/jwt.service';

async function getProtectedData() {
  try {
    const response = await fetch('/api/protected-endpoint', {
      method: 'GET',
      headers: JWTService.getAuthHeaders(),
    });

    if (response.status === 401) {
      // Token expired or invalid - clear session
      JWTService.clearSession();
      // Redirect to login
    }

    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
  }
}
```

## LocalStorage Keys
All JWT and user data is stored in localStorage with these keys:
- `clubviz-accessToken` - JWT token
- `clubviz-refreshToken` - Refresh token (if available)
- `clubviz-user` - User profile data (JSON)
- `user-email` - Remembered email
- `user-phone` - Remembered phone
- `user-name` - Remembered name
- `user-id` - Remembered user ID
- `user-role` - Remembered user role

## Security Notes
⚠️ **Important**: 
- JWT tokens are stored in localStorage (XSS vulnerable)
- For production, consider using httpOnly cookies
- The token is decoded but NOT verified (signature not checked)
- Always use HTTPS in production
- Clear tokens on logout to prevent unauthorized access

## Logout Example
```typescript
import { JWTService } from '@/lib/services/jwt.service';

function handleLogout() {
  JWTService.clearSession();
  // Redirect to login
  router.push('/auth/mobile');
}
```

## Debug Mode
Enable console logs to see token operations:
```typescript
// All JWTService methods include console logging
JWTService.storeToken(token);  // ✅ JWT Token stored successfully
JWTService.getToken();          // Logs operations
JWTService.isTokenExpired();    // Logs expiration check
```
