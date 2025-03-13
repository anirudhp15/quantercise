#!/bin/bash

# Script to prepare for Vercel deployment by fixing common issues

echo "Starting deployment preparation..."

# Fix react-scripts issue
echo "Installing react-scripts..."
npm install react-scripts

# Fix date-fns issue
echo "Fixing date-fns dependency..."
npm uninstall date-fns
npm install date-fns@2.30.0

# Install all dependencies - avoid node-gyp issues with --no-optional flag
echo "Installing dependencies..."
npm install --no-optional

# Build to test locally before deployment
echo "Testing build locally..."
SKIP_PREFLIGHT_CHECK=true REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51O5QbNHXnmNztRuxJ0ZlaCFdgIwp4UZHU5Mce5JqSLwQwBFxgWBJMXyLSdtGiS14cG3MCPQ43P4MCmvkMUNTXZvF00L4DUlhBm npm run build

echo "Preparation complete! If the build was successful, you can now deploy to Vercel."
echo "Run 'vercel' or 'vercel --prod' to deploy." 