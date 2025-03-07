#!/usr/bin/env node

/**
 * Cleanup script to remove unnecessary files and folders
 * Run with: node scripts/cleanup.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Files to be deleted from the root directory
const ROOT_FILES_TO_DELETE = [
  ".DS_Store",
  "firebase.json",
  "firestore.rules",
  ".firebaserc",
];

// Clean up functions
function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error deleting ${filePath}:`, err);
  }
}

function cleanupEmptyFiles(directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        cleanupEmptyFiles(filePath);
      } else if (stats.size === 0) {
        deleteFile(filePath);
      }
    });
  } catch (err) {
    console.error(`Error cleaning directory ${directoryPath}:`, err);
  }
}

// Execute cleanup
console.log("Starting cleanup process...");

// Delete specific files from root
ROOT_FILES_TO_DELETE.forEach((file) => {
  deleteFile(path.join(__dirname, "..", file));
});

// Clean empty files in server routes directory
cleanupEmptyFiles(path.join(__dirname, "..", "server", "routes"));

// Remove build artifacts if needed
if (fs.existsSync(path.join(__dirname, "..", "build"))) {
  try {
    execSync("rm -rf build");
    console.log("Removed build directory");
  } catch (err) {
    console.error("Error removing build directory:", err);
  }
}

console.log("Cleanup completed.");
