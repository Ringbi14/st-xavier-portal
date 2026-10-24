import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const apps = getApps();

const adminApp = !apps.length
  ? initializeApp(
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY
        ? {
            credential: cert({
              projectId:
                process.env.FIREBASE_ADMIN_PROJECT_ID ||
                process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
                "sxc-department-of-social-work",
              clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
            }),
            storageBucket: "sxc-department-of-social-work.firebasestorage.app",
          }
        : {
            projectId:
              process.env.FIREBASE_ADMIN_PROJECT_ID ||
              process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
              "sxc-department-of-social-work",
            storageBucket: "sxc-department-of-social-work.firebasestorage.app",
          }
    )
  : apps[0];

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);