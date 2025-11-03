# 🎯 EXACT CODE LOCATIONS - Firebase Environment Keys Usage

## 1️⃣ WHERE THE KEYS ARE LOADED FROM .env.local

**File: `lib/firebase/config.ts`** (Lines 7, 11, 12)

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAF_ltSByrLYa8YY8m71EsgPrKPM8EqhwE",
  authDomain: "clubwiz-auth.firebaseapp.com",
  projectId: "clubwiz-auth",
  storageBucket: "clubwiz-auth.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "619308164050",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:619308164050:web:a5613ec4814b5239d69e8b"
};

app = initializeApp(firebaseConfig);
auth = getAuth(app);
```

📌 **Key Points:**
- **Line 7:** Loads `NEXT_PUBLIC_FIREBASE_API_KEY` - Used for authentication & reCAPTCHA
- **Line 11:** Loads `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase initialization
- **Line 12:** Loads `NEXT_PUBLIC_FIREBASE_APP_ID` - App identification
- **Line 25-26:** Creates Firebase app and auth object using these keys

---

## 2️⃣ WHERE THE KEYS ARE USED FOR RECAPTCHA SETUP

**File: `lib/firebase/phone-auth.ts`** (Lines 1-9, 37-48)

```typescript
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  onAuthStateChanged,
  User,
  signOut
} from "firebase/auth";
import { auth } from "./config";  // ⬅️ Imports auth initialized with your keys

// ...

setupRecaptcha(containerId: string = 'recaptcha-container', size: 'invisible' | 'normal' = 'invisible'): void {
    try {
      // Clear existing verifier
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }

      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: size,
        callback: (response: any) => {
          console.log("reCAPTCHA verified", response);
        },
      });

      console.log("reCAPTCHA setup complete");
    } catch (error) {
      console.error("Error setting up reCAPTCHA:", error);
      throw error;
    }
  }
```

📌 **Key Points:**
- **Line 9:** Imports `auth` object that contains your API keys
- **Line 37:** `new RecaptchaVerifier(auth, ...)` - Uses the Firebase auth (which uses your API key)
- This is where **`NEXT_PUBLIC_FIREBASE_API_KEY`** is actually used for reCAPTCHA

---

## 3️⃣ WHERE OTP IS SENT USING THESE KEYS

**File: `lib/firebase/phone-auth.ts`** (Lines 58-88)

```typescript
async sendOTP(phoneNumber: string): Promise<boolean> {
    try {
      // Validate phone number format
      if (!phoneNumber.startsWith('+')) {
        throw new Error('Phone number must be in international format (e.g., +91xxxxxxxxxx)');
      }

      // Setup reCAPTCHA if not already done
      if (!window.recaptchaVerifier) {
        this.setupRecaptcha();
      }

      const appVerifier = window.recaptchaVerifier;
      
      console.log("Sending OTP to:", phoneNumber);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      // ⬆️⬆️⬆️ Uses 'auth' object which contains your API keys
      
      // Store confirmation result globally for verification
      window.confirmationResult = confirmationResult;
      
      console.log("OTP sent successfully");
      return true;
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      // Clear reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
```

📌 **Key Points:**
- **Line 73:** `signInWithPhoneNumber(auth, phoneNumber, appVerifier)`
- This line uses the `auth` object which was initialized with your API keys
- **`NEXT_PUBLIC_FIREBASE_API_KEY`** is used here to authenticate the OTP request to Firebase

---

## 4️⃣ WHERE IT'S CALLED FROM MOBILE PAGE

**File: `app/auth/mobile/page.tsx`** (Lines 1-98)

