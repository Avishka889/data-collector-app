import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "REDACTED_API_KEY",
  authDomain: "wellmed-data-collection.firebaseapp.com",
  projectId: "wellmed-data-collection",
  storageBucket: "wellmed-data-collection.firebasestorage.app",
  messagingSenderId: "REDACTED_SENDER_ID",
  appId: "REDACTED_APP_ID",
  measurementId: "REDACTED_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
