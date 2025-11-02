#!/usr/bin/env node

const fs = require('fs');

console.log("🔍 Firebase Configuration Fix\n");

// Read service account
const serviceAccount = JSON.parse(fs.readFileSync('./firebase-service-account.json', 'utf8'));

console.log("📋 Service Account Details:");
console.log("Project ID:", serviceAccount.project_id);
console.log("Client Email:", serviceAccount.client_email);
console.log("Auth URI:", serviceAccount.auth_uri);
console.log("Token URI:", serviceAccount.token_uri);

console.log("\n⚠️ ISSUE FOUND:");
console.log("Your current Firebase config uses:");
console.log("- projectId: clubwiz-auth ✅");
console.log("- authDomain: clubwiz-auth.firebaseapp.com ✅");
console.log("- But API Key might be from wrong app registration");

console.log("\n📝 TO FIX THIS:");
console.log(`
1. Go to: https://console.firebase.google.com/project/${serviceAccount.project_id}/settings/general

2. Look for "Your apps" section

3. If you don't have a Web app, click "Add app" → "Web"

4. Register your app with these details:
   - App Name: "ClubViz Web" (or anything)
   - Hosting: Uncheck if you don't use Firebase Hosting

5. Copy the firebaseConfig from the registration page

6. You should get something like:
   {
     apiKey: "AIzaSy...",  // THIS IS THE KEY TO REPLACE
     authDomain: "clubwiz-auth.firebaseapp.com",
     projectId: "clubwiz-auth",
     storageBucket: "clubwiz-auth.appspot.com",
     messagingSenderId: "${serviceAccount.project_id.split(':')[1]}",
     appId: "1:${serviceAccount.project_id.split(':')[1]}:web:..."
   }

7. Update your .env.local with the NEW apiKey:
   NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_NEW_API_KEY_FROM_STEP_6

8. Also make sure to:
   ✅ Enable Phone Authentication: https://console.firebase.google.com/project/${serviceAccount.project_id}/authentication/providers
   ✅ Add localhost to authorized domains in Authentication settings
   ✅ Enable reCAPTCHA v3 in the same location

9. Restart your app and test again!
`);

console.log("\n⚡ Quick Test Command:");
console.log("After getting new credentials, update .env.local and run:");
console.log("npm run dev");
