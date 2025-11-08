# Visual Reference - New Authentication Sequence

## 🎬 Step-by-Step Execution

### PHASE 1: OTP VERIFICATION
```
┌─────────────────────────────────────────────────────────┐
│                   /auth/otp                             │
└─────────────────────────────────────────────────────────┘

User enters 6-digit OTP
    ↓
[1️⃣] Firebase: verifyOTP(otpCode)
    Input:  "123456"
    Output: Firebase User {uid, phoneNumber}
    Status: ✅ SUCCESS
    ↓
[2️⃣] Firebase: user.getIdToken()
    Input:  Firebase User
    Output: JWT ID Token "eyJhbGciOiJSUzI1NiI..."
    Status: ✅ SUCCESS
    ↓
[3️⃣] Store temporary data
    localStorage.tempFirebaseToken = JWT
    localStorage.tempPhoneNumber = "+918096979770"
    ↓
[4️⃣] Redirect to details page
    router.push('/auth/details')
    ↓
✅ PHASE 1 COMPLETE

Console:
🔍 Verifying OTP: 123456
✅ Firebase OTP verification successful, user: +918096979770
🔑 Got Firebase ID token
📝 Redirecting to details page for registration...
```

---

### PHASE 2: USER DETAILS & REGISTRATION
```
┌─────────────────────────────────────────────────────────┐
│                 /auth/details                           │
└─────────────────────────────────────────────────────────┘

User fills form:
- Full Name: "John Doe"
- Email: "john@example.com"

User clicks submit
    ↓
📊 CALL SEQUENCE:

    ┌─────────────────────────────────────┐
    │ API CALL 1 (FIRST)                  │
    │ POST /auth/mobile/complete-         │
    │         registration                │
    ├─────────────────────────────────────┤
    │ Request:                            │
    │ {                                   │
    │   mobileNumber: "+918096979770",    │
    │   fullName: "John Doe",             │
    │   email: "john@example.com"         │
    │ }                                   │
    │                                     │
    │ Response:                           │
    │ {                                   │
    │   success: true,                    │
    │   data: {                           │
    │     accessToken: "abc123...",       │
    │     refreshToken: "xyz789...",      │
    │     user: {                         │
    │       id: "user123",                │
    │       fullName: "John Doe",         │
    │       email: "john@example.com",    │
    │       phoneNumber: "+918096979770", │
    │       isVerified: true              │
    │     }                               │
    │   }                                 │
    │ }                                   │
    │                                     │
    │ Status: ✅ SUCCESS                  │
    └─────────────────────────────────────┘
         ↓
    Console:
    🔄 Starting registration completion...
    📝 Step 1: Calling complete-registration API...
    ✅ Step 1 Complete: Registration completed...
    ↓
    ┌─────────────────────────────────────┐
    │ API CALL 2 (SECOND)                 │
    │ POST /auth/mobile/verify-firebase-  │
    │         token                       │
    ├─────────────────────────────────────┤
    │ Request:                            │
    │ {                                   │
    │   idToken: "eyJhbGciOiJSUzI1..."   │
    │ }                                   │
    │                                     │
    │ Response:                           │
    │ {                                   │
    │   success: true,                    │
    │   data: {                           │
    │     existingUser: false,            │
    │     accessToken: "abc123...",       │
    │     refreshToken: "xyz789...",      │
    │     user: {                         │
    │       id: "user123",                │
    │       phoneNumber: "+918096979770", │
    │       isVerified: true              │
    │     }                               │
    │   }                                 │
    │ }                                   │
    │                                     │
    │ Status: ✅ SUCCESS                  │
    └─────────────────────────────────────┘
         ↓
    Console:
    🔐 Step 2: Calling verify-firebase-token API...
    ✅ Step 2 Complete: Token verified...
    ↓
    💾 Store Tokens (merge from both responses)
    localStorage.accessToken = "abc123..."
    localStorage.refreshToken = "xyz789..."
    localStorage.user = {user data}
    ↓
    🧹 Clean up temp storage
    localStorage.removeItem('tempFirebaseToken')
    localStorage.removeItem('tempPhoneNumber')
    ↓
    Console:
    💾 Step 3: Storing authentication data...
    ✅ All steps completed successfully!
    ↓
✅ PHASE 2 COMPLETE
```

---

### PHASE 3: LOCATION PERMISSION
```
┌─────────────────────────────────────────────────────────┐
│              /location/allow                            │
└─────────────────────────────────────────────────────────┘

Display location permission prompt
    ↓
User approves or skips
    ↓
Redirect to /home
```

---

### PHASE 4: HOME & AUTHENTICATED
```
┌─────────────────────────────────────────────────────────┐
│                  /home                                  │
└─────────────────────────────────────────────────────────┘

✅ User fully authenticated
✅ Tokens stored
✅ User data available
✅ Ready to use app
```

---

## 📊 Request/Response Details

### Complete Registration Request/Response
```
REQUEST:
POST /auth/mobile/complete-registration
Content-Type: application/json

{
  "mobileNumber": "+918096979770",
  "fullName": "John Doe",
  "email": "john@example.com"
}

RESPONSE (200 OK):
{
  "success": true,
  "message": "User registration completed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+918096979770",
      "isVerified": true,
      "createdAt": "2025-11-09T10:30:00Z"
    }
  }
}
```

### Verify Firebase Token Request/Response
```
REQUEST:
POST /auth/mobile/verify-firebase-token
Content-Type: application/json

{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImZiMTk2NTM4..."
}

RESPONSE (200 OK):
{
  "success": true,
  "message": "Firebase token verified successfully",
  "data": {
    "existingUser": false,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "phoneNumber": "+918096979770",
      "isVerified": true
    }
  }
}
```

---

## 🔑 Key Points

| Point | Details |
|-------|---------|
| **OTP Page Role** | Firebase verification only |
| **Details Page Role** | User creation + Verification |
| **API Call 1** | Complete registration (creates user) |
| **API Call 2** | Verify token (confirms session) |
| **Mobile Number** | Passed in API Call 1 ✅ |
| **Token Source** | Both APIs return tokens (use latest) |
| **User Data** | From verify-token response |
| **Temp Storage** | Cleared after both APIs succeed |

---

## ✅ Checklist

- [x] OTP page simplified
- [x] Firebase verification only in OTP page
- [x] Temp data stored correctly
- [x] Redirect to details works
- [x] Form validation on details page
- [x] Complete-registration API called FIRST
- [x] Verify-firebase-token API called SECOND
- [x] Tokens merged correctly
- [x] User data stored
- [x] Temp storage cleared
- [x] Redirect to location page
- [x] Error handling throughout
- [x] Console logging clear
- [x] No TypeScript errors

**STATUS: ✅ COMPLETE & READY FOR TESTING**

