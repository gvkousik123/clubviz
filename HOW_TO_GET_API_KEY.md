# 🔥 How to Get and Update Correct API Key

## ⚠️ **CURRENT STATUS**

Your Firebase config is now **hardcoded** in:
- `lib/firebase/config.ts`

**Current API Key**: `AIzaSyAPB69pxPrG_7JzcrvwloiIYphRYzpfCBQ` ❌ (INVALID for clubwiz-477108)

## 🎯 **Step-by-Step: Get Correct Key**

### **Step 1: Open Firebase Console**

Go to: https://console.firebase.google.com/project/clubwiz-477108/settings/general

You should see the `clubwiz-477108` project dashboard.

### **Step 2: Find Your Web App**

Scroll down the page to the **"Your apps"** section.

You should see:
- 📱 An **Android app** icon (if Firebase for Android is set up)
- 🍎 An **iOS app** icon (if Firebase for iOS is set up)
- 🌐 A **Web app** icon (or placeholder saying "No web apps")

### **Step 3a: If Web App Already Exists**

- Click on the **Web app** 
- You'll see a code snippet with the Firebase config
- Copy the **`apiKey`** value

### **Step 3b: If No Web App Exists**

- Click **"Add app"** button
- Select the **Web icon** 🌐
- Enter app name: `ClubViz Web` (or similar)
- Uncheck "Also set up Firebase Hosting" 
- Click **"Register app"**
- Firebase will show you the config

### **Step 4: Copy the Config**

You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy_NEW_CORRECT_KEY_HERE",
  authDomain: "clubwiz-477108.firebaseapp.com",
  projectId: "clubwiz-477108",
  storageBucket: "clubwiz-477108.firebasestorage.app",
  messagingSenderId: "260703019239",
  appId: "1:260703019239:web:XXXXXXXXXXXXXXXX",
  measurementId: "G-XXXXXXXXXX"
};
```

**Copy the `apiKey` value** (it will start with `AIzaSy...`)

### **Step 5: Update the Code**

Open: `lib/firebase/config.ts`

Find line 7:
```typescript
  apiKey: "AIzaSyAPB69pxPrG_7JzcrvwloiIYphRYzpfCBQ", // ⚠️ REPLACE WITH CORRECT KEY
```

Replace it with your new key:
```typescript
  apiKey: "AIzaSy_YOUR_NEW_KEY_FROM_FIREBASE_CONSOLE",
```

### **Step 6: Verify All Values Match**

Make sure these all match your Firebase console:
```typescript
const firebaseConfig = {
  apiKey: "AIzaSy_YOUR_CORRECT_KEY",               // ✅ From Firebase Console
  authDomain: "clubwiz-477108.firebaseapp.com",    // ✅ Matches project
  projectId: "clubwiz-477108",                     // ✅ Correct project
  storageBucket: "clubwiz-477108.firebasestorage.app", // ✅ Correct project
  messagingSenderId: "260703019239",               // ✅ From Firebase Console
  appId: "1:260703019239:web:0b681131b688abaedc4242", // ✅ From Firebase Console
  measurementId: "G-X1VK4Y90XY"                    // ✅ From Firebase Console (if using Analytics)
};
```

### **Step 7: Test the Fix**

```bash
# 1. Run your dev server
npm run dev

# 2. Go to http://localhost:3001/auth/mobile

# 3. If reCAPTCHA loads, your API key is correct!
```

## 📸 **Visual Guide: Where to Find Your Web App in Firebase**

```
Firebase Console
└── clubwiz-477108 Project
    └── Project Settings (gear icon)
        └── General tab
            └── Scroll down
                └── "Your apps" section
                    └── 🌐 Web app (click here)
                        └── Copy the config from the code snippet
```

## ✅ **Quick Checklist**

- [ ] Opened Firebase Console for clubwiz-477108
- [ ] Found or created a Web app
- [ ] Copied the correct API key
- [ ] Updated `lib/firebase/config.ts` line 7
- [ ] Verified all other config values match
- [ ] Restarted dev server: `npm run dev`
- [ ] Tested phone auth page loads without errors

## 🎯 **After Getting Correct Key**

Once you update the API key, the following should work:

1. ✅ Firebase initializes without "invalid API key" errors
2. ✅ reCAPTCHA loads on the phone auth page
3. ✅ Phone authentication flow can proceed
4. ✅ No more "Invalid app credential" errors

---

**Need Help?** 

The API key in your Firebase Console always matches your project. If you see errors after updating, it means:
- You didn't copy the complete key
- You're looking at the wrong project
- You need to refresh your browser cache

Simply getting the key directly from Firebase Console and pasting it will fix the issue!