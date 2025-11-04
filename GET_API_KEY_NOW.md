# 📍 EXACTLY WHERE TO FIND & COPY YOUR API KEY

## 🎯 Direct Path to API Key

### **URL to Bookmark:**
```
https://console.firebase.google.com/project/clubwiz-477108/settings/general
```

---

## 📸 **Step-by-Step Visual Guide**

### **Step 1: Open Firebase Console**
- Go to: https://console.firebase.google.com/
- Sign in with your account
- Click on **clubwiz-477108** project

### **Step 2: Go to Project Settings**
In the left sidebar:
```
▼ Project Overview
  ▼ Build
  ▼ Run
  ▼ Release
  ⚙️ Project Settings  ← Click here
```

Or go directly to: https://console.firebase.google.com/project/clubwiz-477108/settings/general

### **Step 3: Find "Your apps" Section**
- You're now in **Project Settings > General** tab
- Scroll down the page
- You'll see a section labeled **"Your apps"**

It will show icons for:
- 📱 Android
- 🍎 iOS  
- 🌐 Web (this is what you need)

### **Step 4a: If Web App Already Exists**
- Click on the **Web app** card
- You'll see a section that says "Firebase SDK snippet"
- Look for this pattern:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",  ← COPY THIS VALUE
  authDomain: "clubwiz-477108.firebaseapp.com",
  projectId: "clubwiz-477108",
  storageBucket: "clubwiz-477108.firebasestorage.app",
  messagingSenderId: "260703019239",
  appId: "1:260703019239:web:XXXXXXXXXXXXXXXX",
  measurementId: "G-XXXXXXXXXX"
};
```

### **Step 4b: If No Web App Exists**
- Click the **"Add app"** button
- Select the **Web icon** 🌐
- Give it a name: `ClubViz Web`
- Check "Also set up Firebase Hosting" → **UNCHECK** it
- Click **"Register app"**
- Firebase will show the config snippet (same as above)

---

## 🔑 **Exactly What to Copy**

### **The API Key:**

Look for this line in the config:
```javascript
apiKey: "AIzaSy_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
```

Copy the **entire value** including the quotes:
```
AIzaSy_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

(It will start with `AIzaSy` and be about 40 characters long)

---

## ✏️ **Where to Paste It**

Open this file:
```
lib/firebase/config.ts
```

Find this line (should be line 7):
```typescript
  apiKey: "AIzaSyAPB69pxPrG_7JzcrvwloiIYphRYzpfCBQ",
```

Replace it with:
```typescript
  apiKey: "AIzaSy_YOUR_COPIED_VALUE_HERE",
```

Example of what it will look like:
```typescript
  apiKey: "AIzaSyDfH9jK8lM2nO3pQ4rS5tU6vW7xY8zA",  // ← Your new key
```

---

## ✅ **Verification Checklist**

After copying and pasting the API key:

- [ ] API key starts with `AIzaSy`
- [ ] API key is about 40 characters long
- [ ] It's surrounded by quotes: `"AIzaSy..."`
- [ ] It ends with a comma: `,"` (in the config file)
- [ ] File is saved

---

## 🧪 **Test It**

After updating, run:
```bash
node verify-firebase-setup.js
```

You should see:
```
✅ API key format looks correct (starts with AIzaSy)
✅ Firebase app initializes successfully
✅ Auth service connected
```

---

## 🚨 **Common Mistakes**

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| `AIzaSyAPB69pxPrG_7JzcrvwloiIYphRYzpfCBQ` (old) | `AIzaSyDfH9jK8lM2nO3pQ4rS5tU6vW7xY8zA` (new) |
| Copied without quotes | Pasted as: `"AIzaSyDfH9jK8lM2nO3pQ4rS5tU6vW7xY8zA"` |
| From wrong project | From `clubwiz-477108` project |
| Only first part | Complete key (all 40 characters) |

---

## 📞 **If You Can't Find It**

1. **Make sure you're signed in** to Firebase Console
2. **Make sure you selected** the `clubwiz-477108` project
3. **Try the direct URL**: https://console.firebase.google.com/project/clubwiz-477108/settings/general
4. **Refresh the page** if nothing loads
5. **Check your permissions** - you might need to be a project owner

---

## 🎯 **Summary**

1. **Go here**: https://console.firebase.google.com/project/clubwiz-477108/settings/general
2. **Find**: "Your apps" > Web app
3. **Copy**: The `apiKey` value
4. **Paste**: Into `lib/firebase/config.ts` line 7
5. **Test**: Run `node verify-firebase-setup.js`
6. **Done!** 🎉