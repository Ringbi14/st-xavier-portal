import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBQ2YjSZiWIBK6rGgLOBTfXR9AogBncOVE",
  authDomain: "sxc-department-of-social-work.firebaseapp.com",
  projectId: "sxc-department-of-social-work",
  storageBucket: "sxc-department-of-social-work.firebasestorage.app",
  messagingSenderId: "585566401982",
  appId: "1:585566401982:web:a5b270bf024a8a6eddf5ef",
  measurementId: "G-YXVGCMWG1S",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };