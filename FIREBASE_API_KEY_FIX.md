# 🔥 Firebase API Key Issue - Complete Fix Guide

## ❌ Current Error
```
Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)
```

## 🔍 Root Cause Analysis

Your Firebase setup has a **mismatched or invalid API key**. The current key:
```
AIzaSyAF_ltSByrLYa8YY8m71EsgPrKPM8EqhwE
```

This key either:
1. ❌ Belongs to a different Firebase project
2. ❌ Is restricted to specific APIs (not including reCAPTCHA)
3. ❌ Was generated without Web app registration
4. ❌ Has API restrictions that don't include Auth APIs

---

## ✅ Step-by-Step Fix

### **Step 1: Get the Correct API Key**

1. Go to: [Firebase Console - clubwiz-auth project](https://console.firebase.google.com/project/clubwiz-auth/settings/general)

2. Scroll down to **"Your apps"** section (bottom of page)

3. You should see:
   - If **NO web app exists**: Click **"Add app"** → Choose **Web** icon
   - If **web app exists**: Click on it to view config

### **Step 2: Register Web App (if needed)**

If no web app, click "Add app":
- **App name**: `ClubViz Web`
- **Firebase Hosting**: Uncheck (we're not using it)
- **Register app**

Firebase will show you the config:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy_COPY_YOUR_ACTUAL_KEY_HERE",  ⭐ THIS ONE
  authDomain: "clubwiz-auth.firebaseapp.com",
  projectId: "clubwiz-auth",
  storageBucket: "clubwiz-auth.appspot.com",
  messagingSenderId: "619308164050",
  appId: "1:619308164050:web:YOUR_APP_ID_HERE"
};
```

### **Step 3: Copy the NEW API Key**

Copy the `apiKey` value from the config shown in Firebase Console.

### **Step 4: Update .env.local**

Replace the old key with the new one:

**Current (OLD):**
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAF_ltSByrLYa8YY8m71EsgPrKPM8EqhwE
```

**New (FROM FIREBASE CONSOLE):**
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy_YOUR_NEW_KEY_HERE
```

### **Step 5: Enable Phone Authentication**

1. Go to: [Firebase Auth Settings](https://console.firebase.google.com/project/clubwiz-auth/authentication/providers)

2. Click **"Phone"** in the sign-in methods list

3. Toggle it **ON** (enable)

4. Click **Save**

### **Step 6: Add Authorized Domains**

Still in Authentication settings:

1. Scroll to **"Authorized domains"** section

2. Click **"Add domain"** and add:
   - `localhost`
   - `127.0.0.1`
   - `localhost:3000`
   - `localhost:3001`

3. Click **Save**

### **Step 7: Enable reCAPTCHA**

In the same Authentication settings:

1. Look for **"reCAPTCHA Enterprise"** or **"reCAPTCHA v3"** section

2. Make sure it's **enabled** (usually enabled by default with Phone Auth)

3. If prompted, create a reCAPTCHA key

### **Step 8: Restart Your Application**

```bash
npm run dev
```

Your app will hot-reload with the new credentials.

### **Step 9: Test Again**

Go to: `http://localhost:3001/auth/mobile`

You should now see:
✅ Firebase initializes successfully  
✅ reCAPTCHA widget appears  
✅ Send OTP button becomes enabled  
✅ Can send OTP to +91 7337066524

---

## 🔧 Verification Checklist

After applying the fix, verify:

- [ ] New API key added to `.env.local`
- [ ] `.env.local` file saved
- [ ] Development server restarted (`npm run dev`)
- [ ] Phone authentication enabled in Firebase Console
- [ ] Authorized domains include `localhost`
- [ ] reCAPTCHA is enabled
- [ ] Test page shows ✅ messages, not ❌ errors
- [ ] reCAPTCHA widget appears on test page
- [ ] "Send OTP" button is clickable

---

## 🚨 If Issue Persists

If you still see the error after these steps:

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Check .env.local** - Make sure new key is saved
3. **Restart server** - Stop and run `npm run dev` again
4. **Check Firebase Console** - Verify Phone Auth is enabled
5. **Check browser console** (F12) - Look for specific error messages

If still stuck, run this to verify your config:
```bash
node test-firebase.js
```

---

## 📚 Related Documentation

- [Firebase Web Setup Guide](https://firebase.google.com/docs/web/setup)
- [Firebase Phone Authentication](https://firebase.google.com/docs/auth/web/phone-auth)
- [reCAPTCHA Integration](https://firebase.google.com/docs/auth/web/recaptcha)

---

**After fixing, your mobile auth should work perfectly! 🎉**
