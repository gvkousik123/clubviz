# 🔧 Firebase Phone Auth - App Credential Error Fix

## 🔍 **The Issue You Were Experiencing**

The "app credential error" when sending verification codes is a common Firebase issue that occurs when:

1. **reCAPTCHA is not properly verified** before calling `signInWithPhoneNumber`
2. **Invisible reCAPTCHA fails** to auto-verify in production (works fine with test numbers)
3. **App verifier state** becomes invalid between setup and usage
4. **Race conditions** between reCAPTCHA setup and OTP sending

## ✅ **Fixes Applied**

### **1. Improved reCAPTCHA Setup**
- Changed default from `invisible` to `normal` reCAPTCHA for better reliability
- Added proper error callbacks and verification state tracking
- Added automatic retry logic for invisible reCAPTCHA

### **2. Enhanced OTP Sending**
- Added verification state checking before sending OTP
- Implemented automatic retry with fresh reCAPTCHA on app credential errors
- Better error handling for app verification failures

### **3. Better Error Messages**
- Added specific error codes for app credential issues
- More informative messages for troubleshooting

## 🚀 **How to Use in Your UI**

### **Step 1: HTML Structure**
Make sure your auth page has a visible reCAPTCHA container:

```html
<!-- For visible reCAPTCHA (recommended for production) -->
<div id="recaptcha-container"></div>

<!-- OR for invisible reCAPTCHA -->
<div id="recaptcha-container" style="display: none;"></div>
```

### **Step 2: Phone Number Input Flow**
```typescript
import { firebasePhoneAuth } from '@/lib/firebase/phone-auth';

async function handleSendOTP(phoneNumber: string) {
  try {
    // Setup reCAPTCHA first (will use visible by default)
    await firebasePhoneAuth.setupRecaptcha("recaptcha-container", "normal");
    
    // Show user message to complete reCAPTCHA
    setMessage("Please complete reCAPTCHA verification");
    
    // For visible reCAPTCHA, user needs to click the checkbox
    // For invisible, it may auto-verify or require user action
    
  } catch (error) {
    console.error("reCAPTCHA setup failed:", error);
  }
}

async function sendOTP(phoneNumber: string) {
  try {
    setLoading(true);
    setMessage("Sending OTP...");
    
    const success = await firebasePhoneAuth.sendOTP(phoneNumber);
    if (success) {
      setMessage("OTP sent successfully! Check your phone.");
      // Navigate to OTP verification page
    }
  } catch (error: any) {
    setError(error.message);
    
    // If it's a reCAPTCHA error, user needs to verify again
    if (error.message.includes('reCAPTCHA')) {
      setMessage("Please complete reCAPTCHA verification and try again");
    }
  } finally {
    setLoading(false);
  }
}
```

### **Step 3: For Better User Experience**

#### **Option A: Two-Step Process (Recommended)**
```typescript
// Step 1: Setup and verify reCAPTCHA
const handleSetupRecaptcha = async () => {
  await firebasePhoneAuth.setupRecaptcha("recaptcha-container", "normal");
  setRecaptchaReady(true);
};

// Step 2: Send OTP (only after reCAPTCHA is verified)
const handleSendOTP = async () => {
  if (!recaptchaReady) {
    setError("Please complete reCAPTCHA first");
    return;
  }
  
  await firebasePhoneAuth.sendOTP(phoneNumber);
};
```

#### **Option B: Single-Step with Loading States**
```typescript
const handleSendOTP = async () => {
  try {
    setStep("recaptcha"); // Show reCAPTCHA loading
    await firebasePhoneAuth.setupRecaptcha("recaptcha-container");
    
    setStep("sending"); // Show OTP sending
    await firebasePhoneAuth.sendOTP(phoneNumber);
    
    setStep("success"); // Show success message
  } catch (error) {
    setStep("error");
    setError(error.message);
  }
};
```

## 🔧 **Firebase Console Settings to Verify**

1. **Authentication > Sign-in method**:
   - ✅ Phone authentication enabled
   - ✅ Test phone numbers added (if using any)

2. **Authentication > Settings**:
   - ✅ Authorized domains include your domain(s)
   - ✅ `localhost`, `127.0.0.1` for development

3. **Project Settings > General**:
   - ✅ Web app is properly registered
   - ✅ API key is correct and unrestricted (or includes Identity Toolkit API)

## 🧪 **Testing Guide**

### **Test with Production Numbers**:
1. Use a real phone number (not test number)
2. Complete visible reCAPTCHA manually
3. Should receive actual SMS

### **Test with Test Numbers** (Firebase Console):
1. Add test numbers in Authentication > Sign-in method > Phone
2. These should work without real SMS
3. Use the test verification codes you set

## 🚨 **Common Issues & Solutions**

| Error | Cause | Solution |
|-------|-------|----------|
| "Please complete reCAPTCHA first" | User didn't verify reCAPTCHA | Show clear UI for reCAPTCHA completion |
| "App verification failed" | reCAPTCHA expired/invalid | Refresh reCAPTCHA and try again |
| "reCAPTCHA verification failed" | Network/domain issues | Check authorized domains in Firebase |
| Still getting app credential errors | API key/project mismatch | Verify API key matches your project |

## 📝 **Next Steps**

1. **Update your UI** to use the improved flow above
2. **Test with real phone numbers** in development
3. **Monitor Firebase Console** for quota usage and errors
4. **Consider upgrading** to Firebase paid plan if hitting SMS limits

The key fix is ensuring reCAPTCHA is properly verified before attempting to send the OTP, especially for production phone numbers where Firebase is more strict about app verification.