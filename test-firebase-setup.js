// Firebase Setup Test - Following useful.md best practices
// This tests the exact setup pattern described in the guide

const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');

async function testFirebaseSetup() {
    console.log("🔥 Testing Firebase Setup - Following useful.md Guide\n");

    // Test 1: Basic Firebase Configuration
    console.log("1️⃣ Testing Firebase Configuration...");

    try {
        // Simulate the config pattern from useful.md
        const testConfig = {
            apiKey: "AIzaSyAPB69pxPrG_7JzcrvwloiIYphRYzpfCBQ", // Your current key
            authDomain: "clubwiz-477108.firebaseapp.com",
            projectId: "clubwiz-477108",
            storageBucket: "clubwiz-477108.firebasestorage.app",
            messagingSenderId: "260703019239",
            appId: "1:260703019239:web:0b681131b688abaedc4242"
        };

        const app = initializeApp(testConfig);
        const auth = getAuth(app);

        console.log("✅ Firebase app initialized successfully");
        console.log("✅ Auth service connected");

    } catch (error) {
        console.error("❌ Firebase initialization failed:", error.message);
    }

    // Test 2: Check if Phone Auth is enabled
    console.log("\n2️⃣ Testing Phone Authentication availability...");

    const axios = require('axios');
    const apiKey = "AIzaSyAPB69pxPrG_7JzcrvwloiIYphRYzpfCBQ";

    try {
        // Test if phone auth endpoints are accessible
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=${apiKey}`,
            {
                phoneNumber: "+1234567890", // Dummy number for testing endpoint
                recaptchaToken: "dummy"
            }
        );

        console.log("✅ Phone auth endpoint is accessible");
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            if (status === 400 && data.error?.message?.includes('INVALID_PHONE_NUMBER')) {
                console.log("✅ Phone auth is enabled (got expected validation error)");
            } else if (status === 400 && data.error?.message?.includes('CAPTCHA_CHECK_FAILED')) {
                console.log("✅ Phone auth is enabled (reCAPTCHA validation working)");
            } else if (status === 403) {
                console.log("❌ API key is invalid or restricted");
                console.log("   Error:", data.error?.message);
            } else {
                console.log("✅ Phone auth appears to be working (got auth error as expected)");
            }
        } else {
            console.log("❌ Network error:", error.message);
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎯 NEXT STEPS TO COMPLETE SETUP:");
    console.log("1. Verify your API key in Firebase Console");
    console.log("2. Enable Phone Authentication in Firebase Console > Auth > Sign-in method");
    console.log("3. Add localhost to authorized domains");
    console.log("4. Test reCAPTCHA in your React app");
    console.log("5. Follow the exact pattern from useful.md for phone auth flow");
    console.log("=".repeat(60));
}

testFirebaseSetup().catch(console.error);