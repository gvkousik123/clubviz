# ClubViz API Endpoints - Frontend Integration Guide

Base URL: `https://98.90.141.103/api`

## 🔐 Authentication Endpoints

### 1. Sign In (Login)
- **Endpoint:** `POST /auth/signin`
- **Payload:**
```json
{
  "usernameOrEmail": "amin",
  "password": "Xabia123"
}
```
- **Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "e53c0834-5912-4cd9...",
  "tokenType": "Bearer",
  "expiresIn": 3600000,
  "username": "amin",
  "email": "amin@gmail.com",
  "roles": ["USER"]
}
```
- **Frontend Usage:** `AuthService.signIn(usernameOrEmail, password)`

---

### 2. Sign Up (Register)
- **Endpoint:** `POST /auth/signup`
- **Payload:**
```json
{
  "fullName": "gontakousik",
  "email": "kousik123@gmail.com",
  "password": "kousik123",
  "phoneNumber": "+919608524"
}
```
- **Response (200):**
```json
{
  "success": true,
  "message": "User registered successfully!",
  "username": "kousik123"
}
```
- **Frontend Usage:** `AuthService.signUp(fullName, email, password, phoneNumber)`

---

### 3. Refresh Token
- **Endpoint:** `POST /auth/refresh`
- **Payload:**
```json
{
  "refreshToken": "e53c0834-5912-4cd9-a787..."
}
```
- **Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "d74976f1-e94c-4c3a...",
  "tokenType": "Bearer"
}
```
- **Frontend Usage:** `AuthService.refreshToken(refreshToken)`

---

### 4. Logout
- **Endpoint:** `POST /auth/logout`
- **Payload:** None (requires Authorization header)
- **Response (200):**
```json
{
  "message": "User logged out successfully!"
}
```
- **Frontend Usage:** `AuthService.logout()`

---

### 5. Get User Roles
- **Endpoint:** `GET /auth/users/{username}/roles`
- **Response (200):**
```json
["USER"]
```
- **Frontend Usage:** `AuthService.getUserRoles(username)`

---

### 6. Get Active Sessions
- **Endpoint:** `GET /auth/sessions`
- **Response (200):**
```json
[]
```
- **Frontend Usage:** `AuthService.getActiveSessions()`

---

### 7. Revoke All Sessions
- **Endpoint:** `DELETE /auth/sessions`
- **Response (200):**
```json
{
  "message": "All sessions revoked"
}
```
- **Frontend Usage:** `AuthService.revokeAllSessions()`

---

### 8. Revoke Session by ID
- **Endpoint:** `DELETE /auth/sessions/{id}`
- **Response (200):**
```json
{}
```
- **Frontend Usage:** `AuthService.revokeSession(sessionId)`

---

## 📝 Implementation Status

### ✅ Implemented & Working
1. **Sign In** - Email/Password login working
2. **Sign Up** - User registration working
3. **Logout** - Session cleanup working
4. **Token Storage** - Tokens stored in localStorage

### 🚧 Static (Not Yet Integrated)
1. **Mobile Login** - Currently navigates to mobile page (static)
2. **Google OAuth** - Shows "Coming Soon" message (static)
3. **Session Management** - APIs available but UI not built
4. **Token Refresh** - Auto-refresh not implemented yet

---

## 🎯 Frontend Integration Guide

### Login Flow (Email/Password)
```typescript
// File: app/auth/email/page.tsx
import { AuthService } from '@/lib/services/auth.service';

try {
  const response = await AuthService.signIn(email, password);
  if (response.success) {
    // Token automatically stored in localStorage
    router.push('/location/allow');
  }
} catch (error) {
  // Show error toast
  toast({
    title: "Login failed",
    description: error.message,
    variant: "destructive",
  });
}
```

### Registration Flow
```typescript
// File: app/auth/signup/page.tsx
import { AuthService } from '@/lib/services/auth.service';

try {
  const response = await AuthService.signUp(
    fullName,
    email,
    password,
    phoneNumber
  );
  if (response.success) {
    // Redirect to login
    router.push('/auth/login');
  }
} catch (error) {
  // Show error toast
  toast({
    title: "Registration failed",
    description: error.message,
    variant: "destructive",
  });
}
```

### Logout Flow
```typescript
import { AuthService } from '@/lib/services/auth.service';

try {
  await AuthService.logout();
  // Tokens automatically cleared
  router.push('/auth/intro');
} catch (error) {
  console.error("Logout error:", error);
}
```

---

## 🔑 Token Management

### Stored in localStorage:
- `accessToken` - JWT for authenticated requests
- `refreshToken` - Token for refreshing access token
- `user` - User data (username, email, roles)

### Using Tokens:
All authenticated API requests automatically include:
```
Authorization: Bearer {accessToken}
```

This is handled by the axios interceptor in `lib/api-client.ts`

---

## ⚠️ Error Handling

All errors are caught and displayed with toast notifications:

```typescript
catch (error: any) {
  const errorMessage = 
    error.response?.data?.message || 
    error.response?.data?.error ||
    error.message || 
    'Operation failed. Please try again.';
  
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  });
}
```

---

## 🚀 Next Steps

1. ✅ Remove Guest Login from `/auth/intro`
2. ✅ Integrate Email/Password login dynamically
3. ✅ Integrate Registration dynamically
4. 🔄 Add Google OAuth integration
5. 🔄 Add Mobile OTP login
6. 🔄 Implement automatic token refresh
7. 🔄 Add session management UI

