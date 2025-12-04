# JWT Token Flow Diagram

## Complete Authentication & Token Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLUBVIZ AUTHENTICATION FLOW                   │
└─────────────────────────────────────────────────────────────────┘

Step 1: User Entry
┌──────────────────────┐
│ Auth Mobile Page     │
│ (/auth/mobile)       │
│ - Phone Number       │
│ - Email Address      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│ POST /notification/api/otp/send                  │
│ Params: email, phone                             │
│ Backend: Sends OTP to email                      │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────┐
│  OTP Page            │
│  (/auth/otp)         │
│  - Display 6 fields  │
│  - Input OTP code    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│ POST /notification/api/otp/validate              │
│ Query: email=X, otp=123456                       │
│                                                  │
│ Backend Response:                                │
│ {                                                │
│   "returnCode": 100,                             │
│   "returnMessage": "OTP verified successfully!", │
│   "transactionId": null,                         │
│   "jwtToken": "eyJ..."                           │ ◄── JWT TOKEN
│ }                                                │
└──────────┬───────────────────────────────────────┘
           │
           ▼ [OTP Verified]
┌──────────────────────────────────────────────────┐
│ JWTService.handleOTPValidationResponse()         │
│                                                  │
│ ✅ Extract jwtToken from response                │
│ ✅ Store in localStorage ("clubviz-accessToken")│
│ ✅ Decode JWT payload                            │
│ ✅ Remember user email                           │
│ ✅ Clear temporary data                          │
└──────────┬───────────────────────────────────────┘
           │
           ▼ [Token Stored]
┌──────────────────────────────────────────────────┐
│ localStorage                                     │
│                                                  │
│ ├─ clubviz-accessToken: "eyJ..."                │
│ ├─ user-email: "dev.stksa@gmail.com"           │
│ ├─ clubviz-user: "{...}"                        │
│ └─ clubviz-refreshToken: "..."                  │
└──────────┬───────────────────────────────────────┘
           │
           ▼ [Token Available]
┌──────────────────────────────────────────────────┐
│ Redirect to /home                                │
│                                                  │
│ Now user is authenticated!                       │
└──────────────────────────────────────────────────┘


Step 2: Using Token in API Requests
┌──────────────────────────────────────┐
│ Any Component/Page                   │
│ Needs to make API call               │
└──────────┬──────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Get Authorization Header             │
│                                      │
│ headers = JWTService.getAuthHeaders()│
│ // Returns:                          │
│ // {                                 │
│ //   Authorization: "Bearer eyJ...", │
│ //   Content-Type: "application/json"│
│ // }                                 │
└──────────┬──────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ API Request                          │
│                                      │
│ fetch('/api/protected', {            │
│   method: 'GET',                     │
│   headers: headers                   │
│ })                                   │
└──────────┬──────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Backend Validates Token              │
│                                      │
│ ✅ Token is valid                    │
│ ✅ Return protected data             │
│                                      │
│ ❌ Token expired                     │
│ ❌ Return 401 Unauthorized           │
└──────────┬──────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Frontend Handles Response            │
│                                      │
│ ✅ Use returned data                 │
│                                      │
│ ❌ Clear session & redirect to login │
│    JWTService.clearSession()         │
└──────────────────────────────────────┘


Step 3: JWT Token Structure
┌───────────────────────────────────────────────┐
│ JWT Token Format: header.payload.signature     │
└───────────────────────────────────────────────┘

Encoded:
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkZXYuc3Rrc2NAZ21haWwuY29tIiwiaXNzIjoiY2x1Yndpei1hdXRoIiwiaWF0IjoxNzY0Njc4OTI2LCJleHAiOjE3NjQ2ODA3MjZ9.yRWgONh6r1BZ4ClxLqCdnWDzW21TFWI0K4ncIFRgQrM

Decoded Payload:
┌─────────────────────────────────────┐
│ {                                   │
│   "sub": "dev.stksa@gmail.com",     │ ◄── User identifier (email)
│   "iss": "clubviz-auth",            │ ◄── Issuer
│   "iat": 1764678926,                │ ◄── Issued at (epoch)
│   "exp": 1764680726                 │ ◄── Expiration (epoch)
│ }                                   │
└─────────────────────────────────────┘

Decoded via JWTService:
const data = JWTService.getCurrentTokenData();
console.log(data.sub);    // "dev.stksa@gmail.com"
console.log(data.iss);    // "clubviz-auth"


