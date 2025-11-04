# 🔥 Firebase Setup Fix - Following useful.md Best Practices

## ✅ **Issues Fixed Based on useful.md Guide**

### **1. Config Pattern Updated**
- ✅ Fixed config to use proper environment variables
- ✅ Removed hardcoded fallback values  
- ✅ Following exact pattern from useful.md

### **2. reCAPTCHA Setup Simplified** 
- ✅ Simplified to match useful.md pattern
- ✅ Removed complex retry logic
- ✅ Back to invisible reCAPTCHA (as recommended)

### **3. Phone Auth Flow Streamlined**
- ✅ Follows exact `signInWithPhoneNumber` pattern from guide
- ✅ Simplified error handling
- ✅ Removed unnecessary verification checks

## 🚨 **CRITICAL: Get Correct Firebase Credentials**

Your API key is **STILL INVALID**. The test confirms:
```
❌ API key is invalid or restricted
   Error: Requests from referer <empty> are blocked.
```

### **Step-by-Step Fix:**

#### **1. Get Correct Firebase Config**
1. Open: https://console.firebase.google.com/project/clubwiz-477108/settings/general
2. Scroll to **"Your apps"** section
3. If you see a web app: **Click on it**
4. If no web app: **Click "Add app" → Web**
5. Copy the **ENTIRE** firebaseConfig object

#### **2. Update .env.local with CORRECT values**
Replace your `.env.local` with the config from Firebase Console:

```bash
# Get these from Firebase Console > Project Settings > Your apps
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy_YOUR_CORRECT_KEY_HERE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=clubwiz-477108.firebaseapp.com  
NEXT_PUBLIC_FIREBASE_PROJECT_ID=clubwiz-477108
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=clubwiz-477108.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_CORRECT_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_CORRECT_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_CORRECT_MEASUREMENT_ID
```

#### **3. Enable Phone Authentication**
1. Go to: https://console.firebase.google.com/project/clubwiz-477108/authentication/providers
2. Click **"Phone"** 
3. Toggle **ON**
4. Click **Save**

#### **4. Add Authorized Domains**
In the same Authentication settings:
1. Scroll to **"Authorized domains"**
2. Add: `localhost` and `127.0.0.1`
3. Save

## 🧪 **Test the Fix**

After updating credentials, run:

```bash
# 1. Test API key validity
node test-firebase-setup.js

# 2. Restart your app
npm run dev

# 3. Test phone auth
# Go to: http://localhost:3001/auth/mobile
```

## 📝 **Updated Code Pattern (Following useful.md)**

Your phone-auth.ts now follows the exact pattern from useful.md:

### **reCAPTCHA Setup:**
```typescript
window.recaptchaVerifier = new RecaptchaVerifier(
  auth,
  'recaptcha-container',
  {
    'size': 'invisible',
    'callback': (response) => {
      // reCAPTCHA solved
    }
  }
);
```

### **Send OTP:**
```typescript
const confirmationResult = await signInWithPhoneNumber(
  auth, 
  phoneNumber, 
  window.recaptchaVerifier
);
window.confirmationResult = confirmationResult;
```

### **Verify OTP:**
```typescript
const result = await confirmationResult.confirm(otpCode);
// User signed in successfully
```

## 🎯 **Expected Results After Fix**

- ✅ Firebase initializes without errors
- ✅ reCAPTCHA loads properly  
- ✅ OTP sends to real phone numbers
- ✅ No "Invalid app credential" errors
- ✅ Authentication flow works end-to-end

## 🚨 **If Still Not Working**

1. **Double-check API key**: Make sure it's from the correct project
2. **Check API restrictions**: In Google Cloud Console, ensure Identity Toolkit API is enabled
3. **Verify domains**: Localhost must be in authorized domains
4. **Clear browser cache**: Sometimes old credentials get cached

---

**The main issue**: Wrong API key. Once you get the correct key from Firebase Console for `clubwiz-477108`, everything will work perfectly following the useful.md patterns!