#!/bin/bash

# College Chalo - Project Setup Script
# This script sets up the development environment

echo "🚀 College Chalo - Development Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo ""
    echo "Installing Node.js using Homebrew..."
    brew install node
else
    echo "✅ Node.js is installed: $(node --version)"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
else
    echo "✅ npm is installed: $(npm --version)"
fi

echo ""
echo "📦 Installing project dependencies..."
npm install

echo ""
echo "✅ Setup completed!"
echo ""
echo "To start development server, run:"
echo "  npm run dev"
echo ""
echo "Visit: http://localhost:3000"
