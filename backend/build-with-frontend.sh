#!/bin/bash
# Build script that builds both backend and frontend

set -e

echo "🔨 Building backend..."
cd backend
npm install
npm run build

echo "🔨 Building frontend..."
cd ../frontend
npm install
npm run build

echo "✅ Build complete!"
echo "Frontend build is at: frontend/dist"
echo "Backend build is at: backend/dist"
