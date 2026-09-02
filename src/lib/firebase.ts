import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDad_fgCrSYkI8VvFS-Hr5p1RWP0iw_HM0",
  authDomain: "st-xavier-social-work-2002.firebaseapp.com",
  projectId: "st-xavier-social-work-2002",
  storageBucket: "st-xavier-social-work-2002.firebasestorage.app",
  messagingSenderId: "1056586073809",
  appId: "1:1056586073809:web:9dd756f7ef5e2d6b38c35d",
  measurementId: "G-880M61XEK2"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };