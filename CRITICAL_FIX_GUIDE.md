# 🚨 CRITICAL FIX: Invalid App Credential Error

## ✅ **CONFIRMED ISSUE**

Your API key `AIzaSyAPB69pxPrG_7JzcrvwloiIYphRYzpfCBQ` is **INVALID** for project `clubwiz-477108`.

**Console Error**: `auth/network-request-failed` + `Invalid app credential`

## 🔧 **STEP-BY-STEP FIX**

### **Step 1: Get Correct Firebase Credentials**

1. **Open Firebase Console**: https://console.firebase.google.com/project/clubwiz-477108/settings/general

2. **Scroll to "Your apps" section** (bottom of page)

3. **Check if you have a web app**:
   - ✅ **If you see a web app**: Click on it to view config
   - ❌ **If no web app exists**: Click **"Add app"** → Select **Web** icon

4. **Register web app** (if creating new):
   - **App nickname**: `ClubViz Web`
   - **Firebase Hosting**: Leave unchecked
   - Click **"Register app"**

5. **Copy the config**: Firebase will show you something like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy_NEW_CORRECT_KEY_HERE",
     authDomain: "clubwiz-477108.firebaseapp.com",
     projectId: "clubwiz-477108",
     storageBucket: "clubwiz-477108.firebasestorage.app",
     messagingSenderId: "260703019239",
     appId: "1:260703019239:web:CORRECT_APP_ID_HERE"
   };
   ```

### **Step 2: Update .env.local**

Replace your current `.env.local` content with:

```bash
# Firebase Configuration for clubwiz-477108
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy_PUT_YOUR_CORRECT_KEY_HERE
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=260703019239
NEXT_PUBLIC_FIREBASE_APP_ID=1:260703019239:web:PUT_YOUR_CORRECT_APP_ID_HERE
```

### **Step 3: Verify Phone Auth is Enabled**

1. **Go to Authentication**: https://console.firebase.google.com/project/clubwiz-477108/authentication/providers

2. **Enable Phone authentication**:
   - Click **"Phone"** in the Sign-in methods list
   - Toggle it **ON** (enable)
   - Click **"Save"**

3. **Add authorized domains** (if not already there):
   - Scroll to **"Authorized domains"**
   - Add: `localhost`, `127.0.0.1`
   - Add your production domain when ready

### **Step 4: Test the Fix**

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test API key**:
   ```bash
   node test-api-key.js
   ```
   Should show: ✅ API key is valid

3. **Test phone auth**:
   - Go to: http://localhost:3001/auth/mobile
   - Enter phone number
   - Should work without "Invalid app credential" error

## 🎯 **Expected Results After Fix**

- ✅ No more `auth/network-request-failed` errors
- ✅ No more "Invalid app credential" errors  
- ✅ reCAPTCHA loads properly
- ✅ OTP sends successfully to real phone numbers
- ✅ Authentication flow works end-to-end

## 🚨 **If Still Not Working**

Check these additional settings:

### **API Key Restrictions**
1. Go to: https://console.cloud.google.com/apis/credentials?project=clubwiz-477108
2. Find your API key and click it
3. Under **"API restrictions"**:
   - Either select **"Don't restrict key"**
   - OR ensure **"Identity Toolkit API"** is enabled

### **reCAPTCHA Settings**
1. In Firebase Console > Authentication > Sign-in method
2. Scroll to **"reCAPTCHA Enterprise"** section
3. Make sure it's properly configured

---

**The core issue was**: Wrong API key for wrong project. Your code is fine, just needed correct credentials!