Step 4: Token Lifecycle
┌──────────────────────────────────────────────────────────┐
│ Token Generated                  Token Stored             │
│ [Backend]                        [Browser localStorage]   │
│                                                           │
│ Issued at: 1764678926                                     │
│ Valid for: ~30 minutes (example)                          │
│ Expires at: 1764680726                                    │
│                                                           │
│ ▼ Current Time                                            │
│ ├─ 0 min: ✅ Fresh token                                 │
│ ├─ 15 min: ✅ Still valid                                │
│ ├─ 25 min: ⚠️  Expiring soon                              │
│ ├─ 30 min: ❌ EXPIRED                                    │
│ │                                                        │
│ └─ Action: Redirect to /auth/mobile                      │
│            Clear session with JWTService.clearSession()  │
└──────────────────────────────────────────────────────────┘


Key Methods Used
┌──────────────────────────────────────────┐
│ JWTService.storeToken()                  │
│ └─ Store token in localStorage           │
│                                          │
│ JWTService.getToken()                    │
│ └─ Retrieve token from localStorage      │
│                                          │
│ JWTService.isAuthenticated()             │
│ └─ Check if user is logged in            │
│                                          │
│ JWTService.getCurrentTokenData()         │
│ └─ Get decoded token payload             │
│                                          │
│ JWTService.isTokenExpired()              │
│ └─ Check if token has expired            │
│                                          │
│ JWTService.getAuthHeaders()              │
│ └─ Get headers with Authorization token  │
│                                          │
│ JWTService.getUserIdentifier()           │
│ └─ Get user email from token             │
│                                          │
│ JWTService.clearSession()                │
│ └─ Logout - clear all session data       │
└──────────────────────────────────────────┘


Storage Overview
┌────────────────────────────────────────────┐
│ localStorage (Browser Storage)              │
├────────────────────────────────────────────┤
│                                            │
│ Key: clubviz-accessToken                  │
│ Value: "eyJ..."                           │
│ └─ JWT Token used for API auth            │
│                                            │
│ Key: clubviz-refreshToken                 │
│ Value: "eyJ..."                           │
│ └─ Token to refresh access token          │
│                                            │
│ Key: clubviz-user                         │
│ Value: "{...user data...}"                │
│ └─ Cached user profile data               │
│                                            │
│ Key: user-email                           │
│ Value: "dev.stksa@gmail.com"              │
│ └─ Remembered user email                  │
│                                            │
│ Key: user-phone                           │
│ Value: "+919XXXXXXXXX"                    │
│ └─ Remembered user phone                  │
│                                            │
│ Key: user-id                              │
│ Value: "12345"                            │
│ └─ Remembered user ID                     │
│                                            │
│ Key: user-role                            │
│ Value: "user" / "admin" / "superadmin"   │
│ └─ Remembered user role                   │
│                                            │
└────────────────────────────────────────────┘


Component Usage Example
┌──────────────────────────────────────────┐
│ React Component                          │
│                                          │
│ import useJWTToken from '@/hooks'       │
│                                          │
│ export function Profile() {              │
│   const {                                │
│     token,          ◄── Raw JWT string   │
│     decodedToken,   ◄── Parsed payload   │
│     isAuthenticated,◄── Boolean flag     │
│     getUserEmail,   ◄── Get user email   │
│     getTokenExpiration ◄── Get exp date  │
│   } = useJWTToken(); ◄── Hook            │
│                                          │
│   if (!isAuthenticated) {                │
│     return <Redirect to="/auth/mobile" />│
│   }                                      │
│                                          │
│   return (                               │
│     <div>                                │
│       Welcome, {getUserEmail()}!         │
│     </div>                               │
│   );                                     │
│ }                                        │
└──────────────────────────────────────────┘
```

---

## 🎯 Summary

✅ **Token Generated**: Backend creates JWT on OTP verification (returnCode: 100)  
✅ **Token Transmitted**: JWT included in response as `jwtToken` field  
✅ **Token Stored**: JWTService saves to localStorage automatically  
✅ **Token Decoded**: Payload contains user info (sub = email)  
✅ **Token Used**: Included in Authorization header for all API requests  
✅ **Token Validated**: Checked for expiration before use  
✅ **Token Refreshed**: (Optional - if backend supports refresh tokens)  
✅ **Token Cleared**: Removed on logout with clearSession()  

---

**Implementation Status**: ✅ COMPLETE  
**Date**: December 2, 2025
