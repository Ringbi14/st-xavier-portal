const fs = require("fs");
const path = require("path");
const { initializeApp, cert } = require("firebase-admin/app");
const { getSecurityRules } = require("firebase-admin/security-rules");

const keyPath = path.resolve(__dirname, "../serviceAccountKey.json");
const rulesPath = path.resolve(__dirname, "../firestore.rules");

if (!fs.existsSync(keyPath)) {
  console.error("Missing serviceAccountKey.json!");
  process.exit(1);
}

const serviceAccount = require(keyPath);
const app = initializeApp({
  credential: cert(serviceAccount),
});

const rulesSource = fs.readFileSync(rulesPath, "utf8");

async function deploy() {
  console.log("Deploying firestore.rules to Firebase via Admin SDK...");
  const securityRules = getSecurityRules(app);
  const ruleset = await securityRules.releaseFirestoreRulesetFromSource(rulesSource);
  console.log("✓ Successfully deployed Firestore ruleset:", ruleset.name);
  console.log("✓ Creation time:", ruleset.createTime);
}

deploy()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("✕ Failed to deploy rules:", err);
    process.exit(1);
  });
