# 🚨 Firebase Setup Fix for ClubViz Phone Authentication

## THE ISSUE: You need Firebase WEB APP config, not service account!

The error "api-key-not-valid" happens because you need **Firebase Web App configuration**, not the service account JSON.

## QUICK FIX STEPS:

### 1. Get Firebase Web App Configuration

1. **Go to**: https://console.firebase.google.com
2. **Select project**: "clubwiz-auth" 
3. **Project Settings** (gear icon) → **General tab**
4. **Scroll to "Your apps"** section
5. **If no web app exists**: Click "Add app" → Web icon `</>` → Name it "ClubViz Web"
6. **Copy this config**:

```javascript
// You'll see something like this - COPY THE REAL VALUES
const firebaseConfig = {
  apiKey: "AIzaSyC-REAL-API-KEY-HERE",
  authDomain: "clubwiz-auth.firebaseapp.com", 
  projectId: "clubwiz-auth",
  storageBucket: "clubwiz-auth.appspot.com",
  messagingSenderId: "101064381399201423611",
  appId: "1:101064381399201423611:web:REAL-APP-ID-HERE"
};
```

### 2. Update Your Environment File

Replace the values in `.env.local`:

```env
# REPLACE WITH YOUR ACTUAL VALUES FROM STEP 1
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC-REAL-API-KEY-HERE
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=101064381399201423611
NEXT_PUBLIC_FIREBASE_APP_ID=1:101064381399201423611:web:REAL-APP-ID-HERE
```

## Firebase Console Setup

### 1. Enable Phone Authentication

1. Go to Firebase Console -> Authentication
2. Click on "Sign-in method" tab
3. Enable "Phone" provider
4. Configure your settings

### 2. Configure Authorized Domains

1. In the same "Sign-in method" section
2. Scroll down to "Authorized domains"
3. Add your domains:
   - `localhost` (for development)
   - `your-production-domain.com` (for production)

### 3. Get Configuration Values

1. Go to Project Settings -> General
2. Scroll down to "Your apps" section
3. Click on your web app or add a new one
4. Copy the config values and add them to your `.env.local` file

## Testing Phone Authentication

### Development Testing

Firebase provides test phone numbers for development:

1. Go to Firebase Console -> Authentication -> Settings
2. Add test phone numbers under "Phone numbers for testing"
3. Example: `+1 650-555-3434` with verification code `654321`

### Production Considerations

1. **Rate Limiting**: Firebase has built-in rate limiting for SMS
2. **Quotas**: Check your SMS quota in Firebase Console
3. **Billing**: SMS charges may apply based on your plan
4. **Security**: reCAPTCHA is automatically handled by Firebase

## Troubleshooting

### Common Issues

1. **"reCAPTCHA verification failed"**
   - Check authorized domains in Firebase Console
   - Make sure domain matches exactly (no extra paths)

2. **"Operation not allowed"**
   - Enable Phone authentication in Firebase Console
   - Check if your Firebase plan supports SMS

3. **"Invalid phone number"**
   - Use international format: `+[country code][number]`
   - Example: `+91xxxxxxxxxx` for India

4. **"SMS quota exceeded"**
   - Check usage in Firebase Console
   - Upgrade plan if needed

## Code Usage

The Firebase phone auth is integrated into:

- `/auth/mobile` - Phone number input and OTP sending
- `/auth/otp` - OTP verification
- Context provider for app-wide auth state management

## Security Notes

1. Firebase automatically handles reCAPTCHA verification
2. ID tokens are automatically generated and can be used for backend verification
3. Phone numbers are stored securely in Firebase Auth
4. Rate limiting prevents abuse

## Next Steps

After successful authentication:

1. User data is stored in Firebase Auth
2. ID tokens can be sent to your backend for verification
3. Use the auth context to check authentication state throughout your app