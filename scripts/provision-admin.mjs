import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultKeyPath = path.resolve(__dirname, '../serviceAccountKey.json');
const envKeyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  ? path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS)
  : null;

const serviceAccountPath =
  envKeyPath && fs.existsSync(envKeyPath)
    ? envKeyPath
    : fs.existsSync(defaultKeyPath)
    ? defaultKeyPath
    : null;

if (!serviceAccountPath) {
  console.error("Please place serviceAccountKey.json in the project root before running this script.");
  process.exit(1);
}

const email = process.argv[2] || process.env.ADMIN_PROVISION_EMAIL;

if (!email) {
  console.error("Error: Please provide a target email as an argument or via ADMIN_PROVISION_EMAIL.");
  console.error("Usage: node scripts/provision-admin.mjs <email>");
  process.exit(1);
}

let serviceAccount;
try {
  const fileContent = fs.readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(fileContent);
} catch (err) {
  console.error(`Failed to read or parse service account file at ${serviceAccountPath}:`, err.message);
  process.exit(1);
}

const app = initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth(app);

async function provisionAdmin() {
  try {
    console.log(`Looking up user for email: ${email}...`);
    const user = await auth.getUserByEmail(email);
    console.log(`User found. UID: ${user.uid}`);

    console.log(`Setting custom user claims { admin: true } for UID: ${user.uid}...`);
    await auth.setCustomUserClaims(user.uid, { admin: true });

    const updatedUser = await auth.getUser(user.uid);
    console.log("Updated claims verified successfully:");
    console.log(updatedUser.customClaims);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`Error: User with email "${email}" was not found in Firebase Auth.`);
    } else {
      console.error("Error setting custom claims:", error.message || error);
    }
    process.exit(1);
  }
}

provisionAdmin();
