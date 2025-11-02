// Test Firebase Configuration
const axios = require('axios');

async function testFirebaseConfig() {
    console.log("🔥 Testing Firebase Configuration...\n");

    const projectId = "clubwiz-auth";
    const apiKey = "AIzaSyAF_ltSByrLYa8YY8m71EsgPrKPM8EqhwE";

    // Test if API key is valid by making a request to Firebase Auth API
    try {
        console.log("1. Testing API Key validity...");
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
            {
                email: "test@example.com",
                password: "testpassword",
                returnSecureToken: true
            }
        );
        console.log("❌ API Key test failed - this shouldn't work but no error means key is valid");
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.log("✅ API Key is valid (expected error for test email)");
        } else if (error.response && error.response.status === 403) {
            console.log("❌ API Key is invalid or restricted");
            console.log("Error:", error.response.data);
        } else {
            console.log("❌ Network or other error:", error.message);
        }
    }

    // Test project configuration
    try {
        console.log("\n2. Testing Firebase Project Config...");
        const configResponse = await axios.get(
            `https://firebase.googleapis.com/v1beta1/projects/${projectId}`
        );
        console.log("✅ Project exists:", configResponse.data.displayName);
    } catch (error) {
        console.log("❌ Project access error:", error.response?.data || error.message);
    }

    console.log("\n🔍 Expected Firebase Config for 'clubwiz-auth' project:");
    console.log(`
    const firebaseConfig = {
      apiKey: "YOUR_WEB_API_KEY_HERE",
      authDomain: "clubwiz-auth.firebaseapp.com",
      projectId: "clubwiz-auth",
      storageBucket: "clubwiz-auth.appspot.com", 
      messagingSenderId: "619308164050",
      appId: "YOUR_WEB_APP_ID_HERE"
    };
    `);

    console.log("\n📝 To get the correct credentials:");
    console.log("1. Go to: https://console.firebase.google.com/project/clubwiz-auth/settings/general");
    console.log("2. Scroll down to 'Your apps' section");
    console.log("3. If no web app exists, click 'Add app' > Web");
    console.log("4. Copy the firebaseConfig object from there");
    console.log("5. Update your .env.local file with the correct values");
}

testFirebaseConfig().catch(console.error);