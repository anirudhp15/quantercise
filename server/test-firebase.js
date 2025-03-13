const admin = require("firebase-admin");
const fs = require("fs");

try {
  // Read the file directly with fs
  const rawData = fs.readFileSync("./firebase-service-account.json", "utf8");
  console.log("Raw file contents type:", typeof rawData);
  console.log("Raw file first 50 chars:", rawData.substring(0, 50) + "...");

  // Try to parse the JSON
  const serviceAccount = JSON.parse(rawData);

  // Initialize Firebase with the service account
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error("Error:", error.message);
  if (error.stack) {
    console.error("Stack:", error.stack);
  }
}
