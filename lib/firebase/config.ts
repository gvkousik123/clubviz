import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration for clubwiz-auth project
// Based on your service account, this is your project configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummy_Key_Replace_With_Real_Key",
  authDomain: "clubwiz-auth.firebaseapp.com",
  projectId: "clubwiz-auth",
  storageBucket: "clubwiz-auth.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "101064381399201423611",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:101064381399201423611:web:dummy_app_id"
};

console.log("Firebase Config:", {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 10) + "..." : "NOT SET"
});

// Initialize Firebase
let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

export { auth };
export default app;