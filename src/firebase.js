import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBkg3FuEnLMBAM3YJkaS4aOLfsYcyQibA0",
  authDomain: "rxventory-6253b.firebaseapp.com",
  projectId: "rxventory-6253b",
  storageBucket: "rxventory-6253b.appspot.com",
  messagingSenderId: "1006220745550",
  appId: "1:1006220745550:web:1061161fa7a65b33181c1f"
};

const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);
