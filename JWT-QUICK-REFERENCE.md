# 🚀 JWT Token - Quick Reference Card

## Backend Response
```json
{
  "returnCode": 100,
  "returnMessage": "OTP verified successfully!",
  "jwtToken": "eyJ..."
}
```

## One-Liner Usage Examples

### Check if User is Logged In
```ts
if (JWTService.isAuthenticated()) { /* ... */ }
```

### Get Authorization Header for API
```ts
headers: JWTService.getAuthHeaders()
```

### Get Current User Email
```ts
const email = JWTService.getUserIdentifier();
```

### Store Token
```ts
JWTService.storeToken(token);
```

### Retrieve Token
```ts
const token = JWTService.getToken();
```

### Check if Expired
```ts
if (JWTService.isTokenExpired()) { /* redirect to login */ }
```

### Get Time Left (seconds)
```ts
const seconds = JWTService.getTokenTimeRemaining();
```

### Logout
```ts
JWTService.clearSession();
```

## React Component Usage
```tsx
import { useJWTToken } from '@/hooks/use-jwt-token';

export function Profile() {
  const { isAuthenticated, getUserEmail, token } = useJWTToken();
  
  if (!isAuthenticated) return <Redirect to="/auth/mobile" />;
  
  return <div>Welcome, {getUserEmail()}!</div>;
}
```

## API Request with Token
```ts
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: JWTService.getAuthHeaders(),
  body: JSON.stringify(data),
});
```

## Where Token is Stored
**localStorage Key**: `clubviz-accessToken`  
**Accessible from**: Browser Console: `localStorage.getItem('clubviz-accessToken')`

## Token Contents
```json
{
  "sub": "user@email.com",      // User identifier
  "iss": "clubviz-auth",         // Issuer
  "iat": 1764678926,             // Issued timestamp
  "exp": 1764680726              // Expiration timestamp
}
```

## Lifecycle
```
OTP Verified → Token Stored → Token Used in API → Token Expires → Logout
```

## File Locations
- **Service**: `lib/services/jwt.service.ts`
- **Hook**: `hooks/use-jwt-token.ts`
- **Updated**: `app/auth/otp/page.tsx`
- **Examples**: `components/examples/jwt-token-example.tsx`
- **Docs**: `JWT-TOKEN-MANAGEMENT.md`

## Debug in Browser Console
```js
// Check if logged in
JWTService.isAuthenticated()

// Get token
JWTService.getToken()

// View decoded token
JWTService.getCurrentTokenData()

// Check expiration
JWTService.isTokenExpired()

// Get time left (seconds)
JWTService.getTokenTimeRemaining()

// Get user email
JWTService.getUserIdentifier()
```

## ✅ Done
- ✅ Token automatically stored on OTP verification
- ✅ Token retrieved and used in API calls
- ✅ User session remembered
- ✅ Token expiration checking
- ✅ Easy logout support
