import { initializeApp } from "firebase/app";
import {
  getAuth,
} from "firebase/auth";
import {
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArKRl_39TdR_X4aV3k3kFXPIWA9fkE_pc",
  authDomain: "selfie-5a4b1.firebaseapp.com",
  projectId: "selfie-5a4b1",
  storageBucket: "selfie-5a4b1.appspot.com",
  messagingSenderId: "276208257512",
  appId: "1:276208257512:web:75b85cce591b472df13c5d",
  measurementId: "G-3J0B9G88YP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
