# Updated Authentication Flow - New Sequence

## 📋 New API Call Sequence

### Step 1: OTP Verification Page (`/auth/otp`)

```
User enters 6-digit OTP
         ↓
    Firebase OTP verification
         ↓
    ✅ Success
         ↓
    Get Firebase ID token
         ↓
    ✅ Success
         ↓
    Store temp data:
    - tempFirebaseToken (JWT)
    - tempPhoneNumber (from Firebase)
         ↓
    Redirect to /auth/details
```

**Console Logs:**
```
🔍 Verifying OTP: 123456
✅ Firebase OTP verification successful, user: +918096979770
🔑 Got Firebase ID token
📝 Redirecting to details page for registration...
```

---

### Step 2: Details Page (`/auth/details`)

User fills in:
- Full Name
- Email

When submitted, this page executes **TWO API calls in sequence**:

#### Call 1: Complete Registration API ⬅️ FIRST

```
Endpoint: POST /auth/mobile/complete-registration

Request:
{
  "mobileNumber": "+918096979770",
  "fullName": "John Doe",
  "email": "john@example.com"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {
      "id": "user123",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+918096979770",
      "isVerified": true
    }
  }
}
```

**Console Log:**
```
🔄 Starting registration completion...
📝 Step 1: Calling complete-registration API...
✅ Step 1 Complete: Registration completed {...}
```

#### Call 2: Verify Firebase Token API ⬅️ SECOND

```
Endpoint: POST /auth/mobile/verify-firebase-token

Request:
{
  "idToken": "eyJhbGciOiJSUzI1NiI..."  (Firebase token)
}

Response:
{
  "success": true,
  "data": {
    "existingUser": false,  // New user just registered
    "accessToken": "...",
    "refreshToken": "...",
    "user": {...}
  }
}
```

**Console Log:**
```
🔐 Step 2: Calling verify-firebase-token API...
✅ Step 2 Complete: Token verified {...}
```

#### Step 3: Store Tokens

```
💾 Step 3: Storing authentication data...

localStorage:
- STORAGE_KEYS.accessToken (from Step 1 or Step 2)
- STORAGE_KEYS.refreshToken (from Step 1 or Step 2)
- STORAGE_KEYS.user (from Step 2 preferably)

Clear temp data:
- tempFirebaseToken
- tempPhoneNumber
```

**Console Log:**
```
✅ All steps completed successfully!
```

#### Step 4: Redirect

```
Redirect to /location/allow
    ↓
User approves location access
    ↓
Redirect to /home
```

---

## 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│              AUTHENTICATION FLOW                     │
└─────────────────────────────────────────────────────┘

PAGE 1: /auth/otp
┌────────────────────────────────┐
│ 1. User enters 6-digit OTP     │
│ 2. Firebase verifies ✅        │
│ 3. Get Firebase ID token ✅    │
│ 4. Store temp data:            │
│    - tempFirebaseToken         │
│    - tempPhoneNumber           │
│ 5. Redirect → /auth/details    │
└────────────────────────────────┘
         │
         ▼

PAGE 2: /auth/details
┌────────────────────────────────────────┐
│ User fills form:                       │
│ - Full Name                            │
│ - Email                                │
│                                        │
│ When submitted:                        │
│                                        │
│ API CALL 1 (First):                   │
│ ┌──────────────────────────────────┐ │
│ │ POST /complete-registration      │ │
│ │ Payload:                         │ │
│ │ - mobileNumber (from temp)      │ │
│ │ - fullName (user input)         │ │
│ │ - email (user input)            │ │
│ │                                 │ │
│ │ Response: ✅                    │ │
│ │ - accessToken                   │ │
│ │ - refreshToken                  │ │
│ │ - user data                     │ │
│ └──────────────────────────────────┘ │
│                                        │
│ API CALL 2 (Second):                  │
│ ┌──────────────────────────────────┐ │
│ │ POST /verify-firebase-token      │ │
│ │ Payload:                         │ │
│ │ - idToken (from temp)           │ │
│ │                                 │ │
│ │ Response: ✅                    │ │
│ │ - accessToken                   │ │
│ │ - refreshToken                  │ │
│ │ - user data                     │ │
│ │ - existingUser: false           │ │
│ └──────────────────────────────────┘ │
│                                        │
│ Store tokens to localStorage           │
│ Clear temp storage                    │
│ Redirect → /location/allow            │
└────────────────────────────────────────┘
         │
         ▼

PAGE 3: /location/allow
┌────────────────────────────────┐
│ Request location permission    │
│ User approves or skips         │
│ Redirect → /home               │
└────────────────────────────────┘
         │
         ▼

PAGE 4: /home
┌────────────────────────────────┐
│ Main app / Dashboard           │
│ User fully authenticated ✅    │
└────────────────────────────────┘
```

---

## 🔄 API Call Comparison

### Why Two Verification APIs?

| API | Purpose | Input | Output |
|-----|---------|-------|--------|
| **complete-registration** | Create user account | Mobile, Name, Email | User tokens, user data |
| **verify-firebase-token** | Validate Firebase session | Firebase ID token | Confirms user registered, tokens |

**Benefits:**
1. Complete-registration creates the user in backend
2. Verify-firebase-token confirms creation and provides final session
3. Double verification ensures data consistency
4. Both APIs provide tokens (use latest)

---

## 💾 Token Storage Logic

```typescript
// Get tokens from both responses
const completeRegTokens = registrationResult.data;
const verifyTokens = tokenVerificationResult.data;

// Prefer tokens from complete-registration if available
const tokens = completeRegTokens?.accessToken 
  ? completeRegTokens 
  : verifyTokens;

// Store final tokens
localStorage.setItem('accessToken', tokens.accessToken);
localStorage.setItem('refreshToken', tokens.refreshToken);

// Store user data from verification (more complete)
const userData = verifyTokens.user || completeRegTokens.user;
localStorage.setItem('user', JSON.stringify(userData));
```

---

## 🧪 Testing Checklist

- [ ] Firebase OTP verifies successfully
- [ ] Temp data stored correctly
- [ ] Redirect to /auth/details works
- [ ] Form validates properly
- [ ] Complete-registration API called ✅
- [ ] Verify-firebase-token API called ✅ (after step 1)
- [ ] Tokens stored in localStorage
- [ ] Temp data cleared
- [ ] Redirect to /location/allow works
- [ ] User data persists across pages
- [ ] Full flow: OTP → Details → Registration → Location → Home

---

## 📝 Key Files Modified

1. **app/auth/otp/page.tsx**
   - Simplified: Firebase OTP → Store temp data → Redirect details

2. **app/auth/details/page.tsx**
   - Step 1: Call complete-registration
   - Step 2: Call verify-firebase-token
   - Step 3: Store tokens
   - Step 4: Redirect to location

---

## ✅ Implementation Complete

**Status:** Ready for testing

All changes implemented:
- ✅ OTP page simplified
- ✅ Details page calls both APIs in sequence
- ✅ Mobile number preserved
- ✅ Tokens properly stored
- ✅ No TypeScript errors
- ✅ Proper error handling
- ✅ Clear console logging

