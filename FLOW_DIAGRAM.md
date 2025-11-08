# Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER AUTHENTICATION FLOW                   │
└─────────────────────────────────────────────────────────────────┘

1. MOBILE NUMBER ENTRY
   ┌──────────────────┐
   │  /auth/mobile    │
   │ Enter Phone No.  │
   └────────┬─────────┘
            │
            ▼ Send OTP via Firebase
   ┌──────────────────┐
   │ Firebase OTP Sent│
   └────────┬─────────┘
            │
            ▼
2. OTP VERIFICATION
   ┌──────────────────────────────────────┐
   │       /auth/otp                      │
   │  Enter 6-digit verification code     │
   └────────┬─────────────────────────────┘
            │
            ▼ User enters OTP
   ┌──────────────────────────────────────┐
   │  Firebase verifies OTP ✓             │
   │  Get Firebase ID token               │
   └────────┬─────────────────────────────┘
            │
            ▼ Send to backend
   ┌─────────────────────────────────────────────────┐
   │ POST /auth/mobile/verify-firebase-token         │
   │ Payload: { idToken: "..." }                     │
   └────────┬────────────────────────────────────────┘
            │
            ▼ Backend checks user registration status
   ┌─────────────────────────────────────────────────┐
   │ Response:                                       │
   │ {                                               │
   │   "success": true,                              │
   │   "data": {                                     │
   │     "existingUser": true/false,  ← KEY FIELD   │
   │     "accessToken": "...",                       │
   │     "refreshToken": "...",                      │
   │     "user": {...}  // if existingUser: true    │
   │   }                                             │
   │ }                                               │
   └────────┬───────────────────────────────────────┘
            │
            ├─────────────────────────────┬────────────────────────────┐
            │                             │                            │
            ▼ existingUser: true          ▼ existingUser: false        ▼ Error
    ┌────────────────────┐        ┌──────────────────┐        ┌─────────────┐
    │   EXISTING USER    │        │    NEW USER      │        │    ERROR    │
    │  Already registered│        │  Not registered  │        │  Show error │
    └────────┬───────────┘        └────────┬─────────┘        └─────────────┘
             │                             │
             ▼ Store tokens                ▼ Store temporary data
    ┌────────────────────────────┐  ┌──────────────────────────────┐
    │ localStorage:              │  │ localStorage:                │
    │ - accessToken             │  │ - tempFirebaseToken          │
    │ - refreshToken            │  │ - tempPhoneNumber            │
    │ - user                     │  └────────┬─────────────────────┘
    └────────┬───────────────────┘           │
             │                                ▼ Redirect
             │                        ┌────────────────────┐
             │                        │  /auth/details     │
             │                        │  Registration Form │
             │                        │  - Full Name       │
             │                        │  - Email           │
             │                        └────────┬───────────┘
             │                                 │
             │                                 ▼ User fills form
             │                        ┌────────────────────┐
             │                        │ Form Validated ✓   │
             │                        └────────┬───────────┘
             │                                 │
             │                                 ▼ Submit
             │                        ┌────────────────────────────┐
             │                        │ POST /auth/mobile/          │
             │                        │ complete-registration       │
             │                        │ Payload:                   │
             │                        │ {                          │
             │                        │   mobileNumber: "+91...",  │
             │                        │   fullName: "John",        │
             │                        │   email: "john@mail.com"   │
             │                        │ }                          │
             │                        └────────┬───────────────────┘
             │                                 │
             │                                 ▼ Backend creates user
             │                        ┌────────────────────┐
             │                        │ User Created ✓     │
             │                        │ Response tokens    │
             │                        └────────┬───────────┘
             │                                 │
             │                                 ▼ Store tokens
             │                        ┌────────────────────────────┐
             │                        │ localStorage:              │
             │                        │ - accessToken (new)        │
             │                        │ - refreshToken (new)       │
             │                        │ - user (new)               │
             │                        │ Clear: tempFirebaseToken   │
             │                        │        tempPhoneNumber     │
             │                        └────────┬───────────────────┘
             │                                 │
             ├─────────────────────────────────┤
             │                                 │
             ▼                                 ▼
    ┌────────────────────┐         ┌──────────────────────┐
    │ /location/allow    │         │  /location/allow     │
    │ (Location consent) │         │  (Location consent)  │
    └────────┬───────────┘         └────────┬─────────────┘
             │                              │
             ▼                              ▼
    ┌────────────────────┐         ┌──────────────────────┐
    │    /home           │         │      /home           │
    │  (Main App)        │         │    (Main App)        │
    │  EXISTING USER     │         │     NEW USER         │
    └────────────────────┘         └──────────────────────┘
```

## API Endpoints

### 1. Send OTP
**Method**: POST  
**Endpoint**: `/auth/mobile/send-otp` (Firebase SDK - Client Side)  
**Response**: OTP sent to phone

### 2. Verify Firebase Token
**Method**: POST  
**Endpoint**: `/auth/mobile/verify-firebase-token`  
**Request**:
```json
{
  "idToken": "firebase_id_token_here"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "existingUser": boolean,
    "accessToken": "token",
    "refreshToken": "token",
    "user": {
      "id": "user_id",
      "phoneNumber": "+91...",
      "isVerified": true
    }
  }
}
```

### 3. Complete Registration (NEW USERS ONLY)
**Method**: POST  
**Endpoint**: `/auth/mobile/complete-registration`  
**Request**:
```json
{
  "mobileNumber": "+91xxxxxxxxxx",
  "fullName": "John Doe",
  "email": "john@example.com"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "accessToken": "token",
    "refreshToken": "token",
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+91xxxxxxxxxx",
      "isVerified": true
    }
  }
}
```

## Decision Tree

```
OTP Verified via Firebase
        │
        ▼
Backend verification response received
        │
        ├─── existingUser: true ───→ EXISTING USER ───→ Direct Login ───→ /home
        │
        └─── existingUser: false ──→ NEW USER ───→ Show Registration Form ───→ User enters details ───→ Complete Registration API ───→ /location/allow ───→ /home
```
