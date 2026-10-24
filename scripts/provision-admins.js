const path = require("path");
const fs = require("fs");
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const keyPath = path.resolve(__dirname, "../serviceAccountKey.json");

if (!fs.existsSync(keyPath)) {
  console.error("Missing serviceAccountKey.json in the project root folder!");
  process.exit(1);
}

const serviceAccount = require(keyPath);

const app = initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth(app);
const db = getFirestore(app);

// Added your account to the admin list
const FACULTY_ADMIN_EMAILS = [
  "dominicringbiba@gmail.com",
  "hod.socialwork@stxaviercollegespt.ac.in",
  "fieldwork.sw@stxaviercollegespt.ac.in",
  "john.sw@stxaviercollegespt.ac.in",
];

async function runProvisioning() {
  console.log("Starting administrative claims provisioning...");

  for (const email of FACULTY_ADMIN_EMAILS) {
    try {
      const userRecord = await auth.getUserByEmail(email);

      // 1. Set cryptographic custom claims on Firebase Auth
      await auth.setCustomUserClaims(userRecord.uid, {
        admin: true,
        approved: true,
      });

      // 2. Set/Merge Firestore document with admin role and approved status
      await db.collection("users").doc(userRecord.uid).set(
        {
          uid: userRecord.uid,
          email: userRecord.email,
          role: "admin",
          status: "approved",
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      console.log(`✓ SUCCESS: Granted admin claims to: ${email} (UID: ${userRecord.uid})`);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        console.warn(`! Skipped: ${email} is not created yet.`);
      } else {
        console.error(`✕ Failed to provision ${email}:`, error.message);
      }
    }
  }

  console.log("Provisioning complete.");
  process.exit(0);
}

runProvisioning();