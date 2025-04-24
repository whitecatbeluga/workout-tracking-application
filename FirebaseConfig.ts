import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const API_URL = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: (Constants.expoConfig?.extra as { API_KEY: string }).API_KEY,
  authDomain: "workout-tracking-app-e7a2d.firebaseapp.com",
  projectId: "workout-tracking-app-e7a2d",
  storageBucket: "workout-tracking-app-e7a2d.firebasestorage.app",
  messagingSenderId: "1038049349433",
  appId: "1:1038049349433:web:29431bc0fcfb3f8fbf22e8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
