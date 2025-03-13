const fs = require("fs");
const path = require("path");

try {
  // Read the file directly with fs
  const serviceAccountPath = path.join(
    __dirname,
    "firebase-service-account.json"
  );
  console.log("Reading from:", serviceAccountPath);

  const rawData = fs.readFileSync(serviceAccountPath, "utf8");

  console.log("File size:", rawData.length, "bytes");
  console.log("First 100 chars:", JSON.stringify(rawData.substring(0, 100)));

  // Check for BOM and other potential issues
  const firstFewBytes = [];
  for (let i = 0; i < Math.min(10, rawData.length); i++) {
    firstFewBytes.push(rawData.charCodeAt(i).toString(16));
  }
  console.log("First few bytes (hex):", firstFewBytes.join(" "));

  // Try to parse the JSON
  console.log("Attempting to parse JSON...");
  const serviceAccount = JSON.parse(rawData);
  console.log("JSON parsed successfully");
  console.log("Keys in the parsed object:", Object.keys(serviceAccount));
} catch (error) {
  console.error("Error:", error.message);
  if (error.stack) {
    console.error("Stack:", error.stack);
  }
}
