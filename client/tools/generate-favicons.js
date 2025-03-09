// This script will help you generate all required favicon variants
// To use:
// 1. Install sharp: npm install sharp
// 2. Run: node tools/generate-favicons.js

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SOURCE_FAVICON = path.join(__dirname, "../public/favicon.ico");
const OUTPUT_DIR = path.join(__dirname, "../public/favicons");

// Create the output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper function to save the image with the specified dimensions
async function generateFavicon(filename, width, height = width) {
  try {
    await sharp(SOURCE_FAVICON)
      .resize(width, height)
      .toFile(path.join(OUTPUT_DIR, filename));
    console.log(`✅ Generated ${filename}`);
  } catch (error) {
    console.error(`❌ Error generating ${filename}:`, error);
  }
}

// Generate all favicon variants
async function generateAllFavicons() {
  console.log("🔄 Generating favicon variants...");

  try {
    // For Apple devices
    await generateFavicon("apple-touch-icon.png", 180);

    // For Android devices
    await generateFavicon("android-chrome-192x192.png", 192);
    await generateFavicon("android-chrome-512x512.png", 512);

    // Standard favicons
    await generateFavicon("favicon-16x16.png", 16);
    await generateFavicon("favicon-32x32.png", 32);

    // For Microsoft devices
    await generateFavicon("mstile-150x150.png", 150);

    // Create a very basic SVG for Safari pinned tabs
    const safariSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="8" fill="#5bbad5"/>
    </svg>`;
    fs.writeFileSync(path.join(OUTPUT_DIR, "safari-pinned-tab.svg"), safariSvg);
    console.log("✅ Generated safari-pinned-tab.svg");

    console.log("✅ All favicons generated successfully!");
    console.log(`📁 Check the output directory: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error("❌ Error generating favicons:", error);
  }
}

generateAllFavicons();
