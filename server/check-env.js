require("dotenv").config();

console.log("Env var exists:", !!process.env.FIREBASE_SERVICE_ACCOUNT);
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.log(
    "First few chars:",
    process.env.FIREBASE_SERVICE_ACCOUNT.substring(0, 10) + "..."
  );
}
