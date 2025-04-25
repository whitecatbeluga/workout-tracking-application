import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: (Constants.expoConfig?.extra as { FIREBASE_KEY: string })
    .FIREBASE_KEY,
  authDomain: "workout-app-59927.firebaseapp.com",
  projectId: "workout-app-59927",
  storageBucket: "workout-app-59927.firebasestorage.app",
  messagingSenderId: "683585224838",
  appId: "1:683585224838:web:5c6379c015bd10eef51107",
  measurementId: "G-T4HWY5HB7E",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
