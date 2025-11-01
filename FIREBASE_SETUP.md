# Firebase Phone Authentication Setup

## Prerequisites

1. Firebase project with Phone Authentication enabled
2. Web app configured in Firebase Console
3. Authorized domains configured

## Environment Variables

Create a `.env.local` file in the root directory with the following Firebase configuration values:

```env
# Firebase Configuration
# Get these values from Firebase Console -> Project Settings -> General -> Your apps -> Web app -> Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here  
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
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