// Test Firebase API Key for clubwiz-477108 project
const axios = require('axios');

async function testCorrectAPIKey() {
    console.log("🔍 Testing Firebase API Key for project: clubwiz-477108\n");

    // The WRONG key currently in your .env.local
    const wrongKey = "AIzaSyAPB69pxPrG_7JzcrvwloiIYphRYzpfCBQ";

    console.log("❌ Testing WRONG key (current in .env.local):");
    await testAPIKey(wrongKey, "WRONG KEY");

    console.log("\n" + "=".repeat(60));
    console.log("🔧 TO FIX THIS ISSUE:");
    console.log("1. Go to: https://console.firebase.google.com/project/clubwiz-477108/settings/general");
    console.log("2. Scroll to 'Your apps' section");
    console.log("3. Click your web app OR click 'Add app' > Web");
    console.log("4. Copy the apiKey from the config");
    console.log("5. Update .env.local with the new key");
    console.log("6. Restart your server: npm run dev");
    console.log("=".repeat(60));
}

async function testAPIKey(apiKey, label) {
    try {
        // Test the API key by making a request to Firebase Auth
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
            {
                email: "test@example.com",
                password: "testpass",
                returnSecureToken: true
            }
        );
        console.log(`✅ ${label}: API key is valid`);
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            if (status === 400 && data.error?.message?.includes('EMAIL_EXISTS')) {
                console.log(`✅ ${label}: API key is valid (test email already exists)`);
            } else if (status === 400 && data.error?.message?.includes('WEAK_PASSWORD')) {
                console.log(`✅ ${label}: API key is valid (weak password error expected)`);
            } else if (status === 403) {
                console.log(`❌ ${label}: API key is INVALID or RESTRICTED`);
                console.log(`   Error: ${data.error?.message || 'Forbidden'}`);
            } else if (status === 400 && data.error?.message) {
                console.log(`✅ ${label}: API key is valid (got expected auth error)`);
            } else {
                console.log(`❓ ${label}: Unexpected response - ${status}`);
                console.log(`   ${JSON.stringify(data, null, 2)}`);
            }
        } else {
            console.log(`❌ ${label}: Network error - ${error.message}`);
        }
    }
}

testCorrectAPIKey().catch(console.error);