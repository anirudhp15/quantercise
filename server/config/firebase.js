const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

let serviceAccount;

try {
  console.log("Starting Firebase Admin initialization...");

  // First try to read the JSON file
  const serviceAccountPath = path.join(
    __dirname,
    "..",
    "firebase-service-account.json"
  );
  console.log("Looking for service account at:", serviceAccountPath);

  if (fs.existsSync(serviceAccountPath)) {
    console.log("Service account file found, attempting to read...");
    const rawData = fs.readFileSync(serviceAccountPath, "utf8");
    console.log("File size:", rawData.length, "bytes");

    try {
      serviceAccount = JSON.parse(rawData);
      console.log("Successfully parsed service account from file");
    } catch (parseError) {
      console.error("Error parsing file:", parseError.message);
      throw parseError;
    }
  }
  // If file not found, try environment variable as fallback
  else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log("File not found, trying environment variable...");
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log(
        "Successfully parsed service account from environment variable"
      );
    } catch (parseError) {
      console.error("Error parsing environment variable:", parseError.message);
      throw parseError;
    }
  } else {
    throw new Error("No service account found in file or environment variable");
  }

  // Initialize Firebase
  console.log("Initializing Firebase with credential...");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase Admin:", error.message);
  console.error("Please ensure you have either:");
  console.error(
    "1. Placed the firebase-service-account.json file in the server directory"
  );
  console.error(
    "2. Or set the FIREBASE_SERVICE_ACCOUNT environment variable with the service account JSON"
  );
  process.exit(1);
}

module.exports = admin;
