import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDTAjEgyFixXk8yFLpWqwXTnTZPeqlWN-Y",
  authDomain: "ecommerce-70f46.firebaseapp.com",
  projectId: "ecommerce-70f46",
  storageBucket: "ecommerce-70f46.firebasestorage.app",
  messagingSenderId: "819563520513",
  appId: "1:819563520513:web:2d6eb65ab863806153d600",
  measurementId: "G-DJJLK89T9C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
