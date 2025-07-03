import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTAjEgyFixXk8yFLpWqwXTnTZPeqlWN-Y",
  authDomain: "ecommerce-70f46.firebaseapp.com",
  projectId: "ecommerce-70f46",
  storageBucket: "ecommerce-70f46.firebasestorage.app",
  messagingSenderId: "819563520513",
  appId: "1:819563520513:web:2d6eb65ab863806153d600",
  measurementId: "G-DJJLK89T9C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;