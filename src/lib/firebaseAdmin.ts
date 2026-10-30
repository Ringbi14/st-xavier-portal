import fs from "fs";
import path from "path";
import { cert, getApps, initializeApp, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";

let adminApp: App | null = null;
let adminAuth: Auth | null = null;

function loadServiceAccount(): Record<string, unknown> | null {
  // 1. Check direct JSON string environment variable (Vercel production standard)
  const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  if (envKey) {
    try {
      return JSON.parse(envKey);
    } catch {
      // Try base64 decoding if someone encoded the JSON string
      try {
        const decoded = Buffer.from(envKey, "base64").toString("utf-8");
        return JSON.parse(decoded);
      } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY environment variable:", e);
      }
    }
  }

  // 2. Check GOOGLE_APPLICATION_CREDENTIALS file path
  const gAppCredPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (gAppCredPath) {
    try {
      const resolved = path.resolve(gAppCredPath);
      if (fs.existsSync(resolved)) {
        const content = fs.readFileSync(resolved, "utf-8");
        return JSON.parse(content);
      }
    } catch (e) {
      console.warn("Could not read GOOGLE_APPLICATION_CREDENTIALS file:", e);
    }
  }

  // 3. Check local serviceAccountKey.json in process.cwd() (local dev)
  try {
    const localPath = path.join(process.cwd(), "serviceAccountKey.json");
    if (fs.existsSync(localPath)) {
      const content = fs.readFileSync(localPath, "utf-8");
      return JSON.parse(content);
    }
  } catch (e) {
    console.warn("Could not read local serviceAccountKey.json:", e);
  }

  return null;
}

export function isAdminConfigured(): boolean {
  if (adminAuth) return true;
  return loadServiceAccount() !== null;
}

export function getAdminAuth(): Auth {
  if (adminAuth) {
    return adminAuth;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    adminAuth = getAuth(adminApp);
    return adminAuth;
  }

  const serviceAccount = loadServiceAccount();
  if (!serviceAccount) {
    throw new Error(
      "Firebase Admin credentials not found. Please set FIREBASE_SERVICE_ACCOUNT_KEY in your deployment environment variables (e.g. Vercel) or place serviceAccountKey.json in your local project root."
    );
  }

  adminApp = initializeApp({
    credential: cert(serviceAccount),
  });
  adminAuth = getAuth(adminApp);
  return adminAuth;
}