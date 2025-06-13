#!/bin/bash

echo "🔹 Setting up Local Financial Analyser"
echo "======================================"

# Install dependencies
echo "📦 Installing dependencies..."
npm install googleapis @google-cloud/local-auth

# Create directories
mkdir -p financial-reports
mkdir -p credentials

echo ""
echo "🔑 Gmail API Setup Required:"
echo ""
echo "1. Go to: https://console.cloud.google.com/"
echo "2. Create new project or select existing"
echo "3. Enable Gmail API"
echo "4. Create credentials (OAuth 2.0 Client ID)"
echo "5. Download credentials.json"
echo "6. Save as 'gmail-credentials.json' in this directory"
echo ""
echo "🔒 Security Note:"
echo "- Credentials stay local on your machine"
echo "- No external servers involved"
echo "- You control all your data"
echo ""
echo "▶️  Run with: node local-financial-analyser.js"
echo ""
echo "✅ Setup complete!" 