```typescript
"use client";

import { useState, useEffect } from "react";
import { firebasePhoneAuth } from "@/lib/firebase/phone-auth";  // ⬅️ Imports the service
import { useToast } from "@/hooks/use-toast";
import { STORAGE_KEYS } from "@/lib/constants/storage";

export default function MobileVerificationScreen() {
    const router = useRouter();
    const { toast } = useToast();
    const [phoneNumber, setPhoneNumber] = useState("+91 XXXXXXXXXX");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Setup reCAPTCHA on component mount
    useEffect(() => {
        try {
            firebasePhoneAuth.setupRecaptcha('recaptcha-container', 'invisible');
            // ⬆️ This uses the auth object with your API keys
        } catch (error) {
            console.error("Error setting up reCAPTCHA:", error);
        }

        // Cleanup on unmount
        return () => {
            firebasePhoneAuth.cleanup();
        };
    }, []);

    const handleSubmit = async () => {
        console.log("=== Mobile Login: handleSubmit called ===");
        console.log("Current phone number:", phoneNumber);

        setIsLoading(true);
        setError(null);

        try {
            // Clean phone number and format for Firebase
            const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

            if (cleanPhone.length !== 12) { // Should be 12 digits (91 + 10 digits)
                setError('Please enter a valid 10-digit mobile number');
                setIsLoading(false);
                return;
            }

            // Convert to international format for Firebase
            const formattedPhone = `+${cleanPhone}`;
            console.log("Formatted phone for Firebase:", formattedPhone);

            // Send OTP using Firebase with your API keys
            const success = await firebasePhoneAuth.sendOTP(formattedPhone);
            // ⬆️ This sends OTP using your NEXT_PUBLIC_FIREBASE_API_KEY
```

📌 **Key Points:**
- **Line 9:** Imports `firebasePhoneAuth` which uses your keys
- **Line 40:** Calls `firebasePhoneAuth.setupRecaptcha()` - Uses API key for reCAPTCHA
- **Line 98:** Calls `firebasePhoneAuth.sendOTP()` - Uses API key to send OTP

---

## 5️⃣ WHERE OTP IS VERIFIED

**File: `app/auth/otp/page.tsx`** (Lines 1-15)

```typescript
"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { firebasePhoneAuth } from "@/lib/firebase/phone-auth";  // ⬅️ Uses the service
import { useToast } from "@/hooks/use-toast";
import { STORAGE_KEYS } from "@/lib/constants/storage";
import { User } from "firebase/auth";

export default function OTPVerificationScreen() {
    const router = useRouter();
    const { toast } = useToast();
    
    const handleVerifyOTP = async (otpCode: string) => {
        // Uses firebasePhoneAuth.verifyOTP() which uses auth object with your API keys
    };
```

📌 **Key Points:**
- Uses `firebasePhoneAuth` to verify OTP
- This ultimately uses your API keys from .env.local

---

## 📊 COMPLETE EXECUTION CHAIN

```
.env.local
  ├─ NEXT_PUBLIC_FIREBASE_API_KEY
  ├─ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  └─ NEXT_PUBLIC_FIREBASE_APP_ID
      ↓
lib/firebase/config.ts (Line 7, 11, 12)
  ├─ firebaseConfig object created
  ├─ initializeApp(firebaseConfig) - Line 25
  └─ getAuth(app) - Line 26
      ↓
  Returns: auth object (contains your API keys)
      ↓
lib/firebase/phone-auth.ts
  ├─ Line 9: import { auth } from "./config"
  ├─ Line 37: new RecaptchaVerifier(auth, ...) 
      └─ Uses NEXT_PUBLIC_FIREBASE_API_KEY
  └─ Line 73: signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      └─ Uses NEXT_PUBLIC_FIREBASE_API_KEY
      ↓
app/auth/mobile/page.tsx
  ├─ Line 40: firebasePhoneAuth.setupRecaptcha() - Uses API key
  └─ Line 98: firebasePhoneAuth.sendOTP() - Uses API key
      ↓
app/auth/otp/page.tsx
  └─ firebasePhoneAuth.verifyOTP() - Uses API key
      ↓
Firebase Backend - Authenticates using your keys ✅
```

---

## ✅ SUMMARY

| Key | File | Line | Purpose |
|-----|------|------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `lib/firebase/config.ts` | 7 | Loaded from env, used for auth & reCAPTCHA |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `lib/firebase/config.ts` | 11 | Loaded from env, Firebase initialization |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `lib/firebase/config.ts` | 12 | Loaded from env, Firebase app ID |
| All 3 keys combined | `lib/firebase/phone-auth.ts` | 9 | Create auth object used for all OTP operations |
| Auth object | `app/auth/mobile/page.tsx` | 40, 98 | Used for reCAPTCHA setup and OTP sending |
| Auth object | `app/auth/otp/page.tsx` | 1-15 | Used for OTP verification |

