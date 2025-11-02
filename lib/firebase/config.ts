import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration for clubwiz-auth project
// Real credentials from Firebase Console
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAF_ltSByrLYa8YY8m71EsgPrKPM8EqhwE",
  authDomain: "clubwiz-auth.firebaseapp.com",
  projectId: "clubwiz-auth",
  storageBucket: "clubwiz-auth.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "619308164050",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:619308164050:web:a5613ec4814b5239d69e8b"
};

console.log("🔥 Firebase Config:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKey: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 10) + "..." : "NOT SET"
});

// Initialize Firebase
let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
  throw error;
}

export { auth };
export default app;