import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTMjc6SLDQFATn5IrJ0TSkC1W0A68ZjOc",
  authDomain: "workout-tracking-app-e7a2d.firebaseapp.com",
  projectId: "workout-tracking-app-e7a2d",
  storageBucket: "workout-tracking-app-e7a2d.firebasestorage.app",
  messagingSenderId: "1038049349433",
  appId: "1:1038049349433:web:29431bc0fcfb3f8fbf22e8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  if (error.code === "auth/already-initialized") {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
