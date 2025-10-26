#!/bin/bash

# Environment Setup Script for CryptoTally
# This script helps new developers set up their .env.local files

set -e

echo "🚀 CryptoTally Environment Setup"
echo "=================================="
echo ""

# Function to check if file exists
check_file() {
  if [ -f "$1" ]; then
    echo "✅ $1 exists"
    return 0
  else
    echo "❌ $1 not found"
    return 1
  fi
}

# Function to create .env.local from .env
create_env_local() {
  local dir=$1
  local env_file="$dir/.env"
  local env_local_file="$dir/.env.local"

  if [ -f "$env_local_file" ]; then
    echo "⚠️  $env_local_file already exists"
    read -p "   Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo "   Skipping $dir"
      return
    fi
  fi

  if [ -f "$env_file" ]; then
    cp "$env_file" "$env_local_file"
    echo "✅ Created $env_local_file from template"
  else
    echo "❌ Template $env_file not found"
  fi
}

echo "Step 1: Creating .env.local files from templates"
echo "-------------------------------------------------"
echo ""

# Client setup
echo "📱 Client (.env.local):"
create_env_local "client"
echo ""

# Server setup
echo "🖥️  Server (.env.local):"
create_env_local "server"
echo ""

echo "Step 2: Verification"
echo "--------------------"
echo ""

# Check if .env.local files exist
check_file "client/.env.local" && CLIENT_ENV_OK=1 || CLIENT_ENV_OK=0
check_file "server/.env.local" && SERVER_ENV_OK=1 || SERVER_ENV_OK=0
echo ""

# Check if .env.local is in .gitignore
echo "Step 3: Security Check"
echo "----------------------"
echo ""

if grep -q ".env.local" client/.gitignore && grep -q ".env.local" server/.gitignore; then
  echo "✅ .env.local is gitignored (safe from commits)"
else
  echo "⚠️  Warning: .env.local might not be properly gitignored"
fi
echo ""

# Summary
echo "📋 Summary"
echo "----------"
echo ""

if [ $CLIENT_ENV_OK -eq 1 ] && [ $SERVER_ENV_OK -eq 1 ]; then
  echo "✅ Environment files created successfully!"
  echo ""
  echo "📝 Next Steps:"
  echo "   1. Edit client/.env.local with your Firebase config"
  echo "   2. Edit server/.env.local with your Firebase project ID"
  echo "   3. Download Firebase service account key to server/serviceAccountKey.json"
  echo "   4. Run 'npm run dev' in both client/ and server/ directories"
  echo ""
  echo "📖 For detailed instructions, see ENV_SETUP.md"
else
  echo "❌ Setup incomplete. Please check the errors above."
  exit 1
fi

echo ""
echo "🎉 Setup complete! Happy coding!"
